/**
 * ==============================================================================
 * SERVIDOR PRINCIPAL DE LA API REST (Node.js & Express)
 * ==============================================================================
 * 
 * Punto de entrada del Backend del Sistema de Gestión Integral de Spa.
 * Configura middlewares globales, inicializa la conexión ORM con Sequelize,
 * monta los enrutadores modulares de la API REST (/api/v1) y levanta el servicio HTTP.
 * 
 * @module server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, testConnection, Sala } = require('./models');
const apiRoutes = require('./routes');
const ejecutarSeeder = require('./seeders/initialSeed');

// 1. Instanciar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Configurar Middlewares Globales
app.use(cors({
  origin: '*', // Permite solicitudes desde cualquier cliente web / frontend desacoplado
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta frontend como estáticos si se ejecuta en modo unificado local
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 3. Registrar el Enrutador Central de la API REST (/api/v1)
app.use('/api/v1', apiRoutes);

// Ruta raíz informativa
app.get('/', (req, res) => {
  res.redirect('/views/index.html');
});

// Middleware para manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    ok: false,
    mensaje: `La ruta solicitada '${req.originalUrl}' no existe en el servidor.`
  });
});

// Middleware global para captura de errores no controlados (500)
app.use((err, req, res, next) => {
  console.error('❌ [Error Global del Servidor]:', err);
  res.status(500).json({
    ok: false,
    mensaje: 'Se produjo un error interno en el servidor.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 4. Inicialización de la Base de Datos y Arranque del Servidor HTTP
const iniciarServidor = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();

    // Sincronizar tablas de base de datos
    await sequelize.sync();
    console.log('✅ [Sequelize] Esquema de base de datos sincronizado correctamente.');

    // Verificar si las salas temáticas existen; si no, poblar datos iniciales
    const totalSalas = await Sala.count();
    if (totalSalas === 0) {
      console.log('🌱 [Auto-Seeder] Base de datos vacía. Ejecutando seeder inicial...');
      await ejecutarSeeder();
    }

    // Levantar el servidor en el puerto configurado
    app.listen(PORT, () => {
      console.log('================================================================');
      console.log(`🌿 [SPA Management API] Servidor iniciado exitosamente.`);
      console.log(`📡 URL API REST:       http://localhost:${PORT}/api/v1`);
      console.log(`🌐 Portal Web Cliente: http://localhost:${PORT}/views/index.html`);
      console.log(`🔒 Panel Privado:      http://localhost:${PORT}/views/login.html`);
      console.log('================================================================');
    });

  } catch (error) {
    console.error('❌ Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();

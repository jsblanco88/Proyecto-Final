/**
 * ==============================================================================
 * ENRUTADOR PRINCIPAL DE LA API REST (/api/v1)
 * ==============================================================================
 * 
 * Agrupa y expone todos los módulos de endpoints de la aplicación:
 * - /api/v1/auth
 * - /api/v1 (citas y salas)
 * - /api/v1/inventario
 * - /api/v1/clientes
 * - /api/v1/dashboard
 * 
 * @module routes/index
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const citasRoutes = require('./citas.routes');
const inventarioRoutes = require('./inventario.routes');
const clientesRoutes = require('./clientes.routes');
const dashboardRoutes = require('./dashboard.routes');

// Montaje de rutas
router.use('/auth', authRoutes);
router.use('/', citasRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/clientes', clientesRoutes);
router.use('/dashboard', dashboardRoutes);

// Endpoint de verificación de salud del backend
router.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    servicio: 'API Sistema de Gestión Integral de Spa',
    version: '1.0.0',
    estado: 'Operativo',
    timestamp: new Date()
  });
});

module.exports = router;

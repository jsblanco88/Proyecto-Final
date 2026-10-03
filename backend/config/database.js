/**
 * ==============================================================================
 * CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS (SEQUELIZE ORM)
 * ==============================================================================
 * 
 * Este módulo inicializa y exporta la instancia de Sequelize configurada según
 * las variables de entorno. Soporta SQLite (predeterminado para portabilidad y
 * ejecución inmediata local) y conexiones remotas a PostgreSQL/MySQL.
 * 
 * @module config/database
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

// Obtención de parámetros de configuración desde variables de entorno
const dialect = process.env.DB_DIALECT || 'sqlite';
const storagePath = process.env.DB_STORAGE 
  ? path.resolve(__dirname, '..', process.env.DB_STORAGE) 
  : path.resolve(__dirname, '..', 'database_spa.sqlite');

let sequelize;

if (dialect === 'sqlite') {
  // Configuración para SQLite (archivo local)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: process.env.NODE_ENV === 'development' ? false : false, // Cambiar a console.log para debug SQL
    define: {
      timestamps: true, // Agrega createdAt y updatedAt automáticamente
      underscored: true // Usa formato snake_case en nombres de columnas de BD
    }
  });
} else {
  // Configuración para PostgreSQL o MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME || 'spa_management_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: dialect,
      logging: false,
      define: {
        timestamps: true,
        underscored: true
      }
    }
  );
}

/**
 * Función para comprobar y autenticar la conexión a la base de datos
 * @returns {Promise<void>}
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ [Base de Datos] Conexión establecida exitosamente (${dialect.toUpperCase()}).`);
  } catch (error) {
    console.error('❌ [Base de Datos] Error crítico al conectar con la base de datos:', error.message);
  }
};

module.exports = {
  sequelize,
  testConnection
};

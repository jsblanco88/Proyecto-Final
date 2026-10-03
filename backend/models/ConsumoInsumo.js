/**
 * ==============================================================================
 * MODELO: CONSUMO_INSUMO (Sequelize)
 * ==============================================================================
 * 
 * Registra los insumos descargados/utilizados en cada sesión de masaje completada
 * o en operaciones generales de mantenimiento de salas.
 * 
 * @module models/ConsumoInsumo
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ConsumoInsumo = sequelize.define('ConsumoInsumo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del registro de consumo'
  },
  cita_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID de la cita en la que se consumió el insumo (opcional)'
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID del producto consumido'
  },
  cantidad_usada: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1 },
    comment: 'Cantidad de unidades o dosis consumidas'
  },
  fecha_consumo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha del consumo'
  },
  observaciones: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Detalle o justificación del uso del material'
  }
}, {
  tableName: 'consumos_insumos',
  timestamps: true
});

module.exports = ConsumoInsumo;

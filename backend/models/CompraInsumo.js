/**
 * ==============================================================================
 * MODELO: COMPRA_INSUMO (Sequelize)
 * ==============================================================================
 * 
 * Registra los abastecimientos y adquisiciones de productos realizadas a los
 * proveedores, incrementando automáticamente el stock disponible.
 * 
 * @module models/CompraInsumo
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CompraInsumo = sequelize.define('CompraInsumo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único de la orden de compra de insumos'
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID del producto abastecido'
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID del proveedor que suministró el lote'
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
    comment: 'Cantidad de unidades adquiridas'
  },
  costo_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Precio unitario de compra'
  },
  costo_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Costo total acumulado de la adquisición'
  },
  fecha_compra: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Fecha en que se efectuó la compra'
  },
  numero_factura: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Número de comprobante fiscal o factura'
  }
}, {
  tableName: 'compras_insumos',
  timestamps: true
});

module.exports = CompraInsumo;

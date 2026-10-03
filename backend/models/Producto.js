/**
 * ==============================================================================
 * MODELO: PRODUCTO / INSUMO (Sequelize)
 * ==============================================================================
 * 
 * Modela los insumos y productos utilizados en los masajes y tratamientos
 * (aceites esenciales, cremas hidratantes/termogénicas, toallas descartables,
 * piedras volcánicas, sales aromáticas, etc.).
 * 
 * @module models/Producto
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del insumo o producto'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Nombre comercial del insumo (ej. Aceite de Almendras 500ml)'
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Aceites y Cremas',
    comment: 'Categoría del producto (Aceites, Cremas, Higiene, Aromaterapia)'
  },
  stock_actual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 },
    comment: 'Cantidad física disponible en almacén'
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    comment: 'Umbral mínimo de inventario antes de disparar alerta de reposición'
  },
  reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Unidades comprometidas o apartadas para citas programadas'
  },
  unidad_medida: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Unidades',
    comment: 'Unidad de medida (Unidades, ml, gr, paquetes)'
  },
  costo_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Costo unitario promedio de adquisición'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Indica si el producto sigue activo en el catálogo'
  }
}, {
  tableName: 'productos',
  timestamps: true
});

module.exports = Producto;

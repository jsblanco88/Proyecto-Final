/**
 * ==============================================================================
 * MODELO: PROVEEDOR (Sequelize)
 * ==============================================================================
 * 
 * Gestiona los distribuidores y proveedores de insumos cosméticos y terapéuticos.
 * 
 * @module models/Proveedor
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Proveedor = sequelize.define('Proveedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del proveedor'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Razón social o nombre comercial del proveedor'
  },
  contacto: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Persona de contacto o ejecutivo de cuentas'
  },
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Teléfono de contacto para pedidos'
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: true,
    validate: { isEmail: true },
    comment: 'Correo electrónico para cotizaciones y órdenes de compra'
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Dirección fiscal o almacén del proveedor'
  }
}, {
  tableName: 'proveedores',
  timestamps: true
});

module.exports = Proveedor;

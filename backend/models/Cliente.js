/**
 * ==============================================================================
 * MODELO: CLIENTE (Sequelize)
 * ==============================================================================
 * 
 * Gestiona los expedientes y fichas de clientes del spa, almacenando sus datos
 * de contacto, identificación y notas clínicas o terapéuticas (alergias a esencias,
 * preferencias de presión de masaje, zonas con dolor crónico, etc.).
 * 
 * @module models/Cliente
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del cliente'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre y apellidos del cliente'
  },
  dni: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    comment: 'Documento Nacional de Identidad o Pasaporte del cliente'
  },
  telefono: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Número de teléfono o WhatsApp para notificaciones y contacto'
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: true,
    validate: {
      isEmail: true
    },
    comment: 'Correo electrónico de contacto'
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Dirección o ciudad de residencia'
  },
  notas_clinicas: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas clínicas, alergias a aceites esenciales, contraindicaciones y preferencias'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Estado activo o inactivo del cliente'
  },
  creado_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID del usuario/masajista que registró al cliente'
  }
}, {
  tableName: 'clientes',
  timestamps: true
});

module.exports = Cliente;

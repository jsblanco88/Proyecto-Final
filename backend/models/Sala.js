/**
 * ==============================================================================
 * MODELO: SALA (Sequelize)
 * ==============================================================================
 * 
 * Representa los 4 espacios físicos temáticos de atención en el centro de spa:
 * 1. 💧 'Sala Agua' - Hidroterapia y masajes relajantes fluidos.
 * 2. 💨 'Sala Aire' - Aromaterapia y técnicas de respiración y relajación.
 * 3. 🌿 'Sala Tierra' - Piedras calientes, fangoterapia y masajes profundos.
 * 4. 🔥 'Sala Fuego' - Termoterapia, bambuterapia y masajes descontracturantes.
 * 
 * @module models/Sala
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sala = sequelize.define('Sala', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único de la sala de masajes'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Nombre de la sala temática (Agua, Aire, Tierra, Fuego)'
  },
  icono: {
    type: DataTypes.STRING(30),
    allowNull: true,
    defaultValue: 'spa',
    comment: 'Ícono representativo para la interfaz gráfica'
  },
  color_tema: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: '#2874A6',
    comment: 'Código hexadecimal del color de ambientación temática'
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Descripción del equipamiento y ambientación de la sala'
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Capacidad de camillas / personas simultáneas en la sala'
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Indica si la sala se encuentra habilitada operativamente'
  }
}, {
  tableName: 'salas',
  timestamps: true
});

module.exports = Sala;

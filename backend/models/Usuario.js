/**
 * ==============================================================================
 * MODELO: USUARIO (Sequelize)
 * ==============================================================================
 * 
 * Representa los usuarios del sistema interno con acceso mediante credenciales.
 * Soporta dos roles fundamentales según la constitución del proyecto:
 * 1. 'admin': Administrador con acceso total a salas, inventarios, compras y reportes.
 * 2. 'masoterapeuta': Masajista con permisos para visualizar disponibilidad de salas,
 *    agendar y confirmar sus reservas dentro de los plazos normativos (1h / 20min).
 * 
 * @module models/Usuario
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único autoincremental del usuario'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre completo y apellido del usuario o terapeuta'
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    comment: 'Correo electrónico único utilizado para el inicio de sesión'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Hash seguro de la contraseña generado con bcryptjs'
  },
  rol: {
    type: DataTypes.ENUM('admin', 'masoterapeuta'),
    allowNull: false,
    defaultValue: 'masoterapeuta',
    comment: 'Rol del usuario en el sistema que determina sus permisos RBAC'
  },
  especialidad: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Especialidad terapéutica (ej. Masaje Relajante, Drenaje, Descontracturante)'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Indica si el usuario tiene acceso activo al sistema'
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;

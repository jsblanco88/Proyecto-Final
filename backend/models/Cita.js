/**
 * ==============================================================================
 * MODELO: CITA (Sequelize)
 * ==============================================================================
 * 
 * Modela las citas y turnos agendados en las 4 salas (Agua, Aire, Tierra, Fuego)
 * en los 12 bloques horarios (8:00 AM a 8:00 PM).
 * 
 * Reglas de Ciclo de Vida:
 * 1. 'pendiente_confirmacion': Cita reservada sujeta a confirmación en el plazo límite
 *    (1 hora antes del inicio o 20 min si fue creada con <= 1 hora de anticipación).
 * 2. 'confirmada': Sala ratificada por el masajista. ÚNICAMENTE el Administrador
 *    puede liberar o cancelar una cita en este estado.
 * 3. 'ocupada': Sesión en curso en la sala.
 * 4. 'completada': Cita finalizada con éxito, disparando el registro de consumo de insumos.
 * 5. 'cancelada': Cita anulada manualmente por el Administrador.
 * 6. 'liberada_automatica': Cita liberada por el sistema al vencer el plazo sin confirmación.
 * 
 * @module models/Cita
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cita = sequelize.define('Cita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único de la cita'
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID foráneo del cliente asociado a la cita'
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID foráneo del masajista / terapeuta asignado a la sesión'
  },
  sala_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID foráneo de la sala temática (Agua, Aire, Tierra, Fuego)'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Fecha de la cita (formato YYYY-MM-DD)'
  },
  hora_inicio: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Hora de inicio del bloque (ej. 08:00, 09:00, ..., 19:00)'
  },
  hora_fin: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Hora de finalización del bloque (ej. 09:00, 10:00, ..., 20:00)'
  },
  servicio_solicitado: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Masaje Relajante',
    comment: 'Nombre de la terapia o servicio requerido'
  },
  monto_cobrado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Precio o tarifa cobrada por la sesión de spa'
  },
  deadline_confirmacion: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha y hora exacta límite para que el masajista confirme la sala'
  },
  estado: {
    type: DataTypes.ENUM(
      'pendiente_confirmacion',
      'confirmada',
      'ocupada',
      'completada',
      'cancelada',
      'liberada_automatica'
    ),
    allowNull: false,
    defaultValue: 'pendiente_confirmacion',
    comment: 'Estado actual del ciclo de vida de la cita'
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observaciones particulares para la sesión'
  },
  motivo_cancelacion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Motivo registrado en caso de liberación o cancelación por el Administrador'
  },
  confirmada_en: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp en que el masajista confirmó la reserva'
  }
}, {
  tableName: 'citas',
  timestamps: true
});

module.exports = Cita;

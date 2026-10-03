/**
 * ==============================================================================
 * REGISTRO CENTRAL DE MODELOS Y ASOCIACIONES (Sequelize ORM)
 * ==============================================================================
 * 
 * Centraliza la importación de todos los modelos de datos y define las relaciones
 * e integridad referencial de acuerdo con la especificación técnica (spec.md).
 * 
 * @module models/index
 */

const { sequelize } = require('../config/database');

const Usuario = require('./Usuario');
const Sala = require('./Sala');
const Cliente = require('./Cliente');
const Cita = require('./Cita');
const Producto = require('./Producto');
const Proveedor = require('./Proveedor');
const CompraInsumo = require('./CompraInsumo');
const ConsumoInsumo = require('./ConsumoInsumo');

// ==========================================
// ASOCIACIONES: CITAS
// ==========================================

// Un Cliente tiene muchas Citas
Cliente.hasMany(Cita, { foreignKey: 'cliente_id', as: 'citas' });
Cita.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Un Usuario (Masajista) tiene muchas Citas asignadas
Usuario.hasMany(Cita, { foreignKey: 'usuario_id', as: 'citas_asignadas' });
Cita.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'masajista' });

// Una Sala temática (Agua, Aire, Tierra, Fuego) alberga muchas Citas
Sala.hasMany(Cita, { foreignKey: 'sala_id', as: 'citas' });
Cita.belongsTo(Sala, { foreignKey: 'sala_id', as: 'sala' });

// ==========================================
// ASOCIACIONES: INVENTARIO, COMPRAS Y CONSUMOS
// ==========================================

// Un Producto tiene muchas Compras
Producto.hasMany(CompraInsumo, { foreignKey: 'producto_id', as: 'compras' });
CompraInsumo.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Un Proveedor suministra muchas Compras
Proveedor.hasMany(CompraInsumo, { foreignKey: 'proveedor_id', as: 'suministros' });
CompraInsumo.belongsTo(Proveedor, { foreignKey: 'proveedor_id', as: 'proveedor' });

// Un Producto tiene muchos registros de Consumo
Producto.hasMany(ConsumoInsumo, { foreignKey: 'producto_id', as: 'consumos' });
ConsumoInsumo.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Una Cita puede tener varios Consumos de insumos asociados
Cita.hasMany(ConsumoInsumo, { foreignKey: 'cita_id', as: 'insumos_consumidos' });
ConsumoInsumo.belongsTo(Cita, { foreignKey: 'cita_id', as: 'cita' });

module.exports = {
  sequelize,
  Usuario,
  Sala,
  Cliente,
  Cita,
  Producto,
  Proveedor,
  CompraInsumo,
  ConsumoInsumo
};

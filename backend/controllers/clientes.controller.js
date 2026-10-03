/**
 * ==============================================================================
 * CONTROLADOR: CLIENTES Y FICHAS TERAPÉUTICAS (MVC)
 * ==============================================================================
 * 
 * Gestiona el expediente de clientes, datos personales, notas terapéuticas/clínicas
 * y el historial de consultas y sesiones de spa.
 * 
 * @module controllers/clientes.controller
 */

const { Cliente, Cita, Sala, Usuario } = require('../models');
const { Op } = require('sequelize');

/**
 * Obtiene la lista de clientes con opción de búsqueda por texto (nombre, dni, teléfono)
 * @route GET /api/v1/clientes
 */
const getClientes = async (req, res) => {
  try {
    const { busqueda } = req.query;
    const whereCondition = { activo: true };

    if (busqueda && busqueda.trim() !== '') {
      const termino = `%${busqueda.trim()}%`;
      whereCondition[Op.or] = [
        { nombre: { [Op.like]: termino } },
        { dni: { [Op.like]: termino } },
        { telefono: { [Op.like]: termino } }
      ];
    }

    const clientes = await Cliente.findAll({
      where: whereCondition,
      order: [['nombre', 'ASC']]
    });

    return res.status(200).json({
      ok: true,
      total: clientes.length,
      clientes
    });
  } catch (error) {
    console.error('❌ [ClientesController.getClientes] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar clientes.',
      error: error.message
    });
  }
};

/**
 * Obtiene el detalle de la ficha del cliente y su historial de citas
 * @route GET /api/v1/clientes/:id
 */
const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id, {
      include: [
        {
          model: Cita,
          as: 'citas',
          include: [
            { model: Sala, as: 'sala', attributes: ['id', 'nombre', 'color_tema'] },
            { model: Usuario, as: 'masajista', attributes: ['id', 'nombre'] }
          ],
          order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
        }
      ]
    });

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Cliente no encontrado.'
      });
    }

    return res.status(200).json({
      ok: true,
      cliente
    });
  } catch (error) {
    console.error('❌ [ClientesController.getClienteById] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar la ficha del cliente.',
      error: error.message
    });
  }
};

/**
 * Crea un nuevo cliente en el sistema
 * @route POST /api/v1/clientes
 */
const createCliente = async (req, res) => {
  try {
    const { nombre, dni, telefono, email, direccion, notas_clinicas } = req.body;

    if (!nombre || !telefono) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El nombre y el teléfono son campos obligatorios.'
      });
    }

    // Verificar si el DNI ya existe si fue provisto
    if (dni) {
      const existeDni = await Cliente.findOne({ where: { dni } });
      if (existeDni) {
        return res.status(409).json({
          ok: false,
          mensaje: 'Ya existe un cliente registrado con ese DNI / Identificación.'
        });
      }
    }

    const nuevoCliente = await Cliente.create({
      nombre,
      dni: dni || null,
      telefono,
      email: email || null,
      direccion: direccion || null,
      notas_clinicas: notas_clinicas || null
    });

    return res.status(201).json({
      ok: true,
      mensaje: 'Cliente registrado exitosamente.',
      cliente: nuevoCliente
    });
  } catch (error) {
    console.error('❌ [ClientesController.createCliente] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al crear el cliente.',
      error: error.message
    });
  }
};

/**
 * Actualiza los datos o notas clínicas de un cliente
 * @route PUT /api/v1/clientes/:id
 */
const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, dni, telefono, email, direccion, notas_clinicas } = req.body;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Cliente no encontrado.'
      });
    }

    cliente.nombre = nombre || cliente.nombre;
    cliente.dni = dni !== undefined ? dni : cliente.dni;
    cliente.telefono = telefono || cliente.telefono;
    cliente.email = email !== undefined ? email : cliente.email;
    cliente.direccion = direccion !== undefined ? direccion : cliente.direccion;
    cliente.notas_clinicas = notas_clinicas !== undefined ? notas_clinicas : cliente.notas_clinicas;

    await cliente.save();

    return res.status(200).json({
      ok: true,
      mensaje: 'Ficha del cliente actualizada exitosamente.',
      cliente
    });
  } catch (error) {
    console.error('❌ [ClientesController.updateCliente] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar la ficha del cliente.',
      error: error.message
    });
  }
};

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente
};

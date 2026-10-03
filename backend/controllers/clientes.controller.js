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
 * REGLA: Los masajistas solo ven a sus clientes individuales; el admin ve a todos.
 * @route GET /api/v1/clientes
 */
const getClientes = async (req, res) => {
  try {
    const { busqueda } = req.query;
    const esAdmin = req.usuario && req.usuario.rol === 'admin';
    const usuarioId = req.usuario ? req.usuario.id : null;

    const whereConditions = [{ activo: true }];

    // Si es masoterapeuta, restringir a sus clientes propios (citas asignadas o creados por él)
    if (!esAdmin && usuarioId) {
      const citasDelMasajista = await Cita.findAll({
        where: { usuario_id: usuarioId },
        attributes: ['cliente_id'],
        raw: true
      });
      const clienteIdsAsignados = [...new Set(citasDelMasajista.map(c => c.cliente_id).filter(Boolean))];

      whereConditions.push({
        [Op.or]: [
          { id: { [Op.in]: clienteIdsAsignados } },
          { creado_por: usuarioId }
        ]
      });
    }

    if (busqueda && busqueda.trim() !== '') {
      const termino = `%${busqueda.trim()}%`;
      whereConditions.push({
        [Op.or]: [
          { nombre: { [Op.like]: termino } },
          { telefono: { [Op.like]: termino } },
          { email: { [Op.like]: termino } }
        ]
      });
    }

    const clientes = await Cliente.findAll({
      where: {
        [Op.and]: whereConditions
      },
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
 * REGLA: Los masajistas solo pueden ver fichas de sus propios clientes.
 * @route GET /api/v1/clientes/:id
 */
const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const esAdmin = req.usuario && req.usuario.rol === 'admin';
    const usuarioId = req.usuario ? req.usuario.id : null;

    // Filtro condicional de citas incluidas
    const whereCitas = {};
    if (!esAdmin && usuarioId) {
      whereCitas.usuario_id = usuarioId;
    }

    const cliente = await Cliente.findByPk(id, {
      include: [
        {
          model: Cita,
          as: 'citas',
          where: whereCitas,
          required: false,
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

    // Si es masoterapeuta, verificar pertenencia
    if (!esAdmin && usuarioId) {
      const tieneCitasConMasajista = cliente.citas && cliente.citas.length > 0;
      const esCreador = cliente.creado_por === usuarioId;

      if (!tieneCitasConMasajista && !esCreador) {
        return res.status(403).json({
          ok: false,
          mensaje: 'Acceso Denegado: No tiene autorización para consultar este expediente de cliente.'
        });
      }
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
 * Crea un nuevo cliente en el sistema asignándole el creador
 * @route POST /api/v1/clientes
 */
const createCliente = async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body;

    if (!nombre || !telefono) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El nombre y el teléfono son campos obligatorios.'
      });
    }

    const nuevoCliente = await Cliente.create({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email ? email.trim().toLowerCase() : null,
      creado_por: req.usuario ? req.usuario.id : null
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
 * Actualiza los datos de un cliente (nombre, teléfono, correo)
 * @route PUT /api/v1/clientes/:id
 */
const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email } = req.body;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Cliente no encontrado.'
      });
    }

    if (nombre) cliente.nombre = nombre.trim();
    if (telefono) cliente.telefono = telefono.trim();
    if (email !== undefined) cliente.email = email ? email.trim().toLowerCase() : null;

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

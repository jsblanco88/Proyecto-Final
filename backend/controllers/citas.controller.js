/**
 * ==============================================================================
 * CONTROLADOR: CITAS Y DISPONIBILIDAD DE SALAS (MÓDULO 1)
 * ==============================================================================
 * 
 * Implementa la lógica de negocio core del sistema de gestión de spa:
 * 1. Visualización de la matriz de 4 Salas temáticas (Agua, Aire, Tierra, Fuego)
 *    en 12 Bloques horarios continuos (08:00 AM a 08:00 PM).
 * 2. Cálculo dinámico de liberación automática de salas:
 *    - Citas estándar (>1h de anticipación): Confirmación obligatoria hasta 1h antes.
 *    - Citas express (<=1h de anticipación): Confirmación obligatoria en 20 minutos.
 * 3. Regla de Exclusividad: ÚNICAMENTE el usuario Administrador puede liberar o
 *    cancelar una cita en estado 'confirmada'.
 * 
 * @module controllers/citas.controller
 */

const { Op } = require('sequelize');
const { Cita, Sala, Cliente, Usuario, Producto, ConsumoInsumo, sequelize } = require('../models');

// Definición de los 12 bloques horarios obligatorios (08:00 a 20:00)
const BLOQUES_HORARIOS = [
  { id: 1, hora_inicio: '08:00', hora_fin: '09:00', etiqueta: '08:00 AM - 09:00 AM' },
  { id: 2, hora_inicio: '09:00', hora_fin: '10:00', etiqueta: '09:00 AM - 10:00 AM' },
  { id: 3, hora_inicio: '10:00', hora_fin: '11:00', etiqueta: '10:00 AM - 11:00 AM' },
  { id: 4, hora_inicio: '11:00', hora_fin: '12:00', etiqueta: '11:00 AM - 12:00 PM' },
  { id: 5, hora_inicio: '12:00', hora_fin: '13:00', etiqueta: '12:00 PM - 01:00 PM' },
  { id: 6, hora_inicio: '13:00', hora_fin: '14:00', etiqueta: '01:00 PM - 02:00 PM' },
  { id: 7, hora_inicio: '14:00', hora_fin: '15:00', etiqueta: '02:00 PM - 03:00 PM' },
  { id: 8, hora_inicio: '15:00', hora_fin: '16:00', etiqueta: '03:00 PM - 04:00 PM' },
  { id: 9, hora_inicio: '16:00', hora_fin: '17:00', etiqueta: '04:00 PM - 05:00 PM' },
  { id: 10, hora_inicio: '17:00', hora_fin: '18:00', etiqueta: '05:00 PM - 06:00 PM' },
  { id: 11, hora_inicio: '18:00', hora_fin: '19:00', etiqueta: '06:00 PM - 07:00 PM' },
  { id: 12, hora_inicio: '19:00', hora_fin: '20:00', etiqueta: '07:00 PM - 08:00 PM' }
];

/**
 * Función auxiliar interna para procesar la máquina de estados automática:
 * 1. Liberación automática de reservas no confirmadas dentro del plazo.
 * 2. Marcado automático como 'completada' de citas confirmadas/ocupadas al culminar su horario de fin.
 */
const procesarEstadosAutomaticos = async () => {
  try {
    const ahora = new Date();
    const fechaHoyStr = ahora.toISOString().split('T')[0];
    const horasStr = String(ahora.getHours()).padStart(2, '0');
    const minsStr = String(ahora.getMinutes()).padStart(2, '0');
    const horaActualStr = `${horasStr}:${minsStr}`;

    // 1. Buscar todas las citas pendientes cuyo deadline haya expirado y liberarlas
    const citasExpiradas = await Cita.findAll({
      where: {
        estado: 'pendiente_confirmacion',
        deadline_confirmacion: {
          [Op.lt]: ahora
        }
      }
    });

    if (citasExpiradas.length > 0) {
      for (const cita of citasExpiradas) {
        cita.estado = 'liberada_automatica';
        cita.motivo_cancelacion = 'Liberación automática del sistema por vencimiento del plazo de confirmación.';
        await cita.save();
      }
      console.log(`ℹ️ [Sistema de Citas] Se liberaron automáticamente ${citasExpiradas.length} reservas expiradas.`);
    }

    // 2. REGLA: Marcar automáticamente como 'completada' las citas confirmadas u ocupadas al finalizar la hora de la cita
    const citasParaCompletar = await Cita.findAll({
      where: {
        estado: {
          [Op.in]: ['confirmada', 'ocupada']
        },
        [Op.or]: [
          { fecha: { [Op.lt]: fechaHoyStr } },
          {
            fecha: fechaHoyStr,
            hora_fin: { [Op.lte]: horaActualStr }
          }
        ]
      }
    });

    if (citasParaCompletar.length > 0) {
      for (const c of citasParaCompletar) {
        c.estado = 'completada';
        await c.save();
      }
      console.log(`✅ [Sistema de Citas] Se marcaron automáticamente como completadas ${citasParaCompletar.length} citas al culminar su horario.`);
    }

  } catch (error) {
    console.error('❌ [CitasController.procesarEstadosAutomaticos] Error:', error.message);
  }
};

/**
 * Obtiene el catálogo de las 4 salas temáticas
 * @route GET /api/v1/salas
 */
const getSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll({
      where: { activa: true },
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      ok: true,
      salas
    });
  } catch (error) {
    console.error('❌ [CitasController.getSalas] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar las salas.',
      error: error.message
    });
  }
};

/**
 * Devuelve la matriz de disponibilidad de las 4 salas en los 12 bloques para una fecha
 * @route GET /api/v1/citas/disponibilidad?fecha=YYYY-MM-DD
 */
const getDisponibilidad = async (req, res) => {
  try {
    // 1. Ejecutar verificación y liberación/completación automática
    await procesarEstadosAutomaticos();

    // 2. Determinar la fecha consultada (por defecto hoy)
    const fechaConsulta = req.query.fecha || new Date().toISOString().split('T')[0];

    // 3. Obtener las 4 salas activas
    const salas = await Sala.findAll({
      where: { activa: true },
      order: [['id', 'ASC']]
    });

    // 4. Obtener las citas activas de ese día (excluyendo canceladas y liberadas)
    const citasDelDia = await Cita.findAll({
      where: {
        fecha: fechaConsulta,
        estado: {
          [Op.in]: ['pendiente_confirmacion', 'confirmada', 'ocupada']
        }
      },
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'telefono', 'dni'] },
        { model: Usuario, as: 'masajista', attributes: ['id', 'nombre', 'email', 'especialidad'] },
        { model: Sala, as: 'sala', attributes: ['id', 'nombre', 'color_tema'] }
      ]
    });

    // 5. Construir la matriz estructurada por bloque horario y sala
    const esAdmin = req.usuario && req.usuario.rol === 'admin';
    const usuarioId = req.usuario ? req.usuario.id : null;

    const matrizDisponibilidad = BLOQUES_HORARIOS.map(bloque => {
      const filaSalas = {};

      salas.forEach(sala => {
        // Buscar si existe una cita en esta sala y bloque horario
        const citaEncontrada = citasDelDia.find(
          c => c.sala_id === sala.id && c.hora_inicio === bloque.hora_inicio
        );

        if (citaEncontrada) {
          // Mapear estado al código de colores del semáforo
          let colorEstado = 'verde'; // disponible
          let textoEstado = 'Disponible';

          if (citaEncontrada.estado === 'pendiente_confirmacion') {
            colorEstado = 'amarillo'; // Reservado (pendiente confirmación)
            textoEstado = 'Reservado (Pendiente Conf.)';
          } else if (citaEncontrada.estado === 'confirmada') {
            colorEstado = 'azul'; // Confirmado por masajista
            textoEstado = 'Confirmado';
          } else if (citaEncontrada.estado === 'ocupada') {
            colorEstado = 'rojo'; // En sesión activa
            textoEstado = 'Ocupado';
          }

          // REGLA: Los masajistas solo ven el nombre de su propio cliente. Solo el admin ve todos los nombres.
          const esMiCita = Boolean(usuarioId && citaEncontrada.usuario_id === usuarioId);
          const puedeVerNombre = esAdmin || esMiCita;

          filaSalas[sala.id] = {
            disponible: false,
            estado: citaEncontrada.estado,
            colorEstado,
            textoEstado,
            citaId: citaEncontrada.id,
            cliente: puedeVerNombre ? (citaEncontrada.cliente ? citaEncontrada.cliente.nombre : 'Cliente') : 'Cliente Reservado',
            clienteId: puedeVerNombre ? citaEncontrada.cliente_id : null,
            clienteTelefono: puedeVerNombre && citaEncontrada.cliente ? citaEncontrada.cliente.telefono : '',
            masajista: citaEncontrada.masajista ? citaEncontrada.masajista.nombre : 'Terapeuta',
            masajistaId: citaEncontrada.usuario_id,
            servicio: citaEncontrada.servicio_solicitado,
            monto: puedeVerNombre ? citaEncontrada.monto_cobrado : null,
            deadlineConfirmacion: citaEncontrada.deadline_confirmacion,
            esMiCita: esMiCita
          };
        } else {
          // Bloque totalmente libre
          filaSalas[sala.id] = {
            disponible: true,
            estado: 'disponible',
            colorEstado: 'verde',
            textoEstado: 'Disponible',
            citaId: null,
            cliente: null,
            masajista: null,
            esMiCita: false
          };
        }
      });

      return {
        bloqueId: bloque.id,
        hora_inicio: bloque.hora_inicio,
        hora_fin: bloque.hora_fin,
        etiqueta: bloque.etiqueta,
        salas: filaSalas
      };
    });

    return res.status(200).json({
      ok: true,
      fecha: fechaConsulta,
      bloques: BLOQUES_HORARIOS,
      salas,
      matriz: matrizDisponibilidad
    });

  } catch (error) {
    console.error('❌ [CitasController.getDisponibilidad] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar la matriz de disponibilidad.',
      error: error.message
    });
  }
};

/**
 * Crea una nueva reserva de cita calculando el deadline de confirmación
 * @route POST /api/v1/citas
 */
const createReserva = async (req, res) => {
  try {
    const {
      cliente_id,
      usuario_id,
      sala_id,
      fecha,
      hora_inicio,
      hora_fin,
      servicio_solicitado,
      monto_cobrado,
      notas
    } = req.body;

    const esAdmin = req.usuario && req.usuario.rol === 'admin';
    // Si es masoterapeuta, se asigna obligatoriamente a sí mismo
    const idTerapeuta = (!esAdmin && req.usuario) ? req.usuario.id : (usuario_id || (req.usuario ? req.usuario.id : null));

    // 1. Validaciones básicas
    if (!cliente_id || !idTerapeuta || !sala_id || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Todos los campos obligatorios deben ser completados.'
      });
    }

    // 2. Verificar que no exista otra cita activa en la misma sala, fecha y hora
    const citaExistente = await Cita.findOne({
      where: {
        sala_id,
        fecha,
        hora_inicio,
        estado: {
          [Op.in]: ['pendiente_confirmacion', 'confirmada', 'ocupada']
        }
      }
    });

    if (citaExistente) {
      return res.status(409).json({
        ok: false,
        mensaje: 'La sala ya se encuentra ocupada o reservada en el horario seleccionado.'
      });
    }

    // 3. Lógica de cálculo de plazos de confirmación:
    const ahora = new Date();
    const fechaHoraCita = new Date(`${fecha}T${hora_inicio}:00`);
    const diferenciaMinutos = (fechaHoraCita - ahora) / (1000 * 60);

    let deadlineConfirmacion;

    if (diferenciaMinutos > 60) {
      // Regla estándar: Cita con más de 1 hora de anticipación -> Confirmar hasta 1h antes del inicio
      deadlineConfirmacion = new Date(fechaHoraCita.getTime() - 60 * 60 * 1000);
    } else {
      // Regla express: Cita con 1 hora o menos de anticipación -> Confirmar en máximo 20 minutos
      deadlineConfirmacion = new Date(ahora.getTime() + 20 * 60 * 1000);
    }

    // 4. Crear el registro de la cita en la base de datos
    const nuevaCita = await Cita.create({
      cliente_id,
      usuario_id: idTerapeuta,
      sala_id,
      fecha,
      hora_inicio,
      hora_fin,
      servicio_solicitado: servicio_solicitado || 'Masaje Terapéutico',
      monto_cobrado: monto_cobrado || 0.00,
      deadline_confirmacion: deadlineConfirmacion,
      estado: 'pendiente_confirmacion',
      notas: notas || null
    });

    // 5. Cargar asociaciones para respuesta
    const citaCompleta = await Cita.findByPk(nuevaCita.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'masajista' },
        { model: Sala, as: 'sala' }
      ]
    });

    return res.status(201).json({
      ok: true,
      mensaje: 'Reserva agendada exitosamente. Pendiente de confirmación por el masajista.',
      cita: citaCompleta
    });

  } catch (error) {
    console.error('❌ [CitasController.createReserva] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al registrar la reserva.',
      error: error.message
    });
  }
};

/**
 * Confirma la sala asignada a la reserva por parte del masajista o administrador
 * @route PATCH /api/v1/citas/:id/confirmar
 */
const confirmarSala = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita.findByPk(id);

    if (!cita) {
      return res.status(404).json({
        ok: false,
        mensaje: 'La cita especificada no existe.'
      });
    }

    // Regla de autorización: El masajista dueño de la cita o el Administrador
    const esAdmin = req.usuario && req.usuario.rol === 'admin';
    if (!esAdmin && cita.usuario_id !== req.usuario.id) {
      return res.status(403).json({
        ok: false,
        mensaje: 'Acceso Denegado: Solo puedes confirmar tus propias reservas.'
      });
    }

    if (cita.estado !== 'pendiente_confirmacion') {
      return res.status(400).json({
        ok: false,
        mensaje: `No se puede confirmar la cita porque su estado actual es '${cita.estado}'.`
      });
    }

    // Verificar si el plazo límite ya venció
    const ahora = new Date();
    if (cita.deadline_confirmacion && ahora > new Date(cita.deadline_confirmacion)) {
      cita.estado = 'liberada_automatica';
      cita.motivo_cancelacion = 'Plazo de confirmación expirado al momento de intentar confirmar.';
      await cita.save();

      return res.status(400).json({
        ok: false,
        mensaje: 'El plazo de confirmación ha vencido y la sala fue liberada automáticamente.'
      });
    }

    // Confirmar la cita
    cita.estado = 'confirmada';
    cita.confirmada_en = ahora;
    await cita.save();

    return res.status(200).json({
      ok: true,
      mensaje: 'Sala confirmada exitosamente.',
      cita
    });

  } catch (error) {
    console.error('❌ [CitasController.confirmarSala] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al confirmar la sala.',
      error: error.message
    });
  }
};

/**
 * Reprograma el horario, fecha y/o sala de una cita
 * REGLA ESTRICTA:
 * - Si la cita está 'confirmada': ÚNICAMENTE el Administrador puede cambiar el horario o sala.
 * - Si la cita está 'pendiente_confirmacion': El terapeuta dueño o Administrador pueden cambiarla.
 * @route PATCH /api/v1/citas/:id/reprogramar
 */
const reprogramarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora_inicio, hora_fin, sala_id } = req.body;
    const esAdmin = req.usuario && req.usuario.rol === 'admin';
    const usuarioId = req.usuario ? req.usuario.id : null;

    if (!fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({
        ok: false,
        mensaje: 'La nueva fecha, hora de inicio y hora de fin son obligatorias.'
      });
    }

    const cita = await Cita.findByPk(id);

    if (!cita) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Cita no encontrada.'
      });
    }

    // REGLA: Si la cita está confirmada, SOLO el admin puede cambiar horario
    if (cita.estado === 'confirmada' && !esAdmin) {
      return res.status(403).json({
        ok: false,
        mensaje: 'Acceso Denegado: Una vez confirmada la cita, únicamente el Administrador puede cambiar el horario o sala.'
      });
    }

    // Si está pendiente y el usuario no es admin ni dueño
    if (cita.estado === 'pendiente_confirmacion' && !esAdmin && cita.usuario_id !== usuarioId) {
      return res.status(403).json({
        ok: false,
        mensaje: 'Acceso Denegado: Solo puedes modificar tus propias citas pendientes.'
      });
    }

    if (['completada', 'cancelada', 'liberada_automatica'].includes(cita.estado)) {
      return res.status(400).json({
        ok: false,
        mensaje: `No se puede reprogramar una cita en estado '${cita.estado}'.`
      });
    }

    const targetSalaId = sala_id ? parseInt(sala_id, 10) : cita.sala_id;

    // Verificar colisión con otra cita activa
    const colision = await Cita.findOne({
      where: {
        id: { [Op.ne]: cita.id },
        sala_id: targetSalaId,
        fecha,
        hora_inicio,
        estado: {
          [Op.in]: ['pendiente_confirmacion', 'confirmada', 'ocupada']
        }
      }
    });

    if (colision) {
      return res.status(409).json({
        ok: false,
        mensaje: 'La sala ya se encuentra ocupada o reservada en el nuevo horario seleccionado.'
      });
    }

    cita.fecha = fecha;
    cita.hora_inicio = hora_inicio;
    cita.hora_fin = hora_fin;
    cita.sala_id = targetSalaId;

    // Si sigue en pendiente, recalcular deadline
    if (cita.estado === 'pendiente_confirmacion') {
      const ahora = new Date();
      const fechaHoraCita = new Date(`${fecha}T${hora_inicio}:00`);
      const diferenciaMinutos = (fechaHoraCita - ahora) / (1000 * 60);

      if (diferenciaMinutos > 60) {
        cita.deadline_confirmacion = new Date(fechaHoraCita.getTime() - 60 * 60 * 1000);
      } else {
        cita.deadline_confirmacion = new Date(ahora.getTime() + 20 * 60 * 1000);
      }
    }

    await cita.save();

    const citaActualizada = await Cita.findByPk(cita.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'masajista' },
        { model: Sala, as: 'sala' }
      ]
    });

    return res.status(200).json({
      ok: true,
      mensaje: 'Horario y sala de la cita actualizados exitosamente.',
      cita: citaActualizada
    });

  } catch (error) {
    console.error('❌ [CitasController.reprogramarCita] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al reprogramar la cita.',
      error: error.message
    });
  }
};

/**
 * Cancela o libera una cita.
 * REGLA ESTRICTA:
 * - Si está 'confirmada': ÚNICAMENTE el Administrador puede cancelarla o liberarla.
 * - Si está 'pendiente_confirmacion': El terapeuta dueño o Administrador pueden cancelarla.
 * @route PATCH /api/v1/citas/:id/cancelar
 */
const cancelarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const esAdmin = req.usuario && req.usuario.rol === 'admin';
    const usuarioId = req.usuario ? req.usuario.id : null;

    const cita = await Cita.findByPk(id);

    if (!cita) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Cita no encontrada.'
      });
    }

    if (cita.estado === 'confirmada') {
      if (!esAdmin) {
        return res.status(403).json({
          ok: false,
          mensaje: 'Acceso Denegado: Una vez confirmada la cita, únicamente el Administrador tiene autorización para cancelarla o liberarla.'
        });
      }
    } else if (cita.estado === 'pendiente_confirmacion') {
      if (!esAdmin && cita.usuario_id !== usuarioId) {
        return res.status(403).json({
          ok: false,
          mensaje: 'Acceso Denegado: Solo puedes cancelar tus propias reservas pendientes.'
        });
      }
    } else {
      return res.status(400).json({
        ok: false,
        mensaje: `No se puede cancelar una cita en estado '${cita.estado}'.`
      });
    }

    cita.estado = 'cancelada';
    cita.motivo_cancelacion = motivo || `Cancelada por ${req.usuario.nombre} (${req.usuario.rol === 'admin' ? 'Administrador' : 'Masoterapeuta'})`;
    await cita.save();

    return res.status(200).json({
      ok: true,
      mensaje: 'La cita ha sido cancelada exitosamente y el espacio queda disponible.',
      cita
    });

  } catch (error) {
    console.error('❌ [CitasController.cancelarCita] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al cancelar la cita.',
      error: error.message
    });
  }
};

/**
 * Marca una cita como completada y registra el consumo de insumos opcional
 * @route PATCH /api/v1/citas/:id/completar
 */
const completarCita = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { insumos_utilizados } = req.body; // Array de { producto_id, cantidad }

    const cita = await Cita.findByPk(id, { transaction });

    if (!cita) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        mensaje: 'Cita no encontrada.'
      });
    }

    // Actualizar estado a completada
    cita.estado = 'completada';
    await cita.save({ transaction });

    // Procesar descuento de insumos en inventario si se especificaron
    if (Array.isArray(insumos_utilizados) && insumos_utilizados.length > 0) {
      for (const item of insumos_utilizados) {
        const producto = await Producto.findByPk(item.producto_id, { transaction });
        if (producto) {
          const cantidadDescontar = parseInt(item.cantidad, 10) || 1;
          producto.stock_actual = Math.max(0, producto.stock_actual - cantidadDescontar);
          await producto.save({ transaction });

          await ConsumoInsumo.create({
            cita_id: cita.id,
            producto_id: producto.id,
            cantidad_usada: cantidadDescontar,
            fecha_consumo: cita.fecha,
            observaciones: `Consumo automático por finalización de cita #${cita.id}`
          }, { transaction });
        }
      }
    }

    await transaction.commit();

    return res.status(200).json({
      ok: true,
      mensaje: 'Cita completada exitosamente y stock de insumos actualizado.',
      cita
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ [CitasController.completarCita] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al completar la cita.',
      error: error.message
    });
  }
};

/**
 * Obtiene el historial de citas con filtros
 * @route GET /api/v1/citas/historial
 */
const getHistorial = async (req, res) => {
  try {
    await procesarEstadosAutomaticos();
    const { fecha_desde, fecha_hasta, estado, sala_id, usuario_id } = req.query;

    const whereConditions = {};

    // Filtros
    if (fecha_desde && fecha_hasta) {
      whereConditions.fecha = { [Op.between]: [fecha_desde, fecha_hasta] };
    } else if (fecha_desde) {
      whereConditions.fecha = { [Op.gte]: fecha_desde };
    }

    if (estado) {
      whereConditions.estado = estado;
    }

    if (sala_id) {
      whereConditions.sala_id = sala_id;
    }

    // Si el usuario es masoterapeuta y no es admin, solo ve sus propias citas asignadas
    if (req.usuario && req.usuario.rol === 'masoterapeuta') {
      whereConditions.usuario_id = req.usuario.id;
    } else if (usuario_id) {
      whereConditions.usuario_id = usuario_id;
    }

    const citas = await Cita.findAll({
      where: whereConditions,
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'dni', 'telefono'] },
        { model: Usuario, as: 'masajista', attributes: ['id', 'nombre', 'especialidad'] },
        { model: Sala, as: 'sala', attributes: ['id', 'nombre', 'color_tema'] },
        { model: ConsumoInsumo, as: 'insumos_consumidos', include: [{ model: Producto, as: 'producto' }] }
      ],
      order: [['fecha', 'DESC'], ['hora_inicio', 'DESC']]
    });

    return res.status(200).json({
      ok: true,
      total: citas.length,
      citas
    });

  } catch (error) {
    console.error('❌ [CitasController.getHistorial] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar el historial de citas.',
      error: error.message
    });
  }
};

module.exports = {
  BLOQUES_HORARIOS,
  getSalas,
  getDisponibilidad,
  createReserva,
  confirmarSala,
  reprogramarCita,
  cancelarCita,
  liberarCitaConfirmada: cancelarCita,
  completarCita,
  getHistorial
};

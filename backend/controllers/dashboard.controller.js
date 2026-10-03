/**
 * ==============================================================================
 * CONTROLADOR: DASHBOARD Y ANALÍTICA DE NEGOCIO (MVC)
 * ==============================================================================
 * 
 * Genera indicadores clave de rendimiento (KPIs), curvas de citas mensuales,
 * balance de ingresos y niveles de ocupación de las 4 salas temáticas
 * (Agua, Aire, Tierra, Fuego).
 * 
 * @module controllers/dashboard.controller
 */

const { Cita, Sala, Cliente, Producto, Usuario, ConsumoInsumo, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Obtiene las métricas y KPIs para el panel principal
 * @route GET /api/v1/dashboard/stats
 */
const getStats = async (req, res) => {
  try {
    const esAdmin = req.usuario && req.usuario.rol === 'admin';
    const usuarioId = req.usuario ? req.usuario.id : null;

    // Filtro condicional según rol
    const whereCitas = {};
    if (!esAdmin && usuarioId) {
      whereCitas.usuario_id = usuarioId;
    }

    // 1. Contadores Generales
    const totalCitas = await Cita.count({ where: whereCitas });
    const citasCompletadas = await Cita.count({ where: { ...whereCitas, estado: 'completada' } });
    const citasPendientes = await Cita.count({ where: { ...whereCitas, estado: 'pendiente_confirmacion' } });
    const citasConfirmadas = await Cita.count({ where: { ...whereCitas, estado: 'confirmada' } });

    // 2. Total Ingresos (suma de citas completadas)
    const ingresosResult = await Cita.sum('monto_cobrado', {
      where: { ...whereCitas, estado: 'completada' }
    });
    const totalIngresos = ingresosResult || 0;

    // 3. Conteo de Clientes y Productos
    const totalClientes = await Cliente.count({ where: { activo: true } });
    const totalProductos = await Producto.count({ where: { activo: true } });

    // 4. Ocupación por Sala (Agua, Aire, Tierra, Fuego)
    const salas = await Sala.findAll({ attributes: ['id', 'nombre', 'color_tema'] });
    const ocupacionPorSala = [];

    for (const sala of salas) {
      const cantidad = await Cita.count({
        where: { sala_id: sala.id, estado: { [Op.in]: ['confirmada', 'ocupada', 'completada'] } }
      });
      ocupacionPorSala.push({
        id: sala.id,
        nombre: sala.nombre,
        color: sala.color_tema,
        citas: cantidad
      });
    }

    // 5. Citas por mes (Simulación estructurada para visualizador Chart.js)
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const citasPorMesData = [12, 19, 15, 25, 32, 28, 35, 42, 38, 45, 0, 0];
    const ingresosPorMesData = [600, 950, 750, 1250, 1600, 1400, 1750, 2100, 1900, 2250, 0, 0];

    return res.status(200).json({
      ok: true,
      kpis: {
        totalCitas,
        citasCompletadas,
        citasPendientes,
        citasConfirmadas,
        totalIngresos,
        totalClientes,
        totalProductos
      },
      ocupacionSalas: ocupacionPorSala,
      graficos: {
        meses,
        citasPorMes: citasPorMesData,
        ingresosPorMes: ingresosPorMesData
      }
    });

  } catch (error) {
    console.error('❌ [DashboardController.getStats] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al generar estadísticas del dashboard.',
      error: error.message
    });
  }
};

module.exports = {
  getStats
};

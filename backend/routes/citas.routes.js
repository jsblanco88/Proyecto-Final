/**
 * ==============================================================================
 * ENRUTADOR: SALAS, CITAS Y DISPONIBILIDAD (/api/v1/citas y /api/v1/salas)
 * ==============================================================================
 * 
 * Expone endpoints para la matriz de 4 Salas y 12 Horarios, confirmación
 * y liberación exclusiva por el Administrador.
 * 
 * @module routes/citas.routes
 */

const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citas.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { esAdmin } = require('../middlewares/role.middleware');

// Rutas de Salas
router.get('/salas', verificarToken, citasController.getSalas);

// Matriz de Disponibilidad (12 bloques x 4 salas)
router.get('/citas/disponibilidad', verificarToken, citasController.getDisponibilidad);

// Historial de Citas con filtros
router.get('/citas/historial', verificarToken, citasController.getHistorial);

// Creación de nueva reserva
router.post('/citas', verificarToken, citasController.createReserva);

// Confirmación de sala por masajista (plazos 1h / 20min)
router.patch('/citas/:id/confirmar', verificarToken, citasController.confirmarSala);

// Reprogramar horario y sala (Si confirmada: exclusivo Admin; si pendiente: terapeuta o Admin)
router.patch('/citas/:id/reprogramar', verificarToken, citasController.reprogramarCita);

// Cancelar cita (Si confirmada: exclusivo Admin; si pendiente: terapeuta o Admin)
router.patch('/citas/:id/cancelar', verificarToken, citasController.cancelarCita);

// Liberación / Cancelación de cita confirmada (EXCLUSIVO ADMINISTRADOR)
router.patch('/citas/:id/liberar', verificarToken, esAdmin, citasController.liberarCitaConfirmada);

// Completar cita y descontar insumos
router.patch('/citas/:id/completar', verificarToken, citasController.completarCita);

module.exports = router;

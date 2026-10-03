/**
 * ==============================================================================
 * ENRUTADOR: DASHBOARD Y MÉTRICAS (/api/v1/dashboard)
 * ==============================================================================
 * 
 * @module routes/dashboard.routes
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/stats', verificarToken, dashboardController.getStats);

module.exports = router;

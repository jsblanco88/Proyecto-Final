/**
 * ==============================================================================
 * ENRUTADOR: AUTENTICACIÓN Y USUARIOS (/api/v1/auth)
 * ==============================================================================
 * 
 * @module routes/auth.routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Rutas Públicas
router.post('/login', authController.login);

// Rutas Autenticadas
router.get('/me', verificarToken, authController.getPerfil);
router.get('/masajistas', verificarToken, authController.getMasajistas);

module.exports = router;

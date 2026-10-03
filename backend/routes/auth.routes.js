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
const { esAdmin } = require('../middlewares/role.middleware');

// Rutas Públicas
router.post('/login', authController.login);

// Rutas Autenticadas
router.get('/me', verificarToken, authController.getPerfil);
router.get('/masajistas', verificarToken, authController.getMasajistas);

// Creación de nuevos masajistas (EXCLUSIVO ADMINISTRADOR)
router.post('/masajistas', verificarToken, esAdmin, authController.createMasajista);

module.exports = router;

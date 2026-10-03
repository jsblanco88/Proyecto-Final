/**
 * ==============================================================================
 * ENRUTADOR: CLIENTES Y EXPEDIENTES (/api/v1/clientes)
 * ==============================================================================
 * 
 * @module routes/clientes.routes
 */

const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.use(verificarToken);

router.get('/', clientesController.getClientes);
router.post('/', clientesController.createCliente);
router.get('/:id', clientesController.getClienteById);
router.put('/:id', clientesController.updateCliente);

module.exports = router;

/**
 * ==============================================================================
 * ENRUTADOR: INVENTARIO, COMPRAS Y CONSUMO (/api/v1/inventario)
 * ==============================================================================
 * 
 * Protegido exclusivamente para rol 'admin'.
 * 
 * @module routes/inventario.routes
 */

const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { esAdmin } = require('../middlewares/role.middleware');

// Todas las rutas de inventario requieren autenticación y rol Administrador
router.use(verificarToken);
router.use(esAdmin);

router.get('/productos', inventarioController.getProductos);
router.post('/productos', inventarioController.createProducto);
router.post('/compras', inventarioController.registrarCompra);
router.get('/metricas-consumo', inventarioController.getMetricasConsumo);
router.get('/proveedores', inventarioController.getProveedores);

module.exports = router;

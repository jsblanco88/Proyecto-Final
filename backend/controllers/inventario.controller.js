/**
 * ==============================================================================
 * CONTROLADOR: GESTIÓN DE INVENTARIOS Y CONSUMO DE INSUMOS (MÓDULO 2)
 * ==============================================================================
 * 
 * Exclusivo para el rol Administrador. Gestiona:
 * - Catálogo de productos, existencias actuales y alertas de stock mínimo.
 * - Registro de compras a distribuidores y proveedores.
 * - Registro y métricas de consumo de insumos por sesión.
 * 
 * @module controllers/inventario.controller
 */

const { Producto, Proveedor, CompraInsumo, ConsumoInsumo, sequelize } = require('../models');

/**
 * Obtiene el catálogo completo de productos e insumos con stock y estado agotado
 * @route GET /api/v1/inventario/productos
 */
const getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      order: [
        ['agotado', 'DESC'],
        ['nombre', 'ASC']
      ]
    });

    const listaCompras = productos.filter(p => p.agotado);

    return res.status(200).json({
      ok: true,
      total: productos.length,
      totalAgotados: listaCompras.length,
      productos,
      listaCompras
    });
  } catch (error) {
    console.error('❌ [InventarioController.getProductos] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener la lista de insumos.',
      error: error.message
    });
  }
};

/**
 * Alterna el estado de un insumo (Disponible <-> Agotado) para armar la lista de compra
 * @route PATCH /api/v1/inventario/productos/:id/toggle-agotado
 */
const toggleAgotado = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Insumo no encontrado.'
      });
    }

    producto.agotado = !producto.agotado;
    await producto.save();

    return res.status(200).json({
      ok: true,
      mensaje: producto.agotado 
        ? `Insumo "${producto.nombre}" marcado como AGOTADO y agregado a la lista de compras.`
        : `Insumo "${producto.nombre}" marcado como DISPONIBLE (retirado de la lista de compras).`,
      producto
    });
  } catch (error) {
    console.error('❌ [InventarioController.toggleAgotado] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar el estado del insumo.',
      error: error.message
    });
  }
};

/**
 * Marca un insumo como repuesto / en stock (agotado = false)
 * @route PATCH /api/v1/inventario/productos/:id/reponer
 */
const reponerInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad_agregada } = req.body;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Insumo no encontrado.'
      });
    }

    producto.agotado = false;
    if (cantidad_agregada && parseInt(cantidad_agregada, 10) > 0) {
      producto.stock_actual += parseInt(cantidad_agregada, 10);
    }
    await producto.save();

    return res.status(200).json({
      ok: true,
      mensaje: `Insumo "${producto.nombre}" repuesto exitosamente y marcado como disponible.`,
      producto
    });
  } catch (error) {
    console.error('❌ [InventarioController.reponerInsumo] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al reponer el insumo.',
      error: error.message
    });
  }
};

/**
 * Obtiene la lista exclusiva de insumos agotados para compras y reposición
 * @route GET /api/v1/inventario/lista-compras
 */
const getListaCompras = async (req, res) => {
  try {
    const productosAgotados = await Producto.findAll({
      where: { agotado: true },
      order: [['categoria', 'ASC'], ['nombre', 'ASC']]
    });

    return res.status(200).json({
      ok: true,
      total: productosAgotados.length,
      listaCompras: productosAgotados
    });
  } catch (error) {
    console.error('❌ [InventarioController.getListaCompras] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener la lista de compras.',
      error: error.message
    });
  }
};

/**
 * Crea un nuevo producto en el catálogo de inventario
 * @route POST /api/v1/inventario/productos
 */
const createProducto = async (req, res) => {
  try {
    const { nombre, categoria, stock_actual, stock_minimo, unidad_medida, costo_unitario } = req.body;

    if (!nombre) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El nombre del producto es obligatorio.'
      });
    }

    const nuevoProducto = await Producto.create({
      nombre,
      categoria: categoria || 'Aceites y Cremas',
      stock_actual: parseInt(stock_actual, 10) || 0,
      stock_minimo: parseInt(stock_minimo, 10) || 5,
      unidad_medida: unidad_medida || 'Unidades',
      costo_unitario: parseFloat(costo_unitario) || 0.00
    });

    return res.status(201).json({
      ok: true,
      mensaje: 'Producto creado exitosamente.',
      producto: nuevoProducto
    });

  } catch (error) {
    console.error('❌ [InventarioController.createProducto] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al registrar el producto.',
      error: error.message
    });
  }
};

/**
 * Registra una compra de insumos a un proveedor e incrementa el stock
 * @route POST /api/v1/inventario/compras
 */
const registrarCompra = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { producto_id, proveedor_id, cantidad, costo_unitario, numero_factura } = req.body;

    if (!producto_id || !cantidad || cantidad <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        ok: false,
        mensaje: 'El producto y una cantidad válida mayor a 0 son obligatorios.'
      });
    }

    const producto = await Producto.findByPk(producto_id, { transaction });
    if (!producto) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        mensaje: 'Producto no encontrado.'
      });
    }

    const cant = parseInt(cantidad, 10);
    const costoUnit = parseFloat(costo_unitario) || parseFloat(producto.costo_unitario) || 0.00;
    const costoTotal = cant * costoUnit;

    // Registrar la compra
    const compra = await CompraInsumo.create({
      producto_id,
      proveedor_id: proveedor_id || null,
      cantidad: cant,
      costo_unitario: costoUnit,
      costo_total: costoTotal,
      numero_factura: numero_factura || null,
      fecha_compra: new Date().toISOString().split('T')[0]
    }, { transaction });

    // Incrementar stock en catálogo
    producto.stock_actual += cant;
    producto.costo_unitario = costoUnit;
    await producto.save({ transaction });

    await transaction.commit();

    return res.status(201).json({
      ok: true,
      mensaje: 'Compra registrada exitosamente y stock actualizado.',
      compra,
      nuevoStock: producto.stock_actual
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ [InventarioController.registrarCompra] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al procesar la compra de insumos.',
      error: error.message
    });
  }
};

/**
 * Obtiene métricas agregadas del consumo de insumos para la gráfica de barras
 * @route GET /api/v1/inventario/metricas-consumo
 */
const getMetricasConsumo = async (req, res) => {
  try {
    const consumos = await ConsumoInsumo.findAll({
      include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre', 'categoria'] }]
    });

    // Agrupar por nombre de producto
    const acumuladoPorProducto = {};

    consumos.forEach(c => {
      const nombre = c.producto ? c.producto.nombre : 'Insumo Varios';
      if (!acumuladoPorProducto[nombre]) {
        acumuladoPorProducto[nombre] = 0;
      }
      acumuladoPorProducto[nombre] += c.cantidad_usada;
    });

    const labels = Object.keys(acumuladoPorProducto);
    const data = Object.values(acumuladoPorProducto);

    return res.status(200).json({
      ok: true,
      labels,
      data
    });

  } catch (error) {
    console.error('❌ [InventarioController.getMetricasConsumo] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener métricas de consumo.',
      error: error.message
    });
  }
};

/**
 * Lista los proveedores de insumos
 * @route GET /api/v1/inventario/proveedores
 */
const getProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({ order: [['nombre', 'ASC']] });
    return res.status(200).json({ ok: true, proveedores });
  } catch (error) {
    console.error('❌ [InventarioController.getProveedores] Error:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al listar proveedores.' });
  }
};

module.exports = {
  getProductos,
  createProducto,
  toggleAgotado,
  reponerInsumo,
  getListaCompras,
  registrarCompra,
  getMetricasConsumo,
  getProveedores
};

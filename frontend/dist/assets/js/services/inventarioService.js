/**
 * ==============================================================================
 * SERVICIO: INVENTARIO, COMPRAS Y CONSUMO (MÓDULO 2 - ADMIN)
 * ==============================================================================
 * 
 * @module services/inventarioService
 */

const inventarioService = {
  /**
   * Obtiene la lista de insumos y existencias
   * @returns {Promise<Array>}
   */
  async getProductos() {
    const res = await apiClient.get('/inventario/productos');
    return res.productos || [];
  },

  /**
   * Registra un nuevo producto en catálogo
   * @param {Object} productoData 
   * @returns {Promise<Object>}
   */
  async createProducto(productoData) {
    const res = await apiClient.post('/inventario/productos', productoData);
    return res;
  },

  /**
   * Registra una compra de insumos a un proveedor
   * @param {Object} compraData 
   * @returns {Promise<Object>}
   */
  async registrarCompra(compraData) {
    const res = await apiClient.post('/inventario/compras', compraData);
    return res;
  },

  /**
   * Obtiene métricas agregadas de consumo de insumos para gráficos
   * @returns {Promise<Object>}
   */
  async getMetricasConsumo() {
    const res = await apiClient.get('/inventario/metricas-consumo');
    return res;
  },

  /**
   * Lista los proveedores registrados
   * @returns {Promise<Array>}
   */
  async getProveedores() {
    const res = await apiClient.get('/inventario/proveedores');
    return res.proveedores || [];
  }
};

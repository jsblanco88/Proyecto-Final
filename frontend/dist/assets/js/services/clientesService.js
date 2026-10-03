/**
 * ==============================================================================
 * SERVICIO: CLIENTES Y EXPEDIENTES (Frontend)
 * ==============================================================================
 * 
 * @module services/clientesService
 */

const clientesService = {
  /**
   * Obtiene la lista de clientes con filtro de búsqueda opcional
   * @param {string} busqueda 
   * @returns {Promise<Array>}
   */
  async getClientes(busqueda = '') {
    const query = busqueda ? `?busqueda=${encodeURIComponent(busqueda)}` : '';
    const res = await apiClient.get(`/clientes${query}`);
    return res.clientes || [];
  },

  /**
   * Obtiene el detalle de la ficha de un cliente con su historial de citas
   * @param {number|string} id 
   * @returns {Promise<Object>}
   */
  async getClienteById(id) {
    const res = await apiClient.get(`/clientes/${id}`);
    return res.cliente;
  },

  /**
   * Registra un nuevo cliente
   * @param {Object} clienteData 
   * @returns {Promise<Object>}
   */
  async createCliente(clienteData) {
    const res = await apiClient.post('/clientes', clienteData);
    return res;
  },

  /**
   * Actualiza datos y notas clínicas de un cliente
   * @param {number|string} id 
   * @param {Object} clienteData 
   * @returns {Promise<Object>}
   */
  async updateCliente(id, clienteData) {
    const res = await apiClient.put(`/clientes/${id}`, clienteData);
    return res;
  }
};

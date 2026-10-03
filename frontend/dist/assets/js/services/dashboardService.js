/**
 * ==============================================================================
 * SERVICIO: DASHBOARD Y ANALÍTICA (Frontend)
 * ==============================================================================
 * 
 * @module services/dashboardService
 */

const dashboardService = {
  /**
   * Obtiene los KPIs, ocupación de salas y series temporales para el Dashboard
   * @returns {Promise<Object>}
   */
  async getStats() {
    const res = await apiClient.get('/dashboard/stats');
    return res;
  }
};

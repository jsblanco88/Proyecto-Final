/**
 * ==============================================================================
 * SERVICIO: CITAS, SALAS Y DISPONIBILIDAD (MÓDULO 1)
 * ==============================================================================
 * 
 * Gestiona las llamadas HTTP para la matriz de 4 Salas (Agua, Aire, Tierra, Fuego)
 * y 12 bloques horarios (8:00 AM - 8:00 PM), confirmaciones de sala y liberación
 * exclusiva para Administradores.
 * 
 * @module services/citasService
 */

const citasService = {
  /**
   * Obtiene las 4 salas temáticas activas
   * @returns {Promise<Array>}
   */
  async getSalas() {
    const res = await apiClient.get('/salas');
    return res.salas || [];
  },

  /**
   * Consulta la matriz de disponibilidad para una fecha (YYYY-MM-DD)
   * @param {string} fecha 
   * @returns {Promise<Object>}
   */
  async getDisponibilidad(fecha) {
    const res = await apiClient.get(`/citas/disponibilidad?fecha=${fecha}`);
    return res;
  },

  /**
   * Crea una nueva reserva de cita
   * @param {Object} datosReserva 
   * @returns {Promise<Object>}
   */
  async createReserva(datosReserva) {
    const res = await apiClient.post('/citas', datosReserva);
    return res;
  },

  /**
   * Confirma la sala asignada a la reserva dentro de los plazos reglamentarios
   * @param {number|string} citaId 
   * @returns {Promise<Object>}
   */
  async confirmarSala(citaId) {
    const res = await apiClient.patch(`/citas/${citaId}/confirmar`);
    return res;
  },

  /**
   * Libera o cancela una cita en estado 'confirmada' (Exclusivo Administrador)
   * @param {number|string} citaId 
   * @param {string} motivo 
   * @returns {Promise<Object>}
   */
  async liberarCitaConfirmada(citaId, motivo) {
    const res = await apiClient.patch(`/citas/${citaId}/liberar`, { motivo });
    return res;
  },

  /**
   * Reprograma fecha, horario y sala de una cita
   * @param {number|string} citaId 
   * @param {Object} datosReprogramacion { fecha, hora_inicio, hora_fin, sala_id }
   * @returns {Promise<Object>}
   */
  async reprogramarCita(citaId, datosReprogramacion) {
    const res = await apiClient.patch(`/citas/${citaId}/reprogramar`, datosReprogramacion);
    return res;
  },

  /**
   * Cancela una cita
   * @param {number|string} citaId 
   * @param {string} motivo 
   * @returns {Promise<Object>}
   */
  async cancelarCita(citaId, motivo) {
    const res = await apiClient.patch(`/citas/${citaId}/cancelar`, { motivo });
    return res;
  },

  /**
   * Marca una cita como completada y registra insumos consumidos
   * @param {number|string} citaId 
   * @param {Array} insumosUtilizados 
   * @returns {Promise<Object>}
   */
  async completarCita(citaId, insumosUtilizados = []) {
    const res = await apiClient.patch(`/citas/${citaId}/completar`, {
      insumos_utilizados: insumosUtilizados
    });
    return res;
  },

  /**
   * Obtiene el historial de citas con filtros
   * @param {Object} filtros 
   * @returns {Promise<Object>}
   */
  async getHistorial(filtros = {}) {
    const queryParams = new URLSearchParams(filtros).toString();
    const res = await apiClient.get(`/citas/historial?${queryParams}`);
    return res;
  }
};

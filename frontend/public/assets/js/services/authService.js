/**
 * ==============================================================================
 * SERVICIO: AUTENTICACIÓN Y SESIÓN (Frontend)
 * ==============================================================================
 * 
 * Gestiona el inicio de sesión, almacenamiento seguro de tokens y roles,
 * y verificación de estado de autenticación.
 * 
 * @module services/authService
 */

const authService = {
  /**
   * Inicia sesión en el sistema y almacena token y datos de usuario
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>}
   */
  async login(email, password) {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.ok && res.token) {
      localStorage.setItem('spa_jwt_token', res.token);
      localStorage.setItem('spa_user_data', JSON.stringify(res.usuario));
    }
    return res;
  },

  /**
   * Cierra la sesión activa y elimina las credenciales locales
   */
  logout() {
    localStorage.removeItem('spa_jwt_token');
    localStorage.removeItem('spa_user_data');
    window.location.href = '/views/login.html';
  },

  /**
   * Obtiene los datos del usuario almacenado en sesión local
   * @returns {Object|null}
   */
  getUsuarioActual() {
    const data = localStorage.getItem('spa_user_data');
    return data ? JSON.parse(data) : null;
  },

  /**
   * Verifica si existe una sesión activa con token
   * @returns {boolean}
   */
  estaAutenticado() {
    return !!localStorage.getItem('spa_jwt_token');
  },

  /**
   * Verifica si el usuario actual posee rol de Administrador
   * @returns {boolean}
   */
  esAdmin() {
    const u = this.getUsuarioActual();
    return u && u.rol === 'admin';
  },

  /**
   * Lista el equipo de masajistas activos para desplegables
   * @returns {Promise<Array>}
   */
  async getMasajistas() {
    const res = await apiClient.get('/auth/masajistas');
    return res.masajistas || [];
  },

  /**
   * Registra un nuevo masajista en el sistema (Exclusivo Administrador)
   * @param {Object} datosMasajista 
   * @returns {Promise<Object>}
   */
  async createMasajista(datosMasajista) {
    const res = await apiClient.post('/auth/masajistas', datosMasajista);
    return res;
  }
};

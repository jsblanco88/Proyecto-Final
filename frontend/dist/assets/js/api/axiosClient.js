/**
 * ==============================================================================
 * CLIENTE HTTP: AXIOS CONFIGURATION & INTERCEPTORS
 * ==============================================================================
 * 
 * Configura la instancia global de Axios para consumir la API REST del Backend.
 * Incluye interceptores para inyectar automáticamente el Token JWT en los headers
 * y capturar respuestas 401 (redireccionando al login si la sesión caduca).
 * 
 * @module api/axiosClient
 */

// Base URL configurable para entorno de desarrollo y producción
const API_BASE_URL = window.location.port === '3000'
  ? '/api/v1' 
  : 'http://localhost:3000/api/v1';

// Crear instancia de Axios (utiliza axios cargado por CDN o paquete)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos timeout
});

/**
 * Interceptor de Peticiones: Adjunta el Token JWT si existe en localStorage
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spa_jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuestas: Maneja errores comunes (401 Expirado, 403 No Autorizado)
 */
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 401 No Autorizado -> Sesión expirada
      if (error.response.status === 401) {
        console.warn('⚠️ [Axios] Sesión caducada. Redirigiendo a login...');
        localStorage.removeItem('spa_jwt_token');
        localStorage.removeItem('spa_user_data');
        
        // Redireccionar si no estamos ya en login o portal público
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
          window.location.href = '/views/login.html';
        }
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      ok: false,
      mensaje: 'No se pudo conectar con el servidor backend (API). Verifique su conexión.'
    });
  }
);

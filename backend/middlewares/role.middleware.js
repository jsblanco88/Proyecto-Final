/**
 * ==============================================================================
 * MIDDLEWARE: CONTROL DE ACCESO BASADO EN ROLES (RBAC)
 * ==============================================================================
 * 
 * Verifica que el usuario autenticado cuente con el rol requerido para ejecutar
 * la acción solicitada. Protege acciones críticas como:
 * - Liberación exclusiva de horarios confirmados por el Administrador.
 * - Módulo de inventarios y registro de compras.
 * - Eliminación o bajas lógicas de clientes y personal.
 * 
 * @module middlewares/role.middleware
 */

/**
 * Middleware que permite el acceso exclusivamente a usuarios con rol 'admin'
 * @param {import('express').Request} req - Petición HTTP
 * @param {import('express').Response} res - Respuesta HTTP
 * @param {import('express').NextFunction} next - Siguiente función
 */
const esAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Usuario no autenticado en la sesión.'
    });
  }

  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      ok: false,
      mensaje: 'Acceso denegado. Esta acción requiere privilegios de Administrador.'
    });
  }

  next();
};

/**
 * Middleware que permite el acceso a usuarios autenticados (Admin o Masoterapeuta)
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const esPersonalSpa = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Usuario no autenticado en la sesión.'
    });
  }

  if (req.usuario.rol === 'admin' || req.usuario.rol === 'masoterapeuta') {
    return next();
  }

  return res.status(403).json({
    ok: false,
    mensaje: 'Acceso denegado. Rol no autorizado.'
  });
};

module.exports = {
  esAdmin,
  esPersonalSpa
};

/**
 * ==============================================================================
 * MIDDLEWARE: AUTENTICACIÓN JWT (JSON Web Tokens)
 * ==============================================================================
 * 
 * Intercepta las solicitudes HTTP hacia rutas protegidas y valida la firma
 * y vigencia del Token JWT enviado en el header 'Authorization: Bearer <token>'.
 * Si el token es válido, adjunta la información del usuario autenticado en `req.usuario`.
 * 
 * @module middlewares/auth.middleware
 */

const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/**
 * Middleware que verifica la presencia y validez del token JWT
 * @param {import('express').Request} req - Petición HTTP
 * @param {import('express').Response} res - Respuesta HTTP
 * @param {import('express').NextFunction} next - Función para continuar al siguiente middleware
 */
const verificarToken = async (req, res, next) => {
  try {
    // 1. Extraer el header Authorization
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Acceso no autorizado. Se requiere un Token JWT válido.'
      });
    }

    // 2. Extraer el token después del prefijo 'Bearer '
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token no proporcionado.'
      });
    }

    // 3. Verificar la firma del token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_spa_management_2026_modulo8');

    // 4. Buscar el usuario en la base de datos para asegurar que sigue activo
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'especialidad']
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Sesión inválida o usuario inactivo.'
      });
    }

    // 5. Adjuntar los datos del usuario autenticado en el objeto Request
    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        mensaje: 'El token de sesión ha expirado. Por favor inicie sesión nuevamente.'
      });
    }
    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o corrupto.'
    });
  }
};

module.exports = {
  verificarToken
};

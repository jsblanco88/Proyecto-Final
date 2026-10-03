/**
 * ==============================================================================
 * CONTROLADOR: AUTENTICACIÓN Y USUARIOS (MVC)
 * ==============================================================================
 * 
 * Gestiona el inicio de sesión, verificación de credenciales mediante bcryptjs,
 * generación de Tokens JWT con control de roles y consulta de perfil activo.
 * 
 * @module controllers/auth.controller
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/**
 * Inicia sesión en el sistema y retorna el token JWT junto con el rol
 * @route POST /api/v1/auth/login
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar presencia de campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Por favor proporcione el correo electrónico y la contraseña.'
      });
    }

    // 2. Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email: email.toLowerCase().trim() } });

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales inválidas. Usuario no encontrado.'
      });
    }

    // 3. Verificar si el usuario se encuentra activo
    if (!usuario.activo) {
      return res.status(403).json({
        ok: false,
        mensaje: 'El usuario se encuentra inactivo. Contacte al Administrador.'
      });
    }

    // 4. Comparar la contraseña en texto plano contra el hash almacenado
    const esPasswordCorrecto = await bcrypt.compare(password, usuario.password);

    if (!esPasswordCorrecto) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales inválidas. Contraseña incorrecta.'
      });
    }

    // 5. Generar Token JWT con payload de identificación y rol
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_spa_management_2026_modulo8';
    const expiresIn = process.env.JWT_EXPIRES_IN || '8h';

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      secret,
      { expiresIn }
    );

    // 6. Retornar respuesta exitosa con token y datos de sesión
    return res.status(200).json({
      ok: true,
      mensaje: `Bienvenido al sistema, ${usuario.nombre}.`,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        especialidad: usuario.especialidad
      }
    });

  } catch (error) {
    console.error('❌ [AuthController.login] Error al procesar login:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al iniciar sesión.',
      error: error.message
    });
  }
};

/**
 * Obtiene los datos del usuario actualmente autenticado
 * @route GET /api/v1/auth/me
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getPerfil = async (req, res) => {
  try {
    return res.status(200).json({
      ok: true,
      usuario: req.usuario
    });
  } catch (error) {
    console.error('❌ [AuthController.getPerfil] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener el perfil de usuario.',
      error: error.message
    });
  }
};

/**
 * Lista todos los masajistas y terapeutas activos
 * @route GET /api/v1/auth/masajistas
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getMasajistas = async (req, res) => {
  try {
    const masajistas = await Usuario.findAll({
      where: { activo: true },
      attributes: ['id', 'nombre', 'email', 'rol', 'especialidad'],
      order: [['nombre', 'ASC']]
    });

    return res.status(200).json({
      ok: true,
      masajistas
    });
  } catch (error) {
    console.error('❌ [AuthController.getMasajistas] Error:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al listar el equipo de masajistas.',
      error: error.message
    });
  }
};

module.exports = {
  login,
  getPerfil,
  getMasajistas
};

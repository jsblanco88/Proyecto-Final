/**
 * ==============================================================================
 * SEEDER INICIAL DE DATOS (Sequelize)
 * ==============================================================================
 * 
 * Inicializa la base de datos con las 4 salas temáticas requeridas (Agua, Aire,
 * Tierra, Fuego), usuarios administradores y terapeutas, insumos y clientes demo.
 * 
 * @module seeders/initialSeed
 */

const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Sala, Cliente, Producto, Proveedor, Cita } = require('../models');

const ejecutarSeeder = async () => {
  try {
    console.log('🔄 [Seeder] Sincronizando modelos de base de datos...');
    await sequelize.sync({ force: true }); // Reinicia tablas en modo limpio para seeders

    console.log('🌱 [Seeder] Creando las 4 Salas Temáticas obligatorias...');
    const salas = await Sala.bulkCreate([
      {
        nombre: 'Sala Agua',
        icono: 'water_drop',
        color_tema: '#2980B9',
        descripcion: 'Especializada en hidroterapia, masajes relajantes fluidos y cromoterapia.',
        capacidad: 1,
        activa: true
      },
      {
        nombre: 'Sala Aire',
        icono: 'air',
        color_tema: '#16A085',
        descripcion: 'Especializada en aromaterapia, masajes tántricos y técnicas de respiración.',
        capacidad: 1,
        activa: true
      },
      {
        nombre: 'Sala Tierra',
        icono: 'spa',
        color_tema: '#B7950B',
        descripcion: 'Especializada en piedras calientes volcánicas, fangoterapia y masajes profundos.',
        capacidad: 1,
        activa: true
      },
      {
        nombre: 'Sala Fuego',
        icono: 'local_fire_department',
        color_tema: '#C0392B',
        descripcion: 'Especializada en termoterapia, bambuterapia y masajes descontracturantes intensos.',
        capacidad: 1,
        activa: true
      }
    ]);

    console.log('🌱 [Seeder] Creando Usuarios y Terapeutas demo...');
    const passwordAdminHash = await bcrypt.hash('admin123', 10);
    const passwordMasajistaHash = await bcrypt.hash('masaje123', 10);

    const usuarios = await Usuario.bulkCreate([
      {
        nombre: 'Administrador General',
        email: 'admin@spa.com',
        password: passwordAdminHash,
        rol: 'admin',
        especialidad: 'Dirección y Gestión de Operaciones',
        activo: true
      },
      {
        nombre: 'Carlos Masoterapeuta',
        email: 'carlos@spa.com',
        password: passwordMasajistaHash,
        rol: 'masoterapeuta',
        especialidad: 'Masaje Relajante e Hidroterapia (Sala Agua)',
        activo: true
      },
      {
        nombre: 'Ana Masoterapeuta',
        email: 'ana@spa.com',
        password: passwordMasajistaHash,
        rol: 'masoterapeuta',
        especialidad: 'Aromaterapia y Reflexología (Sala Aire)',
        activo: true
      },
      {
        nombre: 'Marta Masoterapeuta',
        email: 'marta@spa.com',
        password: passwordMasajistaHash,
        rol: 'masoterapeuta',
        especialidad: 'Piedras Calientes y Tejido Profundo (Sala Tierra/Fuego)',
        activo: true
      }
    ]);

    console.log('🌱 [Seeder] Creando Clientes demo...');
    const clientes = await Cliente.bulkCreate([
      {
        nombre: 'Ana Gómez',
        dni: '12345678A',
        telefono: '+34 600 111 222',
        email: 'ana.gomez@email.com',
        direccion: 'Calle Mayor 12, Madrid',
        notas_clinicas: 'Sensibilidad leve en zona lumbar. Prefiere presión suave y aroma a lavanda.'
      },
      {
        nombre: 'Luis Pérez',
        dni: '87654321B',
        telefono: '+34 600 333 444',
        email: 'luis.perez@email.com',
        direccion: 'Av. Diagonal 45, Barcelona',
        notas_clinicas: 'Contractura cervical por postura de oficina. Apto para bambuterapia.'
      },
      {
        nombre: 'Marta Rodríguez',
        dni: '45678912C',
        telefono: '+34 600 555 666',
        email: 'marta.rodriguez@email.com',
        direccion: 'Calle Gran Vía 88, Madrid',
        notas_clinicas: 'Alergia a frutos secos (evitar aceite de almendras, usar aceite de jojoba).'
      },
      {
        nombre: 'José Vega',
        dni: '78912345D',
        telefono: '+34 600 777 888',
        email: 'jose.vega@email.com',
        direccion: 'Plaza España 3, Valencia',
        notas_clinicas: 'Deportista (atletismo). Solicita masaje descontracturante en piernas.'
      }
    ]);

    console.log('🌱 [Seeder] Creando Proveedores e Insumos...');
    const proveedores = await Proveedor.bulkCreate([
      {
        nombre: 'Aromas del Bosque Natural S.L.',
        contacto: 'Elena Martínez',
        telefono: '+34 912 345 678',
        email: 'pedidos@aromasdelbosque.com',
        direccion: 'Polígono Industrial Norte 24, Madrid'
      },
      {
        nombre: 'Distribuidora Cosmética Terapéutica',
        contacto: 'Roberto Sánchez',
        telefono: '+34 933 888 999',
        email: 'contacto@cosmeticaterapeutica.es',
        direccion: 'Av. Industria 102, Barcelona'
      }
    ]);

    const productos = await Producto.bulkCreate([
      {
        nombre: 'Aceite de Almendras Dulces (500ml)',
        categoria: 'Aceites y Cremas',
        stock_actual: 35,
        stock_minimo: 10,
        reserva: 5,
        unidad_medida: 'Botellas',
        costo_unitario: 12.50
      },
      {
        nombre: 'Aceite Esencial de Lavanda (50ml)',
        categoria: 'Aromaterapia',
        stock_actual: 20,
        stock_minimo: 5,
        reserva: 2,
        unidad_medida: 'Frascos',
        costo_unitario: 8.90
      },
      {
        nombre: 'Crema Descontracturante Árnica (1kg)',
        categoria: 'Aceites y Cremas',
        stock_actual: 15,
        stock_minimo: 4,
        reserva: 3,
        unidad_medida: 'Potes',
        costo_unitario: 24.00
      },
      {
        nombre: 'Toallas Descartables Premium (Paq 50u)',
        categoria: 'Higiene y Descartables',
        stock_actual: 50,
        stock_minimo: 15,
        reserva: 10,
        unidad_medida: 'Paquetes',
        costo_unitario: 15.00
      },
      {
        nombre: 'Set Piedras Volcánicas Basalto (12u)',
        categoria: 'Equipamiento Terapéutico',
        stock_actual: 8,
        stock_minimo: 2,
        reserva: 0,
        unidad_medida: 'Kits',
        costo_unitario: 45.00
      },
      {
        nombre: 'Esencia de Eucalipto y Menta (100ml)',
        categoria: 'Aromaterapia',
        stock_actual: 18,
        stock_minimo: 5,
        reserva: 1,
        unidad_medida: 'Frascos',
        costo_unitario: 9.50
      }
    ]);

    console.log('🌱 [Seeder] Creando Citas de prueba para hoy...');
    const hoy = new Date().toISOString().split('T')[0];

    await Cita.bulkCreate([
      {
        cliente_id: clientes[0].id, // Ana Gómez
        usuario_id: usuarios[1].id, // Carlos
        sala_id: salas[0].id,       // Sala Agua
        fecha: hoy,
        hora_inicio: '10:00',
        hora_fin: '11:00',
        servicio_solicitado: 'Masaje Relajante Hidro',
        monto_cobrado: 45.00,
        estado: 'confirmada',
        confirmada_en: new Date()
      },
      {
        cliente_id: clientes[1].id, // Luis Pérez
        usuario_id: usuarios[2].id, // Ana
        sala_id: salas[1].id,       // Sala Aire
        fecha: hoy,
        hora_inicio: '11:00',
        hora_fin: '12:00',
        servicio_solicitado: 'Aromaterapia y Reflexología',
        monto_cobrado: 50.00,
        estado: 'pendiente_confirmacion',
        deadline_confirmacion: new Date(Date.now() + 45 * 60 * 1000)
      },
      {
        cliente_id: clientes[2].id, // Marta Rodríguez
        usuario_id: usuarios[3].id, // Marta Masoterapeuta
        sala_id: salas[2].id,       // Sala Tierra
        fecha: hoy,
        hora_inicio: '15:00',
        hora_fin: '16:00',
        servicio_solicitado: 'Piedras Calientes Volcánicas',
        monto_cobrado: 65.00,
        estado: 'confirmada',
        confirmada_en: new Date()
      },
      {
        cliente_id: clientes[3].id, // José Vega
        usuario_id: usuarios[3].id, // Marta Masoterapeuta
        sala_id: salas[3].id,       // Sala Fuego
        fecha: hoy,
        hora_inicio: '17:00',
        hora_fin: '18:00',
        servicio_solicitado: 'Bambuterapia Descontracturante',
        monto_cobrado: 55.00,
        estado: 'ocupada'
      }
    ]);

    console.log('✅ [Seeder] Base de datos inicializada y poblada exitosamente.');
    console.log('🔑 Credenciales por defecto:');
    console.log('   👤 Admin: admin@spa.com | admin123');
    console.log('   💆 Masoterapeuta: carlos@spa.com | masaje123');
    console.log('   💆 Masoterapeuta: ana@spa.com | masaje123');
    console.log('   💆 Masoterapeuta: marta@spa.com | masaje123');

  } catch (error) {
    console.error('❌ [Seeder] Error al inicializar datos:', error);
  }
};

// Si se ejecuta directamente desde terminal
if (require.main === module) {
  ejecutarSeeder().then(() => process.exit(0));
}

module.exports = ejecutarSeeder;

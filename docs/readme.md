# Sistema de Gestión Integral de Spa 💆‍♀️🌿

Plataforma web modular para la administración y control operativo de spas y centros de masoterapia, construida bajo el patrón **MVC (Modelo - Vista - Controlador)** con separación física y lógica entre el **Backend (API REST con Node.js, Express y Sequelize)** y el **Frontend (Vistas HTML5/CSS3 con Axios)**.

---

## 🏛️ Características y Reglas Principales

### 🌿 4 Salas Temáticas
El centro cuenta con cuatro salas de atención con ambiente diferenciado:
- 💧 **Sala Agua**: Hidroterapia y masajes relajantes.
- 💨 **Sala Aire**: Aromaterapia y técnicas de respiración.
- 🌿 **Sala Tierra**: Piedras calientes y fangoterapia.
- 🔥 **Sala Fuego**: Termoterapia y masajes descontracturantes intensos.

### ⏰ Matriz de 12 Bloques Horarios (8:00 AM a 8:00 PM)
- 12 bloques continuos de 1 hora de duración: `08:00`, `09:00`, `10:00`, `11:00`, `12:00`, `13:00`, `14:00`, `15:00`, `16:00`, `17:00`, `18:00`, `19:00` (cierre a las 20:00).
- Semáforo visual en tiempo real:
  - 🟢 **Verde (Disponible)**: Sala y bloque libre para agendar.
  - 🟡 **Amarillo (Reservado)**: En espera de confirmación del masajista.
  - 🔵 **Azul (Confirmado)**: Sala confirmada por el profesional.
  - 🔴 **Rojo (Ocupado)**: Sesión en ejecución o bloqueada.

### ⏱️ Reglas Operativas y de Seguridad
1. **Reservas y Confirmaciones por Masajista (Clientes Individuales)**:
   - Los masajistas agendan salas para sus clientes individuales y confirman sus propias citas dentro de los plazos reglamentarios (1 hora antes para reservas estándar o 20 minutos para reservas express).
2. **Control Exclusivo del Administrador sobre Citas Confirmadas**:
   - Una vez que la cita pasa a 🔵 **Confirmado**, **ÚNICAMENTE el Administrador** tiene autorización para cambiar el horario (reprogramar) o cancelar/liberar la cita.
3. **Privacidad Estricta de Clientes**:
   - Cada masajista **únicamente visualiza el nombre de sus propios clientes**. Para turnos de otros terapeutas, el cliente se visualiza como `[Cliente Reservado]`.
   - El Administrador posee visibilidad global sobre todos los clientes.
4. **Alta y Creación de Masajistas (Solo Administrador)**:
   - **ÚNICAMENTE el Administrador** puede registrar y crear nuevas cuentas de masajistas en el sistema.

### 📝 Estándar de Código Comentado
- **100% de Código Comentado**: Todo el código fuente del proyecto (Modelos, Controladores, Rutas, Middlewares, Servicios Axios y Vistas) está exhaustivamente documentado para garantizar una lectura intuitiva y facilidad de mantenimiento.

---

## 🛠️ Stack Tecnológico

| Capa | Componente | Tecnologías |
| :--- | :--- | :--- |
| **Backend** | API REST & Controladores | Node.js, Express.js |
| **Backend** | Modelos & Persistencia | Sequelize ORM (PostgreSQL, MySQL o SQLite) |
| **Backend** | Seguridad & Auth | JWT, bcryptjs, CORS, RBAC (Admin / Masajista) |
| **Frontend** | Vistas & Maquetación | HTML5 Semántico, CSS3 Flexbox/Grid |
| **Frontend** | Lógica de Cliente | JavaScript Modular (ES6+), Axios, Chart.js |

---

## 📁 Estructura del Proyecto (MVC Desacoplado)

```text
proyecto-spa/
├── backend/                  # SERVIDOR API REST, MODELOS Y CONTROLADORES
│   ├── config/               # Configuración de base de datos y variables de entorno
│   ├── controllers/          # Controladores MVC (100% comentados)
│   │   ├── auth.controller.js
│   │   ├── citas.controller.js      # Matriz 12 bloques, Salas Agua/Aire/Tierra/Fuego, Reglas 1h y 20m
│   │   ├── inventario.controller.js # Control de insumos y compras
│   │   ├── clientes.controller.js
│   │   └── dashboard.controller.js
│   ├── middlewares/          # JWT y Role Guards (Exclusividad Admin para liberar confirmadas)
│   ├── models/               # Modelos Sequelize (Usuario, Sala, Cita, Cliente, Producto, etc.)
│   ├── routes/               # Enrutadores API (/api/v1/...)
│   ├── migrations/           # Migraciones de base de datos
│   ├── seeders/              # Datos iniciales (Salas Agua, Aire, Tierra, Fuego y Usuarios)
│   ├── server.js             # Entrada principal del Backend Express
│   └── package.json
│
├── frontend/                 # VISTAS E INTERFAZ DE USUARIO DESACOPLADA
│   ├── public/assets/
│   │   ├── css/              # Estilos públicos y del panel privado
│   │   ├── img/              # Recursos multimedia
│   │   └── js/               # Controladores JS de cliente y Axios Services (100% comentados)
│   └── views/                # Páginas HTML (Portal público, Reservas, Historial, Inventario)
│
├── docs/
│   └── DIAGRAMA DE PROCESO.pdf
├── constitution.md           # Constitución, principios y reglas de negocio
├── spec.md                   # Especificación técnica y funcional detallada
├── manual.md                 # Manual de usuario y operaciones paso a paso
└── readme.md                 # Este documento
```

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Iniciar la API Backend
```bash
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

### 2. Iniciar el Frontend
```bash
cd ../frontend
# Servir con http-server o abrir views/index.html:
npx http-server -p 8080 -c-1
```
- **Portal Público**: `http://localhost:8080/views/index.html`
- **Panel Privado**: `http://localhost:8080/views/login.html`
- **API Base**: `http://localhost:3000/api/v1`

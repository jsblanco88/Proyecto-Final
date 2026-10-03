# Constitución del Proyecto: Sistema de Gestión Integral de Spa

## 1. Visión y Propósito
El **Sistema de Gestión Integral de Spa** es una plataforma web modular construida bajo el patrón arquitectónico **MVC (Modelo - Vista - Controlador)** con una **separación estricta entre la API Backend y la aplicación Frontend**. Su propósito central es coordinar y optimizar la utilización de **4 salas temáticas de atención (Agua, Aire, Tierra, Fuego)**, organizar **12 bloques horarios de atención diaria (de 8:00 AM a 8:00 PM)**, gestionar turnos con reglas estrictas de confirmación y liberación, centralizar clientes y controlar el inventario de insumos.

---

## 2. Objetivos Principales
1. **Portal Público**: Interfaz web atractiva para exhibir servicios de spa, terapeutas, salas temáticas, información institucional y canalizar solicitudes de citas.
2. **Controlador de Citas y Matriz de Salas (Módulo 1)**: Visualizador dinámico de **4 salas fijas (Agua, Aire, Tierra, Fuego)** en **12 bloques de 1 hora (8:00 AM a 8:00 PM)** con código semáforo en tiempo real (🟢 Verde/Disponible, 🟡 Amarillo/Reservado, 🔵 Azul/Confirmado, 🔴 Rojo/Ocupado).
3. **Gestión de Insumos e Inventarios (Módulo 2)**: Control de stock, compras a proveedores y deducción de insumos por sesión completada para el rol Administrador.
4. **Historial y Ficha de Clientes**: Expedientes centralizados con historial de atenciones y notas terapéuticas.
5. **Métricas y Rendimiento (Dashboard)**: Analítica de citas por mes, balance de ingresos y gráficos de consumo de productos.
6. **Mantenibilidad y Código Comentado**: Todo el código fuente del backend y frontend debe estar **completamente documentado y comentado** para facilitar su lectura, comprensión y mantenimiento.

---

## 3. Principios de Arquitectura y Estándares de Desarrollo

### 3.1. Patrón MVC y Separación Backend API / Frontend
- **Modelos (Backend / Sequelize ORM)**: Definición de tablas, tipos de datos, restricciones y relaciones de la base de datos relacional.
- **Controladores (Backend / Express)**: Lógica de negocio, validaciones de tiempo, transacciones de confirmación y endpoints REST.
- **Vistas (Frontend Modular)**: Interfaz construida con HTML5, CSS3 y JavaScript, comunicándose con la API mediante Axios.

### 3.2. Estándar de Documentación y Comentarios de Código (Mandatorio)
- **100% de Código Comentado**: Cada archivo, modelo, controlador, ruta, servicio Axios y script de vista debe contar con bloques de comentarios (JSDoc / explicaciones inline) describiendo:
  - Propósito de la función o módulo.
  - Parámetros recibidos y tipos de datos de retorno.
  - Reglas de negocio y validaciones temporales aplicadas.

---

## 4. Roles y Matriz de Responsabilidades

| Actor | Alcance y Permisos | Responsabilidades Principales |
| :--- | :--- | :--- |
| **Público General / Cliente** | Zona Pública | Consulta catálogo de servicios, salas temáticas y solicita reservas. |
| **Masajista / Masoterapeuta** | Zona Privada (Limitada) | Consulta la matriz de salas (Agua, Aire, Tierra, Fuego), agenda turnos y **confirma sus salas dentro del plazo reglamentario**. No puede liberar citas ya confirmadas. |
| **Administrador** | Zona Privada (Acceso Total) | Control total de todas las salas, **único autorizado para liberar o cancelar horarios confirmados**, gestión de inventario, compras, usuarios y analítica financiera. |

---

## 5. Reglas de Negocio Fundamentales

### 5.1. Nombres de Salas y Horarios de Operación
- **Salas Temáticas (4)**:
  1. 💧 **Sala Agua**
  2. 💨 **Sala Aire**
  3. 🌿 **Sala Tierra**
  4. 🔥 **Sala Fuego**
- **Bloques Horarios (12 bloques de 1 hora)**:
  - `08:00 - 09:00` | `09:00 - 10:00` | `10:00 - 11:00` | `11:00 - 12:00`
  - `12:00 - 13:00` | `13:00 - 14:00` | `14:00 - 15:00` | `15:00 - 16:00`
  - `16:00 - 17:00` | `17:00 - 18:00` | `18:00 - 19:00` | `19:00 - 20:00`

### 5.2. Reglas Temporales de Confirmación y Liberación de Reservas
1. **Regla de Confirmación Estándar (Plazo de 1 Hora Antes)**:
   - Para reservas efectuadas con más de 1 hora de anticipación, el **masajista asignado deberá confirmar la sala a más tardar 1 hora antes del inicio de la cita**.
   - Si no se confirma dentro de este plazo límite, **el sistema libera automáticamente la reserva**, devolviendo la sala al estado 🟢 **Disponible**.
2. **Regla de Confirmación para Reservas Express / Última Hora (Ventana de 20 Minutos)**:
   - Las reservas que se efectúen con **1 hora o menos de anticipación** respecto al horario de la cita deberán ser confirmadas por el masajista en un **plazo máximo de 20 minutos** desde su creación.
   - Si transcurren los 20 minutos sin confirmación, **la reserva se libera automáticamente**.
3. **Exclusividad Administrativa sobre Horarios Confirmados**:
   - Una vez que una reserva pasa al estado **Confirmado**, **ÚNICAMENTE el Administrador tiene autorización para liberar, reasignar o cancelar dicho horario**. Ni el masajista ni el cliente pueden desmarcar un horario confirmado por cuenta propia.
4. **Estados de Disponibilidad y Semáforo Visual**:
   - 🟢 **Disponible**: Espacio libre para agendar.
   - 🟡 **Reservado (Pendiente de Confirmación)**: Cita agendada sujeta a confirmación en los plazos de 1 hora o 20 minutos.
   - 🔵 **Confirmado**: Sala ratificada por el masajista. Solo liberable por el Administrador.
   - 🔴 **Ocupado / En Curso**: Sesión en ejecución o sala bloqueada por mantenimiento.

# Manual de Usuario y Operación del Sistema

Bienvenido al **Manual de Usuario y Operación** del Sistema de Gestión Integral de Spa. Este sistema está construido bajo la arquitectura **MVC Desacoplada** (Frontend independiente que consume la API REST en Node.js/Express) con código 100% comentado y documentado para su mantenimiento.

---

## 1. Salas Temáticas y Horarios de Atención

El centro opera con **4 salas temáticas** especializadas y **12 bloques de 1 hora**:

- 💧 **Sala Agua**: Hidroterapia y masajes relajantes.
- 💨 **Sala Aire**: Aromaterapia y técnicas de respiración.
- 🌿 **Sala Tierra**: Piedras calientes y fangoterapia.
- 🔥 **Sala Fuego**: Termoterapia y masajes descontracturantes intensos.

### Horario de Operación (08:00 AM a 08:00 PM)
- Bloques: `08:00 - 09:00`, `09:00 - 10:00`, `10:00 - 11:00`, `11:00 - 12:00`, `12:00 - 13:00`, `13:00 - 14:00`, `14:00 - 15:00`, `15:00 - 16:00`, `16:00 - 17:00`, `17:00 - 18:00`, `18:00 - 19:00`, `19:00 - 20:00`.

## 2. Navegación en el Sistema Interno: Navbar y Sidebar

Tal como se define en los diagramas de procesos, tanto el **Masajista** como el **Administrador** interactúan con el sistema privado a través de un **Navbar superior** y un **Sidebar lateral**:

```
+---------------------------------------------------------------------------------------------------------+
| [🌿 SPA Logo]                                   [📅 Calendario] [⏰ Horarios] | Bienvenido, [Nombre] [Logout] |
+------------------+--------------------------------------------------------------------------------------+
| 📊 Dashboard     |                                                                                      |
| 📋 Historial     |                              ÁREA DE CONTENIDO PRINCIPAL                             |
| 📅 Reservas      |         (Dashboard / Matriz de Salas / Historial / Inventario / Ficha Cliente)       |
| 📦 Inventario*   |                                                                                      |
| 👤 Ficha Cliente |                                                                                      |
+------------------+--------------------------------------------------------------------------------------+
  * Módulo visible exclusivamente para el rol Administrador.
```

### 2.1. Navbar Superior
- **SPA Logo**: Identidad visual del centro de masoterapia.
- **Selectores Rápidos**: Calendario (para cambiar de fecha de atención) y filtro rápido de horarios.
- **Panel de Usuario**: Saludo dinámico con el nombre del usuario autenticado, distintivo de rol (`[Administrador]` o `[Masajista]`) y botón **Logout** para cerrar sesión de manera segura.

### 2.2. Sidebar Lateral (Opciones por Rol)
- **📊 Dashboard**: Métricas individuales para masajistas; métricas globales, financieras y de consumo para administradores.
- **📋 Historial de Citas**: Tabla interactiva para consultar y cambiar estados de citas.
- **📅 Reservas (Salas)**: Matriz interactiva de las 4 salas (**Agua, Aire, Tierra, Fuego**) y 12 bloques (8:00 AM - 8:00 PM).
- **📦 Inventario**: Control de insumos y compras a proveedores (*Exclusivo Administrador*).
- **👤 Ficha Cliente**: Búsqueda y gestión de expedientes de clientes y notas terapéuticas.

---

## 3. Matriz de Reservas y Código Semáforo (Módulo 1)

```
+-----------------------------------------------------------------------------------------------+
| HORA          | SALA AGUA       | SALA AIRE       | SALA TIERRA     | SALA FUEGO              |
+---------------+-----------------+-----------------+-----------------+-------------------------+
| 08:00 - 09:00 | [🟢 DISPONIBLE] | [🟢 DISPONIBLE] | [🟢 DISPONIBLE] | [🟢 DISPONIBLE]         |
| 09:00 - 10:00 | [🟢 DISPONIBLE] | [🟡 RESERVADO]  | [🟢 DISPONIBLE] | [🔵 CONFIRMADO]         |
| 10:00 - 11:00 | [🟢 DISPONIBLE] | [🟢 DISPONIBLE] | [🔵 CONFIRMADO] | [🟢 DISPONIBLE]         |
| 11:00 - 12:00 | [🟡 RESERVADO]  | [🟢 DISPONIBLE] | [🟢 DISPONIBLE] | [🔴 OCUPADO]            |
+-----------------------------------------------------------------------------------------------+
```

### Significado de los Colores
- 🟢 **Verde (Disponible)**: Bloque libre para agendar.
- 🟡 **Amarillo (Reservado / Pendiente de Confirmación)**: Cita agendada, en espera de que el masajista confirme la sala.
- 🔵 **Azul (Confirmado)**: Cita ratificada por el masajista. **Solo el Administrador puede cancelarla o liberarla.**
- 🔴 **Rojo (Ocupado)**: Sesión en curso en la sala.

---

## 3. Guía Operativa para Masajistas / Terapeutas

### 3.1. Cómo Reservar una Sala
1. Ingrese a la vista de **"Reservas (Salas)"**.
2. Seleccione la fecha deseada.
3. Haga clic sobre la celda 🟢 **Verde (Disponible)** de la sala (`Agua`, `Aire`, `Tierra` o `Fuego`) y horario de preferencia.
4. Seleccione el cliente, tratamiento y confirme. La celda cambiará a 🟡 **Amarillo (Reservado)**.

### 3.2. Reglas Obligatorias de Confirmación de Sala
- **Reservas Estándar (con más de 1 hora de anticipación)**:
  - El masajista debe ingresar a la plataforma y presionar el botón **"Confirmar Sala"** a más tardar **1 hora antes del inicio de la cita**.
  - *Ejemplo*: Para una cita de las `16:00`, debe confirmarse antes de las `15:00`.
  - ⚠️ **Liberación Automática**: Si llega la hora límite sin confirmación, el sistema libera la reserva automáticamente para que otro terapeuta o cliente pueda utilizar la sala.
- **Reservas Express / Última Hora (creadas con 1 hora o menos de anticipación)**:
  - Si la reserva se genera faltando menos de una hora para la cita, el masajista dispone de **20 minutos exactos** desde el momento de la reserva para confirmarla.
  - ⚠️ **Liberación Automática**: Si no se confirma en 20 minutos, la sala se libera de inmediato.

---

## 4. Guía Operativa para el Administrador

### 4.1. Liberación Exclusiva de Horarios Confirmados
- Por seguridad y control operativo, **únicamente el usuario con rol de Administrador puede liberar o cancelar un horario que ya se encuentre en estado 🔵 Confirmado**.
- **Pasos para el Administrador**:
  1. Acceda a la matriz de salas o al **Historial de Citas**.
  2. Seleccione la cita confirmada que requiere cancelación o modificación.
  3. Presione el botón **"Liberar Horario Confirmado (Admin)"**.
  4. Ingrese el motivo de la cancelación. La sala retornará automáticamente a 🟢 **Disponible**.

### 4.2. Control de Inventario y Compras de Insumos (Módulo 2)
1. Ingrese a **"Inventario"** en el menú lateral.
2. Monitoree las existencias de aceites, cremas, toallas y esencias por sala temática.
3. Registre compras a proveedores para reabastecer stock.
4. Revise las gráficas de consumo vinculadas a las citas completadas.

---

## 5. Portal Público y Ficha de Clientes

- **Público General**: Consulta catálogo de terapias en las salas Agua, Aire, Tierra y Fuego y solicita turnos.
- **Ficha Cliente**: Expediente con notas de alergias, zonas corporales prioritarias e historial completo de visitas.

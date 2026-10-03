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
- 🔵 **Azul (Confirmado)**: Cita ratificada por el masajista. **Solo el Administrador puede cambiar su horario o cancelarla.**
- 🔴 **Rojo (Ocupado)**: Sesión en curso en la sala.

---

## 3. Guía Operativa para Masajistas / Terapeutas

### 3.1. Cómo Reservar y Gestionar Clientes Individuales
1. Ingrese a la vista de **"Reservas (Salas)"**.
2. Seleccione la fecha deseada en el Navbar o en el selector.
3. Haga clic sobre la celda 🟢 **Verde (Disponible)** de la sala (`Agua`, `Aire`, `Tierra` o `Fuego`) y horario.
4. En el modal de reserva:
   - Su perfil de masajista quedará fijado automáticamente.
   - Seleccione a su cliente individual en el menú desplegable. Si es un cliente nuevo, use el botón **`➕ Nuevo Cliente`** para darlo de alta de inmediato.
   - Ingrese el servicio y notas clínicas. Al enviar, la celda cambiará a 🟡 **Amarillo (Reservado)**.

### 3.2. Reglas Obligatorias de Confirmación de Sala
- **Confirmación Individual**: Cada masajista debe confirmar sus propias reservas antes de atender al cliente.
- **Reservas Estándar (con más de 1 hora de anticipación)**:
  - El masajista debe pulsar el botón **"✓ Confirmar Sala"** a más tardar **1 hora antes del inicio de la cita**.
  - ⚠️ **Liberación Automática**: Si vence el plazo sin confirmación, el sistema libera la sala automáticamente a 🟢 **Disponible**.
- **Reservas Express / Última Hora (creadas con <= 1 hora de anticipación)**:
  - Dispone de **20 minutos exactos** desde el momento de la creación para presionar **"✓ Confirmar Sala"**.

### 3.3. Privacidad y Bloqueo de Citas Confirmadas
- **Privacidad**: En la matriz de reservas, usted **solo verá el nombre de su cliente**. Las reservas de otros masajistas se mostrarán protegidas como `👤 [Cliente Reservado]`.
- **Bloqueo**: Una vez confirmada la cita (🔵 **Azul**), no podrá cambiar el horario ni cancelarla directamente; si el cliente solicita reprogramar o cancelar, debe solicitarlo al **Administrador**.

---

## 4. Guía Operativa para el Administrador

### 4.1. Reprogramación y Cancelación Exclusiva de Citas Confirmadas
- **Solo el Administrador** tiene autorización para modificar citas en estado 🔵 **Confirmado**:
  - **⏰ Cambiar Horario**: Haga clic sobre la cita confirmada y presione el botón para reprogramar la fecha, hora o sala (el sistema verificará que no exista colisión).
  - **🗑️ Cancelar / Liberar (Admin)**: Haga clic en liberar, ingrese la justificación y la sala regresará de inmediato a 🟢 **Disponible**.

### 4.2. Registro y Alta de Nuevos Masajistas
- **Exclusivo Administrador**: Solo el administrador puede crear nuevos terapeutas.
  1. En la vista de **Reservas**, haga clic en el botón superior **`💆 Nuevo Masajista (Admin)`** (o dentro del modal de reserva).
  2. Complete el nombre, correo electrónico de acceso, contraseña inicial y especialidad.
  3. El nuevo masoterapeuta podrá iniciar sesión de inmediato con su cuenta individual.

### 4.3. Control de Insumos y Lista de la Compra (Módulo 2)
1. Ingrese a **"Inventario"** en el menú lateral.
2. **Marcar Insumos Agotados**: En el catálogo general de insumos, presione el botón **`🚨 Marcar Agotado`** sobre cualquier producto que requiera reposición.
3. **Lista de la Compra**: Los productos marcados como agotados se integran automáticamente en el panel superior **"Lista de la Compra"**.
4. **Imprimir / Copiar**: Puede copiar o imprimir la lista con el botón **`🖨️ Imprimir / Copiar Lista`**.
5. **Reposición**: Al comprar o reponer los insumos, presione **`✓ Marcar Repuesto / En Stock`** para devolver el insumo al estado disponible.

### 4.4. Monitor de Desempeño y KPIs de Masajistas (Dashboard)
1. Ingrese a **"Dashboard"** en el menú lateral como Administrador.
2. Visualice la tabla ejecutiva **"Desempeño y KPIs del Equipo de Masajistas"**:
   - Total de citas asignadas a cada terapeuta.
   - Desglose por estados: Completadas (🟢), Confirmadas (🔵), Pendientes (🟡) y Canceladas/Liberadas (🔴).
   - Facturación / Ingresos totales aportados por cada terapeuta.
   - Indicador y barra visual de **Tasa de Efectividad (%)**.

---

## 5. Portal Público y Ficha de Clientes

- **Público General**: Consulta catálogo de terapias en las salas Agua, Aire, Tierra y Fuego y solicita turnos.
- **Ficha y Expediente de Clientes**: 
  - Cada ficha contiene exclusivamente: **Nombre y Apellidos**, **Teléfono** (**Obligatorio**) y **Correo Electrónico** (opcional), además del historial de citas asociadas.
  - Los masajistas visualizan y gestionan únicamente los clientes creados o atendidos por ellos.
  - El Administrador cuenta con visualización y búsqueda global sobre todos los clientes del centro.

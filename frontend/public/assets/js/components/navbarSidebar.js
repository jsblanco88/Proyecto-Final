/**
 * ==============================================================================
 * COMPONENTE REUTILIZABLE: NAVBAR SUPERIOR Y SIDEBAR LATERAL
 * ==============================================================================
 * 
 * Inyecta dinámicamente el Navbar y el Sidebar en cualquier página privada interna.
 * Aplica control de visibilidad según el rol (Administrador vs Masajista),
 * gestiona el selector de fecha del Navbar y el cierre de sesión seguro.
 * 
 * @module components/navbarSidebar
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Verificar autenticación obligatoria en páginas privadas
  if (!authService.estaAutenticado()) {
    window.location.href = '/views/login.html';
    return;
  }

  const usuario = authService.getUsuarioActual();
  const esAdmin = authService.esAdmin();
  const pathActual = window.location.pathname;

  // 2. Renderizar Sidebar Lateral
  const sidebarContainer = document.getElementById('sidebar-container');
  if (sidebarContainer) {
    sidebarContainer.innerHTML = `
      <aside class="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-logo-icon">🌿</span>
          <span class="sidebar-brand">SPA GESTIÓN</span>
        </div>
        
        <ul class="sidebar-menu">
          <li class="sidebar-item">
            <a href="/views/dashboard.html" class="sidebar-link ${pathActual.includes('dashboard.html') ? 'active' : ''}">
              <span class="menu-icon">📊</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li class="sidebar-item">
            <a href="/views/reservas.html" class="sidebar-link ${pathActual.includes('reservas.html') ? 'active' : ''}">
              <span class="menu-icon">📅</span>
              <span>Reservas (Salas)</span>
            </a>
          </li>
          <li class="sidebar-item">
            <a href="/views/historial.html" class="sidebar-link ${pathActual.includes('historial.html') ? 'active' : ''}">
              <span class="menu-icon">📋</span>
              <span>Historial de Citas</span>
            </a>
          </li>
          ${esAdmin ? `
          <li class="sidebar-item">
            <a href="/views/inventario.html" class="sidebar-link ${pathActual.includes('inventario.html') ? 'active' : ''}">
              <span class="menu-icon">📦</span>
              <span>Inventario</span>
            </a>
          </li>
          ` : ''}
          <li class="sidebar-item">
            <a href="/views/ficha-cliente.html" class="sidebar-link ${pathActual.includes('ficha-cliente.html') ? 'active' : ''}">
              <span class="menu-icon">👤</span>
              <span>Ficha Cliente</span>
            </a>
          </li>
        </ul>

        <div class="sidebar-footer">
          <p>Sistema de Gestión v1.0</p>
          <p style="font-size: 0.75rem; margin-top: 0.2rem; opacity: 0.8;">4 Salas • 12 Horarios</p>
        </div>
      </aside>
    `;
  }

  // 3. Renderizar Navbar Superior
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaSeleccionada = sessionStorage.getItem('spa_selected_date') || hoy;

    navbarContainer.innerHTML = `
      <header class="top-navbar">
        <div class="navbar-left">
          <h2 class="navbar-title" id="page-title">Sistema de Gestión</h2>
          <div class="navbar-tools">
            <div class="navbar-date-picker">
              <span>📅</span>
              <input type="date" id="navbar-global-date" value="${fechaSeleccionada}">
            </div>
          </div>
        </div>

        <div class="navbar-right">
          <div class="user-profile">
            <div>
              <div class="user-greeting">Bienvenido, ${usuario.nombre}</div>
              <span class="user-role-badge ${esAdmin ? 'role-admin' : 'role-masoterapeuta'}">
                ${esAdmin ? 'Administrador' : 'Masoterapeuta'}
              </span>
            </div>
          </div>
          <button id="btn-global-logout" class="btn-logout" title="Cerrar sesión">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>
    `;

    // Evento para Logout
    document.getElementById('btn-global-logout').addEventListener('click', () => {
      if (confirm('¿Desea cerrar la sesión actual?')) {
        authService.logout();
      }
    });

    // Evento de cambio de fecha global en Navbar
    const inputFecha = document.getElementById('navbar-global-date');
    if (inputFecha) {
      inputFecha.addEventListener('change', (e) => {
        sessionStorage.setItem('spa_selected_date', e.target.value);
        // Disparar evento personalizado para que vistas como reservas.html recarguen datos
        window.dispatchEvent(new CustomEvent('spa_date_changed', { detail: { fecha: e.target.value } }));
      });
    }
  }
});

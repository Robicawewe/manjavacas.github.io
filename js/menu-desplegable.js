// Menú desplegable
const menuBtn = document.querySelector('.menu-btn');
const menuDropdown = document.querySelector('.menu-dropdown');

if (menuBtn && menuDropdown) {
  menuBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const willOpen = !menuDropdown.classList.contains('active');
    menuDropdown.classList.toggle('active');
    menuBtn.classList.toggle('active');
    if (willOpen) {
      // Fijar ancho mínimo del menú para evitar cambios por hover en enlaces largos
      requestAnimationFrame(() => {
        const rect = menuDropdown.getBoundingClientRect();
        menuDropdown.style.minWidth = Math.ceil(rect.width) + 'px';
      });
    } else {
      // Liberar el ancho fijado al cerrar
      menuDropdown.style.minWidth = '';
    }
  });

  // Cerrar el menú cuando se hace clic fuera
  document.addEventListener('click', (event) => {
    if (!menuDropdown.contains(event.target) && !menuBtn.contains(event.target)) {
      menuDropdown.classList.remove('active');
      menuBtn.classList.remove('active');
      menuDropdown.style.minWidth = '';
    }
  });

  // Cerrar el menú al hacer clic en un enlace
  const menuLinks = document.querySelectorAll('.menu-dropdown a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuDropdown.classList.remove('active');
      menuBtn.classList.remove('active');
      menuDropdown.style.minWidth = '';
    });
  });
}



// Capitular automática eliminada a petición: mantener primera letra normal en todos los párrafos

// ================== MODO OSCURO / CLARO (sin modo auto en UI) ==================
(function themeSetup() {
  const root = document.documentElement; // :root
  let toggle = document.querySelector('.theme-toggle');
  const STORAGE_KEY = 'prefer-theme'; // 'light' | 'dark'

  // 1) Aplicar preferencia guardada o sistema al cargar (si no hay guardada)
  const saved = localStorage.getItem(STORAGE_KEY);
  let initial;
  if (saved === 'light' || saved === 'dark') {
    initial = saved;
  } else {
    initial = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', initial);

  // Crear el botón si no existe para asegurar que esté disponible en todas las páginas
  if (!toggle) {
    if (menuDropdown) {
      toggle = document.createElement('button');
      toggle.className = 'theme-toggle';
      toggle.type = 'button';
      // Estructura: icono + texto
      toggle.innerHTML = '<span class="icon" aria-hidden="true">🌗</span><span class="label">Tema: ' + (initial === 'dark' ? 'Oscuro' : 'Claro') + '</span>';
      // Dentro del menú desplegable, al final de la lista
      menuDropdown.appendChild(toggle);
    }
  }

  // 2) Configurar botón si existe (sin estado "auto")
  if (toggle) {
    updateToggleIconAndLabel();

    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
      updateToggleIconAndLabel();
    });
  }

  function updateToggleIconAndLabel() {
    if (!toggle) return;
    const state = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const icon = state === 'dark' ? '🌙' : '☀️';
    const label = state === 'dark' ? 'Tema: Oscuro' : 'Tema: Claro';
    // Si el botón ya tiene estructura, actualizamos spans; si no, la creamos
    if (toggle.querySelector('.icon') && toggle.querySelector('.label')) {
      toggle.querySelector('.icon').textContent = icon;
      toggle.querySelector('.label').textContent = label;
    } else {
      toggle.innerHTML = '<span class="icon" aria-hidden="true">' + icon + '</span><span class="label">' + label + '</span>';
    }
    toggle.setAttribute('aria-pressed', state === 'dark');
    toggle.title = state === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
  }
})();

// ================== PARALLAX SUAVE HEADER ==================
// (Desactivado por petición: la imagen del header no debe moverse al hacer scroll)
/*
(function headerParallax() {
  const header = document.querySelector('header');
  if (!header) return;
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (Math.abs(y - lastY) < 1) return; // evitar trabajo extra
    lastY = y;
    // Desplazamiento muy sutil (0.2) limitado
    const pos = Math.max(0, Math.min(100, 50 + y * 0.2));
    document.documentElement.style.setProperty('--header-bg-pos', pos + '%');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
*/

// ================== REVELADO POR SCROLL ==================
(function scrollReveal() {
  const toReveal = document.querySelectorAll('.reveal, .blog-item');
  if (!toReveal.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  toReveal.forEach(el => {
    // Estado inicial acorde a CSS
    el.classList.add('reveal');
    obs.observe(el);
  });
})();

// =============== Carga de menú compartido e inicialización adicional ===============
(function loadSharedMenuAndInit() {
  function initAfterInjection() {
    const dd = document.querySelector('.menu-dropdown');
    const btn = document.querySelector('.menu-btn');
    if (!(btn && dd)) return;

    // Re-vincular botón evitando listeners duplicados
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    const menuBtn = newBtn;
    const menuDropdown = dd;

    menuBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = !menuDropdown.classList.contains('active');
      menuDropdown.classList.toggle('active');
      menuBtn.classList.toggle('active');
      if (willOpen) {
        requestAnimationFrame(() => {
          const rect = menuDropdown.getBoundingClientRect();
          menuDropdown.style.minWidth = Math.ceil(rect.width) + 'px';
        });
      } else {
        menuDropdown.style.minWidth = '';
      }
    });

    if (!window.__menuDocListenerBound) {
      document.addEventListener('click', (event) => {
        if (!menuDropdown.contains(event.target) && !menuBtn.contains(event.target)) {
          menuDropdown.classList.remove('active');
          menuBtn.classList.remove('active');
          menuDropdown.style.minWidth = '';
        }
      });
      window.__menuDocListenerBound = true;
    }

    menuDropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuDropdown.classList.remove('active');
        menuBtn.classList.remove('active');
        menuDropdown.style.minWidth = '';
      });
    });

    // Re-vincular botón de tema si existe
    const root = document.documentElement;
    const STORAGE_KEY = 'prefer-theme';
    let toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        root.setAttribute('data-theme', saved);
      } else if (!root.getAttribute('data-theme')) {
        const initial = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
        root.setAttribute('data-theme', initial);
      }
      function updateToggleIconAndLabel() {
        const state = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const icon = state === 'dark' ? '🌙' : '☀️';
        const label = state === 'dark' ? 'Tema: Oscuro' : 'Tema: Claro';
        if (toggle.querySelector('.icon') && toggle.querySelector('.label')) {
          toggle.querySelector('.icon').textContent = icon;
          toggle.querySelector('.label').textContent = label;
        } else {
          toggle.innerHTML = '<span class="icon" aria-hidden="true">' + icon + '</span><span class="label">' + label + '</span>';
        }
        toggle.setAttribute('aria-pressed', state === 'dark');
        toggle.title = state === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
      }
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      toggle = newToggle;
      updateToggleIconAndLabel();
      toggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem(STORAGE_KEY, next);
        updateToggleIconAndLabel();
      });
    }
  }

  async function inject() {
    try {
      const resp = await fetch('partials/menu.html', { cache: 'no-store' });
      if (!resp.ok) return;
      const html = await resp.text();
      const tpl = document.createElement('template');
      tpl.innerHTML = html.trim();
      const newMenu = tpl.content.firstElementChild;
      if (!newMenu) return;
      const existing = document.querySelector('.menu-container');
      if (existing) {
        existing.replaceWith(newMenu);
      } else {
        document.body.insertAdjacentElement('afterbegin', newMenu);
      }
    } catch (e) { /* silencio */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { inject().finally(initAfterInjection); }, { once: true });
  } else {
    inject().finally(initAfterInjection);
  }
})();

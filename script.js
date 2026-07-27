// Cambia este número por el WhatsApp real del negocio (formato: 52 + 10 dígitos, sin espacios ni signos)
// Este es solo el respaldo inicial: si el administrador edita el teléfono en el panel,
// applyContent() lo actualiza automáticamente al cargar la página.
let WHATSAPP_NUMBER = "528718336666";

// ============================================================
// CARGA DE DATOS: primero revisa si el administrador guardó un
// borrador local (localStorage); si no, usa el archivo JSON publicado.
// ============================================================
async function loadData(key, path) {
  const override = localStorage.getItem('medifix_' + key);
  if (override) {
    try { return JSON.parse(override); } catch (e) { /* ignora y sigue al fetch */ }
  }
  const res = await fetch(path);
  if (!res.ok) throw new Error('No se pudo cargar ' + path);
  return res.json();
}

// ============================================================
// CONTENIDO EDITABLE: aplica textos desde data/site-content.json
// (o el borrador del administrador en localStorage) a cualquier
// elemento marcado con data-ck="ruta.al.campo".
// El HTML ya trae el texto real como respaldo, así que si esto
// falla la página se sigue leyendo perfectamente.
// ============================================================
async function applyContent() {
  let content;
  try {
    content = await loadData('content', 'data/site-content.json');
  } catch (e) { return; }

  if (content.global && content.global.whatsappNumber) {
    WHATSAPP_NUMBER = content.global.whatsappNumber;
  }

  document.querySelectorAll('[data-ck]').forEach(el => {
    const path = el.getAttribute('data-ck');
    const value = path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, content);
    if (value === undefined || value === '') return;
    const attr = el.getAttribute('data-ck-attr');
    if (attr) el.setAttribute(attr, value);
    else el.textContent = value;
  });

  // Enlaces de WhatsApp con mensaje precargado (wa.me/NUMERO?text=...):
  // se reconstruyen con el número actualizado, conservando el mensaje.
  document.querySelectorAll('[data-wa-link]').forEach(el => {
    const url = new URL(el.getAttribute('href'), location.href);
    el.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}${url.search}`);
  });
}
applyContent();

// ============================================================
// MENÚ MÓVIL
// ============================================================
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.querySelector('.nav-links');
if (navToggle && navLinksEl) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.classList.toggle('is-active', isOpen);
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('is-open');
      navToggle.classList.remove('is-active');
    });
  });
}

// ============================================================
// REVELADO SUAVE AL HACER SCROLL
// Se marca con JS (nunca con CSS puro) para que si el script falla,
// el contenido siga visible desde el primer momento.
// ============================================================
(function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) return;

  items.forEach(el => el.classList.add('reveal-init'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-init');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));

  // Red de seguridad: si algo queda oculto por más de 4s, se revela solo
  setTimeout(() => {
    document.querySelectorAll('.reveal-init').forEach(el => el.classList.remove('reveal-init'));
  }, 4000);
})();

// ============================================================
// RESALTAR LA PÁGINA ACTUAL EN EL MENÚ
// ============================================================
(function highlightActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });
})();

// ============================================================
// CONTADOR ANIMADO PARA LAS ESTADÍSTICAS (+200, 14, 98%, 30...)
// ============================================================
(function initStatCounters() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const raw = el.textContent.trim();
      const match = raw.match(/^(\d+)(.*)$/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = match[2] || '';
      const duration = 1100;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = raw; // asegura el valor exacto al final (evita redondeos raros)
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat-num').forEach(el => io.observe(el));
})();

// ============================================================
// BARRA DE PROGRESO ("línea vital") AL HACER SCROLL
// ============================================================
const ecgBar = document.getElementById('ecgProgress');
if (ecgBar) {
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    ecgBar.style.width = pct + "%";
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// ============================================================
// FORMULARIO DE COTIZACIÓN (solo existe en index.html)
// ============================================================
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(quoteForm);
    const lines = [
      "Hola Medifix, quiero solicitar una cotización.",
      `Nombre: ${data.get('nombre') || ''}`,
      data.get('clinica') ? `Clínica/institución: ${data.get('clinica')}` : null,
      `Contacto: ${data.get('contacto') || ''}`,
      `Interés: ${data.get('interes') || ''}`,
      data.get('detalle') ? `Detalle: ${data.get('detalle')}` : null
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, '_blank');
  });
}

// ============================================================
// FORMULARIO DE CONTACTO (solo existe en contacto.html)
// ============================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(contactForm);
    const lines = [
      "Hola Medifix, quiero ponerme en contacto.",
      `Nombre: ${data.get('nombre') || ''}`,
      data.get('clinica') ? `Clínica/institución: ${data.get('clinica')}` : null,
      `Contacto: ${data.get('contacto') || ''}`,
      `Motivo: ${data.get('motivo') || ''}`,
      data.get('mensaje') ? `Mensaje: ${data.get('mensaje')}` : null
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, '_blank');
  });
}

// ============================================================
// RENDERIZADO DINÁMICO: TIENDA (tienda.html)
// ============================================================
const productGrid = document.getElementById('productGrid');
const filterRow = document.getElementById('filterRow');
if (productGrid && filterRow) {
  loadData('products', 'data/products.json').then(({ categories, products }) => {
    filterRow.innerHTML = `<button class="filter-chip active" data-filter="todos">Todos</button>` +
      categories.map(c => `<button class="filter-chip" data-filter="${c.id}">${c.label}</button>`).join('');

    productGrid.innerHTML = products.map(p => `
      <article class="product-card" data-category="${p.categories.join(' ')}" data-preview="${p.img}" data-preview-tag="Cotizar" data-href="#">
        <div class="product-img" style="background-image:url('${p.img}')"></div>
        <div class="product-body">
          <span class="product-cat">${p.categories.map(id => (categories.find(c => c.id === id) || {}).label || id).join(' · ')}</span>
          <h3>${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <span class="product-price">${p.price}</span>
          <button class="btn btn-outline-dark btn-small product-cta" data-product="${p.name}">Cotizar</button>
        </div>
      </article>
    `).join('');
  }).catch(err => {
    productGrid.innerHTML = `<p style="grid-column:1/-1; color:#8A968F;">No se pudo cargar el catálogo (${err.message}). Si estás viendo este archivo directamente desde tu computadora (file://), ábrelo desde un servidor local o revisa la versión publicada en línea.</p>`;
  });
}

// ============================================================
// RENDERIZADO DINÁMICO: CURSOS (cursos.html)
// ============================================================
const coursesListFull = document.getElementById('coursesListFull');
const courseFilterRow = document.getElementById('courseFilterRow');
if (coursesListFull && courseFilterRow) {
  loadData('courses', 'data/courses.json').then(({ courses }) => {
    coursesListFull.innerHTML = courses.map(c => `
      <article class="course-row" data-modality="${c.modality}">
        <div class="course-date"><span class="course-day">${c.day}</span><span class="course-month">${c.month}</span></div>
        <div class="course-info">
          <h3>${c.title}</h3>
          <p>${c.info}</p>
        </div>
        <button class="btn btn-small btn-outline-dark course-book" data-course="${c.title} — ${c.day} ${c.month}">Apartar lugar</button>
      </article>
    `).join('');
  }).catch(err => {
    coursesListFull.innerHTML = `<p style="color:#8A968F;">No se pudo cargar el calendario (${err.message}).</p>`;
  });
}

// ============================================================
// DELEGACIÓN DE EVENTOS (funciona con contenido estático Y dinámico)
// ============================================================

// Clic en "Apartar lugar" (cursos) o "Cotizar" (productos) -> WhatsApp
document.addEventListener('click', (e) => {
  const bookBtn = e.target.closest('.course-book');
  if (bookBtn) {
    const course = bookBtn.getAttribute('data-course');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Medifix, quiero apartar mi lugar en: ${course}`)}`, '_blank');
    return;
  }
  const quoteBtn = e.target.closest('.product-cta');
  if (quoteBtn) {
    const product = quoteBtn.getAttribute('data-product');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Medifix, quiero cotizar: ${product}`)}`, '_blank');
    return;
  }
});

// Filtros genéricos: cualquier .filter-row cuyos botones filtran los hijos
// directos de un contenedor hermano (#productGrid o #coursesListFull),
// comparando data-filter contra data-category / data-modality
document.addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  const row = chip.closest('.filter-row');
  const container = row.id === 'filterRow' ? productGrid : coursesListFull;
  if (!container) return;
  const attr = container === productGrid ? 'data-category' : 'data-modality';

  row.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  const filter = chip.getAttribute('data-filter');

  Array.from(container.children).forEach(card => {
    const value = card.getAttribute(attr) || '';
    const show = filter === 'todos' || value.split(' ').includes(filter);
    card.hidden = !show;
  });
});

// Clic en tarjetas con data-href (que no sea sobre un link/botón interno) -> navega
document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-href]');
  if (!card) return;
  if (e.target.closest('a, button')) return;
  const href = card.getAttribute('data-href');
  if (href && href !== '#') window.location.href = href;
});

// ---- Vista previa flotante al pasar el mouse (imagen o video) ----
// Uso: agrega a cualquier elemento los atributos:
//   data-preview="ruta/imagen.jpg"        -> muestra imagen
//   data-preview-video="ruta/clip.mp4"    -> muestra video (tiene prioridad sobre data-preview)
//   data-preview-tag="Ver catálogo"       -> etiqueta pequeña dentro del preview (opcional)
//   data-href="tienda.html"               -> si el clic no fue sobre un link/botón interno, navega aquí
// Funciona por delegación de eventos, así que aplica también a contenido
// agregado dinámicamente (tarjetas de la tienda/cursos cargadas por JS).
(function initHoverPreview() {
  const preview = document.createElement('div');
  preview.className = 'hover-preview';
  preview.innerHTML = `<img alt="" style="display:none">
                        <video muted loop playsinline style="display:none"></video>
                        <span class="hover-preview-tag" style="display:none"></span>`;
  document.body.appendChild(preview);
  const imgEl = preview.querySelector('img');
  const videoEl = preview.querySelector('video');
  const tagEl = preview.querySelector('.hover-preview-tag');
  let activeEl = null;

  document.addEventListener('mousemove', (e) => {
    preview.style.left = e.clientX + 'px';
    preview.style.top = e.clientY + 'px';

    const target = e.target.closest('[data-preview], [data-preview-video]');
    if (target === activeEl) return;
    activeEl = target;

    if (!target) {
      preview.classList.remove('is-visible');
      videoEl.pause();
      return;
    }

    const videoSrc = target.getAttribute('data-preview-video');
    const imgSrc = target.getAttribute('data-preview');
    const tag = target.getAttribute('data-preview-tag');

    if (videoSrc) {
      videoEl.src = videoSrc;
      videoEl.style.display = 'block';
      imgEl.style.display = 'none';
      videoEl.play().catch(() => {});
    } else if (imgSrc) {
      imgEl.src = imgSrc;
      imgEl.style.display = 'block';
      videoEl.style.display = 'none';
    }

    if (tag) { tagEl.textContent = tag; tagEl.style.display = 'block'; }
    else { tagEl.style.display = 'none'; }

    preview.classList.add('is-visible');
  });

  document.addEventListener('mouseleave', () => {
    preview.classList.remove('is-visible');
    videoEl.pause();
    activeEl = null;
  });
})();

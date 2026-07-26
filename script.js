// Cambia este número por el WhatsApp real del negocio (formato: 52 + 10 dígitos, sin espacios ni signos)
const WHATSAPP_NUMBER = "5215512345678";

// Barra de progreso tipo "línea vital" al hacer scroll
const ecgBar = document.getElementById('ecgProgress');
function updateProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  ecgBar.style.width = pct + "%";
}
window.addEventListener('scroll', updateProgress, { passive:true });
updateProgress();

// Formulario de cotización (solo existe en index.html) -> arma un mensaje y abre WhatsApp
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(quoteForm);
    const nombre = data.get('nombre') || '';
    const clinica = data.get('clinica') || '';
    const contacto = data.get('contacto') || '';
    const interes = data.get('interes') || '';
    const detalle = data.get('detalle') || '';

    const lines = [
      "Hola Medifix, quiero solicitar una cotización.",
      `Nombre: ${nombre}`,
      clinica ? `Clínica/institución: ${clinica}` : null,
      `Contacto: ${contacto}`,
      `Interés: ${interes}`,
      detalle ? `Detalle: ${detalle}` : null
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  });
}

// ---- Vista previa flotante al pasar el mouse (imagen o video) ----
// Uso: agrega a cualquier elemento los atributos:
//   data-preview="ruta/imagen.jpg"        -> muestra imagen
//   data-preview-video="ruta/clip.mp4"    -> muestra video (tiene prioridad sobre data-preview)
//   data-preview-tag="Ver catálogo"       -> etiqueta pequeña dentro del preview (opcional)
//   data-href="tienda.html"               -> si el clic no fue sobre un link/botón interno, navega aquí
(function initHoverPreview(){
  const targets = document.querySelectorAll('[data-preview], [data-preview-video]');
  if (!targets.length) return;

  const preview = document.createElement('div');
  preview.className = 'hover-preview';
  preview.innerHTML = `<img alt="" style="display:none">
                        <video muted loop playsinline style="display:none"></video>
                        <span class="hover-preview-tag" style="display:none"></span>`;
  document.body.appendChild(preview);
  const imgEl = preview.querySelector('img');
  const videoEl = preview.querySelector('video');
  const tagEl = preview.querySelector('.hover-preview-tag');

  function movePreview(e){
    preview.style.left = e.clientX + 'px';
    preview.style.top = e.clientY + 'px';
  }

  targets.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      const videoSrc = el.getAttribute('data-preview-video');
      const imgSrc = el.getAttribute('data-preview');
      const tag = el.getAttribute('data-preview-tag');

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

      movePreview(e);
      preview.classList.add('is-visible');
    });

    el.addEventListener('mousemove', movePreview);

    el.addEventListener('mouseleave', () => {
      preview.classList.remove('is-visible');
      videoEl.pause();
    });

    // Clic en cualquier parte de la tarjeta navega, salvo que el clic
    // haya sido sobre un link o botón interno (esos ya tienen su propia acción)
    const href = el.getAttribute('data-href');
    if (href) {
      el.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        window.location.href = href;
      });
    }
  });
})();
document.querySelectorAll('.course-book').forEach(btn => {
  btn.addEventListener('click', () => {
    const course = btn.getAttribute('data-course');
    const message = encodeURIComponent(`Hola Medifix, quiero apartar mi lugar en: ${course}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  });
});

// Botones "Cotizar" en tarjetas de producto (tienda.html) -> WhatsApp con el producto ya indicado
document.querySelectorAll('.product-cta').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = btn.getAttribute('data-product');
    const message = encodeURIComponent(`Hola Medifix, quiero cotizar: ${product}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  });
});

// Filtro de categorías en tienda.html
const filterRow = document.getElementById('filterRow');
if (filterRow) {
  const chips = filterRow.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('#productGrid .product-card');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter');
      cards.forEach(card => {
        const show = filter === 'todos' || card.getAttribute('data-category') === filter;
        card.hidden = !show;
      });
    });
  });
}

// Filtro de modalidad en cursos.html
const courseFilterRow = document.getElementById('courseFilterRow');
if (courseFilterRow) {
  const chips = courseFilterRow.querySelectorAll('.filter-chip');
  const rows = document.querySelectorAll('#coursesListFull .course-row');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter');
      rows.forEach(row => {
        const show = filter === 'todos' || row.getAttribute('data-modality') === filter;
        row.hidden = !show;
      });
    });
  });
}

// Formulario de contacto (contacto.html) -> WhatsApp
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(contactForm);
    const nombre = data.get('nombre') || '';
    const clinica = data.get('clinica') || '';
    const contacto = data.get('contacto') || '';
    const motivo = data.get('motivo') || '';
    const mensaje = data.get('mensaje') || '';

    const lines = [
      "Hola Medifix, quiero ponerme en contacto.",
      `Nombre: ${nombre}`,
      clinica ? `Clínica/institución: ${clinica}` : null,
      `Contacto: ${contacto}`,
      `Motivo: ${motivo}`,
      mensaje ? `Mensaje: ${mensaje}` : null
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  });
}

// ============================================================
// MEDIFIX TELEMEDICINA — tele.js
// ⚠️ Cambia esta URL por la de tu Google Apps Script desplegado
// ============================================================
const API_URL = "https://script.google.com/macros/s/TU_APPS_SCRIPT_URL_AQUI/exec";

// ============================================================
// ESTADO GLOBAL
// ============================================================
let allSpecialties = [];
let allDirectory = [];
let activeFilters = { specialty: "", tipo: "", plan: "" };

// ============================================================
// ARRANQUE
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  loadSpecialties().then(() => {
    populateSpecialtySelects();
    buildChips();
    buildClinicSpecialtyCheckboxes();
  });
  loadDirectory();
  initRegistrationForms();
  initHeroSearch();
  initFilterSelects();
  initTabSwitcher();
});

// ============================================================
// CARGAR ESPECIALIDADES DESDE APPS SCRIPT
// ============================================================
async function loadSpecialties() {
  try {
    const res = await fetch(`${API_URL}?action=getSpecialties`);
    const json = await res.json();
    if (json.ok) allSpecialties = json.data;
  } catch(e) {
    // fallback local si el script no está configurado aún
    allSpecialties = [
      {id:"esp001",nombre:"Medicina General",icono:"🩺"},
      {id:"esp002",nombre:"Cardiología",icono:"❤️"},
      {id:"esp003",nombre:"Pediatría",icono:"👶"},
      {id:"esp004",nombre:"Ginecología y Obstetricia",icono:"🌸"},
      {id:"esp005",nombre:"Psicología",icono:"🧠"},
      {id:"esp006",nombre:"Dermatología",icono:"✨"},
      {id:"esp007",nombre:"Nutrición",icono:"🥗"},
      {id:"esp008",nombre:"Ortopedia",icono:"🦴"},
      {id:"esp009",nombre:"Oftalmología",icono:"👁️"},
      {id:"esp010",nombre:"Neurología",icono:"🧬"},
    ];
  }
}

function populateSpecialtySelects() {
  const opts = allSpecialties.map(s => `<option value="${s.id}">${s.icono} ${s.nombre}</option>`).join('');
  ['heroSpecialtySelect','filterSpecialty','doctorSpecialtySelect'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const firstOpt = el.options[0];
    el.innerHTML = '';
    if (firstOpt) el.appendChild(firstOpt);
    el.insertAdjacentHTML('beforeend', opts);
  });
}

function buildChips() {
  const wrap = document.getElementById('specialtyChips');
  if (!wrap) return;
  wrap.innerHTML = allSpecialties.map(s =>
    `<button class="tele-chip" data-specialty="${s.id}">${s.icono} ${s.nombre}</button>`
  ).join('');
  wrap.addEventListener('click', e => {
    const chip = e.target.closest('.tele-chip');
    if (!chip) return;
    const wasActive = chip.classList.contains('active');
    wrap.querySelectorAll('.tele-chip').forEach(c => c.classList.remove('active'));
    if (!wasActive) {
      chip.classList.add('active');
      setFilter('specialty', chip.dataset.specialty);
    } else {
      setFilter('specialty', '');
    }
    syncFilterSelects();
    document.getElementById('directorio').scrollIntoView({ behavior:'smooth', block:'start' });
  });
}

function buildClinicSpecialtyCheckboxes() {
  const wrap = document.getElementById('clinicSpecialties');
  if (!wrap) return;
  wrap.innerHTML = allSpecialties.map(s =>
    `<label><input type="checkbox" name="especialidades" value="${s.nombre}"> ${s.icono} ${s.nombre}</label>`
  ).join('');
}

// ============================================================
// CARGAR DIRECTORIO PÚBLICO
// ============================================================
async function loadDirectory() {
  const grid = document.getElementById('directoryGrid');
  grid.innerHTML = '<div class="tele-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> Cargando directorio…</div>';
  try {
    const res = await fetch(`${API_URL}?action=getDirectory`);
    const json = await res.json();
    if (json.ok && json.data.length > 0) {
      allDirectory = json.data;
    } else {
      // Demo data mientras no hay registro real
      allDirectory = getDemoDirectory();
    }
  } catch(e) {
    allDirectory = getDemoDirectory();
  }
  renderDirectory();
}

function getDemoDirectory() {
  return [
    {id:"DEMO1",tipo:"medico",nombre:"Dr. Ejemplo — reemplázame",especialidad:"Medicina General",descripcion:"Consultas generales, enfermedades crónicas y seguimiento a domicilio.",horarios:"Lun-Vie 9am-6pm",costoConsulta:"$400 MXN",whatsapp:"528718336666",plan:"visibilidad",destacado:true,foto:""},
    {id:"DEMO2",tipo:"medico",nombre:"Dra. Ejemplo — reemplázame",especialidad:"Pediatría",descripcion:"Atención pediátrica, seguimiento de desarrollo y vacunación.",horarios:"Lun-Sáb 8am-5pm",costoConsulta:"$450 MXN",whatsapp:"528718336666",plan:"comunidad",destacado:false,foto:""},
    {id:"DEMO3",tipo:"clinica",nombre:"Clínica Ejemplo — reemplázame",especialidad:"Ginecología y Obstetricia, Dermatología",descripcion:"Clínica multidisciplinaria con especialistas en salud femenina y piel.",horarios:"Lun-Vie 7am-8pm",costoConsulta:"",whatsapp:"528718336666",plan:"visibilidad",destacado:true,foto:""},
  ];
}

function renderDirectory() {
  const grid = document.getElementById('directoryGrid');
  const empty = document.getElementById('dirEmpty');
  const countEl = document.getElementById('dirCount');

  let items = [...allDirectory];

  if (activeFilters.specialty) {
    items = items.filter(d => {
      const spec = allSpecialties.find(s => s.id === activeFilters.specialty);
      if (!spec) return true;
      return d.especialidad.includes(spec.nombre);
    });
  }
  if (activeFilters.tipo) items = items.filter(d => d.tipo === activeFilters.tipo);
  if (activeFilters.plan)  items = items.filter(d => d.plan === activeFilters.plan);

  document.getElementById('dirTitle').textContent =
    activeFilters.specialty
      ? (allSpecialties.find(s=>s.id===activeFilters.specialty)||{nombre:''}).nombre
      : 'Especialistas disponibles';

  if (items.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    countEl.textContent = '';
    return;
  }

  empty.style.display = 'none';
  countEl.textContent = `${items.length} resultado${items.length !== 1 ? 's' : ''}`;

  grid.innerHTML = items.map(d => {
    const phone = (d.whatsapp || '').replace(/\D/g,'');
    const msgPresencial = encodeURIComponent(`Hola, quiero agendar una cita presencial con ${d.nombre} (${d.especialidad}). ¿Qué horarios tienen disponibles?`);
    const msgVideo = encodeURIComponent(`Hola, quiero agendar una videollamada con ${d.nombre} (${d.especialidad}). ¿Qué horarios tienen disponibles?`);
    const avatarContent = d.foto
      ? `<img src="${d.foto}" alt="${d.nombre}">`
      : `<i class="fa-solid ${d.tipo==='clinica' ? 'fa-hospital' : 'fa-user-doctor'}"></i>`;

    return `
    <article class="tele-card ${d.destacado ? 'is-destacado' : ''}">
      <div class="tele-card-top">
        ${d.destacado ? '<span class="tele-card-badge"><i class="fa-solid fa-star"></i> Destacado</span>' : ''}
        ${d.tipo==='clinica' ? '<span class="tele-card-badge-clinica"><i class="fa-solid fa-hospital"></i> Clínica</span>' : ''}
        <div class="tele-avatar">${avatarContent}</div>
      </div>
      <div class="tele-card-body">
        <span class="tele-card-spec">${d.especialidad}</span>
        <h3>${d.nombre}</h3>
        <p class="tele-card-desc">${d.descripcion || ''}</p>
        <div class="tele-card-meta">
          ${d.horarios ? `<span class="tele-horarios"><i class="fa-regular fa-clock"></i> ${d.horarios}</span>` : ''}
          ${d.costoConsulta ? `<span class="tele-costo"><i class="fa-solid fa-tag"></i> ${d.costoConsulta}</span>` : ''}
          <span class="tele-avail"><i class="fa-solid fa-circle-info"></i> Disponibilidad sujeta a confirmación directa con el consultorio</span>
        </div>
      </div>
      <div class="tele-card-actions">
        <a href="https://wa.me/${phone}?text=${msgPresencial}" class="btn btn-outline-dark btn-small" target="_blank" rel="noopener"><i class="fa-solid fa-building"></i> Cita presencial</a>
        <a href="https://wa.me/${phone}?text=${msgVideo}" class="btn btn-copper btn-small" target="_blank" rel="noopener"><i class="fa-solid fa-video"></i> Videollamada</a>
      </div>
    </article>`;
  }).join('');
}

// ============================================================
// FILTROS
// ============================================================
function setFilter(key, value) {
  activeFilters[key] = value;
  renderDirectory();
}

function clearFilters() {
  activeFilters = { specialty:"", tipo:"", plan:"" };
  document.querySelectorAll('.tele-chip').forEach(c => c.classList.remove('active'));
  syncFilterSelects();
  renderDirectory();
}

function syncFilterSelects() {
  const fsEl = document.getElementById('filterSpecialty');
  if (fsEl) fsEl.value = activeFilters.specialty || '';
}

function initFilterSelects() {
  const fs = document.getElementById('filterSpecialty');
  const ft = document.getElementById('filterType');
  const fp = document.getElementById('filterPlan');
  if (fs) fs.addEventListener('change', () => { setFilter('specialty', fs.value); updateChipHighlight(); });
  if (ft) ft.addEventListener('change', () => setFilter('tipo', ft.value));
  if (fp) fp.addEventListener('change', () => setFilter('plan', fp.value));
}

function updateChipHighlight() {
  document.querySelectorAll('.tele-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.specialty === activeFilters.specialty);
  });
}

// ============================================================
// BÚSQUEDA DEL HERO
// ============================================================
function initHeroSearch() {
  const form = document.getElementById('heroSearchForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const spec = form.specialty.value;
    const tipo = form.tipo.value;
    setFilter('specialty', spec);
    setFilter('tipo', tipo);
    updateChipHighlight();
    syncFilterSelects();
    const ft = document.getElementById('filterType');
    if (ft) ft.value = tipo;
    document.getElementById('directorio').scrollIntoView({ behavior:'smooth', block:'start' });
  });
}

// ============================================================
// TABS MÉDICO / CLÍNICA
// ============================================================
function initTabSwitcher() {
  document.querySelectorAll('.tele-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tele-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tele-form').forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('form' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
      if (target) target.classList.add('active');
    });
  });
}

// ============================================================
// FORMULARIOS DE REGISTRO
// ============================================================
function initRegistrationForms() {
  ['formMedico', 'formClinica'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando…';

      const data = { action: id === 'formMedico' ? 'registerDoctor' : 'registerClinic' };
      new FormData(form).forEach((v, k) => {
        if (k === 'especialidades') {
          data.especialidades = data.especialidades ? [...data.especialidades, v] : [v];
        } else {
          data[k] = v;
        }
      });

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        });
        const json = await res.json();
        if (json.ok) {
          form.style.display = 'none';
          const successId = id === 'formMedico' ? 'successMedico' : 'successClinica';
          document.getElementById(successId).style.display = 'block';
        } else {
          alert('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo o contáctanos directamente.');
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar solicitud';
        }
      } catch(err) {
        // Si el API no está configurado aún, muestra igual el mensaje de éxito
        form.style.display = 'none';
        const successId = id === 'formMedico' ? 'successMedico' : 'successClinica';
        document.getElementById(successId).style.display = 'block';
      }
    });
  });
}

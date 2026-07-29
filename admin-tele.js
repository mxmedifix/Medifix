// ============================================================
// MEDIFIX — admin-tele.js
// ⚠️ Cambia esta URL por la de tu Google Apps Script desplegado
// ⚠️ Cambia esta contraseña por la misma que pusiste en appsscript.gs
// ============================================================
const TELE_API   = "https://script.google.com/macros/s/AKfycbyfrcxf-hs4CDMrInhP-yiGu6rQsCoxyJ8Fo0ZbPOtncsaFs-1NrMdCl38nT91v6KDA/exec";
const TELE_SECRET = "medifix2026";
const LOCAL_PASS_KEY = "medifix2026";

// ============================================================
// ESTADO GLOBAL
// ============================================================
let allData = { doctors:[], clinics:[], reviews:[], specialties:[], activity:[] };
let usersPage = 1;
let usersPerPage = 25;
let usersSortKey = "fechaRegistro";
let usersSortAsc = false;
let editingSpecId = null;
let chartPlans = null;
let chartSpecs = null;

// ============================================================
// LOGIN
// ============================================================
function getAdminPass() {
  return sessionStorage.getItem(LOCAL_PASS_KEY) || "";
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const pass = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  errEl.textContent = '';

  // Verificamos contra el servidor
  try {
    const res = await apiGet({ action: 'adminGetStats', secret: pass });
    if (res.ok) {
      sessionStorage.setItem(LOCAL_PASS_KEY, pass);
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'block';
      initPanel();
    } else {
      errEl.textContent = 'Contraseña incorrecta.';
    }
  } catch {
    // Si no hay API configurada, acepta la contraseña local
    const localPass = localStorage.getItem('medifix_tele_local_pass') || 'medifix2026';
    if (pass === localPass) {
      sessionStorage.setItem(LOCAL_PASS_KEY, pass);
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'block';
      initPanel();
    } else {
      errEl.textContent = 'Contraseña incorrecta. (local: medifix2026)';
    }
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem(LOCAL_PASS_KEY);
  location.reload();
});

// ============================================================
// API HELPERS
// ============================================================
async function apiGet(params) {
  const url = new URL(TELE_API);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  return res.json();
}

async function apiPost(data) {
  const res = await fetch(TELE_API, {
    method:'POST',
    body: JSON.stringify({ ...data, secret: getAdminPass() }),
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}

// ============================================================
// INIT PANEL
// ============================================================
async function initPanel() {
  initNav();
  initBell();
  await loadAllData();
  renderDashboard();
  renderUsers();
  renderSpecialties();
  renderSubscriptions();
  renderReviews();
  renderActivityLog();
  initConfig();
}

async function loadAllData() {
  try {
    const res = await apiGet({ action: 'adminGetAll', secret: getAdminPass() });
    if (res.ok) {
      allData = res.data;
    } else {
      // Demo data si no hay API
      allData = getDemoData();
    }
  } catch {
    allData = getDemoData();
  }
}

function getDemoData() {
  return {
    doctors: [
      { id:'DOC-001', fechaRegistro:'2026-07-20T10:00:00.000Z', tipo:'medico', nombre:'Dr. Juan Pérez López', correo:'juan@ejemplo.com', telefono:'52 8712345678', whatsapp:'528712345678', especialidad:'Cardiología', cedula:'12345678', cedulaEspecialidad:'87654321', rfc:'PELJ800101ABC', domicilio:'Av. Principal 100, Torreón, Coahuila', descripcion:'Cardiólogo con 10 años de experiencia.', horarios:'Lun-Vie 9am-6pm', costoConsulta:'$600 MXN', plan:'visibilidad', estadoPago:'activo', estadoAprobacion:'aprobado', activo:'true', notas:'' },
      { id:'DOC-002', fechaRegistro:'2026-07-25T14:00:00.000Z', tipo:'medico', nombre:'Dra. Ana García Ruiz', correo:'ana@ejemplo.com', telefono:'52 8719876543', whatsapp:'528719876543', especialidad:'Pediatría', cedula:'87654321', cedulaEspecialidad:'', rfc:'GARA850202DEF', domicilio:'Calle Sur 200, Torreón, Coahuila', descripcion:'Pediatra especializada en desarrollo infantil.', horarios:'Lun-Sáb 8am-5pm', costoConsulta:'$450 MXN', plan:'comunidad', estadoPago:'pendiente', estadoAprobacion:'pendiente', activo:'false', notas:'' },
    ],
    clinics: [
      { id:'CLI-001', fechaRegistro:'2026-07-22T09:00:00.000Z', tipo:'clinica', nombre:'Clínica San Rafael', correo:'info@sanrafael.com', telefono:'52 8718001234', whatsapp:'528718001234', especialidades:'Ginecología, Dermatología', rfc:'CSR800101XYZ', domicilio:'Blvd. Las Torres 300, Torreón', descripcion:'Clínica multidisciplinaria con 15 años de trayectoria.', horarios:'Lun-Vie 7am-8pm, Sáb 8am-4pm', plan:'visibilidad', estadoPago:'activo', estadoAprobacion:'aprobado', activo:'true', notas:'' },
    ],
    reviews: [
      { id:'REV-001', fechaRegistro:'2026-07-26T11:00:00.000Z', medicoId:'DOC-001', pacienteNombre:'Paciente anónimo', calificacion:5, texto:'Excelente atención, muy puntual y claro en su diagnóstico.', estado:'pendiente' },
    ],
    specialties: [
      { id:'esp001', nombre:'Medicina General', activa:'TRUE', icono:'🩺' },
      { id:'esp002', nombre:'Cardiología', activa:'TRUE', icono:'❤️' },
      { id:'esp003', nombre:'Pediatría', activa:'TRUE', icono:'👶' },
      { id:'esp004', nombre:'Ginecología y Obstetricia', activa:'TRUE', icono:'🌸' },
      { id:'esp005', nombre:'Psicología', activa:'TRUE', icono:'🧠' },
      { id:'esp006', nombre:'Dermatología', activa:'TRUE', icono:'✨' },
    ],
    activity: [
      { fecha:'2026-07-26T12:00:00.000Z', accion:'Nuevo médico registrado', detalle:'Dr. Juan Pérez López — Cardiología — Plan: visibilidad' },
      { fecha:'2026-07-25T10:00:00.000Z', accion:'Nueva clínica registrada', detalle:'Clínica San Rafael — Plan: visibilidad' },
    ]
  };
}

// ============================================================
// NAVEGACIÓN
// ============================================================
const PAGE_TITLES = { dashboard:'Dashboard', usuarios:'Gestión de usuarios', especialidades:'Especialidades', suscripciones:'Suscripciones', resenas:'Reseñas', configuracion:'Configuración' };

function initNav() {
  document.querySelectorAll('.admin-nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('page-' + btn.dataset.page).classList.add('active');
      document.getElementById('pageTitle').textContent = PAGE_TITLES[btn.dataset.page] || '';
    });
  });
}

// ============================================================
// TOAST
// ============================================================
function toast(msg, type='success') {
  const el = document.createElement('div');
  el.style.cssText = `background:${type==='error'?'#B33A3A':type==='warning'?'#92400E':'var(--teal)'};color:white;padding:12px 18px;border-radius:3px;font-size:0.88rem;box-shadow:0 8px 24px -6px rgba(0,0,0,0.3);max-width:320px;`;
  el.textContent = msg;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  const docs = allData.doctors || [];
  const clis = allData.clinics || [];
  const all = [...docs, ...clis];
  const pending = all.filter(u => u.estadoAprobacion === 'pendiente').length;
  const visCount = all.filter(u => u.plan === 'visibilidad' && u.estadoPago === 'activo').length;
  const comCount = all.filter(u => u.plan === 'comunidad' && u.estadoPago === 'activo').length;
  const revenue = visCount * 200 + comCount * 50;

  document.getElementById('statDoctors').textContent = docs.length;
  document.getElementById('statClinics').textContent = clis.length;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statRevenue').textContent = '$' + revenue.toLocaleString();

  renderCharts(all);
  renderActivity();
  updateBell(pending, (allData.reviews||[]).filter(r=>r.estado==='pendiente').length);
}

function renderCharts(all) {
  const planData = {
    visibilidad: all.filter(u=>u.plan==='visibilidad').length,
    comunidad: all.filter(u=>u.plan==='comunidad').length
  };

  if (chartPlans) chartPlans.destroy();
  const ctx1 = document.getElementById('chartPlans').getContext('2d');
  chartPlans = new Chart(ctx1, {
    type: 'doughnut',
    data: {
      labels: ['Visibilidad ($200)', 'Comunidad ($50)'],
      datasets: [{ data: [planData.visibilidad, planData.comunidad], backgroundColor: ['#C0793A','#0E6E76'], borderWidth:0 }]
    },
    options: { responsive:true, maintainAspectRatio:true, plugins:{ legend:{ position:'bottom', labels:{ font:{family:'IBM Plex Sans', size:12} } } } }
  });

  // Especialidades top 6
  const specCount = {};
  all.forEach(u => {
    const spec = u.especialidad || u.especialidades || '';
    spec.split(',').forEach(s => {
      const t = s.trim();
      if (t) specCount[t] = (specCount[t]||0) + 1;
    });
  });
  const sorted = Object.entries(specCount).sort((a,b)=>b[1]-a[1]).slice(0,6);

  if (chartSpecs) chartSpecs.destroy();
  const ctx2 = document.getElementById('chartSpecs').getContext('2d');
  chartSpecs = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: sorted.map(s=>s[0]),
      datasets: [{ label:'Registros', data:sorted.map(s=>s[1]), backgroundColor:'#0E6E76', borderRadius:2 }]
    },
    options: { responsive:true, maintainAspectRatio:true, indexAxis:'y', plugins:{ legend:{ display:false } }, scales:{ x:{ beginAtZero:true, ticks:{ precision:0 } } } }
  });
}

function renderActivity() {
  const list = document.getElementById('activityList');
  const items = (allData.activity || []).slice(0, 10);
  if (!items.length) { list.innerHTML = '<li class="admin-activity-item"><span style="color:#8A968F;">Sin actividad registrada.</span></li>'; return; }
  list.innerHTML = items.map(a => `
    <li class="admin-activity-item">
      <div class="admin-activity-icon"><i class="fa-solid fa-circle-dot fa-xs"></i></div>
      <div class="admin-activity-text"><strong>${a.accion}</strong><br><span style="color:#5C6B70;">${a.detalle||''}</span></div>
      <span class="admin-activity-time">${formatDate(a.fecha)}</span>
    </li>`).join('');
}

// ============================================================
// CAMPANA DE NOTIFICACIONES
// ============================================================
function initBell() {
  document.getElementById('bellBtn').addEventListener('click', () => {
    document.getElementById('notifDropdown').classList.toggle('is-open');
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#bellBtn') && !e.target.closest('#notifDropdown')) {
      document.getElementById('notifDropdown').classList.remove('is-open');
    }
  });
}

function updateBell(pending, pendingReviews) {
  const total = pending + pendingReviews;
  const badge = document.getElementById('bellBadge');
  badge.style.display = total > 0 ? 'flex' : 'none';
  badge.textContent = total;
  const list = document.getElementById('notifList');
  const items = [];
  if (pending > 0) items.push(`<div class="admin-notif-item"><i class="fa-solid fa-user-clock"></i><span><strong>${pending} registro${pending>1?'s':''}</strong> pendiente${pending>1?'s':''} de aprobación</span></div>`);
  if (pendingReviews > 0) items.push(`<div class="admin-notif-item"><i class="fa-solid fa-star"></i><span><strong>${pendingReviews} reseña${pendingReviews>1?'s':''}</strong> pendiente${pendingReviews>1?'s':''} de moderación</span></div>`);
  list.innerHTML = items.length ? items.join('') : '<div class="admin-notif-empty">Todo al día ✓</div>';
}

// ============================================================
// USUARIOS
// ============================================================
function getAllUsers() {
  return [...(allData.doctors||[]).map(d=>({...d,_sheet:'doctors'})), ...(allData.clinics||[]).map(c=>({...c,_sheet:'clinics'}))];
}

function renderUsers() {
  let users = getAllUsers();
  const search = (document.getElementById('userSearch')||{}).value?.toLowerCase() || '';
  const tipo = (document.getElementById('userFilterTipo')||{}).value || '';
  const plan = (document.getElementById('userFilterPlan')||{}).value || '';
  const status = (document.getElementById('userFilterStatus')||{}).value || '';

  if (search) users = users.filter(u => (u.nombre+u.correo+u.especialidad).toLowerCase().includes(search));
  if (tipo)   users = users.filter(u => u.tipo === tipo);
  if (plan)   users = users.filter(u => u.plan === plan);
  if (status) users = users.filter(u => u.estadoAprobacion === status);

  users.sort((a,b) => {
    const va = a[usersSortKey]||'', vb = b[usersSortKey]||'';
    return usersSortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const total = users.length;
  const pages = Math.max(1, Math.ceil(total / usersPerPage));
  usersPage = Math.min(usersPage, pages);
  const slice = users.slice((usersPage-1)*usersPerPage, usersPage*usersPerPage);

  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = slice.length ? slice.map(u => `
    <tr>
      <td><input type="checkbox" class="user-check" data-id="${u.id}" data-sheet="${u._sheet}"></td>
      <td><span class="badge ${u.tipo==='clinica'?'badge-active':'badge-inactive'}">${u.tipo==='clinica'?'Clínica':'Médico'}</span></td>
      <td style="font-weight:600;">${u.nombre}</td>
      <td>${u.correo}</td>
      <td>${u.especialidad||u.especialidades||'—'}</td>
      <td><span class="badge badge-${u.plan||'comunidad'}">${u.plan==='visibilidad'?'Visibilidad':'Comunidad'}</span></td>
      <td><span class="badge badge-${u.estadoPago==='activo'?'approved':u.estadoPago==='pendiente'?'pending':'rejected'}">${u.estadoPago||'pendiente'}</span></td>
      <td><span class="badge badge-${u.estadoAprobacion==='aprobado'?'approved':u.estadoAprobacion==='rechazado'?'rejected':'pending'}">${u.estadoAprobacion||'pendiente'}</span></td>
      <td>${formatDate(u.fechaRegistro)}</td>
      <td>
        <div class="admin-tbl-actions">
          <button class="btn btn-xs btn-outline-dark" onclick="viewUser('${u.id}','${u._sheet}')"><i class="fa-solid fa-eye"></i></button>
          <button class="btn btn-xs btn-copper" onclick="quickApprove('${u.id}','${u._sheet}','aprobado')" title="Aprobar"><i class="fa-solid fa-check"></i></button>
          <button class="btn btn-xs btn-danger" onclick="quickApprove('${u.id}','${u._sheet}','rechazado')" title="Rechazar"><i class="fa-solid fa-times"></i></button>
        </div>
      </td>
    </tr>`).join('') : '<tr><td colspan="10" style="text-align:center;padding:32px;color:#8A968F;">Sin resultados</td></tr>';

  // Paginación
  const pag = document.getElementById('usersPagination');
  pag.innerHTML = `
    <button class="admin-page-btn" onclick="changePage(${usersPage-1})" ${usersPage<=1?'disabled':''}>‹</button>
    ${Array.from({length:pages},(_,i)=>`<button class="admin-page-btn ${i+1===usersPage?'active':''}" onclick="changePage(${i+1})">${i+1}</button>`).join('')}
    <button class="admin-page-btn" onclick="changePage(${usersPage+1})" ${usersPage>=pages?'disabled':''}>›</button>
    <span class="admin-page-info">${(usersPage-1)*usersPerPage+1}–${Math.min(usersPage*usersPerPage,total)} de ${total}</span>
    <select class="tele-filter-select" onchange="usersPerPage=+this.value;usersPage=1;renderUsers()">
      ${[10,25,50,100].map(n=>`<option ${n===usersPerPage?'selected':''}>${n}</option>`).join('')}
    </select>`;

  // Header sort
  document.querySelectorAll('#usersTable th[data-sort]').forEach(th => {
    th.onclick = () => {
      if (usersSortKey === th.dataset.sort) usersSortAsc = !usersSortAsc;
      else { usersSortKey = th.dataset.sort; usersSortAsc = true; }
      renderUsers();
    };
  });

  // Select all
  document.getElementById('selectAll').onchange = e => {
    document.querySelectorAll('.user-check').forEach(c => c.checked = e.target.checked);
  };
}

function changePage(p) { usersPage = p; renderUsers(); }

// Buscar / filtrar
['userSearch','userFilterTipo','userFilterPlan','userFilterStatus'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => { usersPage=1; renderUsers(); });
});

// Aprobar todos pendientes
document.getElementById('approveAllBtn').addEventListener('click', async () => {
  const pending = getAllUsers().filter(u => u.estadoAprobacion === 'pendiente');
  if (!pending.length) { toast('No hay pendientes.','warning'); return; }
  if (!confirm(`¿Aprobar ${pending.length} registro${pending.length>1?'s':''}?`)) return;
  for (const u of pending) await doUpdate(u.id, u._sheet, { estadoAprobacion:'aprobado', activo:'true' });
  toast(`${pending.length} registros aprobados ✓`);
  renderUsers(); renderDashboard();
});

// Exportar CSV
document.getElementById('exportCSVBtn').addEventListener('click', () => {
  const users = getAllUsers();
  const cols = ['id','tipo','nombre','correo','especialidad','plan','estadoPago','estadoAprobacion','fechaRegistro'];
  const csv = [cols.join(','), ...users.map(u => cols.map(c=>`"${(u[c]||'').toString().replace(/"/g,'""')}"`).join(','))].join('\n');
  download('medifix-usuarios.csv', csv, 'text/csv');
});

// ============================================================
// VER / EDITAR USUARIO (MODAL)
// ============================================================
function viewUser(id, sheet) {
  const u = getAllUsers().find(u=>u.id===id);
  if (!u) return;
  const sensitiveFields = ['cedula','cedulaEspecialidad','rfc','domicilio','telefono','whatsapp','correo'];
  const allFields = Object.keys(u).filter(k=>!k.startsWith('_'));

  document.getElementById('modalTitle').textContent = u.nombre;
  document.getElementById('modalBody').innerHTML = `
    <div class="admin-detail-grid">
      ${allFields.filter(k=>!sensitiveFields.includes(k)).map(k=>`
        <div class="admin-detail-item"><strong>${k}</strong>${u[k]||'—'}</div>
      `).join('')}
    </div>
    <hr style="margin:20px 0;border:none;border-top:1px solid var(--line);">
    <h4 style="margin-bottom:14px;font-size:0.9rem;color:#6B7975;">Datos confidenciales (solo visible para administradores)</h4>
    <div class="admin-detail-grid">
      ${sensitiveFields.map(k=>`<div class="admin-detail-item"><strong>${k}</strong>${u[k]||'—'}</div>`).join('')}
    </div>
    <hr style="margin:20px 0;border:none;border-top:1px solid var(--line);">
    <h4 style="margin-bottom:14px;font-size:0.9rem;">Editar estado</h4>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <label style="font-size:0.85rem;font-weight:600;color:#3A4A50;">Aprobación
        <select id="editAprobacion" style="display:block;margin-top:4px;padding:8px 12px;border:1px solid var(--line);border-radius:2px;font-family:var(--font-body);">
          <option ${u.estadoAprobacion==='pendiente'?'selected':''} value="pendiente">Pendiente</option>
          <option ${u.estadoAprobacion==='aprobado'?'selected':''} value="aprobado">Aprobado</option>
          <option ${u.estadoAprobacion==='rechazado'?'selected':''} value="rechazado">Rechazado</option>
        </select>
      </label>
      <label style="font-size:0.85rem;font-weight:600;color:#3A4A50;">Estado pago
        <select id="editPago" style="display:block;margin-top:4px;padding:8px 12px;border:1px solid var(--line);border-radius:2px;font-family:var(--font-body);">
          <option ${u.estadoPago==='pendiente'?'selected':''} value="pendiente">Pendiente</option>
          <option ${u.estadoPago==='activo'?'selected':''} value="activo">Activo</option>
          <option ${u.estadoPago==='vencido'?'selected':''} value="vencido">Vencido</option>
        </select>
      </label>
      <label style="font-size:0.85rem;font-weight:600;color:#3A4A50;">Plan
        <select id="editPlan" style="display:block;margin-top:4px;padding:8px 12px;border:1px solid var(--line);border-radius:2px;font-family:var(--font-body);">
          <option ${u.plan==='comunidad'?'selected':''} value="comunidad">Comunidad ($50)</option>
          <option ${u.plan==='visibilidad'?'selected':''} value="visibilidad">Visibilidad ($200)</option>
        </select>
      </label>
    </div>
    <label style="display:flex;flex-direction:column;gap:6px;font-size:0.85rem;font-weight:600;color:#3A4A50;margin-top:14px;">Notas internas
      <textarea id="editNotas" rows="2" style="padding:8px 12px;border:1px solid var(--line);border-radius:2px;font-family:var(--font-body);">${u.notas||''}</textarea>
    </label>`;

  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-danger btn-small" onclick="deleteUser('${id}','${sheet}')"><i class="fa-solid fa-trash"></i> Eliminar</button>
    <button class="btn btn-outline-dark btn-small" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-copper btn-small" onclick="saveUser('${id}','${sheet}')"><i class="fa-solid fa-floppy-disk"></i> Guardar cambios</button>`;

  openModal();
}

async function saveUser(id, sheet) {
  const updates = {
    estadoAprobacion: document.getElementById('editAprobacion').value,
    estadoPago:       document.getElementById('editPago').value,
    plan:             document.getElementById('editPlan').value,
    notas:            document.getElementById('editNotas').value,
    activo:           document.getElementById('editAprobacion').value === 'aprobado' ? 'true' : 'false'
  };
  await doUpdate(id, sheet, updates);
  closeModal();
  toast('Cambios guardados ✓');
  renderUsers(); renderDashboard();
}

async function quickApprove(id, sheet, status) {
  await doUpdate(id, sheet, { estadoAprobacion: status, activo: status==='aprobado'?'true':'false' });
  toast(status==='aprobado'?'Registro aprobado ✓':'Registro rechazado', status==='rechazado'?'warning':'success');
  renderUsers(); renderDashboard();
}

async function deleteUser(id, sheet) {
  if (!confirm('¿Eliminar este registro permanentemente?')) return;
  try {
    await apiPost({ action: sheet==='doctors'?'adminDeleteDoctor':'adminDeleteClinic', id });
    // también en local
    if (sheet==='doctors') allData.doctors = allData.doctors.filter(d=>d.id!==id);
    else allData.clinics = allData.clinics.filter(c=>c.id!==id);
    closeModal(); toast('Registro eliminado'); renderUsers(); renderDashboard();
  } catch { toast('Error al eliminar','error'); }
}

async function doUpdate(id, sheet, updates) {
  // Actualiza en memoria
  const arr = sheet==='doctors' ? allData.doctors : allData.clinics;
  const idx = arr.findIndex(u=>u.id===id);
  if (idx>=0) Object.assign(arr[idx], updates);
  // Envía al servidor
  try {
    await apiPost({ action: sheet==='doctors'?'adminUpdateDoctor':'adminUpdateClinic', id, updates });
  } catch { /* offline mode */ }
}

// ============================================================
// ESPECIALIDADES
// ============================================================
function renderSpecialties() {
  const tbody = document.getElementById('specsTableBody');
  const all = getAllUsers();
  const specs = allData.specialties || [];

  tbody.innerHTML = specs.map(s => {
    const count = all.filter(u => (u.especialidad||u.especialidades||'').includes(s.nombre)).length;
    return `
    <tr>
      <td style="font-size:1.4rem;">${s.icono||'🏥'}</td>
      <td style="font-weight:600;">${s.nombre}</td>
      <td><span class="badge ${String(s.activa).toUpperCase()==='TRUE'?'badge-active':'badge-inactive'}">${String(s.activa).toUpperCase()==='TRUE'?'Activa':'Inactiva'}</span></td>
      <td>${count}</td>
      <td>
        <div class="admin-tbl-actions">
          <button class="btn btn-xs btn-outline-dark" onclick="editSpec('${s.id}','${s.nombre}','${s.icono||''}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-xs btn-danger" onclick="deleteSpec('${s.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="5" style="text-align:center;padding:32px;color:#8A968F;">Sin especialidades</td></tr>';
}

document.getElementById('saveSpecBtn').addEventListener('click', async () => {
  const name = document.getElementById('specName').value.trim();
  const icon = document.getElementById('specIcon').value.trim();
  if (!name) { toast('El nombre es obligatorio','warning'); return; }

  if (editingSpecId) {
    const spec = allData.specialties.find(s=>s.id===editingSpecId);
    if (spec) { spec.nombre=name; spec.icono=icon; }
    try { await apiPost({ action:'adminUpdateSpecialty', id:editingSpecId, updates:{nombre:name,icono:icon} }); } catch {}
    toast('Especialidad actualizada ✓');
  } else {
    const newSpec = { id:'esp'+Date.now(), nombre:name, activa:'TRUE', icono:icon||'🏥' };
    allData.specialties.push(newSpec);
    try { await apiPost({ action:'adminAddSpecialty', nombre:name, icono:icon||'🏥' }); } catch {}
    toast('Especialidad agregada ✓');
  }
  cancelSpecEdit();
  renderSpecialties();
});

function editSpec(id, nombre, icono) {
  editingSpecId = id;
  document.getElementById('specName').value = nombre;
  document.getElementById('specIcon').value = icono;
  document.getElementById('specFormTitle').textContent = 'Editar especialidad';
}

function cancelSpecEdit() {
  editingSpecId = null;
  document.getElementById('specName').value = '';
  document.getElementById('specIcon').value = '';
  document.getElementById('specFormTitle').textContent = 'Agregar especialidad';
}

document.getElementById('cancelSpecBtn').addEventListener('click', cancelSpecEdit);

async function deleteSpec(id) {
  if (!confirm('¿Eliminar esta especialidad?')) return;
  allData.specialties = allData.specialties.filter(s=>s.id!==id);
  try { await apiPost({ action:'adminDeleteSpecialty', id }); } catch {}
  renderSpecialties();
  toast('Especialidad eliminada');
}

// ============================================================
// SUSCRIPCIONES
// ============================================================
function renderSubscriptions() {
  const all = getAllUsers();
  const vis = all.filter(u=>u.plan==='visibilidad');
  const com = all.filter(u=>u.plan==='comunidad');
  const visAct = vis.filter(u=>u.estadoPago==='activo').length;
  const comAct = com.filter(u=>u.estadoPago==='activo').length;
  const total = visAct*200 + comAct*50;

  document.getElementById('subVis').textContent = vis.length;
  document.getElementById('subVisRev').textContent = `${visAct} activos = $${visAct*200}/mes`;
  document.getElementById('subCom').textContent = com.length;
  document.getElementById('subComRev').textContent = `${comAct} activos = $${comAct*50}/mes`;
  document.getElementById('subTotal').textContent = '$'+total.toLocaleString();

  const tbody = document.getElementById('subsTableBody');
  tbody.innerHTML = all.map(u => `
    <tr>
      <td style="font-weight:600;">${u.nombre}</td>
      <td>${u.tipo==='clinica'?'Clínica':'Médico'}</td>
      <td><span class="badge badge-${u.plan||'comunidad'}">${u.plan==='visibilidad'?'Visibilidad $200':'Comunidad $50'}</span></td>
      <td><span class="badge badge-${u.estadoPago==='activo'?'approved':u.estadoPago==='pendiente'?'pending':'rejected'}">${u.estadoPago||'pendiente'}</span></td>
      <td>${u.notas||'—'}</td>
      <td>
        <div class="admin-tbl-actions">
          <button class="btn btn-xs btn-copper" onclick="setSubStatus('${u.id}','${u._sheet}','activo')" title="Marcar activo"><i class="fa-solid fa-circle-check"></i></button>
          <button class="btn btn-xs btn-outline-dark" onclick="setSubStatus('${u.id}','${u._sheet}','pendiente')" title="Marcar pendiente"><i class="fa-solid fa-clock"></i></button>
          <button class="btn btn-xs btn-danger" onclick="setSubStatus('${u.id}','${u._sheet}','vencido')" title="Marcar vencido"><i class="fa-solid fa-ban"></i></button>
          <button class="btn btn-xs btn-outline-dark" onclick="togglePlan('${u.id}','${u._sheet}','${u.plan}')" title="Cambiar plan"><i class="fa-solid fa-arrows-rotate"></i></button>
        </div>
      </td>
    </tr>`).join('') || '<tr><td colspan="6" style="text-align:center;padding:32px;color:#8A968F;">Sin registros</td></tr>';
}

async function setSubStatus(id, sheet, status) {
  await doUpdate(id, sheet, { estadoPago: status });
  renderSubscriptions(); renderDashboard();
  toast('Estado actualizado ✓');
}

async function togglePlan(id, sheet, currentPlan) {
  const newPlan = currentPlan==='visibilidad' ? 'comunidad' : 'visibilidad';
  if (!confirm(`¿Cambiar a plan ${newPlan}?`)) return;
  await doUpdate(id, sheet, { plan: newPlan });
  renderSubscriptions(); renderDashboard();
  toast(`Plan cambiado a ${newPlan} ✓`);
}

// ============================================================
// RESEÑAS
// ============================================================
function renderReviews() {
  const tbody = document.getElementById('reviewsTableBody');
  const reviews = allData.reviews || [];
  const all = getAllUsers();

  tbody.innerHTML = reviews.map(r => {
    const user = all.find(u=>u.id===r.medicoId);
    const stars = '★'.repeat(+r.calificacion||0) + '☆'.repeat(5-(+r.calificacion||0));
    return `
    <tr>
      <td>${r.pacienteNombre||'Anónimo'}</td>
      <td>${user?.nombre||r.medicoId||'—'}</td>
      <td style="color:var(--copper);">${stars} ${r.calificacion||'—'}</td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.texto||'—'}</td>
      <td><span class="badge badge-${r.estado==='aprobada'?'approved':r.estado==='rechazada'?'rejected':'pending'}">${r.estado||'pendiente'}</span></td>
      <td>${formatDate(r.fechaRegistro)}</td>
      <td>
        <div class="admin-tbl-actions">
          <button class="btn btn-xs btn-copper" onclick="updateReview('${r.id}','aprobada')"><i class="fa-solid fa-check"></i></button>
          <button class="btn btn-xs btn-danger" onclick="updateReview('${r.id}','rechazada')"><i class="fa-solid fa-times"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="7" style="text-align:center;padding:32px;color:#8A968F;">Sin reseñas todavía</td></tr>';
}

async function updateReview(id, status) {
  const r = allData.reviews.find(r=>r.id===id);
  if (r) r.estado = status;
  try { await apiPost({ action:'adminUpdateReview', id, updates:{ estado:status } }); } catch {}
  renderReviews(); updateBell(0, (allData.reviews||[]).filter(r=>r.estado==='pendiente').length);
  toast(status==='aprobada'?'Reseña aprobada ✓':'Reseña rechazada', status==='rechazada'?'warning':'success');
}

// ============================================================
// CONFIGURACIÓN
// ============================================================
function initConfig() {
  const prices = JSON.parse(localStorage.getItem('medifix_tele_prices')||'{"comunidad":50,"visibilidad":200}');
  document.getElementById('priceCom').value = prices.comunidad;
  document.getElementById('priceVis').value = prices.visibilidad;

  document.getElementById('savePricesBtn').addEventListener('click', () => {
    const p = { comunidad: +document.getElementById('priceCom').value, visibilidad: +document.getElementById('priceVis').value };
    localStorage.setItem('medifix_tele_prices', JSON.stringify(p));
    document.getElementById('priceStatus').textContent = 'Precios guardados ✓';
    toast('Precios actualizados ✓');
  });

  document.getElementById('changePassBtn').addEventListener('click', () => {
    const np = document.getElementById('newPassInput').value;
    const cp = document.getElementById('confirmPassInput').value;
    if (!np) { toast('Ingresa la nueva contraseña','warning'); return; }
    if (np !== cp) { toast('Las contraseñas no coinciden','error'); return; }
    localStorage.setItem('medifix_tele_local_pass', np);
    document.getElementById('passStatus').textContent = 'Contraseña actualizada ✓ (recuerda cambiarla también en appsscript.gs)';
    toast('Contraseña local actualizada ✓');
  });

  document.getElementById('backupBtn').addEventListener('click', () => {
    download('medifix-backup-'+(new Date().toISOString().slice(0,10))+'.json', JSON.stringify(allData, null, 2), 'application/json');
    toast('Respaldo descargado ✓');
  });
}

function renderActivityLog() {
  const list = document.getElementById('configActivityList');
  const items = (allData.activity || []).slice(0, 20);
  list.innerHTML = items.map(a => `
    <li class="admin-activity-item" style="padding:10px 14px;">
      <div class="admin-activity-icon" style="width:24px;height:24px;"><i class="fa-solid fa-circle-dot fa-xs"></i></div>
      <div class="admin-activity-text"><strong>${a.accion}</strong><br><span style="font-size:0.8rem;color:#5C6B70;">${a.detalle||''}</span></div>
      <span class="admin-activity-time">${formatDate(a.fecha)}</span>
    </li>`).join('') || '<li style="padding:16px;color:#8A968F;font-size:0.85rem;text-align:center;">Sin actividad</li>';
}

// ============================================================
// MODAL
// ============================================================
function openModal() { document.getElementById('modalOverlay').style.display='flex'; }
function closeModal() { document.getElementById('modalOverlay').style.display='none'; }
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => { if(e.target===document.getElementById('modalOverlay')) closeModal(); });

// ============================================================
// UTILIDADES
// ============================================================
function formatDate(str) {
  if (!str) return '—';
  try { return new Date(str).toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric'}); }
  catch { return str; }
}

function download(filename, text, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text],{type:mime}));
  a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

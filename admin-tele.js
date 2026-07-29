<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Telemedicina — Medifix</title>
<meta name="robots" content="noindex,nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,500&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'IBM Plex Sans',sans-serif;background:#f0f2f5;min-height:100vh;color:#142B33;}
a{text-decoration:none;color:inherit;}
:root{--navy:#0B3049;--teal:#0E6E76;--teal-l:#3FA796;--copper:#C0793A;--line:#DADCD3;--bg:#F5F6F3;--white:#FCFDFB;}

/* LOGIN */
#loginWrap{display:flex;align-items:center;justify-content:center;min-height:100vh;}
.login-box{background:#fff;border:1px solid var(--line);padding:44px 36px;width:380px;text-align:center;}
.login-box .brand{font-family:'Newsreader',serif;font-size:1.6rem;color:var(--navy);margin-bottom:6px;display:block;}
.login-box h2{font-family:'Newsreader',serif;font-size:1.3rem;margin-bottom:6px;}
.login-box p{font-size:.88rem;color:#5C6B70;margin-bottom:22px;}
.login-box input{width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:2px;margin-bottom:12px;font-family:inherit;font-size:.95rem;}
.login-box input:focus{outline:2px solid var(--teal);}
.login-err{color:#B33A3A;font-size:.82rem;margin-top:8px;min-height:18px;}

/* SIDEBAR */
#sidebar{position:fixed;left:0;top:0;bottom:0;width:230px;background:var(--navy);color:rgba(255,255,255,.85);display:flex;flex-direction:column;z-index:100;overflow-y:auto;}
.sb-brand{padding:24px 22px 18px;border-bottom:1px solid rgba(255,255,255,.1);}
.sb-brand span{font-family:'Newsreader',serif;font-size:1.4rem;color:#fff;}
.sb-brand small{display:block;font-size:.72rem;color:rgba(255,255,255,.45);margin-top:2px;}
.sb-nav{padding:14px 0;flex:1;}
.sb-btn{display:flex;align-items:center;gap:11px;padding:12px 22px;cursor:pointer;font-size:.88rem;color:rgba(255,255,255,.7);transition:all .2s;border:none;background:transparent;width:100%;text-align:left;font-family:inherit;}
.sb-btn:hover{background:rgba(255,255,255,.06);color:#fff;}
.sb-btn.active{background:rgba(63,167,150,.18);color:#fff;border-right:3px solid var(--teal-l);}
.sb-btn i{width:18px;text-align:center;}
.sb-sep{height:1px;background:rgba(255,255,255,.08);margin:6px 22px;}
.sb-foot{padding:16px 22px;border-top:1px solid rgba(255,255,255,.1);}

/* TOPBAR */
#topbar{position:fixed;left:230px;right:0;top:0;height:58px;background:#fff;border-bottom:1px solid var(--line);z-index:99;display:flex;align-items:center;justify-content:space-between;padding:0 26px;}
#topbar-title{font-weight:700;font-size:1rem;color:var(--navy);}
.bell-wrap{position:relative;cursor:pointer;}
.bell-badge{position:absolute;top:-4px;right:-4px;background:var(--copper);color:#fff;font-size:.62rem;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;}

/* MAIN */
#main{margin-left:230px;padding-top:58px;}
.page{display:none;padding:28px 26px;}
.page.active{display:block;}

/* STAT CARDS */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:26px;}
.stat{background:#fff;border:1px solid var(--line);padding:20px;}
.stat-label{font-family:'IBM Plex Mono',monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:#6B7975;}
.stat-num{font-family:'Newsreader',serif;font-size:2rem;color:var(--navy);line-height:1.1;margin:4px 0 2px;}
.stat-sub{font-size:.78rem;color:#8A968F;}
.stat.warn .stat-num{color:#C0793A;}
.stat.teal .stat-num{color:var(--teal);}

/* CHARTS */
.charts{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:24px;}
.chart-card{background:#fff;border:1px solid var(--line);padding:20px;}
.chart-card h4{font-size:.88rem;color:var(--navy);margin-bottom:14px;}

/* CARD */
.card{background:#fff;border:1px solid var(--line);margin-bottom:20px;}
.card-head{padding:16px 20px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}
.card-head h3{font-size:.95rem;color:var(--navy);}
.card-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
.card-scroll{overflow-x:auto;}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px 20px;border-radius:2px;font-weight:600;font-size:.88rem;border:1px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;}
.btn-copper{background:var(--copper);color:#fff;border-color:var(--copper);}
.btn-copper:hover{background:#A6632B;}
.btn-outline{background:transparent;color:var(--navy);border-color:var(--navy);}
.btn-outline:hover{background:var(--navy);color:#fff;}
.btn-danger{background:transparent;color:#B33A3A;border-color:#B33A3A;}
.btn-danger:hover{background:#B33A3A;color:#fff;}
.btn-sm{padding:6px 12px;font-size:.76rem;}
.btn-full{width:100%;}
.btn-green{background:#065F46;color:#fff;border-color:#065F46;}
.btn-green:hover{background:#047857;}
input.search{padding:8px 12px;border:1px solid var(--line);border-radius:2px;font-family:inherit;font-size:.85rem;background:var(--bg);min-width:180px;}
input.search:focus{outline:2px solid var(--teal);}
select.fsel{padding:8px 10px;border:1px solid var(--line);border-radius:2px;font-family:inherit;font-size:.83rem;background:#fff;}

/* TABLE */
table{width:100%;border-collapse:collapse;font-size:.83rem;}
th{padding:10px 14px;border-bottom:2px solid var(--line);text-align:left;font-family:'IBM Plex Mono',monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.04em;color:#6B7975;background:var(--bg);white-space:nowrap;cursor:pointer;}
td{padding:10px 14px;border-bottom:1px solid var(--line);vertical-align:middle;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:rgba(14,110,118,.02);}
.actions{display:flex;gap:5px;flex-wrap:wrap;}

/* BADGES */
.badge{display:inline-block;padding:3px 9px;border-radius:2px;font-size:.7rem;font-weight:600;font-family:'IBM Plex Mono',monospace;white-space:nowrap;}
.b-pending{background:#FEF3C7;color:#92400E;}
.b-ok{background:#D1FAE5;color:#065F46;}
.b-no{background:#FEE2E2;color:#991B1B;}
.b-teal{background:rgba(14,110,118,.12);color:var(--teal);}
.b-gray{background:var(--bg);color:#6B7975;}
.b-copper{background:rgba(192,121,58,.12);color:#A6632B;}

/* PAGINATION */
.pagination{display:flex;align-items:center;gap:6px;padding:12px 20px;border-top:1px solid var(--line);flex-wrap:wrap;}
.pag-btn{padding:5px 11px;border:1px solid var(--line);background:#fff;font-size:.8rem;cursor:pointer;border-radius:2px;font-family:inherit;}
.pag-btn:hover,.pag-btn.active{background:var(--navy);color:#fff;border-color:var(--navy);}
.pag-info{font-size:.8rem;color:#8A968F;margin-left:auto;}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:#fff;max-width:680px;width:100%;max-height:90vh;overflow-y:auto;border-radius:3px;box-shadow:0 32px 64px -20px rgba(0,0,0,.4);}
.modal-head{padding:18px 22px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;}
.modal-head h3{font-size:1.05rem;}
.modal-close{background:none;border:none;font-size:1.4rem;cursor:pointer;color:#6B7975;line-height:1;}
.modal-body{padding:22px;}
.modal-foot{padding:14px 22px;border-top:1px solid var(--line);display:flex;gap:8px;justify-content:flex-end;}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.detail-item{font-size:.86rem;}
.detail-item strong{display:block;font-family:'IBM Plex Mono',monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.04em;color:#6B7975;margin-bottom:2px;}
.edit-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:14px;}
.edit-row label{display:flex;flex-direction:column;gap:5px;font-size:.82rem;font-weight:600;color:#3A4A50;flex:1;min-width:140px;}
.edit-row select,.edit-row textarea,.edit-row input{font-family:inherit;font-size:.88rem;padding:9px 10px;border:1px solid var(--line);border-radius:2px;background:var(--bg);}

/* FORM */
.form-card{background:#fff;border:1px solid var(--line);padding:22px;}
.form-card h3{font-size:.95rem;margin-bottom:14px;color:var(--navy);}
.form-group{display:flex;flex-direction:column;gap:5px;font-size:.82rem;font-weight:600;color:#3A4A50;margin-bottom:12px;}
.form-group input,.form-group select,.form-group textarea{font-family:inherit;font-size:.88rem;padding:9px 10px;border:1px solid var(--line);border-radius:2px;background:var(--bg);}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:2px solid var(--teal);}

/* ACTIVITY */
.activity-list{list-style:none;}
.activity-item{display:flex;gap:12px;padding:11px 20px;border-bottom:1px solid var(--line);font-size:.83rem;}
.activity-item:last-child{border-bottom:none;}
.act-dot{width:28px;height:28px;border-radius:50%;background:rgba(14,110,118,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--teal);font-size:.7rem;}
.act-text{flex:1;}
.act-time{color:#8A968F;font-family:'IBM Plex Mono',monospace;font-size:.7rem;align-self:center;white-space:nowrap;}

/* TOAST */
#toasts{position:fixed;bottom:22px;right:22px;z-index:300;display:flex;flex-direction:column;gap:8px;}
.toast{background:var(--teal);color:#fff;padding:12px 18px;border-radius:3px;font-size:.85rem;box-shadow:0 8px 24px -6px rgba(0,0,0,.3);max-width:300px;}
.toast.err{background:#B33A3A;}
.toast.warn{background:#92400E;}

/* RESPONSIVE */
@media(max-width:768px){
  #sidebar{display:none;}
  #topbar,#main{left:0;margin-left:0;}
  .stats{grid-template-columns:1fr 1fr;}
  .charts{grid-template-columns:1fr;}
  .detail-grid{grid-template-columns:1fr;}
}
</style>
</head>
<body>

<!-- LOGIN -->
<div id="loginWrap">
  <div class="login-box">
    <span class="brand">Medifix<span style="color:#C0793A;">.</span></span>
    <h2>Panel Telemedicina</h2>
    <p>Acceso exclusivo para administradores</p>
    <form id="loginForm">
      <input type="password" id="loginPass" placeholder="Contraseña" autocomplete="current-password" required>
      <button type="submit" class="btn btn-copper btn-full">Entrar</button>
    </form>
    <p class="login-err" id="loginErr"></p>
  </div>
</div>

<!-- PANEL -->
<div id="panel" style="display:none;">
  <aside id="sidebar">
    <div class="sb-brand">
      <span>Medifix<span style="color:#C0793A;">.</span></span>
      <small>Panel Telemedicina</small>
    </div>
    <nav class="sb-nav">
      <button class="sb-btn active" data-page="dash">📊 Dashboard</button>
      <button class="sb-btn" data-page="users">👥 Usuarios</button>
      <button class="sb-btn" data-page="specs">🩺 Especialidades</button>
      <button class="sb-btn" data-page="subs">💳 Suscripciones</button>
      <div class="sb-sep"></div>
      <button class="sb-btn" data-page="config">⚙️ Configuración</button>
    </nav>
    <div class="sb-foot">
      <button class="sb-btn" id="logoutBtn" style="padding:8px 0;">🚪 Cerrar sesión</button>
    </div>
  </aside>

  <div id="topbar">
    <span id="topbar-title">Dashboard</span>
    <div style="display:flex;align-items:center;gap:14px;">
      <div class="bell-wrap" id="bellBtn" title="Pendientes">
        🔔 <span class="bell-badge" id="bellN" style="display:none;">0</span>
      </div>
      <span style="font-size:.83rem;color:#5C6B70;">Admin Medifix</span>
    </div>
  </div>

  <main id="main">
    <!-- DASHBOARD -->
    <div class="page active" id="page-dash">
      <div class="stats">
        <div class="stat"><span class="stat-label">Médicos</span><span class="stat-num" id="sMed">0</span></div>
        <div class="stat"><span class="stat-label">Clínicas</span><span class="stat-num" id="sCli">0</span></div>
        <div class="stat warn"><span class="stat-label">Pendientes aprobación</span><span class="stat-num" id="sPend">0</span></div>
        <div class="stat teal"><span class="stat-label">Ingresos est./mes</span><span class="stat-num" id="sRev">$0</span></div>
      </div>
      <div class="charts">
        <div class="chart-card"><h4>Distribución por plan</h4><canvas id="cPlans" style="max-height:210px;"></canvas></div>
        <div class="chart-card"><h4>Top especialidades</h4><canvas id="cSpecs" style="max-height:210px;"></canvas></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>📋 Últimas actividades</h3></div>
        <ul class="activity-list" id="actList"><li class="activity-item"><span style="color:#8A968F;">Sin actividad registrada.</span></li></ul>
      </div>
    </div>

    <!-- USUARIOS -->
    <div class="page" id="page-users">
      <div class="card">
        <div class="card-head">
          <h3>Médicos y clínicas registradas</h3>
          <div class="card-tools">
            <input type="text" class="search" id="uSearch" placeholder="Buscar nombre, correo…">
            <select class="fsel" id="uFTipo"><option value="">Todos</option><option value="medico">Médicos</option><option value="clinica">Clínicas</option></select>
            <select class="fsel" id="uFPlan"><option value="">Todos los planes</option><option value="visibilidad">Visibilidad</option><option value="comunidad">Comunidad</option></select>
            <select class="fsel" id="uFStatus"><option value="">Todos los estados</option><option value="pendiente">Pendiente</option><option value="aprobado">Aprobado</option><option value="rechazado">Rechazado</option></select>
            <button class="btn btn-sm btn-outline" onclick="exportCSV()">⬇ CSV</button>
            <button class="btn btn-sm btn-green" onclick="approveAll()">✓ Aprobar pendientes</button>
          </div>
        </div>
        <div class="card-scroll">
          <table>
            <thead><tr>
              <th>Tipo</th><th onclick="sortBy('nombre')">Nombre ↕</th><th>Correo</th>
              <th>Especialidad</th><th>Plan</th><th>Pago</th><th>Aprobación</th>
              <th onclick="sortBy('fechaRegistro')">Fecha ↕</th><th>Acciones</th>
            </tr></thead>
            <tbody id="uBody"></tbody>
          </table>
        </div>
        <div class="pagination" id="uPag"></div>
      </div>
    </div>

    <!-- ESPECIALIDADES -->
    <div class="page" id="page-specs">
      <div style="display:grid;grid-template-columns:300px 1fr;gap:20px;align-items:start;">
        <div class="form-card">
          <h3 id="specFTitle">➕ Agregar especialidad</h3>
          <div class="form-group">Nombre<input type="text" id="specName" placeholder="Ej. Cardiología"></div>
          <div class="form-group">Ícono (emoji)<input type="text" id="specIcon" placeholder="Ej. ❤️"></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-copper" onclick="saveSpec()">Guardar</button>
            <button class="btn btn-outline btn-sm" onclick="cancelSpec()">Cancelar</button>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>Especialidades activas</h3></div>
          <div class="card-scroll">
            <table><thead><tr><th>Ícono</th><th>Nombre</th><th>Médicos</th><th>Acciones</th></tr></thead>
            <tbody id="specBody"></tbody></table>
          </div>
        </div>
      </div>
    </div>

    <!-- SUSCRIPCIONES -->
    <div class="page" id="page-subs">
      <div class="stats" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px;">
        <div class="stat stat-copper"><span class="stat-label">Plan Visibilidad ($200/mes)</span><span class="stat-num" id="sVis">0</span><span class="stat-sub" id="sVisR">activos</span></div>
        <div class="stat"><span class="stat-label">Plan Comunidad ($50/mes)</span><span class="stat-num" id="sCom">0</span><span class="stat-sub" id="sComR">activos</span></div>
        <div class="stat teal"><span class="stat-label">Total estimado/mes</span><span class="stat-num" id="sTot">$0</span></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Gestión de suscripciones</h3></div>
        <div class="card-scroll">
          <table><thead><tr><th>Nombre</th><th>Tipo</th><th>Plan</th><th>Estado pago</th><th>Notas</th><th>Acciones</th></tr></thead>
          <tbody id="subBody"></tbody></table>
        </div>
      </div>
    </div>

    <!-- CONFIG -->
    <div class="page" id="page-config">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div class="form-card">
          <h3>🔑 Contraseña del panel</h3>
          <div class="form-group" style="margin-top:14px;">Nueva contraseña<input type="password" id="newPass"></div>
          <div class="form-group">Confirmar<input type="password" id="confPass"></div>
          <button class="btn btn-copper btn-sm" onclick="changePass()">Cambiar contraseña</button>
          <p id="passMsg" style="font-size:.8rem;margin-top:8px;"></p>
        </div>
        <div class="form-card">
          <h3>💾 Respaldo de datos</h3>
          <p style="font-size:.85rem;color:#5C6B70;margin:12px 0 16px;">Descarga una copia de todos los registros.</p>
          <button class="btn btn-outline" onclick="backup()">⬇ Descargar JSON</button>
        </div>
        <div class="form-card" style="grid-column:1/-1;">
          <h3>📜 Log de actividad</h3>
          <ul class="activity-list" id="cfgActivity" style="max-height:220px;overflow-y:auto;border:1px solid var(--line);margin-top:12px;"></ul>
        </div>
      </div>
    </div>
  </main>
</div>

<!-- MODAL -->
<div class="overlay" id="overlay" style="display:none;" onclick="if(event.target===this)closeModal()">
  <div class="modal">
    <div class="modal-head">
      <h3 id="mTitle">Detalle</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body" id="mBody"></div>
    <div class="modal-foot" id="mFoot"></div>
  </div>
</div>

<div id="toasts"></div>

<script>
// ── CONSTANTES ──
const PASS_KEY  = 'medifix_tele_pass';
const DATA_KEY  = 'medifix_tele_data';
const SPECS_KEY = 'medifix_tele_specs';
const PUB_KEY   = 'medifix_approved_specialists'; // lo lee telemedicina.html

// ── DATOS ──
let DB = { users:[], activity:[] };
let SPECS = [];
let sortKey = 'fechaRegistro';
let sortAsc = false;
let page = 1;
const PER_PAGE = 25;
let editSpecId = null;
let cPlans = null, cSpecs = null;

// ── PASSWORD ──
function getPass(){ return localStorage.getItem(PASS_KEY) || 'medifix2026'; }

// ── LOGIN ──
document.getElementById('loginForm').addEventListener('submit', e=>{
  e.preventDefault();
  const v = document.getElementById('loginPass').value;
  if(v === getPass()){
    sessionStorage.setItem('tele_auth','1');
    document.getElementById('loginWrap').style.display='none';
    document.getElementById('panel').style.display='block';
    init();
  } else {
    document.getElementById('loginErr').textContent='Contraseña incorrecta.';
  }
});

if(sessionStorage.getItem('tele_auth')==='1'){
  document.getElementById('loginWrap').style.display='none';
  document.getElementById('panel').style.display='block';
}

document.getElementById('logoutBtn').addEventListener('click', ()=>{
  sessionStorage.removeItem('tele_auth');
  location.reload();
});

// ── NAVEGACIÓN ──
const PAGE_TITLES={'dash':'Dashboard','users':'Gestión de usuarios','specs':'Especialidades','subs':'Suscripciones','config':'Configuración'};
document.querySelectorAll('.sb-btn[data-page]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.sb-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('page-'+btn.dataset.page).classList.add('active');
    document.getElementById('topbar-title').textContent = PAGE_TITLES[btn.dataset.page]||'';
  });
});

// ── INIT ──
function init(){
  loadDB();
  loadSpecs();
  renderDash();
  renderUsers();
  renderSpecs();
  renderSubs();
  renderCfgActivity();

  // filtros y búsqueda
  ['uSearch','uFTipo','uFPlan','uFStatus'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener('input', ()=>{page=1;renderUsers();});
  });

  document.getElementById('bellBtn').addEventListener('click', ()=>{
    goPage('users');
    document.getElementById('uFStatus').value='pendiente';
    page=1; renderUsers();
  });
}

// ── LOAD / SAVE DB ──
function loadDB(){
  try{ DB = JSON.parse(localStorage.getItem(DATA_KEY)||'{"users":[],"activity":[]}'); }
  catch{ DB = {users:[],activity:[]}; }
}
function saveDB(){
  localStorage.setItem(DATA_KEY, JSON.stringify(DB));
  publishApproved();
}
function loadSpecs(){
  const def=[
    {id:'s01',n:'Medicina General',i:'🩺'},
    {id:'s02',n:'Cardiología',i:'❤️'},
    {id:'s03',n:'Pediatría',i:'👶'},
    {id:'s04',n:'Ginecología y Obstetricia',i:'🌸'},
    {id:'s05',n:'Psicología',i:'🧠'},
    {id:'s06',n:'Dermatología',i:'✨'},
    {id:'s07',n:'Nutrición',i:'🥗'},
    {id:'s08',n:'Ortopedia',i:'🦴'},
    {id:'s09',n:'Oftalmología',i:'👁️'},
    {id:'s10',n:'Neurología',i:'🧬'},
  ];
  try{ SPECS = JSON.parse(localStorage.getItem(SPECS_KEY))||def; }
  catch{ SPECS = def; }
}
function saveSpecs(){ localStorage.setItem(SPECS_KEY, JSON.stringify(SPECS)); }

// Publica los aprobados para que telemedicina.html los muestre
function publishApproved(){
  const approved = DB.users.filter(u=>u.aprobacion==='aprobado'&&u.activo).map(u=>({
    id:u.id, tipo:u.tipo, nombre:u.nombre,
    especialidad: u.especialidad||u.especialidades||'',
    descripcion:u.descripcion||'', horarios:u.horarios||'',
    costo:u.costo||'', whatsapp:u.whatsapp||'',
    plan:u.plan||'comunidad', foto:u.foto||''
  }));
  localStorage.setItem(PUB_KEY, JSON.stringify(approved));
}

function logActivity(accion, detalle){
  DB.activity.unshift({fecha:new Date().toISOString(), accion, detalle});
  if(DB.activity.length>100) DB.activity=DB.activity.slice(0,100);
}

// ── DASHBOARD ──
function renderDash(){
  const meds=DB.users.filter(u=>u.tipo==='medico').length;
  const clis=DB.users.filter(u=>u.tipo==='clinica').length;
  const pend=DB.users.filter(u=>u.aprobacion==='pendiente').length;
  const visA=DB.users.filter(u=>u.plan==='visibilidad'&&u.pago==='activo').length;
  const comA=DB.users.filter(u=>u.plan==='comunidad'&&u.pago==='activo').length;
  const rev=visA*200+comA*50;

  document.getElementById('sMed').textContent=meds;
  document.getElementById('sCli').textContent=clis;
  document.getElementById('sPend').textContent=pend;
  document.getElementById('sRev').textContent='$'+rev.toLocaleString();

  const bellN=document.getElementById('bellN');
  bellN.style.display=pend>0?'flex':'none';
  bellN.textContent=pend;

  renderCharts();
  renderActivity();
}

function renderCharts(){
  const vis=DB.users.filter(u=>u.plan==='visibilidad').length;
  const com=DB.users.filter(u=>u.plan==='comunidad').length;

  if(cPlans) cPlans.destroy();
  cPlans=new Chart(document.getElementById('cPlans'),{
    type:'doughnut',
    data:{labels:['Visibilidad ($200)','Comunidad ($50)'],datasets:[{data:[vis,com],backgroundColor:['#C0793A','#0E6E76'],borderWidth:0}]},
    options:{responsive:true,plugins:{legend:{position:'bottom',labels:{font:{family:'IBM Plex Sans',size:11}}}}}
  });

  const specCount={};
  DB.users.forEach(u=>{
    (u.especialidad||u.especialidades||'').split(',').forEach(s=>{
      const t=s.trim(); if(t) specCount[t]=(specCount[t]||0)+1;
    });
  });
  const top=Object.entries(specCount).sort((a,b)=>b[1]-a[1]).slice(0,6);

  if(cSpecs) cSpecs.destroy();
  cSpecs=new Chart(document.getElementById('cSpecs'),{
    type:'bar',
    data:{labels:top.map(s=>s[0]),datasets:[{label:'Registros',data:top.map(s=>s[1]),backgroundColor:'#0E6E76',borderRadius:2}]},
    options:{responsive:true,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,ticks:{precision:0}}}}
  });
}

function renderActivity(){
  const al=document.getElementById('actList');
  if(!DB.activity.length){al.innerHTML='<li class="activity-item"><span style="color:#8A968F;">Sin actividad.</span></li>';return;}
  al.innerHTML=DB.activity.slice(0,10).map(a=>`
    <li class="activity-item">
      <div class="act-dot">●</div>
      <div class="act-text"><strong>${a.accion}</strong><br><span style="color:#5C6B70;">${a.detalle||''}</span></div>
      <span class="act-time">${fDate(a.fecha)}</span>
    </li>`).join('');
}

// ── USUARIOS ──
function getFiltered(){
  let u=[...DB.users];
  const s=document.getElementById('uSearch')?.value?.toLowerCase()||'';
  const t=document.getElementById('uFTipo')?.value||'';
  const pl=document.getElementById('uFPlan')?.value||'';
  const st=document.getElementById('uFStatus')?.value||'';
  if(s) u=u.filter(x=>(x.nombre+x.correo+x.especialidad).toLowerCase().includes(s));
  if(t) u=u.filter(x=>x.tipo===t);
  if(pl) u=u.filter(x=>x.plan===pl);
  if(st) u=u.filter(x=>x.aprobacion===st);
  u.sort((a,b)=>{const va=a[sortKey]||'',vb=b[sortKey]||''; return sortAsc?va.localeCompare(vb):vb.localeCompare(va);});
  return u;
}

function sortBy(k){ if(sortKey===k)sortAsc=!sortAsc; else{sortKey=k;sortAsc=true;} renderUsers(); }

function renderUsers(){
  const all=getFiltered();
  const total=all.length;
  const pages=Math.max(1,Math.ceil(total/PER_PAGE));
  page=Math.min(page,pages);
  const slice=all.slice((page-1)*PER_PAGE, page*PER_PAGE);

  document.getElementById('uBody').innerHTML=slice.length ? slice.map(u=>`
    <tr>
      <td><span class="badge ${u.tipo==='clinica'?'b-teal':'b-gray'}">${u.tipo==='clinica'?'Clínica':'Médico'}</span></td>
      <td style="font-weight:600;">${u.nombre}</td>
      <td style="font-size:.8rem;">${u.correo}</td>
      <td style="font-size:.8rem;">${u.especialidad||u.especialidades||'—'}</td>
      <td><span class="badge ${u.plan==='visibilidad'?'b-copper':'b-gray'}">${u.plan==='visibilidad'?'Visibilidad':'Comunidad'}</span></td>
      <td><span class="badge ${u.pago==='activo'?'b-ok':u.pago==='vencido'?'b-no':'b-pending'}">${u.pago||'pendiente'}</span></td>
      <td><span class="badge ${u.aprobacion==='aprobado'?'b-ok':u.aprobacion==='rechazado'?'b-no':'b-pending'}">${u.aprobacion||'pendiente'}</span></td>
      <td style="font-size:.78rem;">${fDate(u.fechaRegistro)}</td>
      <td>
        <div class="actions">
          <button class="btn btn-sm btn-outline" onclick="viewUser('${u.id}')">👁</button>
          <button class="btn btn-sm btn-green" onclick="qa('${u.id}','aprobado')">✓</button>
          <button class="btn btn-sm btn-danger" onclick="qa('${u.id}','rechazado')">✗</button>
        </div>
      </td>
    </tr>`).join('') : '<tr><td colspan="9" style="text-align:center;padding:28px;color:#8A968F;">Sin resultados</td></tr>';

  // paginación
  const pag=document.getElementById('uPag');
  pag.innerHTML=`
    <button class="pag-btn" onclick="gp(${page-1})" ${page<=1?'disabled':''}>‹</button>
    ${Array.from({length:pages},(_,i)=>`<button class="pag-btn ${i+1===page?'active':''}" onclick="gp(${i+1})">${i+1}</button>`).join('')}
    <button class="pag-btn" onclick="gp(${page+1})" ${page>=pages?'disabled':''}>›</button>
    <span class="pag-info">${(page-1)*PER_PAGE+1}–${Math.min(page*PER_PAGE,total)} de ${total}</span>`;
}

function gp(p){page=p;renderUsers();}

function viewUser(id){
  const u=DB.users.find(x=>x.id===id); if(!u) return;
  const pub=['nombre','tipo','especialidad','especialidades','descripcion','horarios','costo','plan','foto'];
  const priv=['correo','whatsapp','cedula','cedulaEsp','rfc','domicilio'];

  document.getElementById('mTitle').textContent=u.nombre;
  document.getElementById('mBody').innerHTML=`
    <h4 style="font-size:.82rem;color:#6B7975;margin-bottom:10px;text-transform:uppercase;letter-spacing:.04em;">Datos públicos</h4>
    <div class="detail-grid">${pub.filter(k=>u[k]).map(k=>`<div class="detail-item"><strong>${k}</strong>${u[k]}</div>`).join('')}</div>
    <hr style="margin:16px 0;border:none;border-top:1px solid var(--line);">
    <h4 style="font-size:.82rem;color:#6B7975;margin-bottom:10px;text-transform:uppercase;letter-spacing:.04em;">🔒 Datos confidenciales</h4>
    <div class="detail-grid">${priv.filter(k=>u[k]).map(k=>`<div class="detail-item"><strong>${k}</strong>${u[k]}</div>`).join('')}</div>
    <hr style="margin:16px 0;border:none;border-top:1px solid var(--line);">
    <h4 style="font-size:.88rem;margin-bottom:10px;">Editar estado</h4>
    <div class="edit-row">
      <label>Aprobación<select id="eAp">
        <option ${u.aprobacion==='pendiente'?'selected':''} value="pendiente">Pendiente</option>
        <option ${u.aprobacion==='aprobado'?'selected':''} value="aprobado">Aprobado</option>
        <option ${u.aprobacion==='rechazado'?'selected':''} value="rechazado">Rechazado</option>
      </select></label>
      <label>Estado pago<select id="ePg">
        <option ${u.pago==='pendiente'?'selected':''} value="pendiente">Pendiente</option>
        <option ${u.pago==='activo'?'selected':''} value="activo">Activo</option>
        <option ${u.pago==='vencido'?'selected':''} value="vencido">Vencido</option>
      </select></label>
      <label>Plan<select id="ePl">
        <option ${u.plan==='comunidad'?'selected':''} value="comunidad">Comunidad ($50)</option>
        <option ${u.plan==='visibilidad'?'selected':''} value="visibilidad">Visibilidad ($200)</option>
      </select></label>
    </div>
    <label style="display:flex;flex-direction:column;gap:5px;font-size:.82rem;font-weight:600;color:#3A4A50;margin-top:12px;">Notas internas
      <textarea id="eNt" rows="2" style="font-family:inherit;font-size:.86rem;padding:8px 10px;border:1px solid var(--line);border-radius:2px;background:var(--bg);">${u.notas||''}</textarea>
    </label>`;
  document.getElementById('mFoot').innerHTML=`
    <button class="btn btn-sm btn-danger" onclick="delUser('${id}')">🗑 Eliminar</button>
    <button class="btn btn-sm btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-sm btn-copper" onclick="saveUser('${id}')">💾 Guardar</button>`;
  openModal();
}

function saveUser(id){
  const u=DB.users.find(x=>x.id===id); if(!u) return;
  u.aprobacion=document.getElementById('eAp').value;
  u.pago=document.getElementById('ePg').value;
  u.plan=document.getElementById('ePl').value;
  u.notas=document.getElementById('eNt').value;
  u.activo=u.aprobacion==='aprobado';
  logActivity('Usuario actualizado', u.nombre);
  saveDB(); closeModal();
  renderUsers(); renderDash(); renderSubs();
  toast('Cambios guardados ✓');
}

function qa(id, status){
  const u=DB.users.find(x=>x.id===id); if(!u) return;
  u.aprobacion=status;
  u.activo=status==='aprobado';
  logActivity(status==='aprobado'?'Aprobado':'Rechazado', u.nombre);
  saveDB(); renderUsers(); renderDash();
  toast(status==='aprobado'?'Aprobado ✓':'Rechazado', status==='rechazado'?'warn':'');
}

function delUser(id){
  if(!confirm('¿Eliminar este registro permanentemente?')) return;
  const u=DB.users.find(x=>x.id===id);
  DB.users=DB.users.filter(x=>x.id!==id);
  logActivity('Eliminado', u?.nombre||id);
  saveDB(); closeModal(); renderUsers(); renderDash();
  toast('Eliminado');
}

function approveAll(){
  const pend=DB.users.filter(u=>u.aprobacion==='pendiente');
  if(!pend.length){toast('No hay pendientes','warn');return;}
  if(!confirm(`¿Aprobar ${pend.length} registro${pend.length>1?'s':''}?`)) return;
  pend.forEach(u=>{u.aprobacion='aprobado';u.activo=true;});
  logActivity('Aprobación masiva', `${pend.length} registros aprobados`);
  saveDB(); renderUsers(); renderDash();
  toast(`${pend.length} aprobados ✓`);
}

function exportCSV(){
  const cols=['tipo','nombre','correo','especialidad','plan','pago','aprobacion','fechaRegistro'];
  const rows=[cols, ...DB.users.map(u=>cols.map(c=>`"${(u[c]||'').toString().replace(/"/g,'""')}"`))]
    .map(r=>r.join(',')).join('\n');
  download('medifix-usuarios.csv',rows,'text/csv');
}

// ── ESPECIALIDADES ──
function renderSpecs(){
  const tbody=document.getElementById('specBody');
  tbody.innerHTML=SPECS.map(s=>{
    const cnt=DB.users.filter(u=>(u.especialidad||u.especialidades||'').includes(s.n)).length;
    return `<tr>
      <td style="font-size:1.4rem;">${s.i||'🏥'}</td>
      <td style="font-weight:600;">${s.n}</td>
      <td>${cnt}</td>
      <td><div class="actions">
        <button class="btn btn-sm btn-outline" onclick="editSpec('${s.id}')">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="delSpec('${s.id}')">🗑</button>
      </div></td>
    </tr>`;
  }).join('')||'<tr><td colspan="4" style="text-align:center;padding:24px;color:#8A968F;">Sin especialidades</td></tr>';
}

function saveSpec(){
  const n=document.getElementById('specName').value.trim();
  const i=document.getElementById('specIcon').value.trim();
  if(!n){toast('Nombre obligatorio','warn');return;}
  if(editSpecId){
    const s=SPECS.find(x=>x.id===editSpecId); if(s){s.n=n;s.i=i;}
  } else {
    SPECS.push({id:'s'+Date.now(),n,i:i||'🏥'});
  }
  saveSpecs(); cancelSpec(); renderSpecs();
  toast(editSpecId?'Especialidad actualizada ✓':'Especialidad agregada ✓');
}

function editSpec(id){
  const s=SPECS.find(x=>x.id===id); if(!s) return;
  editSpecId=id;
  document.getElementById('specName').value=s.n;
  document.getElementById('specIcon').value=s.i||'';
  document.getElementById('specFTitle').textContent='✏️ Editar especialidad';
}

function cancelSpec(){
  editSpecId=null;
  document.getElementById('specName').value='';
  document.getElementById('specIcon').value='';
  document.getElementById('specFTitle').textContent='➕ Agregar especialidad';
}

function delSpec(id){
  if(!confirm('¿Eliminar especialidad?')) return;
  SPECS=SPECS.filter(s=>s.id!==id);
  saveSpecs(); renderSpecs(); toast('Especialidad eliminada');
}

// ── SUSCRIPCIONES ──
function renderSubs(){
  const vis=DB.users.filter(u=>u.plan==='visibilidad');
  const com=DB.users.filter(u=>u.plan==='comunidad');
  const vA=vis.filter(u=>u.pago==='activo').length;
  const cA=com.filter(u=>u.pago==='activo').length;
  document.getElementById('sVis').textContent=vis.length;
  document.getElementById('sVisR').textContent=`${vA} activos`;
  document.getElementById('sCom').textContent=com.length;
  document.getElementById('sComR').textContent=`${cA} activos`;
  document.getElementById('sTot').textContent='$'+(vA*200+cA*50).toLocaleString();

  document.getElementById('subBody').innerHTML=DB.users.map(u=>`
    <tr>
      <td style="font-weight:600;">${u.nombre}</td>
      <td>${u.tipo==='clinica'?'Clínica':'Médico'}</td>
      <td><span class="badge ${u.plan==='visibilidad'?'b-copper':'b-gray'}">${u.plan==='visibilidad'?'Visibilidad $200':'Comunidad $50'}</span></td>
      <td><span class="badge ${u.pago==='activo'?'b-ok':u.pago==='vencido'?'b-no':'b-pending'}">${u.pago||'pendiente'}</span></td>
      <td style="font-size:.8rem;">${u.notas||'—'}</td>
      <td><div class="actions">
        <button class="btn btn-sm btn-green" onclick="setPago('${u.id}','activo')" title="Activo">✓</button>
        <button class="btn btn-sm btn-outline" onclick="setPago('${u.id}','pendiente')" title="Pendiente">⏳</button>
        <button class="btn btn-sm btn-danger" onclick="setPago('${u.id}','vencido')" title="Vencido">✗</button>
        <button class="btn btn-sm btn-outline" onclick="togglePlan('${u.id}')" title="Cambiar plan">⇄</button>
      </div></td>
    </tr>`).join('')||'<tr><td colspan="6" style="text-align:center;padding:24px;color:#8A968F;">Sin registros</td></tr>';
}

function setPago(id,st){
  const u=DB.users.find(x=>x.id===id); if(!u) return;
  u.pago=st; logActivity('Pago actualizado',`${u.nombre} → ${st}`);
  saveDB(); renderSubs(); renderDash(); toast('Estado actualizado ✓');
}

function togglePlan(id){
  const u=DB.users.find(x=>x.id===id); if(!u) return;
  const np=u.plan==='visibilidad'?'comunidad':'visibilidad';
  if(!confirm(`¿Cambiar a plan ${np}?`)) return;
  u.plan=np; logActivity('Plan cambiado',`${u.nombre} → ${np}`);
  saveDB(); renderSubs(); renderDash(); toast(`Plan cambiado a ${np} ✓`);
}

// ── CONFIGURACIÓN ──
function changePass(){
  const np=document.getElementById('newPass').value;
  const cp=document.getElementById('confPass').value;
  if(!np){toast('Ingresa contraseña','warn');return;}
  if(np!==cp){toast('No coinciden','err');return;}
  localStorage.setItem(PASS_KEY,np);
  document.getElementById('passMsg').textContent='✓ Contraseña actualizada';
  toast('Contraseña actualizada ✓');
}

function backup(){
  download('medifix-backup-'+new Date().toISOString().slice(0,10)+'.json',
    JSON.stringify({users:DB.users,specialties:SPECS},null,2),'application/json');
  toast('Respaldo descargado ✓');
}

function renderCfgActivity(){
  const el=document.getElementById('cfgActivity');
  el.innerHTML=DB.activity.slice(0,20).map(a=>`
    <li class="activity-item">
      <div class="act-dot">●</div>
      <div class="act-text"><strong>${a.accion}</strong> — ${a.detalle||''}</div>
      <span class="act-time">${fDate(a.fecha)}</span>
    </li>`).join('')||'<li style="padding:14px;color:#8A968F;font-size:.83rem;text-align:center;">Sin actividad</li>';
}

// ── MODAL ──
function openModal(){document.getElementById('overlay').style.display='flex';}
function closeModal(){document.getElementById('overlay').style.display='none';}

// ── TOAST ──
function toast(msg,type=''){
  const el=document.createElement('div');
  el.className='toast'+(type?' '+type:'');
  el.textContent=msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(()=>el.remove(),3500);
}

// ── UTILS ──
function fDate(s){
  if(!s) return '—';
  try{return new Date(s).toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric'});}
  catch{return s;}
}

function download(name,text,mime){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([text],{type:mime}));
  a.download=name;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
}

function goPage(p){
  document.querySelectorAll('.sb-btn[data-page]').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  const btn=document.querySelector(`.sb-btn[data-page=${p}]`);
  if(btn){btn.classList.add('active');document.getElementById('topbar-title').textContent=PAGE_TITLES[p]||'';}
  document.getElementById('page-'+p)?.classList.add('active');
}

// ── PANEL DE ADMINISTRADOR: AGREGAR ESPECIALISTA MANUALMENTE ──
// Esto es para cuando alguien envíe su solicitud por WhatsApp y tú quieras agregarla manualmente
// Puedes hacerlo también entrando a Usuarios → botón ➕
document.addEventListener('DOMContentLoaded', ()=>{
  if(sessionStorage.getItem('tele_auth')==='1') init();
});
</script>
</body>
</html>


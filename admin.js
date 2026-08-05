const ADMIN_PASSWORD = "medifix2026";

// ── CATEGORÍAS DE PRODUCTOS (sin archivo externo) ──
const DEFAULT_CATEGORIES = [
  { id:"general",    label:"Medicina General" },
  { id:"cardiologia",label:"Cardiología" },
  { id:"ginecologia",label:"Ginecología y Obstetricia" },
  { id:"pediatria",  label:"Pediatría" },
  { id:"fisioterapia",label:"Fisioterapia y Rehabilitación" },
  { id:"cirugia",    label:"Cirugía y Esterilización" },
  { id:"diagnostico",label:"Diagnóstico por Imagen" },
  { id:"odontologia",label:"Odontología" },
  { id:"nutricion",  label:"Nutrición" },
  { id:"psicologia", label:"Psicología" },
];

// ── DATOS EN MEMORIA (se cargan de localStorage o se usan defaults) ──
let productsData = { categories: DEFAULT_CATEGORIES, products: [] };
let coursesData  = { courses: [] };
let specialistsData = {
  specialties:[
    {id:"gen",label:"Medicina General"},{id:"car",label:"Cardiología"},
    {id:"ped",label:"Pediatría"},{id:"gin",label:"Ginecología y Obstetricia"},
    {id:"psi",label:"Psicología"},{id:"der",label:"Dermatología"},
    {id:"nut",label:"Nutrición"},{id:"ort",label:"Ortopedia"},
  ],
  specialists:[]
};
let contentData = null;

// ── LOGIN ──
const gate      = document.getElementById('gate');
const panel     = document.getElementById('panel');
const gateForm  = document.getElementById('gateForm');
const gateError = document.getElementById('gateError');

function isAuthed(){ return sessionStorage.getItem('medifix_admin_auth')==='1'; }

function showPanel(){
  gate.style.display  = 'none';
  panel.style.display = 'block';
  initContent();
  initProducts();
  initCourses();
  initSpecialists();
}
if(isAuthed()) showPanel();

gateForm.addEventListener('submit', e=>{
  e.preventDefault();
  if(e.target.querySelector('input').value === ADMIN_PASSWORD){
    sessionStorage.setItem('medifix_admin_auth','1');
    showPanel();
  } else {
    gateError.textContent = 'Contraseña incorrecta.';
  }
});

document.getElementById('logoutBtn').addEventListener('click',()=>{
  sessionStorage.removeItem('medifix_admin_auth');
  location.reload();
});

// ── TABS ──
document.querySelectorAll('.admin-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.admin-panel-section').forEach(s=>s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-'+tab.dataset.tab).classList.add('active');
  });
});

// ── DESCARGA JSON ──
function downloadJSON(obj, filename){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));
  a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ── ESCAPE HTML ──
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTENIDO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CONTENT_DEFAULTS = {
  global:{ footerTagline:"Más que equipos, estrategias para tu rentabilidad médica.", email:"contacto@medifix.mx", instagramUrl:"https://www.instagram.com/mxmedifix", facebookUrl:"https://www.facebook.com/profile.php?id=61575132607438", phoneDisplay:"+52 871 833 6666", whatsappNumber:"528718336666" },
  home:{ heroEyebrow:"Confianza y excelencia clínica", heroTitleLine1:"Más que equipos,", heroTitleLine2:"estrategias para tu rentabilidad médica.", heroSub:"Equipamos clínicas y hospitales con tecnología confiable, y formamos al personal que la opera.", stat1Num:"200+", stat1Label:"clínicas atendidas", stat2Num:"14", stat2Label:"años de operación", stat3Num:"98%", stat3Label:"soporte resuelto en 24h", stat4Num:"30", stat4Label:"días de garantía de devolución" },
  nosotros:{ heroTitle:"Confianza y excelencia clínica, desde 2012", mision:"Proveer equipamiento médico de alta calidad y programas de capacitación que aseguren que cada clínica opere con confiabilidad clínica y rentabilidad sostenida.", vision:"Ser el socio estratégico de referencia para clínicas independientes en México." },
  contacto:{ heroTitle:"Hablemos de tu clínica", horario:"Lunes a viernes, 9:00 a 18:00", coverage:"Zona de cobertura: toda la República Mexicana" }
};

const SECTION_LABELS = { global:'Global (teléfono, correo, redes)', home:'Página de inicio', nosotros:'Página Nosotros', contacto:'Página Contacto' };

function prettify(k){ return k.replace(/([A-Z0-9])/g,' $1').replace(/^./,c=>c.toUpperCase()).trim(); }

function initContent(){
  const saved = localStorage.getItem('medifix_content');
  contentData = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(CONTENT_DEFAULTS));
  renderContentForm();
}

function renderContentForm(){
  const wrap = document.getElementById('contentGroups');
  wrap.innerHTML = Object.keys(contentData).map(section=>{
    const fields = Object.keys(contentData[section]).map(key=>{
      const v = contentData[section][key];
      const id = `ck__${section}__${key}`;
      return `<label>${prettify(key)}
        ${v.length>70
          ? `<textarea id="${id}" rows="2" data-section="${section}" data-key="${key}">${esc(v)}</textarea>`
          : `<input type="text" id="${id}" value="${esc(v)}" data-section="${section}" data-key="${key}">`}
      </label>`;
    }).join('');
    return `<div class="admin-form"><h3>${SECTION_LABELS[section]||prettify(section)}</h3>${fields}</div>`;
  }).join('');
}

document.getElementById('saveContentBtn').addEventListener('click',()=>{
  document.querySelectorAll('#contentGroups [data-section]').forEach(f=>{
    contentData[f.dataset.section][f.dataset.key] = f.value;
  });
  localStorage.setItem('medifix_content', JSON.stringify(contentData));
  document.getElementById('contentStatus').textContent = 'Guardado ✓ — descarga y sube site-content.json para publicar para todos';
});

document.getElementById('downloadContentBtn').addEventListener('click',()=>{
  document.querySelectorAll('#contentGroups [data-section]').forEach(f=>{
    contentData[f.dataset.section][f.dataset.key] = f.value;
  });
  downloadJSON(contentData,'site-content.json');
});

document.getElementById('resetContentBtn').addEventListener('click',()=>{
  if(!confirm('¿Restablecer contenido a los valores por defecto?')) return;
  localStorage.removeItem('medifix_content');
  contentData = JSON.parse(JSON.stringify(CONTENT_DEFAULTS));
  renderContentForm();
  document.getElementById('contentStatus').textContent = 'Restablecido ✓';
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRODUCTOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initProducts(){
  const saved = localStorage.getItem('medifix_products');
  if(saved){ try{ productsData = JSON.parse(saved); } catch{} }
  // Asegura que siempre haya categorías aunque el localStorage esté vacío
  if(!productsData.categories || productsData.categories.length === 0){
    productsData.categories = DEFAULT_CATEGORIES;
  }
  renderCategoryCheckboxes();
  renderProductsTable();
}

function renderCategoryCheckboxes(){
  document.getElementById('categoryCheckboxes').innerHTML =
    productsData.categories.map(c=>
      `<label class="check-label"><input type="checkbox" value="${c.id}"> ${c.label}</label>`
    ).join('');
}

function renderProductsTable(){
  const tbody = document.getElementById('productsTableBody');
  if(!productsData.products.length){
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:24px;color:#8A968F;">Aún no hay productos. Agrega el primero arriba.</td></tr>';
    return;
  }
  tbody.innerHTML = productsData.products.map(p=>`
    <tr>
      <td style="font-weight:600;">${esc(p.name)}</td>
      <td>${p.categories && p.categories.length > 0 ? p.categories.map(id=>(productsData.categories.find(c=>c.id===id)||{}).label||id).join(', ') : 'Sin categoría'}</td> <!-- <--- SOLO CAMBIÉ ESTA LÍNEA (muestra "Sin categoría" si no tiene) -->
      <td>${esc(p.price||'—')}</td>
      <td>
        <button type="button" class="btn btn-small btn-outline-dark admin-edit-product" data-id="${p.id}">Editar</button>
        <button type="button" class="btn btn-small btn-danger admin-delete-product" data-id="${p.id}">Eliminar</button>
      </td>
    </tr>`).join('');
}

document.getElementById('productForm').addEventListener('submit', e=>{
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const categories = Array.from(form.querySelectorAll('#categoryCheckboxes input:checked')).map(i=>i.value);

  if(!name){
    alert('El nombre del producto es obligatorio.');
    return;
  }
  // <--- ELIMINÉ LA LÍNEA QUE FORZABA "general" por defecto
  // Las categorías son opcionales, se guarda array vacío si no hay selección
  const finalCats = categories.length > 0 ? categories : []; // <--- SOLO CAMBIÉ ESTA LÍNEA (antes forzaba ['general'])

  const id = form.dataset.editId || ('p'+Date.now());
  const obj = { id, name, categories: finalCats, price: form.price.value.trim(), desc: form.desc.value.trim(), img: form.img.value.trim() };

  const idx = productsData.products.findIndex(p=>p.id===id);
  if(idx>=0) productsData.products[idx]=obj;
  else productsData.products.push(obj);

  saveProducts();
  renderProductsTable();
  form.reset();
  delete form.dataset.editId;
  document.getElementById('productFormTitle').textContent = 'Agregar producto';
});

document.getElementById('cancelProductEdit').addEventListener('click',()=>{
  document.getElementById('productForm').reset();
  delete document.getElementById('productForm').dataset.editId;
  document.getElementById('productFormTitle').textContent = 'Agregar producto';
});

document.getElementById('productsTableBody').addEventListener('click', e=>{
  const editBtn = e.target.closest('.admin-edit-product');
  const delBtn  = e.target.closest('.admin-delete-product');
  if(editBtn){
    const p = productsData.products.find(x=>x.id===editBtn.dataset.id);
    if(!p) return;
    const form = document.getElementById('productForm');
    form.name.value  = p.name;
    form.price.value = p.price||'';
    form.desc.value  = p.desc||'';
    form.img.value   = p.img||'';
    form.querySelectorAll('#categoryCheckboxes input').forEach(i=>{ i.checked = p.categories.includes(i.value); });
    form.dataset.editId = p.id;
    document.getElementById('productFormTitle').textContent = 'Editar producto';
    form.scrollIntoView({behavior:'smooth',block:'start'});
  }
  if(delBtn){
    if(!confirm('¿Eliminar este producto?')) return;
    productsData.products = productsData.products.filter(x=>x.id!==delBtn.dataset.id);
    saveProducts();
    renderProductsTable();
  }
});

function saveProducts(){
  localStorage.setItem('medifix_products', JSON.stringify(productsData));
  document.getElementById('productsStatus').textContent = 'Guardado ✓ — descarga y sube products.json para publicar para todos';
}

document.getElementById('downloadProductsBtn').addEventListener('click',()=> downloadJSON(productsData,'products.json'));

document.getElementById('resetProductsBtn').addEventListener('click',()=>{
  if(!confirm('¿Eliminar todos los productos y volver al estado vacío?')) return;
  productsData = { categories: DEFAULT_CATEGORIES, products: [] };
  localStorage.removeItem('medifix_products');
  renderCategoryCheckboxes();
  renderProductsTable();
  document.getElementById('productsStatus').textContent = 'Restablecido ✓';
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CURSOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initCourses(){
  const saved = localStorage.getItem('medifix_courses');
  if(saved){ try{ coursesData = JSON.parse(saved); } catch{} }
  renderCoursesTable();
}

function renderCoursesTable(){
  const tbody = document.getElementById('coursesTableBody');
  if(!coursesData.courses.length){
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:24px;color:#8A968F;">Aún no hay cursos. Agrega el primero arriba.</td></tr>';
    return;
  }
  tbody.innerHTML = coursesData.courses.map(c=>`
    <tr>
      <td style="font-weight:600;">${esc(c.title)}</td>
      <td>${esc(c.day)} ${esc(c.month)}</td>
      <td>${c.modality==='presencial'?'Presencial':'En línea'}</td>
      <td>
        <button type="button" class="btn btn-small btn-outline-dark admin-edit-course" data-id="${c.id}">Editar</button>
        <button type="button" class="btn btn-small btn-danger admin-delete-course" data-id="${c.id}">Eliminar</button>
      </td>
    </tr>`).join('');
}

document.getElementById('courseForm').addEventListener('submit', e=>{
  e.preventDefault();
  const form = e.target;
  const title = form.title.value.trim();
  const day   = form.day.value.trim();
  const month = form.month.value.trim();
  if(!title||!day||!month){ alert('Título, día y mes son obligatorios.'); return; }
  const id = form.dataset.editId||('c'+Date.now());
  const obj = { id, title, day, month, modality:form.modality.value, info:form.info.value.trim() };
  const idx = coursesData.courses.findIndex(c=>c.id===id);
  if(idx>=0) coursesData.courses[idx]=obj;
  else coursesData.courses.push(obj);
  saveCourses(); renderCoursesTable(); form.reset();
  delete form.dataset.editId;
  document.getElementById('courseFormTitle').textContent = 'Agregar curso';
});

document.getElementById('cancelCourseEdit').addEventListener('click',()=>{
  document.getElementById('courseForm').reset();
  delete document.getElementById('courseForm').dataset.editId;
  document.getElementById('courseFormTitle').textContent = 'Agregar curso';
});

document.getElementById('coursesTableBody').addEventListener('click', e=>{
  const editBtn = e.target.closest('.admin-edit-course');
  const delBtn  = e.target.closest('.admin-delete-course');
  if(editBtn){
    const c = coursesData.courses.find(x=>x.id===editBtn.dataset.id);
    if(!c) return;
    const form = document.getElementById('courseForm');
    form.title.value    = c.title;
    form.day.value      = c.day;
    form.month.value    = c.month;
    form.modality.value = c.modality;
    form.info.value     = c.info||'';
    form.dataset.editId = c.id;
    document.getElementById('courseFormTitle').textContent = 'Editar curso';
    form.scrollIntoView({behavior:'smooth',block:'start'});
  }
  if(delBtn){
    if(!confirm('¿Eliminar este curso?')) return;
    coursesData.courses = coursesData.courses.filter(x=>x.id!==delBtn.dataset.id);
    saveCourses(); renderCoursesTable();
  }
});

function saveCourses(){
  localStorage.setItem('medifix_courses', JSON.stringify(coursesData));
  document.getElementById('coursesStatus').textContent = 'Guardado ✓ — descarga y sube courses.json para publicar para todos';
}

document.getElementById('downloadCoursesBtn').addEventListener('click',()=> downloadJSON(coursesData,'courses.json'));

document.getElementById('resetCoursesBtn').addEventListener('click',()=>{
  if(!confirm('¿Eliminar todos los cursos?')) return;
  coursesData = { courses:[] };
  localStorage.removeItem('medifix_courses');
  renderCoursesTable();
  document.getElementById('coursesStatus').textContent = 'Restablecido ✓';
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ESPECIALISTAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initSpecialists(){
  const saved = localStorage.getItem('medifix_specialists');
  if(saved){ try{ specialistsData = JSON.parse(saved); } catch{} }
  renderSpecialistSpecialtyOptions();
  renderSpecialistsTable();
}

function renderSpecialistSpecialtyOptions(){
  document.getElementById('specialistSpecialtySelect').innerHTML =
    specialistsData.specialties.map(s=>`<option value="${s.id}">${s.label}</option>`).join('');
}

function renderSpecialistsTable(){
  const tbody = document.getElementById('specialistsTableBody');
  if(!specialistsData.specialists.length){
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:#8A968F;">Aún no hay especialistas. Agrega el primero arriba.</td></tr>';
    return;
  }
  tbody.innerHTML = specialistsData.specialists.map(d=>`
    <tr>
      <td style="font-weight:600;">${esc(d.name)}</td>
      <td>${(specialistsData.specialties.find(s=>s.id===d.specialtyId)||{}).label||d.specialtyId}</td>
      <td>${esc(d.phone||'—')}</td>
      <td>★ ${esc(d.rating||'—')}</td>
      <td>
        <button type="button" class="btn btn-small btn-outline-dark admin-edit-specialist" data-id="${d.id}">Editar</button>
        <button type="button" class="btn btn-small btn-danger admin-delete-specialist" data-id="${d.id}">Eliminar</button>
      </td>
    </tr>`).join('');
}

document.getElementById('specialistForm').addEventListener('submit', e=>{
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  if(!name){ alert('El nombre es obligatorio.'); return; }
  const id = form.dataset.editId||('s'+Date.now());
  const obj = { id, name, specialtyId:form.specialtyId.value, phone:form.phone.value.trim(), rating:form.rating.value.trim(), reviewCount:form.reviewCount.value.trim(), availabilityNote:form.availabilityNote.value.trim(), bio:form.bio.value.trim(), photo:form.photo.value.trim() };
  const idx = specialistsData.specialists.findIndex(d=>d.id===id);
  if(idx>=0) specialistsData.specialists[idx]=obj;
  else specialistsData.specialists.push(obj);
  saveSpecialists(); renderSpecialistsTable(); form.reset();
  delete form.dataset.editId;
  document.getElementById('specialistFormTitle').textContent = 'Agregar especialista';
});

document.getElementById('cancelSpecialistEdit').addEventListener('click',()=>{
  document.getElementById('specialistForm').reset();
  delete document.getElementById('specialistForm').dataset.editId;
  document.getElementById('specialistFormTitle').textContent = 'Agregar especialista';
});

document.getElementById('specialistsTableBody').addEventListener('click', e=>{
  const editBtn = e.target.closest('.admin-edit-specialist');
  const delBtn  = e.target.closest('.admin-delete-specialist');
  if(editBtn){
    const d = specialistsData.specialists.find(x=>x.id===editBtn.dataset.id);
    if(!d) return;
    const form = document.getElementById('specialistForm');
    form.name.value             = d.name;
    form.specialtyId.value      = d.specialtyId;
    form.phone.value            = d.phone||'';
    form.rating.value           = d.rating||'';
    form.reviewCount.value      = d.reviewCount||'';
    form.availabilityNote.value = d.availabilityNote||'';
    form.bio.value              = d.bio||'';
    form.photo.value            = d.photo||'';
    form.dataset.editId = d.id;
    document.getElementById('specialistFormTitle').textContent = 'Editar especialista';
    form.scrollIntoView({behavior:'smooth',block:'start'});
  }
  if(delBtn){
    if(!confirm('¿Eliminar este especialista?')) return;
    specialistsData.specialists = specialistsData.specialists.filter(x=>x.id!==delBtn.dataset.id);
    saveSpecialists(); renderSpecialistsTable();
  }
});

function saveSpecialists(){
  localStorage.setItem('medifix_specialists', JSON.stringify(specialistsData));
  document.getElementById('specialistsStatus').textContent = 'Guardado ✓ — descarga y sube specialists.json para publicar para todos';
}

document.getElementById('downloadSpecialistsBtn').addEventListener('click',()=> downloadJSON(specialistsData,'specialists.json'));

document.getElementById('resetSpecialistsBtn').addEventListener('click',()=>{
  if(!confirm('¿Eliminar todos los especialistas?')) return;
  specialistsData.specialists = [];
  localStorage.removeItem('medifix_specialists');
  renderSpecialistsTable();
  document.getElementById('specialistsStatus').textContent = 'Restablecido ✓';
});

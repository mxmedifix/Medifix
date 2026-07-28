// ⚠️ Cambia esta contraseña antes de publicar el sitio.
// Esto es solo un filtro simple para que no cualquiera entre por casualidad,
// NO es seguridad real (el código es visible para quien sepa buscarlo).
// Para protección real se necesitaría un servidor/login verdadero.
const ADMIN_PASSWORD = "medifix2026";

const gate = document.getElementById('gate');
const panel = document.getElementById('panel');
const gateForm = document.getElementById('gateForm');
const gateError = document.getElementById('gateError');

function isAuthed() {
  return sessionStorage.getItem('medifix_admin_auth') === '1';
}
function showPanel() {
  gate.style.display = 'none';
  panel.style.display = 'block';
  initContent();
  initProducts();
  initCourses();
  initSpecialists();
}
if (isAuthed()) showPanel();

gateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = document.getElementById('gatePassword').value;
  if (val === ADMIN_PASSWORD) {
    sessionStorage.setItem('medifix_admin_auth', '1');
    showPanel();
  } else {
    gateError.textContent = 'Contraseña incorrecta.';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('medifix_admin_auth');
  location.reload();
});

// Tabs
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-panel-section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================
// CONTENIDO (textos, teléfono, redes — data/site-content.json)
// ============================================================
let contentData = null;

const SECTION_LABELS = {
  global: 'Global (teléfono, correo, redes, pie de página)',
  home: 'Página de inicio',
  nosotros: 'Página Nosotros',
  telemedicina: 'Página Telemedicina',
  contacto: 'Página Contacto'
};

function prettifyKey(key) {
  return key.replace(/([A-Z0-9])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();
}

async function initContent() {
  contentData = await loadData('content', 'data/site-content.json');
  renderContentForm();
}

function renderContentForm() {
  const wrap = document.getElementById('contentGroups');
  wrap.innerHTML = Object.keys(contentData).map(section => {
    const fields = Object.keys(contentData[section]).map(key => {
      const value = contentData[section][key];
      const long = value.length > 70;
      const fieldId = `ck__${section}__${key}`;
      return `
        <label>${prettifyKey(key)}
          ${long
            ? `<textarea id="${fieldId}" rows="2" data-section="${section}" data-key="${key}">${escapeHtml(value)}</textarea>`
            : `<input type="text" id="${fieldId}" value="${escapeHtml(value)}" data-section="${section}" data-key="${key}">`}
        </label>`;
    }).join('');
    return `<div class="admin-form"><h3>${SECTION_LABELS[section] || prettifyKey(section)}</h3>${fields}</div>`;
  }).join('');
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.getElementById('saveContentBtn').addEventListener('click', () => {
  document.querySelectorAll('#contentGroups [data-section]').forEach(field => {
    contentData[field.dataset.section][field.dataset.key] = field.value;
  });
  localStorage.setItem('medifix_content', JSON.stringify(contentData));
  document.getElementById('contentStatus').textContent = 'Cambios guardados en este navegador ✓ (aún no publicados para todos — descarga y sube el archivo para publicar)';
});

document.getElementById('downloadContentBtn').addEventListener('click', () => {
  document.querySelectorAll('#contentGroups [data-section]').forEach(field => {
    contentData[field.dataset.section][field.dataset.key] = field.value;
  });
  downloadJSON(contentData, 'site-content.json');
});

document.getElementById('resetContentBtn').addEventListener('click', async () => {
  if (!confirm('Esto borra tus cambios locales de contenido y vuelve a la versión publicada. ¿Continuar?')) return;
  localStorage.removeItem('medifix_content');
  const res = await fetch('data/site-content.json');
  contentData = await res.json();
  renderContentForm();
  document.getElementById('contentStatus').textContent = 'Restablecido a la versión publicada.';
});

// ============================================================
// PRODUCTOS
// ============================================================
let productsData = null;

async function initProducts() {
  productsData = await loadData('products', 'data/products.json');
  renderCategoryCheckboxes();
  renderProductsTable();
}

function renderCategoryCheckboxes() {
  document.getElementById('categoryCheckboxes').innerHTML = productsData.categories.map(c => `
    <label class="check-label"><input type="checkbox" value="${c.id}"> ${c.label}</label>
  `).join('');
}

function renderProductsTable() {
  document.getElementById('productsTableBody').innerHTML = productsData.products.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.categories.map(id => (productsData.categories.find(c => c.id === id) || {}).label || id).join(', ')}</td>
      <td>${p.price || '—'}</td>
      <td>
        <button type="button" class="btn btn-small btn-outline-dark admin-edit-product" data-id="${p.id}">Editar</button>
        <button type="button" class="btn btn-small btn-danger admin-delete-product" data-id="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('productForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const categories = Array.from(form.querySelectorAll('#categoryCheckboxes input:checked')).map(i => i.value);

  if (!name || categories.length === 0) {
    alert('El nombre y al menos una especialidad son obligatorios.');
    return;
  }

  const id = form.dataset.editId || ('p' + Date.now());
  const productObj = {
    id, name, categories,
    price: form.price.value.trim(),
    desc: form.desc.value.trim(),
    img: form.img.value.trim()
  };

  const idx = productsData.products.findIndex(p => p.id === id);
  if (idx >= 0) productsData.products[idx] = productObj;
  else productsData.products.push(productObj);

  saveProductsDraft();
  renderProductsTable();
  form.reset();
  delete form.dataset.editId;
  document.getElementById('productFormTitle').textContent = 'Agregar producto';
});

document.getElementById('cancelProductEdit').addEventListener('click', () => {
  const form = document.getElementById('productForm');
  form.reset();
  delete form.dataset.editId;
  document.getElementById('productFormTitle').textContent = 'Agregar producto';
});

document.getElementById('productsTableBody').addEventListener('click', (e) => {
  const editBtn = e.target.closest('.admin-edit-product');
  const delBtn = e.target.closest('.admin-delete-product');

  if (editBtn) {
    const p = productsData.products.find(x => x.id === editBtn.dataset.id);
    const form = document.getElementById('productForm');
    form.name.value = p.name;
    form.price.value = p.price || '';
    form.desc.value = p.desc || '';
    form.img.value = p.img || '';
    form.querySelectorAll('#categoryCheckboxes input').forEach(i => { i.checked = p.categories.includes(i.value); });
    form.dataset.editId = p.id;
    document.getElementById('productFormTitle').textContent = 'Editar producto';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (delBtn) {
    if (!confirm('¿Eliminar este producto?')) return;
    productsData.products = productsData.products.filter(x => x.id !== delBtn.dataset.id);
    saveProductsDraft();
    renderProductsTable();
  }
});

function saveProductsDraft() {
  localStorage.setItem('medifix_products', JSON.stringify(productsData));
  document.getElementById('productsStatus').textContent = 'Cambios guardados en este navegador ✓ (aún no publicados para todos — descarga y sube el archivo para publicar)';
}

document.getElementById('downloadProductsBtn').addEventListener('click', () => {
  downloadJSON(productsData, 'products.json');
});

document.getElementById('resetProductsBtn').addEventListener('click', async () => {
  if (!confirm('Esto borra tus cambios locales de productos y vuelve a la versión publicada. ¿Continuar?')) return;
  localStorage.removeItem('medifix_products');
  const res = await fetch('data/products.json');
  productsData = await res.json();
  renderCategoryCheckboxes();
  renderProductsTable();
  document.getElementById('productsStatus').textContent = 'Restablecido a la versión publicada.';
});

// ============================================================
// CURSOS
// ============================================================
let coursesData = null;

async function initCourses() {
  coursesData = await loadData('courses', 'data/courses.json');
  renderCoursesTable();
}

function renderCoursesTable() {
  document.getElementById('coursesTableBody').innerHTML = coursesData.courses.map(c => `
    <tr>
      <td>${c.title}</td>
      <td>${c.day} ${c.month}</td>
      <td>${c.modality === 'presencial' ? 'Presencial' : 'En línea'}</td>
      <td>
        <button type="button" class="btn btn-small btn-outline-dark admin-edit-course" data-id="${c.id}">Editar</button>
        <button type="button" class="btn btn-small btn-danger admin-delete-course" data-id="${c.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('courseForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const title = form.title.value.trim();
  const day = form.day.value.trim();
  const month = form.month.value.trim();

  if (!title || !day || !month) {
    alert('Título, día y mes son obligatorios.');
    return;
  }

  const id = form.dataset.editId || ('c' + Date.now());
  const courseObj = { id, title, day, month, modality: form.modality.value, info: form.info.value.trim() };

  const idx = coursesData.courses.findIndex(c => c.id === id);
  if (idx >= 0) coursesData.courses[idx] = courseObj;
  else coursesData.courses.push(courseObj);

  saveCoursesDraft();
  renderCoursesTable();
  form.reset();
  delete form.dataset.editId;
  document.getElementById('courseFormTitle').textContent = 'Agregar curso';
});

document.getElementById('cancelCourseEdit').addEventListener('click', () => {
  const form = document.getElementById('courseForm');
  form.reset();
  delete form.dataset.editId;
  document.getElementById('courseFormTitle').textContent = 'Agregar curso';
});

document.getElementById('coursesTableBody').addEventListener('click', (e) => {
  const editBtn = e.target.closest('.admin-edit-course');
  const delBtn = e.target.closest('.admin-delete-course');

  if (editBtn) {
    const c = coursesData.courses.find(x => x.id === editBtn.dataset.id);
    const form = document.getElementById('courseForm');
    form.title.value = c.title;
    form.day.value = c.day;
    form.month.value = c.month;
    form.modality.value = c.modality;
    form.info.value = c.info || '';
    form.dataset.editId = c.id;
    document.getElementById('courseFormTitle').textContent = 'Editar curso';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (delBtn) {
    if (!confirm('¿Eliminar este curso?')) return;
    coursesData.courses = coursesData.courses.filter(x => x.id !== delBtn.dataset.id);
    saveCoursesDraft();
    renderCoursesTable();
  }
});

function saveCoursesDraft() {
  localStorage.setItem('medifix_courses', JSON.stringify(coursesData));
  document.getElementById('coursesStatus').textContent = 'Cambios guardados en este navegador ✓ (aún no publicados para todos — descarga y sube el archivo para publicar)';
}

document.getElementById('downloadCoursesBtn').addEventListener('click', () => {
  downloadJSON(coursesData, 'courses.json');
});

document.getElementById('resetCoursesBtn').addEventListener('click', async () => {
  if (!confirm('Esto borra tus cambios locales de cursos y vuelve a la versión publicada. ¿Continuar?')) return;
  localStorage.removeItem('medifix_courses');
  const res = await fetch('data/courses.json');
  coursesData = await res.json();
  renderCoursesTable();
  document.getElementById('coursesStatus').textContent = 'Restablecido a la versión publicada.';
});

// ============================================================
// ESPECIALISTAS (Telemedicina)
// ============================================================
let specialistsData = null;

async function initSpecialists() {
  specialistsData = await loadData('specialists', 'data/specialists.json');
  renderSpecialistSpecialtyOptions();
  renderSpecialistsTable();
}

function renderSpecialistSpecialtyOptions() {
  document.getElementById('specialistSpecialtySelect').innerHTML = specialistsData.specialties
    .map(s => `<option value="${s.id}">${s.label}</option>`).join('');
}

function renderSpecialistsTable() {
  document.getElementById('specialistsTableBody').innerHTML = specialistsData.specialists.map(d => `
    <tr>
      <td>${d.name}</td>
      <td>${(specialistsData.specialties.find(s => s.id === d.specialtyId) || {}).label || d.specialtyId}</td>
      <td>★ ${d.rating || '—'} (${d.reviewCount || 0})</td>
      <td>
        <button type="button" class="btn btn-small btn-outline-dark admin-edit-specialist" data-id="${d.id}">Editar</button>
        <button type="button" class="btn btn-small btn-danger admin-delete-specialist" data-id="${d.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('specialistForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  if (!name) { alert('El nombre es obligatorio.'); return; }

  const id = form.dataset.editId || ('s' + Date.now());
  const obj = {
    id, name,
    specialtyId: form.specialtyId.value,
    rating: form.rating.value.trim(),
    reviewCount: form.reviewCount.value.trim(),
    nextAvailable: form.nextAvailable.value.trim(),
    bio: form.bio.value.trim(),
    photo: form.photo.value.trim()
  };

  const idx = specialistsData.specialists.findIndex(d => d.id === id);
  if (idx >= 0) specialistsData.specialists[idx] = obj;
  else specialistsData.specialists.push(obj);

  saveSpecialistsDraft();
  renderSpecialistsTable();
  form.reset();
  delete form.dataset.editId;
  document.getElementById('specialistFormTitle').textContent = 'Agregar especialista';
});

document.getElementById('cancelSpecialistEdit').addEventListener('click', () => {
  const form = document.getElementById('specialistForm');
  form.reset();
  delete form.dataset.editId;
  document.getElementById('specialistFormTitle').textContent = 'Agregar especialista';
});

document.getElementById('specialistsTableBody').addEventListener('click', (e) => {
  const editBtn = e.target.closest('.admin-edit-specialist');
  const delBtn = e.target.closest('.admin-delete-specialist');

  if (editBtn) {
    const d = specialistsData.specialists.find(x => x.id === editBtn.dataset.id);
    const form = document.getElementById('specialistForm');
    form.name.value = d.name;
    form.specialtyId.value = d.specialtyId;
    form.rating.value = d.rating || '';
    form.reviewCount.value = d.reviewCount || '';
    form.nextAvailable.value = d.nextAvailable || '';
    form.bio.value = d.bio || '';
    form.photo.value = d.photo || '';
    form.dataset.editId = d.id;
    document.getElementById('specialistFormTitle').textContent = 'Editar especialista';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (delBtn) {
    if (!confirm('¿Eliminar este especialista?')) return;
    specialistsData.specialists = specialistsData.specialists.filter(x => x.id !== delBtn.dataset.id);
    saveSpecialistsDraft();
    renderSpecialistsTable();
  }
});

function saveSpecialistsDraft() {
  localStorage.setItem('medifix_specialists', JSON.stringify(specialistsData));
  document.getElementById('specialistsStatus').textContent = 'Cambios guardados en este navegador ✓ (aún no publicados para todos — descarga y sube el archivo para publicar)';
}

document.getElementById('downloadSpecialistsBtn').addEventListener('click', () => {
  downloadJSON(specialistsData, 'specialists.json');
});

document.getElementById('resetSpecialistsBtn').addEventListener('click', async () => {
  if (!confirm('Esto borra tus cambios locales de especialistas y vuelve a la versión publicada. ¿Continuar?')) return;
  localStorage.removeItem('medifix_specialists');
  const res = await fetch('data/specialists.json');
  specialistsData = await res.json();
  renderSpecialistSpecialtyOptions();
  renderSpecialistsTable();
  document.getElementById('specialistsStatus').textContent = 'Restablecido a la versión publicada.';
});

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
  initProducts();
  initCourses();
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

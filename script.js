// script.js - Versión CORREGIDA
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
});

function cargarProductos() {
    const container = document.getElementById('productos-container');
    
    if (!container) {
        console.error('No se encontró el contenedor de productos');
        return;
    }
    
    container.innerHTML = '<p style="text-align:center;">Cargando productos...</p>';
    
    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de productos');
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.categories) {
                throw new Error('Estructura de datos inválida');
            }
            renderProducts(data, container);
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = `
                <div style="text-align:center;padding:40px;background:#f8d7da;border-radius:8px;">
                    <p style="color:#721c24;">❌ Error al cargar los productos</p>
                    <p style="color:#721c24;font-size:14px;">${error.message}</p>
                    <button onclick="location.reload()" style="padding:10px 20px;background:#2c3e50;color:white;border:none;border-radius:5px;cursor:pointer;">
                        Intentar de nuevo
                    </button>
                </div>
            `;
        });
}

function renderProducts(data, container) {
    let html = '';
    
    data.categories.forEach(category => {
        if (!category.products || category.products.length === 0) {
            return;
        }
        
        html += `
            <div style="margin-bottom:40px;">
                <h2 style="color:#2c3e50;border-bottom:3px solid #3498db;padding-bottom:10px;">
                    ${category.name}
                </h2>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;padding:20px 0;">
        `;
        
        category.products.forEach(product => {
            const imagePath = product.image || 'placeholder.jpg';
            const price = product.price ? `$${product.price}` : 'Precio no disponible';
            
            html += `
                <div style="border:1px solid #ddd;border-radius:8px;overflow:hidden;background:white;transition:transform 0.3s;box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                    <div style="width:100%;height:200px;overflow:hidden;background:#f5f5f5;">
                        <img src="${imagePath}" 
                             alt="${product.name}" 
                             style="width:100%;height:100%;object-fit:cover;"
                             onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                    </div>
                    <div style="padding:15px;">
                        <h3 style="margin:0 0 10px 0;font-size:1.1rem;color:#333;">${product.name}</h3>
                        <p style="color:#666;font-size:0.9rem;margin:5px 0;">${product.description || ''}</p>
                        <p style="font-size:1.3rem;font-weight:bold;color:#2c3e50;margin:10px 0;">${price}</p>
                        ${product.stock ? `<p style="color:#666;font-size:0.8rem;">Stock: ${product.stock} unidades</p>` : ''}
                        <button onclick="agregarAlCarrito('${product.id}')" 
                                style="background:#2c3e50;color:white;border:none;padding:10px 15px;border-radius:5px;cursor:pointer;width:100%;">
                            🛒 Agregar al carrito
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html || '<p style="text-align:center;">No hay productos disponibles</p>';
}

function agregarAlCarrito(productId) {
    alert('Producto agregado al carrito (ID: ' + productId + ')');
}

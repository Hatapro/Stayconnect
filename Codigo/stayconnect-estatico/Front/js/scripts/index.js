import { getFeaturedProducts } from '@/services/productService.js';
import { getCurrentUser } from '@/services/authService.js';
import { initStayConnectMap } from '@/services/mapService.js';

document.addEventListener('DOMContentLoaded', () => initStayConnectMap('stay-map'))

const user = getCurrentUser();
if (!user) {
    window.location.href = 'login.html';
}

function renderUserNav() {
    const nav = document.getElementById("user-nav");
    if (!nav) return;
    if (user) {
        nav.href = "perfil.html";
        nav.innerHTML = `<i class="fas fa-user"></i> Perfil`;
    } else {
        nav.href = "login.html";
        nav.innerHTML = `<i class="fas fa-user"></i> Login`;
    }
}
renderUserNav();

async function cargarDestacados() {
    try {
        const destacados = await getFeaturedProducts(6);
        const cont = document.getElementById('destacados-grid');
        cont.innerHTML = destacados.map((prod) => `
            <article class="product-card">
            <h3>${prod.name}</h3>
            <p>${prod.description}</p>
            <a href="detalle_producto.html?id=${prod.id}" class="btn">Ver detalles</a>
            </article>
        `).join('');
    } catch (e) {
        console.error('Error cargando productos destacados:', e);
        alert('No se pudieron cargar los productos destacados');
    }
}

document.addEventListener('DOMContentLoaded', cargarDestacados);
import { getProductById } from '@/services/productService.js';
import { getVariantsOfProduct } from '@/services/variantService.js';
import { getCurrentUser } from '@/services/authService.js';
import { getReviewsByProduct, createReview, updateReview, deleteReview } from '@/services/reviewService.js';
import { initStayConnectMap } from '@/services/mapService.js';

document.addEventListener('DOMContentLoaded', () => initStayConnectMap('stay-map'))

const user = getCurrentUser();
if (!user) {
    window.location.href = 'login.html';
}

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

let product, variantes = [], reviewItems = [], editingReviewId = null;

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

function actualizarVista() {
    const idx = +document.getElementById('variant-select').value;
    const v = variantes[idx];
    document.getElementById('precio').textContent = `Precio: €${v.price.toFixed(2)}`;
    
    const img = document.getElementById('variant-image');
    if (v.image) {
        img.src = `http://127.0.0.1:8090/api/files/variants/${v.id}/${v.image}`;
    } else {
        img.src = 'https://via.placeholder.com/400?text=Sin+Imagen';
    }
    img.alt = `${product.name} - ${v.description}`;
    
    const btn = document.getElementById('addcarrito');
    btn.disabled = v.stock <= 0;
    btn.textContent = v.stock > 0 ? 'Añadir al carrito' : 'Agotado';
}


document.getElementById('addcarrito').addEventListener('click', ()=>{
    const idx = +document.getElementById('variant-select').value;
    const v = variantes[idx];

    if (v.stock<=0) return alert('Sin stock');

    let cart = JSON.parse(localStorage.getItem('carrito')||'[]');
    const pos = cart.findIndex(x=>x.variantId===v.id);

    if (pos>=0) cart[pos].cantidad = Math.min(v.stock, cart[pos].cantidad+1);
    else cart.push({ productId, name: product.name, variantId: v.id, variantDescription:v.description, price:v.price, cantidad:1, stock:v.stock });

    localStorage.setItem('carrito', JSON.stringify(cart));
    alert('Añadido al carrito');
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('review-form');
    form.addEventListener('submit', handleReviewSubmit);
    init();
});

async function loadReviews() {
    const list = document.getElementById('reviews-list');
    const avgContainer = document.getElementById('review-average');

    reviewItems = await getReviewsByProduct(productId);

    if (reviewItems.length === 0) {
        avgContainer.innerHTML = '';
        list.innerHTML = '<p>No hay reseñas aún.</p>';
        return;
    }

    const total = reviewItems.reduce((sum, r) => sum + r.score, 0);
    const avg = (total / reviewItems.length).toFixed(1);
    const fullStars = Math.floor(avg);
    const halfStar = avg - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    avgContainer.innerHTML = `
        <div class="average-header">
        <span class="average-score">${avg} / 5</span>
        <span class="average-stars">${'★'.repeat(fullStars)}${halfStar?'½':''}${'☆'.repeat(emptyStars)}</span>
        <span class="average-count">(${reviewItems.length} reseñas)</span>
        </div>
    `;

    list.innerHTML = reviewItems.map(r => {
        const userName = r.expand.user?.name || r.expand.user?.email || 'Anónimo';
        return `
        <div class="review-card" data-id="${r.id}">
            <div class="review-header">
            <span class="review-user">${userName}</span>
            <span class="review-score">${'★'.repeat(r.score)}${'☆'.repeat(5-r.score)}</span>
            </div>
            <p class="review-comment">${r.comment}</p>
            ${getCurrentUser()?.id === r.user ? `
            <button class="btn-small btn-edit">Editar</button>
            <button class="btn-small btn-delete">Eliminar</button>
            ` : ''}
        </div>
        `;
    }).join('');

    document.querySelectorAll('.btn-edit').forEach(btn =>
        btn.onclick = () => startEdit(btn.closest('.review-card').dataset.id)
    );
    document.querySelectorAll('.btn-delete').forEach(btn =>
        btn.onclick = () => handleDeleteReview(btn.closest('.review-card').dataset.id)
    );
}

async function handleReviewSubmit(e) {
    e.preventDefault();
    const scoreEl = document.getElementById('score');
    const commentEl = document.getElementById('comment');

    if (!scoreEl || !commentEl) {
        return console.error('Campos score/comment no encontrados');
    }
    const score = +scoreEl.value;
    const comment = commentEl.value.trim();
    if (!score || !comment) return alert('Completa ambos campos');

    const form = document.getElementById('review-form');
    try {
        if (editingReviewId) {
            await updateReview(editingReviewId, { score, comment });
            editingReviewId = null;
            form.querySelector('button[type="submit"]').textContent = 'Enviar';
        } else {
            await createReview({ product: productId, userId: getCurrentUser().id, score, comment });
        }
        form.reset();
        loadReviews();
    } catch (err) {
        console.error(err);
        alert('Error guardando reseña');
    }   
}

function startEdit(id) {
    const r = reviewItems.find(x => x.id === id);

    if (!r) return;

    editingReviewId = id;
    document.getElementById('score').value = r.score;
    document.getElementById('comment').value = r.comment;
    const btn = document.querySelector('#review-form button[type="submit"]');
    btn.textContent = 'Actualizar';
    document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' });
}

async function handleDeleteReview(id) {
    if (!confirm('¿Eliminar reseña?')) return;
    await deleteReview(id);
    loadReviews();
}

async function init() {
    renderUserNav();
    product = await getProductById(productId);
    variantes = await getVariantsOfProduct(productId);

    document.getElementById('detalle-prod').innerHTML = `
        <h1>${product.name}</h1>
        <p>${product.description}</p>
    `;

    const sel = document.getElementById('variant-select');
    sel.innerHTML = variantes.map((v,i)=>`
        <option value="${i}">${v.description} - €${v.price.toFixed(2)}</option>
    `).join('');
    sel.addEventListener('change', actualizarVista);
    actualizarVista();

    loadReviews();
}
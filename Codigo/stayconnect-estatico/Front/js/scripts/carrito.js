import { getCurrentUser } from '@/services/authService.js';
import { updateVariant } from '@/services/variantService.js';
import { createOrder } from '@/services/ordersService.js';
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

const stateLabels = {
    'In preparation': 'En preparación',
    'Sent': 'Enviado',
    'Delivered': 'Entregado'
};

function getCart() {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
}

function setCart(cart) {
    localStorage.setItem('carrito', JSON.stringify(cart));
}

function renderCart() {
    const container = document.getElementById('carrito-container');
    const totalBox = document.getElementById('carrito-total');
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h3>Tu carrito está vacío</h3>
            <p>Añade algunos productos para comenzar</p>
            </div>
        `;
        totalBox.innerHTML = '';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map((item, i) => {
    const itemTotal = (item.price || 0) * (item.cantidad || 1);
    total += itemTotal;
    
    return `
        <div class="cart-item">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-variant">Variante: ${item.variantDescription || 'Estándar'}</p>
                <p class="item-price">€${(item.price || 0).toFixed(2)} por unidad</p>
            </div>
            <div class="item-controls">
                <div class="quantity-control">
                    <label>Cantidad:</label>
                    <input type="number" min="1" max="99" data-idx="${i}" 
                        value="${item.cantidad || 1}" class="quantity-input" />
                </div>
                <div class="item-total">€${itemTotal.toFixed(2)}</div>
                <button class="btn-remove" onclick="removeFromCart(${i})" 
                        title="Eliminar del carrito">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    }).join('');
    
    totalBox.innerHTML = `<strong>Total: €${total.toFixed(2)}</strong>`;
}

window.removeFromCart = (idx) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        const cart = getCart();
        cart.splice(idx, 1);
        setCart(cart);
        renderCart();
    }
};

document.getElementById('vaciar-carrito').onclick = () => {
    if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
        localStorage.removeItem('carrito');
        renderCart();
    }
};

document.getElementById('realizar-pedido').onclick = async () => {
    if (!getCurrentUser()) {
        alert('Debes iniciar sesión para realizar el pedido');
        return window.location = 'login.html';
    }
    const cart = getCart();

    if (cart.length === 0) return alert('El carrito está vacío');

    for (let item of cart) {
        if (item.cantidad > item.stock) {
            return alert(`No hay suficiente stock de "${item.name}". Stock disponible: ${item.stock}`);
        }
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.cantidad, 0);

    try {
        const order = await createOrder({
            user: getCurrentUser().id,
            total: parseFloat(total.toFixed(2)),
            state: 'In preparation',
            items_json: JSON.stringify(cart)
        });

        for (let item of cart) {
            const nuevoStock = item.stock - item.cantidad;
            await updateVariant(item.variantId, { stock: nuevoStock });
        }

        localStorage.removeItem('carrito');
        alert(`Pedido realizado con éxito. Estado: ${stateLabels[order.state]}`);
        renderCart();
    } catch (err) {
        console.error(err);
        alert('Error realizando el pedido: ' + err.message);
    }
};

document.addEventListener('change', (e) => {
    if (e.target.matches('input[type=number][data-idx]')) {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        const cart = getCart();
        const newQuantity = Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1));
        cart[idx].cantidad = newQuantity;
        setCart(cart);
        renderCart();
    }
});

renderCart();
import { getCurrentUser, saveAuthModel, updateUser, deleteUser } from '@/services/authService.js';
import { getOrdersByUser } from '@/services/ordersService.js';
import { initStayConnectMap } from '@/services/mapService.js';

document.addEventListener('DOMContentLoaded', () => initStayConnectMap('stay-map'))

let user = getCurrentUser();
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

function loadUserData() {
    document.getElementById('name').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('street').value = user.street || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('profile-username').textContent = user.name || 'Mi Perfil';
}

document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updateData = Object.fromEntries(formData.entries());
    
    try {
        await updateUser(user.id, updateData);
        alert('Datos actualizados correctamente');

        const updatedUser = await getCurrentUser();
        // update local user reference and auth store (preserve token)
        user = updatedUser;
        saveAuthModel(undefined, updatedUser);

        document.getElementById('profile-username').textContent = updatedUser.name || 'Mi Perfil';
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        alert('Error al guardar los cambios. Inténtalo de nuevo.');
    }
});

function switchSection(activeSection) {
    document.querySelectorAll('.profile-nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.profile-section').forEach(section => section.classList.remove('active'));
    
    if (activeSection === 'profile-data') {
        document.getElementById('btn-profile-data').classList.add('active');
        document.getElementById('profile-data-section').classList.add('active');
    } else if (activeSection === 'order-history') {
        document.getElementById('btn-order-history').classList.add('active');
        document.getElementById('order-history-section').classList.add('active');
        loadOrderHistory();
    }
}

document.getElementById('btn-profile-data').addEventListener('click', () => {
    switchSection('profile-data');
});

document.getElementById('btn-order-history').addEventListener('click', () => {
    switchSection('order-history');
});

async function loadOrderHistory() {
    const container = document.getElementById('orders-container');
    container.innerHTML = '<div class="loading">Cargando pedidos...</div>';
    
    try {
        const orders = await getOrdersByUser(user.id, 1, 50);

        if (orders.items.length === 0) {
            container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-shopping-bag"></i>
                <p>Aún no has realizado ningún pedido</p>
            </div>
            `;
        } else {
            container.innerHTML = orders.items.map(order => `
            <div class="order-card">
                <div class="order-header">
                <h4>Pedido #${order.id.substring(0, 8)}</h4>
                <span class="order-date">${new Date(order.created).toLocaleDateString()}</span>
                </div>
                <div class="order-info">
                <p><strong>Total:</strong> ${order.total || '0.00'} €</p>
                <p><strong>Estado:</strong> <span class="order-status">${order.status || 'Pendiente'}</span></p>
                </div>
            </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error cargando pedidos:', error);
        container.innerHTML = `
            <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>No se pudieron cargar los pedidos</p>
            <button onclick="loadOrderHistory()" class="btn btn-secondary">Reintentar</button>
            </div>
        `;
    }
}

document.getElementById('logout').onclick = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        saveAuthModel(null, null);
        localStorage.removeItem('carrito');
        window.location = 'login.html';
    }
};

document.getElementById('delete-account').addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        try {
            await deleteUser(user.id);
            saveAuthModel(null, null);
            localStorage.removeItem('carrito');
            window.location.href = 'login.html';
        } catch (err) {
            console.error('Error eliminando cuenta:', err);
            alert('No se pudo eliminar la cuenta. Intenta nuevamente.');
        }
    }
});

loadUserData();
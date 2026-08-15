import { getCurrentUser, login } from '@/services/authService.js';
import { initStayConnectMap } from '@/services/mapService.js';

document.addEventListener('DOMContentLoaded', () => initStayConnectMap('stay-map'))

const user = getCurrentUser();
if (user) {
    window.location.href = 'index.html';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
        await login(form.correo.value, form.password.value);
        alert('¡Login exitoso!');
        window.location = 'index.html';
    } catch (err) {
        alert('Usuario o contraseña incorrectos');
    }
});
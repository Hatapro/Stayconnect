import { getCurrentUser, register } from '@/services/authService.js';
import { initStayConnectMap } from '@/services/mapService.js';

document.addEventListener('DOMContentLoaded', () => initStayConnectMap('stay-map'))

const user = getCurrentUser();
if (user) {
    window.location.href = 'index.html';
}

document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const f = e.target;

    try {
        await register({
            name: f.nombre.value,
            email: f.email.value,
            password: f.password.value,
            passwordConfirm: f.passwordConfirm.value,
        });
        alert('¡Usuario creado! Ahora puedes iniciar sesión.');
        window.location.href = 'login.html';
    } catch (err) {
        alert('No se pudo crear el usuario.');
    }
};
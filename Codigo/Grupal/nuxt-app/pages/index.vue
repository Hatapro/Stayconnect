<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card card">
        <div class="logo-section">
          <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1>Bienvenido</h1>
          <p>Ingresa tus credenciales</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label for="username">Usuario</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div class="input-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            Iniciar Sesión
          </button>
        </form>

        <div class="demo-credentials">
          <p>
            <small>
              Usuario de prueba: <strong>demo</strong><br>
              Contraseña: <strong>demo123</strong>
            </small>
          </p>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <Transition name="fade">
      <div v-if="toast.show" :class="['toast', `toast-${toast.type}`]">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
const router = useRouter()
const username = ref('')
const password = ref('')
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Middleware para redireccionar si ya está autenticado
onMounted(() => {
  if (process.client) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    if (isAuthenticated) {
      router.push('/tasks')
    }
  }
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const handleLogin = () => {
  if (username.value === 'demo' && password.value === 'demo123') {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('username', username.value)
    showToast('¡Inicio de sesión exitoso!', 'success')
    setTimeout(() => {
      router.push('/tasks')
    }, 500)
  } else {
    showToast('Usuario o contraseña incorrectos', 'danger')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.icon-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.logo-section h1 {
  font-size: 28px;
  margin-bottom: 8px;
  color: var(--dark-color);
}

.logo-section p {
  color: var(--medium-color);
  font-size: 14px;
}

.demo-credentials {
  margin-top: 30px;
  text-align: center;
  padding: 15px;
  background-color: var(--light-color);
  border-radius: 8px;
}

.demo-credentials small {
  color: var(--medium-color);
  line-height: 1.8;
}

.demo-credentials strong {
  color: var(--primary-color);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .login-container {
    padding: 10px;
  }

  .login-card {
    padding: 30px 20px;
  }
}
</style>

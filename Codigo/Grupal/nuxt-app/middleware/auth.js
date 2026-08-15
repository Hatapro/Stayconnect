export default defineNuxtRouteMiddleware((to, from) => {
  // Solo se ejecuta en el cliente
  if (process.client) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      return navigateTo('/')
    }
  }
})

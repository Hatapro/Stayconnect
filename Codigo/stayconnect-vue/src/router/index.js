import { createRouter, createWebHistory } from "vue-router";
import Home from '@/views/Home.vue';
import Productos from '@/views/Productos.vue';
import DetalleProducto from '@/views/DetalleProducto.vue';
import Carrito from '@/views/Carrito.vue';
import Login from '@/views/Login.vue';
import Registro from '@/views/Registro.vue';
import Perfil from '@/views/Perfil.vue';
import { getCurrentUser } from '@/services/authService';

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true }},
  { path: '/productos', component: Productos, meta: { requiresAuth: true }},
  { path: '/productos/:id', component: DetalleProducto, meta: { requiresAuth: true }},
  { path: '/carrito', component: Carrito, meta: { requiresAuth: true } },
  { path: '/login', component: Login, meta: { guestOnly: true } },
  { path: '/registro', component: Registro, meta: { guestOnly: true } },
  { path: '/perfil', component: Perfil, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = getCurrentUser();

  if (to.meta && to.meta.requiresAuth && !user) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  if (to.meta && to.meta.guestOnly && user) {
    return next({ path: '/' });
  }

  return next();
});

export default router;
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import { useAuthStore } from '@/stores/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/registro',
    component: () => import('@/views/Registro.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/tabs/Productos'
      },
      {
        path: 'Productos',
        component: () => import('@/views/Productos.vue')
      },
      {
        path: 'Productos/:id',
        component: () => import('@/views/DetalleProducto.vue')
      },
      {
        path: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'Perfil',
        component: () => import('@/views/Perfil.vue')
      },
      {
        path: 'Carrito',
        component: () => import('@/views/Carrito.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard para verificar autenticación
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isAuthenticated = !!auth.user;
  
  // Si la ruta requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  }
  // Si está autenticado e intenta ir a login/registro
  else if ((to.path === '/login' || to.path === '/registro') && isAuthenticated) {
    next('/tabs/Productos');
  }
  // En cualquier otro caso, continuar normalmente
  else {
    next();
  }
});

export default router

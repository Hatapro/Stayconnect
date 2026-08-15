<template>
  <TheHeader />
  <div>
    <main class="profile-container">
      <div class="profile-sidebar">
        <div class="profile-header">
          <i class="bi bi-person-circle profile-icon"></i>
          <h2 id="profile-username">{{ user?.name || 'Mi Perfil' }}</h2>
        </div>

        <nav class="profile-nav">
          <ul>
            <li>
              <button id="btn-profile-data" :class="['profile-nav-btn', { active: activeSection === 'data' }]" @click="selectSection('data')">
                <i class="bi bi-person"></i>
                Modificar Datos
              </button>
            </li>
            <li>
              <button id="btn-order-history" :class="['profile-nav-btn', { active: activeSection === 'orders' }]" @click="selectSection('orders')">
                <i class="bi bi-bag"></i>
                Historial de Pedidos
              </button>
            </li>
          </ul>
        </nav>

        <button class="btn-logout" id="logout" @click="onLogout">
          <i class="bi bi-box-arrow-right"></i>
          Cerrar sesión
        </button>
      </div>

      <div class="profile-content">
        <section id="profile-data-section" :class="['profile-section', { active: activeSection === 'data' }]">
          <header class="section-header">
            <h3><i class="bi bi-pencil"></i> Modificar Datos Personales</h3>
          </header>

          <form id="profile-form" class="profile-form" @submit.prevent="save">
            <div class="form-group">
              <label for="name">Nombre completo</label>
              <input type="text" id="name" name="name" v-model="form.name" required />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" v-model="form.email" required />
            </div>

            <div class="form-group">
              <label for="street">Dirección</label>
              <input type="text" id="street" name="street" v-model="form.street" placeholder="Calle, número, piso..." />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-save" style="margin-right: 5px;"></i>
                Guardar Cambios
              </button>
              <button type="button" id="delete-account" class="btn btn-danger" @click="del">
                <i class="bi bi-trash" style="margin-right: 5px;"></i>
                Eliminar Cuenta
              </button>
            </div>
          </form>
        </section>

        <section id="order-history-section" :class="['profile-section', { active: activeSection === 'orders' }]">
          <header class="section-header">
            <h3><i class="bi bi-bag"></i> Historial de Pedidos</h3>
          </header>

          <div id="orders-container" class="orders-container">
            <div v-if="loadingOrders" class="loading">Cargando pedidos...</div>
            <div v-else>
              <div v-if="orders.length === 0" class="no-orders">No hay pedidos aún.</div>
              <div v-else>
                <div v-for="order in orders" :key="order.id" class="order-card">
                  <div class="order-header">
                    <h4>Pedido #{{ order.id.substring(0,8) }}</h4>
                    <div class="order-date">{{ order.created }}</div>
                  </div>
                  <div class="order-info">
                    <p><strong>Total:</strong> {{ order.total }} €</p>
                    <p><strong>Estado:</strong>
                      <select v-model="order.state" @change="changeOrderState(order)" class="order-state-select" :disabled="order.state === 'Cancelled' || order.state === 'Delivered'">
                        <option v-for="(label, key) in stateLabels" :key="key" :value="key">{{ label }}</option>
                      </select>
                      <button v-if="order.state !== 'Cancelled' && order.state !== 'Delivered'" class="btn btn-danger" style="margin-left:10px;" @click="cancelOrder(order)">Cancelar</button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
  <TheFooter />
</template>

<script>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import TheHeader from '@/components/TheHeader.vue';
  import TheFooter from '@/components/TheFooter.vue';
  import { getOrdersByUser, updateOrder } from '@/services/ordersService';

  export default {
    components: { TheHeader, TheFooter },
    setup() {
      const stateLabels = {
        'In preparation': 'En preparación',
        'Sent': 'Enviado',
        'Delivered': 'Entregado',
        'Cancelled': 'Cancelado'
      };

      const auth = useAuthStore();
      const router = useRouter();
      const user = computed(() => auth.user || null);
      const activeSection = ref('data');
      const form = ref({ name: '', email: '', street: '' });
      const orders = ref([]);
      const loadingOrders = ref(false);

      const selectSection = (s) => {
        activeSection.value = s;

        if (s === 'orders') loadOrders();
      };

      onMounted(() => {
        const u = auth.user;

        if (u) {
          form.value = { name: u.name || '', email: u.email || '', street: u.street || '' };
        }
      });

      const save = async () => {
        if (!auth.user) return alert('No estás autenticado');

        try {
          await auth.updateUser(auth.user.id, { ...form.value });
          alert('Guardado');

        } catch (err) {
          console.error(err);
          alert('Error guardando los datos');
        }
      };

      const del = async () => {
        if (!auth.user) return;

        if (!confirm('¿Eliminar cuenta? Esta acción no se puede deshacer')) return;

        try {
          await auth.deleteUser(auth.user.id);
          await auth.logout();
          router.push('/');

        } catch (err) {
          console.error(err);
          alert('Error eliminando la cuenta');
        }
      };

      const onLogout = async () => {
        await auth.logout();
        router.push('/login');
      };

      const loadOrders = async () => {
        if (!auth.user) {
          orders.value = [];
          return;
        }
        loadingOrders.value = true;

        try {
          const res = await getOrdersByUser(auth.user.id, 1, 50);
          const items = res?.items || [];
          orders.value = items.map((r) => ({
            id: r.id,
            created: r.created ? new Date(r.created).toLocaleString() : '',
            total: r.total || 0,
            state: r.state || r.status || 'In preparation',
            raw: r,
          }));

        } catch (err) {
          console.error('Failed to load orders', err);
          orders.value = [];

        } finally {
          loadingOrders.value = false;
        }
      };

      const cancelOrder = async (order) => {
        if (!order) return;
        if (order.state === 'Cancelled') return;

        if (!confirm('¿Confirmar cancelación del pedido? Esta acción cambiará el estado a Cancelado.')) return;

        try {
          await updateOrder(order.id, { state: 'Cancelled', status: 'Cancelled' });
          await loadOrders();

        } catch (err) {
          console.error('Failed to cancel order', err);
          const msg = err?.message || 'Error cancelando el pedido';
          alert(msg);
          await loadOrders();
        }
      };

      const changeOrderState = async (order) => {
        const prevState = order.raw?.state || order.raw?.status || null;

        if (prevState === 'Delivered') {
          alert('El pedido ya fue entregado y no se puede modificar.');
          await loadOrders();
          return;
        }

        try {
          await updateOrder(order.id, { state: order.state });
          await loadOrders();

        } catch (err) {
          console.error('Failed to update order state', err);
          alert('Error actualizando el estado del pedido');
          await loadOrders();
        }
      };

      return {user, activeSection, selectSection, form, save, del, onLogout, orders, loadingOrders, changeOrderState, stateLabels, cancelOrder};
    },
  };
</script>
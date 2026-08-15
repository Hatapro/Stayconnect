
<template>
  <ion-page>
    <ion-content>
      <ion-grid class="profile-container">
        <ion-row>
          <ion-col size="12" size-md="4">
            <div class="profile-sidebar">
              <div class="profile-header">
                <i class="bi bi-person-circle profile-icon"></i>
                <h2 id="profile-username">{{ user?.name || 'Mi Perfil' }}</h2>
              </div>

              <nav class="profile-nav" style="display: flex; flex-direction: row; gap: 10px; margin-top: 20px; justify-content: center; flex-wrap: wrap;">
                <ion-button id="btn-profile-data" :class="['profile-nav-btn', { active: activeSection === 'data' }]" @click="selectSection('data')" :fill="activeSection === 'data' ? 'solid' : 'outline'" color="primary" size="small" style="flex: 1; min-width: 80px; font-size: 12px;">
                  <i class="bi bi-person" style="margin-right:4px"></i>
                  Modificar Datos
                </ion-button>
                <ion-button id="btn-order-history" :class="['profile-nav-btn', { active: activeSection === 'orders' }]" @click="selectSection('orders')" :fill="activeSection === 'orders' ? 'solid' : 'outline'" color="primary" size="small" style="flex: 1; min-width: 80px; font-size: 12px;">
                  <i class="bi bi-bag" style="margin-right:4px"></i>
                  Historial de Pedidos
                </ion-button>
                <ion-button id="logout" color="danger" @click="onLogout" size="small" style="flex: 1; min-width: 80px; font-size: 12px;">
                  <i class="bi bi-box-arrow-right" style="margin-right:4px"></i>
                  Cerrar sesión
                </ion-button>
              </nav>
            </div>
          </ion-col>

          <ion-col size="12" size-md="8">
            <div class="profile-content">
              <section id="profile-data-section" v-show="activeSection === 'data'" :class="['profile-section', { active: activeSection === 'data' }]">
                <header class="section-header">
                  <h3><i class="bi bi-pencil"></i> Modificar Datos Personales</h3>
                </header>

                <form id="profile-form" class="profile-form" @submit.prevent="save">
                  <ion-item>
                    <ion-label position="stacked">Nombre completo</ion-label>
                    <ion-input v-model="form.name" required></ion-input>
                  </ion-item>

                  <ion-item>
                    <ion-label position="stacked">Email</ion-label>
                    <ion-input type="email" v-model="form.email" required></ion-input>
                  </ion-item>

                  <ion-item>
                    <ion-label position="stacked">Dirección</ion-label>
                    <ion-input v-model="form.street" placeholder="Calle, número, piso..."></ion-input>
                  </ion-item>

                  <div class="form-actions" style="margin-top:16px">
                    <ion-button type="submit" color="primary">
                      <i class="bi bi-save" style="margin-right:8px"></i>
                      Guardar Cambios
                    </ion-button>
                    <ion-button color="danger" fill="outline" @click="del" style="margin-left:8px">
                      <i class="bi bi-trash" style="margin-right:8px"></i>
                      Eliminar Cuenta
                    </ion-button>
                  </div>
                </form>
              </section>

              <section id="order-history-section" v-show="activeSection === 'orders'" :class="['profile-section', { active: activeSection === 'orders' }]" style="margin-top:16px">
                <header class="section-header">
                  <h3><i class="bi bi-bag"></i> Historial de Pedidos</h3>
                </header>

                <div id="orders-container" class="orders-container">
                  <div v-if="loadingOrders" class="loading">Cargando pedidos...</div>
                  <div v-else>
                    <div v-if="orders.length === 0" class="no-orders">No hay pedidos aún.</div>
                    <div v-else>
                      <ion-card v-for="order in orders" :key="order.id" class="order-card">
                        <ion-card-header>
                          <div class="order-header">
                            <h4>Pedido #{{ order.id.substring(0,8) }}</h4>
                            <div class="order-date">{{ order.created }}</div>
                          </div>
                        </ion-card-header>
                        <ion-card-content>
                          <div class="order-info">
                            <p><strong>Total:</strong> {{ order.total }} €</p>
                            <p><strong>Estado:</strong>
                              <ion-select v-model="order.state" @ionChange="() => changeOrderState(order)" :disabled="order.state === 'Cancelled' || order.state === 'Delivered'" interface="popover">
                                <ion-select-option v-for="(label, key) in stateLabels" :key="key" :value="key" v-if="key !== 'Cancelled'">{{ label }}</ion-select-option>
                              </ion-select>
                            </p>
                          </div>
                        </ion-card-content>
                      </ion-card>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { getOrdersByUser, updateOrder } from '@/services/ordersService';
  import { subscribeToOrders, unsubscribeFromOrders } from '@/services/realtimeService';

  import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonList, IonCard, IonCardHeader, IonCardContent } from '@ionic/vue';

  export default {
    components: { IonPage, IonContent, IonGrid, IonRow, IonCol, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonList, IonCard, IonCardHeader, IonCardContent },
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

      // React to auth.user changes (e.g., after login) so profile shows current user
      watch(() => auth.user, (u) => {
        if (u) {
          form.value = { name: u.name || '', email: u.email || '', street: u.street || '' };
          if (activeSection.value === 'orders') loadOrders();
        } else {
          form.value = { name: '', email: '', street: '' };
          orders.value = [];
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

      // Suscribirse a notificaciones en tiempo real cuando el componente se monta
      onMounted(() => {
        if (auth.user) {
          // Suscribirse solo a los pedidos del usuario actual
          subscribeToOrders(auth.user.id, () => {
            // Recargar pedidos cuando hay cambios
            if (activeSection.value === 'orders') {
              loadOrders();
            }
          });
        }
      });

      // Desuscribirse cuando el componente se desmonta
      onUnmounted(() => {
        unsubscribeFromOrders();
      });

      const cancelOrder = async (order) => {
        if (!order) return;
        if (order.state === 'Cancelled') return;

        if (!confirm('¿Confirmar cancelación del pedido? Esta acción cambiará el estado a Cancelado.')) return;

        try {
          await updateOrder(order.id, { state: 'Cancelled', status: 'Cancelled' });
          alert('Pedido marcado como cancelado');
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
        const newState = order.state;

        if (prevState === 'Delivered') {
          alert('El pedido ya fue entregado y no se puede modificar.');
          await loadOrders();
          return;
        }

        // Confirmaciones explícitas para Delivered y Cancelled
        if (newState === 'Delivered') {
          if (!confirm('¿Confirmar marcar el pedido como entregado?')) {
            await loadOrders();
            return;
          }
        }

        if (newState === 'Cancelled') {
          if (!confirm('¿Confirmar cancelación del pedido?')) {
            await loadOrders();
            return;
          }
        }

        try {
          await updateOrder(order.id, { state: newState });
          if (newState === 'Delivered') alert('Pedido marcado como entregado');
          if (newState === 'Cancelled') alert('Pedido marcado como cancelado');
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

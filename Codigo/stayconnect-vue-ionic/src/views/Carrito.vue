<template>
  <ion-page>
    <ion-content>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tu Carrito</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="cart-container">
        <div v-if="items.length === 0" class="empty-cart ion-text-center ion-padding">
          <ion-icon name="cart-outline" size="large"></ion-icon>
          <h3>Tu carrito está vacío</h3>
          <p>Añade algunos productos para comenzar</p>
        </div>

        <ion-list v-else class="cart-items">
          <ion-item v-for="(item, idx) in items" :key="`${item.id}-${item.variantId || ''}`" lines="full">
            <ion-label>
              <h2>{{ item.name }}</h2>
              <p class="item-variant">Variante: {{ item.variantDescription || 'Estándar' }}</p>
              <p class="item-price">€{{ (item.price || 0).toFixed(2) }} por unidad</p>
            </ion-label>

            <div class="item-controls" slot="end">
              <div class="quantity-control">
                <ion-label class="qty-label">Cant.</ion-label>
                <ion-input
                  class="quantity-input"
                  type="number"
                  :value="item.quantity || 1"
                  min="1"
                  max="99"
                  @ionChange="onQuantityChange(idx, $event)"
                ></ion-input>
              </div>
              <div class="item-total">€{{ ((item.price||0) * (item.quantity||1)).toFixed(2) }}</div>
              <ion-button fill="clear" color="danger" @click="removeFromCart(idx)" title="Eliminar del carrito">
                <ion-icon :icon="trashOutline" style="margin-right: 5px;"></ion-icon>
              </ion-button>
            </div>
          </ion-item>
        </ion-list>

        <ion-card class="cart-summary">
          <ion-card-content>
            <div class="cart-total"><strong>Total: {{ total.toFixed(2) }} €</strong></div>
            <div class="cart-actions">
              <ion-button id="vaciar-carrito" color="medium" fill="outline" @click="vaciarCarrito" :disabled="clearing">
                <ion-icon :icon="trashOutline" slot="start"></ion-icon>
                <span v-if="!clearing">Vaciar carrito</span>
                <span v-else>Vaciando...</span>
              </ion-button>
              <ion-button id="realizar-pedido" color="primary" @click="realizarPedido" :disabled="clearing">
                <ion-icon :icon="cardOutline" slot="start"></ion-icon>
                Realizar pedido
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonCard, IonCardContent } from '@ionic/vue';
  import { getCurrentUser } from '@/services/authService';
  import { updateVariant } from '@/services/variantService';
  import { createOrder } from '@/services/ordersService';
  import { useCartStore } from '@/stores/cart';
  import { trashOutline, cardOutline } from 'ionicons/icons';

  const stateLabels = {
    'In preparation': 'En preparación',
    'Sent': 'Enviado',
    'Delivered': 'Entregado'
  };

  export default {
    components: {
      IonPage,
      IonContent,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonList,
      IonItem,
      IonLabel,
      IonInput,
      IonButton,
      IonIcon,
      IonCard,
      IonCardContent
    },
    setup() {
      const cart = useCartStore();
      const items = computed(() => cart.items);
      const total = computed(() => cart.total || 0);
      const clearing = ref(false);
      const _timers = [];

      function removeFromCart(idx) {
        cart.removeItem(idx);
      }

      function vaciarCarrito() {
        const len = cart.items.length || 0;

        if (!len) return;
        clearing.value = true;

        for (let j = 0; j < len; j++) {
          const idxToRemove = len - 1 - j;
          const t = setTimeout(() => {
            if (!cart.items.length) return;
            const safeIdx = Math.min(idxToRemove, cart.items.length - 1);
            cart.removeItem(safeIdx);
          }, j * 90);
          _timers.push(t);
        }

        const finishTimer = setTimeout(() => {
          clearing.value = false;
          _timers.length = 0;
        }, (len * 90) + 120);
        _timers.push(finishTimer);
      }

      onUnmounted(() => { _timers.forEach(t => clearTimeout(t)); _timers.length = 0; });

      function onQuantityChange(idx, ev) {
        const val = ev.detail?.value ?? ev.target?.value;
        const newQuantity = Math.max(1, Math.min(99, parseInt(val, 10) || 1));

        if (!cart.items[idx]) return;
        cart.items[idx].quantity = newQuantity;

        if (typeof cart._save === 'function') cart._save();
      }

      async function realizarPedido() {
        const user = getCurrentUser();

        if (!user) {
          alert('Debes iniciar sesión para realizar el pedido');
          return (window.location.href = '/login');
        }
        const cartItems = cart.items || [];

        if (cartItems.length === 0) return alert('El carrito está vacío');

        for (let item of cartItems) {

          if ((item.quantity || 0) > (item.stock || 0)) {
            return alert(`No hay suficiente stock de "${item.name}". Stock disponible: ${item.stock}`);
          }
        }

        const sumTotal = cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

        try {
          const order = await createOrder({
            user: user.id,
            total: parseFloat(sumTotal.toFixed(2)),
            state: 'In preparation',
            items_json: JSON.stringify(cartItems)
          });

          for (let item of cartItems) {
            const nuevoStock = (item.stock || 0) - (item.quantity || 0);

            try {
              await updateVariant(item.variantId, { stock: nuevoStock });

            } catch (e) {
              console.error('Error actualizando stock variante', item.variantId, e);
            }
          }

          cart.clear();
          const label = stateLabels[order.state] || order.state || 'In preparation';
          alert(`Pedido realizado con éxito. Estado: ${label}`);

        } catch (err) {
          console.error(err);
          alert('Error realizando el pedido: ' + (err.message || err));
        }
      }

      onMounted(() => {
        try { initStayConnectMap('stay-map'); } catch (e) { console.warn('map init failed', e); }
      });

      return { items, total, removeFromCart, vaciarCarrito, onQuantityChange, realizarPedido, trashOutline, cardOutline};
    }
  };
</script>

<style scoped>
.cart-container {
  padding: 1rem;
}

.cart-items {
  margin-bottom: 1rem;
}

.item-variant, .item-price {
  color: var(--ion-color-medium);
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.qty-label {
  font-size: 0.8rem;
}

.quantity-input {
  width: 64px;
}

.item-total {
  min-width: 90px;
  text-align: right;
}

.cart-summary .cart-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.empty-cart ion-icon {
  margin-bottom: 0.5rem;
}
</style>
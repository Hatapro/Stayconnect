<template>
  <TheHeader />
  <main class="cart-container">
    <div class="cart-content">
      <header class="cart-header">
        <h2><i class="bi bi-cart"></i> Tu Carrito</h2>
      </header>

      <div id="carrito-container">
        <div v-if="items.length === 0" class="empty-cart">
          <i class="bi bi-cart"></i>
          <h3>Tu carrito está vacío</h3>
          <p>Añade algunos productos para comenzar</p>
        </div>

        <transition-group name="cart-list" tag="div" class="cart-items" v-else>
          <div v-for="(item, idx) in items" :key="`${item.id}-${item.variantId || ''}`" class="cart-item">
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="item-variant">Variante: {{ item.variantDescription || 'Estándar' }}</p>
              <p class="item-price">€{{ (item.price || 0).toFixed(2) }} por unidad</p>
            </div>
            <div class="item-controls">
              <div class="quantity-control">
                <label>Cantidad:</label>
                <input type="number" min="1" max="99" :value="item.quantity || 1" @change="onQuantityChange(idx, $event)" class="quantity-input" />
              </div>
              <div class="item-total">€{{ ((item.price||0) * (item.quantity||1)).toFixed(2) }}</div>
              <button class="btn-remove" @click="removeFromCart(idx)" title="Eliminar del carrito">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="cart-summary">
        <div id="carrito-total" class="cart-total"><strong>Total: {{ total.toFixed(2) }} €</strong></div>
        <div class="cart-actions">
          <button id="vaciar-carrito" class="btn btn-secondary" @click="vaciarCarrito" :disabled="clearing">
            <i class="bi bi-trash" style="margin-right: 5px;"></i>
            <span v-if="!clearing">Vaciar carrito</span>
            <span v-else>Vaciando...</span>
          </button>
          <button id="realizar-pedido" class="btn btn-primary" @click="realizarPedido" :disabled="clearing">
            <i class="bi bi-credit-card" style="margin-right: 5px;"></i>
            Realizar pedido
          </button>
        </div>
      </div>
    </div>
  </main>
  <TheFooter />
</template>

<script>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import TheHeader from '@/components/TheHeader.vue';
  import TheFooter from '@/components/TheFooter.vue';
  import { getCurrentUser } from '@/services/authService';
  import { updateVariant } from '@/services/variantService';
  import { createOrder } from '@/services/ordersService';
  import { initStayConnectMap } from '@/services/mapService';
  import { useCartStore } from '@/stores/cart';

  const stateLabels = {
    'In preparation': 'En preparación',
    'Sent': 'Enviado',
    'Delivered': 'Entregado'
  };

  export default {
    components: { TheHeader, TheFooter },
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
        const newQuantity = Math.max(1, Math.min(99, parseInt(ev.target.value, 10) || 1));

        if (!cart.items[idx]) return;
        cart.items[idx].quantity = newQuantity;

        if (typeof cart._save === 'function') cart._save();
      }

      async function realizarPedido() {
        const user = getCurrentUser();

        if (!user) {
          alert('Debes iniciar sesión para realizar el pedido');

          return window.location.href = '/login';
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

      return { items, total, removeFromCart, vaciarCarrito, onQuantityChange, realizarPedido };
    }
  };
</script>
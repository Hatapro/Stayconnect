<template>
  <header class="header">
    <router-link to="/" class="header__logo">
      <img src="@/assets/SC.png" alt="StayConnect Logo"/>
    </router-link>
    <nav>
      <ul class="header__menu">
        <li class="header__menu-item"><router-link to="/"><i class="bi bi-house"></i> Inicio</router-link></li>
        <li class="header__menu-item"><router-link to="/productos"><i class="bi bi-box-seam"></i> Productos</router-link></li>
        <li class="header__menu-item">
          <router-link to="/carrito" class="cart-link">
            <span class="cart-icon" :class="{ pulse }">
              <i class="bi bi-cart"></i>
              <span class="cart-badge" v-if="count > 0">{{ count }}</span>
              <span class="fly-plus" v-if="showPlus">+1</span>
            </span>
            Carrito
          </router-link>
        </li>
        <li class="header__menu-item">
          <template v-if="user">
            <router-link to="/perfil"><i class="bi bi-person"></i> Perfil</router-link>
          </template>
          <template v-else>
            <router-link id="user-nav" to="/login"><i class="bi bi-person"></i> Login</router-link>
          </template>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import { useCartStore } from '@/stores/cart';

  export default {
    name: 'TheHeader',
    setup() {
      const auth = useAuthStore();
      const user = computed(() => auth.user);
      const cart = useCartStore();
      const count = computed(() => cart.count);
      const pulse = ref(false);
      const showPlus = ref(false);

      const onAdded = (ev) => {
        showPlus.value = true;
        pulse.value = true;
        setTimeout(() => { showPlus.value = false; }, 700);
        setTimeout(() => { pulse.value = false; }, 800);
      };

      onMounted(() => { window.addEventListener('cart:added', onAdded); });
      onUnmounted(() => { window.removeEventListener('cart:added', onAdded); });

      return { user, count, pulse, showPlus };
    }
  }
</script>
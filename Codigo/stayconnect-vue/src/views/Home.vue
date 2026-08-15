<template>
  <TheHeader />
  <div>
    <section class="banner">
      <h1 class="banner__title">¡Bienvenido a StayConnect!</h1>
      <p class="banner__subtitle">Los mejores productos al mejor precio</p>
    </section>

    <main>
      <section class="product-list" id="productos-destacados">
        <h2 class="product-list__title">Productos Nuevos</h2>
        <div class="product-list__grid" id="destacados-grid">
          <div v-for="p in featured" :key="p.id" class="product-card">
            <h4>{{ p.name }}</h4>
            <p>{{ p.description }}</p>
            <router-link :to="`/productos/${p.id}`" class="btn">Ver</router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
  <TheFooter />
</template>

<script>
  import { ref, onMounted } from 'vue';
  import { getFeaturedProducts } from '@/services/productService';
  import TheHeader from '@/components/TheHeader.vue';
  import TheFooter from '@/components/TheFooter.vue';

  export default {
    components: { TheHeader, TheFooter },
    setup() {
      const featured = ref([]);
      onMounted(async () => {
        try {
          featured.value = await getFeaturedProducts(6);

        } catch (e) {
          console.warn('no featured', e);
        }
      });

      return { featured };
    }
  }
</script>

 

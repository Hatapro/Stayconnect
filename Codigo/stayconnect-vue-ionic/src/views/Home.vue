<template>
  <ion-page>
    <ion-content>
      <!-- Banner -->
      <ion-card class="banner">
        <ion-card-content class="banner-content">
          <h1 class="banner-title">¡Bienvenido a StayConnect!</h1>
          <p class="banner-subtitle">Los mejores productos al mejor precio</p>
        </ion-card-content>
      </ion-card>

      <!-- Productos Destacados -->
      <div class="section">
        <h2 class="section-title">Agregados Recientemente</h2>
        
        <ion-grid v-if="featured.length > 0" class="products-grid">
          <ion-row>
            <ion-col size="12" sizeMd="6" sizeLg="4" v-for="p in featured" :key="p.id">
              <ion-card class="product-card">
                <ion-card-header>
                  <ion-card-title>{{ p.name }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <p>{{ p.description }}</p>
                  <p v-if="p.expand?.subcategory" class="product-meta">
                    <small>{{ p.expand.subcategory.name }}</small>
                  </p>
                </ion-card-content>
                <ion-button expand="block" color="primary" :router-link="`/tabs/Productos/${p.id}`">
                  Ver
                </ion-button>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>

        <div v-else class="ion-text-center ion-padding">
          <ion-text>
            <p>Cargando productos...</p>
          </ion-text>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonGrid, IonRow, IonCol, IonText } from '@ionic/vue';
import { getFeaturedProducts } from '@/services/productService';

const featured = ref<any[]>([]);

onMounted(async () => {
  try {
    featured.value = await getFeaturedProducts(6);
  } catch (e) {
    console.warn('Error loading featured products', e);
  }
});
</script>

<style scoped>
.banner {
  margin: 1rem;
  background: linear-gradient(135deg, var(--ion-color-primary), var(--ion-color-secondary));
  color: white;
}

.banner-content {
  text-align: center;
  padding: 2rem 1rem;
}

.banner-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: bold;
}

.banner-subtitle {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.section {
  padding: 1rem;
}

.section-title {
  margin: 1.5rem 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.product-card {
  margin-bottom: 1rem;
}

.product-meta {
  color: var(--ion-color-medium);
  margin: 0.5rem 0 0 0;
}

.products-grid {
  padding-bottom: 1rem;
}
</style>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button v-if="showBack" default-href="/tabs/Productos"></ion-back-button>
          <img src="/SC512.png" alt="Logo" class="header-logo" />
        </ion-buttons>
        <ion-title>StayConnect</ion-title>
        <ion-buttons slot="end">
          <ion-button href="/tabs/Carrito">
            <ion-icon :icon="bag" style="width: 25px; height: 25px;"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="Productos" href="/tabs/Productos">
            <ion-icon aria-hidden="true" :icon="shirt"></ion-icon>
            <ion-label>Productos</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="Home" href="/tabs/Home">
            <ion-icon aria-hidden="true" :icon="home" />
            <ion-label>Home</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="Perfil" href="/tabs/Perfil">
            <ion-icon aria-hidden="true" :icon="personSharp" />
            <ion-label>Perfil</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonBackButton, IonButton } from '@ionic/vue';
import { home, personSharp, shirt, bag } from 'ionicons/icons';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Show back button on specific routes (e.g., Detalle de producto)
const showBack = computed(() => {
  const p = route.path.toLowerCase();
  // matches /tabs/productos/:id and child paths
  return /^\/tabs\/productos\//.test(p);
});
</script>

<style scoped>
.header-logo {
  width: 50px;
  height: 50px;
  margin-left: 8px;
  object-fit: contain;
  border-radius: 30%;
}
</style>

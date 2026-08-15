<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-container">
        <div class="logo-section">
          <ion-icon :icon="personCircle" color="primary" style="font-size: 100px;"></ion-icon>
          <h1>Bienvenido</h1>
          <p>Ingresa tus credenciales</p>
        </div>

        <form @submit.prevent="handleLogin">
          <ion-input
            label="Usuario"
            label-placement="floating"
            :legacy="false"
            v-model="username"
            type="text"
            placeholder="Ingresa tu usuario"
            aria-label="Usuario"
            required
          ></ion-input>

          <ion-input
            label="Contraseña"
            label-placement="floating"
            :legacy="false"
            v-model="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            aria-label="Contraseña"
            required
          ></ion-input>

          <ion-button
            expand="block"
            type="submit"
            class="ion-margin-top"
          >
            Iniciar Sesión
          </ion-button>
        </form>

        <ion-text color="medium" class="ion-text-center ion-margin-top">
          <p>
            <small>
              Usuario de prueba: <strong>demo</strong><br>
              Contraseña: <strong>demo123</strong>
            </small>
          </p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  toastController
} from '@ionic/vue'
import { personCircle } from 'ionicons/icons'

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  // Validación simple (en producción esto sería con un backend real)
  if (username.value === 'demo' && password.value === 'demo123') {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('username', username.value)
    
    const toast = await toastController.create({
      message: '¡Inicio de sesión exitoso!',
      duration: 2000,
      color: 'success',
      position: 'top'
    })
    await toast.present()
    
    router.push('/tasks')
  } else {
    const toast = await toastController.create({
      message: 'Usuario o contraseña incorrectos',
      duration: 2000,
      color: 'danger',
      position: 'top'
    })
    await toast.present()
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding-top: 50px;
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-section h1 {
  margin-top: 20px;
  margin-bottom: 10px;
}

.logo-section p {
  color: var(--ion-color-medium);
}

ion-item {
  margin-bottom: 15px;
}
</style>

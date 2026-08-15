<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Iniciar sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card class="auth-card">
        <ion-card-content>
          <form @submit.prevent="submit">
            <ion-item>
              <ion-label position="stacked">Correo electrónico</ion-label>
              <ion-input 
                v-model="email" 
                type="email" 
                placeholder="ejemplo@correo.com"
                required
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Contraseña</ion-label>
              <ion-input 
                v-model="password" 
                type="password" 
                placeholder="********"
                required
              ></ion-input>
            </ion-item>

            <div v-if="error" class="error-message">
              <ion-text color="danger">
                <p>{{ error }}</p>
              </ion-text>
            </div>

            <ion-button 
              expand="block" 
              type="submit"
              class="ion-margin-top"
            >
              Entrar
            </ion-button>
          </form>

          <div class="auth-link ion-text-center ion-margin-top">
            <p>¿No tienes cuenta? <router-link to="/registro">Regístrate aquí</router-link></p>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonText } from '@ionic/vue';
  import { useAuthStore } from '@/stores/auth';

  export default {
    components: {
      IonPage,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonCard,
      IonCardContent,
      IonItem,
      IonLabel,
      IonInput,
      IonButton,
      IonText
    },
    setup() {
      const email = ref('');
      const password = ref('');
      const error = ref('');
      const auth = useAuthStore();
      const router = useRouter();

      // Ensure fields are empty when component mounts (and after logout)
      onMounted(() => {
        email.value = '';
        password.value = '';
        error.value = '';
      });

      watch(() => auth.user, (u) => {
        if (!u) {
          email.value = '';
          password.value = '';
          error.value = '';
        }
      });

      const submit = async () => {
        error.value = '';

        if (!email.value || email.value.trim() === '') {
          error.value = 'Introduce tu correo';
          return;
        }
        
        if (!password.value || password.value.trim() === '') {
          error.value = 'Introduce tu contraseña';
          return;
        }

        try {
          await auth.login(email.value, password.value);
          router.push('/tabs/Productos');
        } catch (e) { 
          error.value = 'Credenciales incorrectas';
        }
      }

      return { email, password, submit, error };
    }
  }
</script>

<style scoped>
.auth-card {
  margin: 2rem 1rem;
  border-radius: 12px;
}

.error-message {
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(255, 67, 54, 0.1);
  margin: 1rem 0;
}

.auth-link {
  margin-top: 1.5rem;
}

.auth-link a {
  color: var(--ion-color-primary);
  text-decoration: none;
  font-weight: 600;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>

 


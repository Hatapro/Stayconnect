<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Crear cuenta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card class="auth-card">
        <ion-card-content>
          <form @submit.prevent="onSubmit">
            <ion-item>
              <ion-label position="stacked">Nombre</ion-label>
              <ion-input 
                v-model="name" 
                type="text" 
                placeholder="Tu nombre"
                required
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Correo electrónico</ion-label>
              <ion-input 
                v-model="email" 
                type="email" 
                placeholder="ejemplo@dominio.com"
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

            <ion-item>
              <ion-label position="stacked">Repetir contraseña</ion-label>
              <ion-input 
                v-model="passwordConfirm" 
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
              Crear cuenta
            </ion-button>
          </form>

          <div class="auth-link ion-text-center ion-margin-top">
            <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
  import { ref } from 'vue';
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
      const name = ref('');
      const email = ref('');
      const password = ref('');
      const passwordConfirm = ref('');
      const error = ref('');
      const auth = useAuthStore();
      const router = useRouter();
      
      const onSubmit = async () => {
        error.value = '';

        if (!name.value || name.value.trim() === '') {
          error.value = 'Introduce tu nombre';
          return;
        }

        if (!email.value || email.value.trim() === '') {
          error.value = 'Introduce tu correo';
          return;
        }

        if ((password.value || '').length < 4) {
          error.value = 'La contraseña debe tener al menos 4 caracteres';
          return;
        }

        if (password.value !== passwordConfirm.value) {
          error.value = 'Las contraseñas no coinciden';
          return;
        }

        try {
          await auth.register({ name: name.value, email: email.value, password: password.value, passwordConfirm: passwordConfirm.value });
          router.push('/login');
        } catch(e) {
          error.value = 'Error al registrar';
        }
      }

      return { name, email, password, passwordConfirm, error, onSubmit };
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

 

<template>
  <div>
    <main>
      <form @submit.prevent="onSubmit" :class="['form-container', { shake }]" aria-live="polite">
        <h1>Iniciar sesión</h1>
        <div class="form-group">
          <label for="correo">Correo electrónico</label>
          <input v-model="email" type="email" id="correo" name="correo" placeholder="ejemplo@correo.com" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input v-model="password" type="password" id="password" name="password" placeholder="********" required />
        </div>
        <button type="submit" class="btn">Entrar</button>
        <p class="form-error" v-if="error">{{ error }}</p>
        <div class="form-link-alt">¿No tienes cuenta? <router-link to="/registro" class="alt-link">Regístrate aquí</router-link></div>
      </form>
    </main>
  </div>
  <TheFooter />
</template>

<script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import TheFooter from '@/components/TheFooter.vue';

  export default {
    components: {TheFooter },
    setup() {
      const email = ref('');
      const password = ref('');
      const shake = ref(false);
      const error = ref('');
      const auth = useAuthStore();
      const router = useRouter();

      const triggerShake = (msg = 'Credenciales incorrectas') => {
        error.value = msg;
        shake.value = true;
        setTimeout(() => { shake.value = false; }, 650);
      }

      const submit = async () => {
        if (!email.value || email.value.trim() === '') {
          triggerShake('Introduce tu correo');
          return;
        }
        
        if (!password.value || password.value.trim() === '') {
          triggerShake('Introduce tu contraseña');
          return;
        }

        try {
          await auth.login(email.value, password.value);
          router.push('/');

        } catch (e) { triggerShake(); }
      }

      return { email, password, onSubmit: submit, shake, error };
    }
  }
</script>

 


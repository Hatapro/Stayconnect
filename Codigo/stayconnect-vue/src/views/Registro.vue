<template>
  <div>
    <main>
      <form @submit.prevent="onSubmit" class="form-container">
        <h1>Crear cuenta</h1>
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input v-model="name" id="nombre" name="nombre" placeholder="ejemplo" required />
        </div>
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input v-model="email" id="email" type="email" name="email" placeholder="ejemplo@dominio.com" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input v-model="password" id="password" type="password" name="password" placeholder="********" required />
        </div>
        <div class="form-group">
          <label for="passwordConfirm">Repetir contraseña</label>
          <input v-model="passwordConfirm" id="passwordConfirm" type="password" name="passwordConfirm" placeholder="********" required />
        </div>
        <button class="btn" type="submit">Crear cuenta</button>
          <p class="form-error" v-if="error">{{ error }}</p>
        <div class="form-link-alt">¿Ya tienes cuenta? <router-link to="/login" class="alt-link">Inicia sesión aquí</router-link></div>
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
    components: { TheFooter },
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

 

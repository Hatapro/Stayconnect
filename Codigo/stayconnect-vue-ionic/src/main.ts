import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

// Registrar Service Worker con vite-plugin-pwa (autoUpdate)
// Esto evita doble registro y usa la estrategia del plugin
import { registerSW } from 'virtual:pwa-register';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';


const app = createApp(App)
  .use(createPinia())
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});

registerSW({ immediate: true, onRegistered(swReg) {
  console.log('✅ Service Worker registrado (vite-plugin-pwa):', swReg);
}, onRegisterError(error) {
  console.error('❌ Error registrando Service Worker:', error);
} });
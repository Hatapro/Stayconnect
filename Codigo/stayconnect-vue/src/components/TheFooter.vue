<template>
  <footer class="footer footer--with-map">
    <div class="footer--map-area">
      <div id="stay-map" style="height:100%; width:100%; border-radius:8px; overflow:hidden;"></div>
    </div>
    <div class="footer--info">
      <h4>StayConnect</h4>
      <p class="footer__text">© 2025 StayConnect</p>
      <div class="footer--contact">
        <div><span class="label">Dirección:</span> C. Alcalá, 50, 28014 Madrid</div><br>
        <div><span class="label">Teléfono:</span> +34 912 345 678</div>
      </div>
      <div class="footer--socials">
        <a href="#" aria-label="facebook"><i class="bi bi-facebook"></i></a>
        <a href="#" aria-label="twitter"><i class="bi bi-twitter"></i></a>
        <a href="#" aria-label="instagram"><i class="bi bi-instagram"></i></a>
      </div>
    </div>
  </footer>
</template>

<script>
  import { onMounted } from 'vue';
  import { initStayConnectMap } from '../services/mapService';

  export default {
    name: 'TheFooter',
    setup() {
      onMounted(() => {
        try { initStayConnectMap('stay-map'); } catch (e) { console.warn('map init failed', e); }
      });
    }
  }
</script>
<template>
  <TheHeader />
  <div>
    <main class="product-detail-container">
      <div class="product-detail-main">
        <div class="detail-image">
          <img :src="image" alt="Imagen de variante" />
        </div>
        <div class="detail-info">
          <section id="detalle-prod">
            <h2>{{ product?.name }}</h2>
            <p>{{ product?.description }}</p>
          </section>
          <div class="variant-selector">
            <label><strong style="margin-right: 5px;">Elegir Variante: </strong></label>
            <select v-model="selectedVariantIndex">
              <option v-for="(v, i) in variants" :value="i" :key="v.id">{{ v.description || v.name }} - €{{ formatPrice(v.price) }}</option>
            </select>
          </div>
          <p id="precio">Precio: {{ formatPrice(price) }} €</p>
          <button aria-disabled="false" :aria-disabled="addDisabled" @click="addToCart" class="btn btn-primary">{{ addLabel }}</button>
        </div>
      </div>

      <section class="reviews-section">
        <h3>Opiniones de los usuarios</h3>
        <div id="review-average" class="review-average" v-if="reviews.length">
          <div class="average-header">
            <span class="average-score" style="margin-right: 5px;">{{ averageScore.toFixed(1) }} / 5</span>
            <span class="average-stars" style="margin-right: 5px;">{{ starsString }}</span>
            <span class="average-count">({{ reviews.length }} reseñas)</span>
          </div>
        </div>
        <div id="reviews-list">
          <div v-if="reviews.length === 0">No hay reseñas aún.</div>
          <div v-else>
            <div v-for="r in reviews" :key="r.id" class="review-card">
              <div class="review-header">
                <span class="review-user">{{ r.expand?.user?.name || r.expand?.user?.email || 'Anónimo' }}</span>
                <span class="review-rating">{{ '★'.repeat(r.score) }}{{ '☆'.repeat(5-r.score) }}</span>
              </div>
              <p class="review-comment">{{ r.comment }}</p>
              <div v-if="isAuthor(r)">
                <button class="btn-small" @click="startEdit(r.id)">Editar</button>
                <button class="btn-small" @click="handleDeleteReview(r.id)">Eliminar</button>
              </div>
            </div>
          </div>
        </div>

        <form id="review-form" class="review-form" @submit.prevent="handleReviewSubmit">
          <h4>Deja tu reseña</h4>
          <label for="score">Puntuación</label>
          <select id="score" v-model.number="reviewForm.score">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <label for="comment">Comentario</label>
          <textarea id="comment" v-model="reviewForm.comment" required></textarea>
          <button type="submit" class="btn btn-primary">{{ editingReviewId ? 'Actualizar' : 'Enviar' }}</button>
        </form>
      </section>
    </main>
  </div>
  <TheFooter />
</template>

<script>
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { getProductById } from '@/services/productService';
  import { getVariantsOfProduct } from '@/services/variantService';
  import { getReviewsByProduct, createReview, updateReview, deleteReview } from '@/services/reviewService';
  import { useCartStore } from '@/stores/cart';
  import { useAuthStore } from '@/stores/auth';
  import TheHeader from '@/components/TheHeader.vue';
  import TheFooter from '@/components/TheFooter.vue';

  export default {
    components: { TheHeader, TheFooter },
    setup() {
      const route = useRoute();
      const product = ref(null);
      const variants = ref([]);
      const selectedVariantIndex = ref(0);
      const image = ref('/img/SC.png');
      const price = ref(0);
      const cart = useCartStore();
      const reviews = ref([]);
      const editingReviewId = ref(null);
      const reviewForm = ref({ score: 5, comment: '' });
      const auth = useAuthStore();
      const user = computed(() => auth.user);

      const load = async () => {
        const id = route.params.id;
        const r = await getProductById(id);
        product.value = r;

        try {
          const vars = await getVariantsOfProduct(id);
          variants.value = vars;
          
        } catch (err) {
          variants.value = r?.variants || [];
        }

        if (variants.value.length) {
          selectedVariantIndex.value = 0;
          const v = variants.value[0];
          image.value = v.image ? (`http://127.0.0.1:8090/api/files/variants/${v.id}/${v.image}`) : image.value;
          price.value = v.price || r?.price || 0;
        }
        await loadReviews();
      }

      watch(selectedVariantIndex, (idx) => {
        const v = variants.value[idx];

        if (!v) return;
        image.value = v.image ? (`http://127.0.0.1:8090/api/files/variants/${v.id}/${v.image}`) : image.value;
        price.value = v.price || product.value.price || 0;
      });

      const selectedVariant = computed(() => variants.value[selectedVariantIndex.value] || {});

      const addDisabled = computed(() => {
        const v = selectedVariant.value || {};
        const stock = v.stock || 0;

        if (stock <= 0) return true;
        const existing = cart.items.find(i => i.id === product.value.id && i.variantId === v.id);

        if (existing && (existing.quantity || 0) >= stock) return true;

        return false;
      });

      const addLabel = computed(() => {
        const v = selectedVariant.value || {};

        if ((v.stock || 0) <= 0) return 'Sin stock';
        const existing = cart.items.find(i => i.id === product.value.id && i.variantId === v.id);

        if (existing && (existing.quantity || 0) >= (v.stock || 0)) return 'Sin stock';

        return 'Añadir al carrito';
      });

      const addToCart = () => {
        const v = variants.value[selectedVariantIndex.value] || {};
        const variantId = v.id || null;

        if ((v.stock || 0) <= 0) return;

        if (addDisabled.value) return;

        const existing = cart.items.find(i => i.id === product.value.id && i.variantId === variantId);

        if (existing && (existing.quantity || 0) >= (v.stock || 0)) return;
        cart.addItem({
          id: product.value.id,
          name: product.value.name,
          variantId,
          price: v.price || product.value.price || 0,
          quantity: 1,
          stock: v.stock || 0,
          variantDescription: v.description || v.name || ''
        });
      }

      const loadReviews = async () => {
        try {
          const list = await getReviewsByProduct(route.params.id);
          reviews.value = list;

        } catch (err) {
          console.error('Error loading reviews', err);
          reviews.value = [];
        }
      }

      const handleReviewSubmit = async () => {
        const score = reviewForm.value.score;
        const comment = reviewForm.value.comment.trim();

        if (!score || !comment) return alert('Completa ambos campos');

        try {

          if (editingReviewId.value) {
            await updateReview(editingReviewId.value, { score, comment });
            editingReviewId.value = null;

          } else {
            const authUser = auth.user;

            if (!authUser) return alert('Debes iniciar sesión para dejar una reseña');
            await createReview({ product: route.params.id, userId: authUser.id, score, comment });
          }
          reviewForm.value.comment = '';
          reviewForm.value.score = 5;
          await loadReviews();

        } catch (err) {
          console.error(err);
          alert('Error guardando reseña');
        }
      }

      const startEdit = (id) => {
        const r = reviews.value.find(x => x.id === id);

        if (!r) return;

        if (!isAuthor(r)) return alert('Solo el autor puede editar su reseña');
        editingReviewId.value = id;
        reviewForm.value.score = r.score;
        reviewForm.value.comment = r.comment;
      }

      const handleDeleteReview = async (id) => {
        const r = reviews.value.find(x => x.id === id);

        if (!r) return alert('Reseña no encontrada');

        if (!isAuthor(r)) return alert('Solo el autor puede eliminar su reseña');

        try {
          await deleteReview(id);
          await loadReviews();

        } catch (err) {
          console.error(err);
          alert('Error eliminando reseña');
        }
      }

      const getReviewUserId = (r) => {
        if (!r) return null;

        if (r.user && typeof r.user === 'object' && r.user.id) return r.user.id;

        if (r.user && typeof r.user === 'string') return r.user;

        if (r.expand && r.expand.user && r.expand.user.id) return r.expand.user.id;

        return null;
      }

      const isAuthor = (r) => {
        const current = user.value;

        if (!current) return false;
        const reviewUserId = getReviewUserId(r);

        return !!reviewUserId && String(current.id) === String(reviewUserId);
      }

      onMounted(load);

      const averageScore = computed(() => {
        if (!reviews.value.length) return 0;

        return reviews.value.reduce((s, r) => s + r.score, 0) / reviews.value.length;
      });

      const starsString = computed(() => {
        const avg = Math.round(averageScore.value);
        
        return '★'.repeat(avg) + '☆'.repeat(5-avg);
      });

      const formatPrice = (v) => (typeof v === 'number' ? v.toFixed(2) : v);

      return { product, variants, selectedVariantIndex, image, price, addToCart, reviews, reviewForm, handleReviewSubmit, startEdit, handleDeleteReview, averageScore, starsString, formatPrice, isAuthor, editingReviewId, addDisabled, addLabel };
    }
  }
</script>

 

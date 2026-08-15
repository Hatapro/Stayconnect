<template>
  <ion-page>

    <ion-content>
      <div class="product-detail-container">
        <!-- Imagen del producto -->
        <div class="detail-image">
          <img :src="image" alt="Imagen de variante" />
        </div>

        <!-- Información del producto -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ product?.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ product?.description }}</p>

            <!-- Selector de variantes -->
            <div class="variant-selector">
              <ion-label><strong>Elegir Variante:</strong></ion-label>
              <ion-select v-model="selectedVariantIndex" :compare-with="compareVariants" interface="popover">
                <ion-select-option v-for="(v, i) in variants" :value="i" :key="v.id">
                  {{ v.description || v.name }} - €{{ formatPrice(v.price) }}
                </ion-select-option>
              </ion-select>
            </div>

            <!-- Precio -->
            <div class="price-section">
              <ion-text>
                <h3>Precio: {{ formatPrice(price) }} €</h3>
              </ion-text>
            </div>

            <!-- Botón añadir al carrito -->
            <ion-button 
              expand="block" 
              :disabled="addDisabled" 
              @click="addToCart"
              :color="addDisabled ? 'medium' : 'primary'"
            >
              {{ addLabel }}
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- Sección de reseñas -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Opiniones de los usuarios</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <!-- Puntuación promedio -->
            <div v-if="reviews.length" class="review-average">
              <ion-text>
                <h4>{{ averageScore.toFixed(1) }} / 5</h4>
                <p>{{ starsString }} ({{ reviews.length }} reseñas)</p>
              </ion-text>
            </div>

            <!-- Lista de reseñas -->
            <ion-list v-if="reviews.length">
              <ion-item v-for="r in reviews" :key="r.id">
                <ion-card-content class="review-card">
                  <div class="review-header">
                    <ion-text>
                      <p><strong>{{ r.expand?.user?.name || r.expand?.user?.email || 'Anónimo' }}</strong></p>
                    </ion-text>
                    <span class="review-rating">{{ '★'.repeat(r.score) }}{{ '☆'.repeat(5-r.score) }}</span>
                  </div>
                  <p class="review-comment">{{ r.comment }}</p>
                  <div v-if="isAuthor(r)" class="review-actions">
                    <ion-button size="small" fill="outline" @click="startEdit(r.id)">
                      <ion-icon :icon="createOutline" style="margin-right: 5px;"></ion-icon>
                      Editar
                    </ion-button>
                    <ion-button size="small" fill="outline" color="danger" @click="handleDeleteReview(r.id)">
                      <ion-icon :icon="trashOutline" style="margin-right: 5px;"></ion-icon>
                      Eliminar
                    </ion-button>
                  </div>
                </ion-card-content>
              </ion-item>
            </ion-list>
            <ion-text v-else>
              <p>No hay reseñas aún.</p>
            </ion-text>
          </ion-card-content>
        </ion-card>

        <!-- Formulario para dejar reseña -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ editingReviewId ? 'Editar reseña' : 'Deja tu reseña' }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Puntuación</ion-label>
              <ion-select v-model="reviewForm.score" placeholder="5" interface="popover">
                <ion-select-option :value="1">1</ion-select-option>
                <ion-select-option :value="2">2</ion-select-option>
                <ion-select-option :value="3">3</ion-select-option>
                <ion-select-option :value="4">4</ion-select-option>
                <ion-select-option :value="5">5</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Comentario</ion-label>
              <ion-textarea 
                v-model="reviewForm.comment" 
                placeholder="Escribe tu comentario"
                rows="4"
              ></ion-textarea>
            </ion-item>

            <ion-button 
              expand="block" 
              @click="handleReviewSubmit"
              :disabled="!reviewForm.comment.trim()"
            >
              {{ editingReviewId ? 'Actualizar' : 'Enviar' }}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { IonPage, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonSelect, IonSelectOption, IonText, IonButton, IonIcon, IonList, IonItem, IonTextarea } from '@ionic/vue';
  import { createOutline, trashOutline } from 'ionicons/icons';
  import { getProductById } from '@/services/productService';
  import { getVariantsOfProduct } from '@/services/variantService';
  import { getReviewsByProduct, createReview, updateReview, deleteReview } from '@/services/reviewService';
  import { useCartStore } from '@/stores/cart';
  import { useAuthStore } from '@/stores/auth';

  export default {
    components: {
      IonPage,
      IonHeader,
      IonContent,
      IonToolbar,
      IonTitle,
      IonButtons,
      IonBackButton,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonLabel,
      IonSelect,
      IonSelectOption,
      IonText,
      IonButton,
      IonIcon,
      IonList,
      IonItem,
      IonTextarea
    },
    setup() {
      const route = useRoute();
      const product = ref(null);
      const variants = ref([]);
      const selectedVariantIndex = ref(0);
      const image = ref('/img/SC512.png');
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

      const compareVariants = (o1, o2) => {
        return o1 === o2;
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

      return { 
        product, 
        variants, 
        selectedVariantIndex, 
        image, 
        price, 
        addToCart, 
        reviews, 
        reviewForm, 
        handleReviewSubmit, 
        startEdit, 
        handleDeleteReview, 
        averageScore, 
        starsString, 
        formatPrice, 
        isAuthor, 
        editingReviewId, 
        addDisabled, 
        addLabel,
        compareVariants,
        createOutline,
        trashOutline
      };
    }
  }
</script>

<style scoped>
  .product-detail-container {
    padding: 1rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .detail-image {
    margin-bottom: 2rem;
    text-align: center;
  }

  .detail-image img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .variant-selector {
    margin: 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 18px;
  }

  .variant-selector ion-label {
    margin-bottom: 0.5rem;
  }

  .price-section {
    margin: 1rem 0;
    padding: 1rem 0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }

  .price-section h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #4d8dff;
  }

  .review-average {
    background-color: #1e1e1e;
    border: 1px solid #4d8dff;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .review-average h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #ff9800;
  }

  .review-average p {
    margin: 0;
    color: #ff9800;
  }

  .review-card {
    padding: 1rem 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .review-card:last-child {
    border-bottom: none;
  }

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .review-header p {
    margin: 0;
    font-weight: 600;
  }

  .review-rating {
    margin-left: auto;
    color: #ff9800;
    font-size: 0.9rem;
    white-space: nowrap;
  }


  .review-comment {
    margin: 0.5rem 0 0 0;
    color: #555;
    line-height: 1.5;
  }

  .review-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  ion-button {
    text-transform: none;
  }
</style>

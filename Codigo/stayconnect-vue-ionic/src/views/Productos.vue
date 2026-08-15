<template>
  <ion-page>
    <ion-content ref="content">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Todos los productos</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Filtros Modal -->
      <ion-modal ref="filterModal" trigger="open-filters" @ion-modal-did-dismiss="onFilterModalDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-title>Filtros</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="dismissFilters">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list>
            <ion-list-header>
              <ion-label>Categorías</ion-label>
            </ion-list-header>
            <ion-item v-for="c in categories" :key="c.id">
              <ion-label>{{ c.name }}</ion-label>
              <ion-checkbox slot="start" :checked="selectedCategory === c.id" @ionChange="onCategoryClick(c)"></ion-checkbox>
            </ion-item>
          </ion-list>

          <ion-list class="ion-margin-top">
            <ion-list-header>
              <ion-label>Subcategorías</ion-label>
            </ion-list-header>
            <ion-item v-for="s in subcategories" :key="s.id">
              <ion-label>
                {{ s.name }}
                <p v-if="s.expand?.category">{{ s.expand.category.name }}</p>
              </ion-label>
              <ion-checkbox slot="start" :checked="selectedSubcategory === s.id" @ionChange="onSubcategoryClick(s)"></ion-checkbox>
            </ion-item>
          </ion-list>

          <ion-button expand="block" color="danger" class="ion-margin-top" @click="clearFilters">
            Limpiar filtros
          </ion-button>
        </ion-content>
      </ion-modal>

      <!-- Búsqueda -->
      <ion-searchbar
        v-model="searchTerm"
        placeholder="Buscar productos..."
        @ionInput="onSearch"
        class="ion-margin-top"
      ></ion-searchbar>

      <!-- Botón Filtros Flotante -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button id="open-filters">
          <ion-icon :icon="funnel"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- Grid de Productos -->
      <ion-grid v-if="products.length > 0" class="products-grid ion-padding">
        <ion-row>
          <ion-col size="12" sizeMd="6" sizeLg="4" v-for="p in products" :key="p.id">
            <ion-card class="product-card">
              <ion-card-header>
                <ion-card-title>{{ p.name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>{{ p.description }}</p>
                <p v-if="p.expand?.subcategory" class="product-meta">
                  <small>{{ p.expand.subcategory.name }}{{ p.expand.subcategory.expand?.category ? ` - ${p.expand.subcategory.expand.category.name}` : '' }}</small>
                </p>
                <ion-text color="primary">
                  <h3 style="margin-top: 20px">{{ formatPrice(p.price) }} €</h3>
                </ion-text>
              </ion-card-content>
              <ion-button expand="block" color="primary" :router-link="`/tabs/Productos/${p.id}`">
                Ver
              </ion-button>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Sin productos -->
      <div v-else class="ion-text-center ion-padding ion-margin-top">
        <ion-card>
          <ion-card-content>
            <h2>No se han encontrado productos</h2>
            <p>No quedan productos que coincidan con esos filtros o búsqueda.</p>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="ion-text-center ion-padding">
        <ion-button
          v-for="n in totalPages"
          :key="n"
          :disabled="n === currentPage"
          fill="outline"
          color="primary"
          class="pagination-btn"
          @click="goToPage(n)"
        >
          {{ n }}
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonModal,
  IonButton,
  IonSearchbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonCheckbox
} from '@ionic/vue';
import { funnel } from 'ionicons/icons';
import { ref, onMounted, computed } from 'vue';
import { getProducts, getProductsWithOptions, setAutoCancellation } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { getSubcategories } from '@/services/subcategoryService';
import { getVariantsOfProduct } from '@/services/variantService';

const filterModal = ref<any>(null);
const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const subcategories = ref<any[]>([]);
const searchTerm = ref<string>('');
const currentPage = ref<number>(1);
const perPage = 12;
const totalItems = ref<number>(0);
const selectedCategory = ref<string | null>(null);
const selectedSubcategory = ref<string | null>(null);
let subcategoriesData: any[] = [];
const content = ref<any>(null);

const loadCategories = async () => {
  try {
    categories.value = await getCategories();
  } catch (e) {
    categories.value = [];
  }
};

const loadSubcategories = async () => {
  try {
    const subs = await getSubcategories({ expand: 'category' });
    subcategoriesData = subs;
    subcategories.value = subs;
  } catch (e) {
    subcategories.value = [];
  }
};

const loadProducts = async () => {
  try {
    setAutoCancellation(false);
    let result;
    const hasSearch = searchTerm.value && searchTerm.value.trim() !== '';
    const hasCategory = selectedCategory.value !== null;
    const hasSubcategory = selectedSubcategory.value !== null;

    if (!hasSearch && !hasCategory && !hasSubcategory) {
      result = await getProducts(currentPage.value, perPage);
    } else {
      const filterParts: string[] = [];

      if (hasSearch) {
        const s = searchTerm.value.trim().replace(/"/g, '\\"');
        filterParts.push(`(name ~ "${s}" || description ~ "${s}")`);
      }

      if (hasSubcategory) {
        filterParts.push(`subcategory = "${selectedSubcategory.value}"`);
      } else if (hasCategory) {
        const subcatsOfCategory = subcategoriesData
          .filter(sub => sub.category === selectedCategory.value)
          .map(sub => sub.id);

        if (subcatsOfCategory.length > 0) {
          const subcatFilters = subcatsOfCategory.map(id => `subcategory = "${id}"`).join(' || ');
          filterParts.push(`(${subcatFilters})`);
        } else {
          products.value = [];
          totalItems.value = 0;
          setAutoCancellation(true);
          return;
        }
      }
      const finalFilter = filterParts.join(' && ');
      result = await getProductsWithOptions(currentPage.value, perPage, {
        filter: finalFilter,
        sort: '-created',
        expand: 'subcategory,subcategory.category'
      });
    }

    const items = result.items || [];

    if (items.length === 0) {
      products.value = [];
      totalItems.value = result.totalItems || 0;
      setAutoCancellation(true);
      return;
    }

    const productsWithPrice: any[] = [];

    for (const prod of items) {
      try {
        const vars = await getVariantsOfProduct(prod.id);
        const min = vars.length > 0 ? vars.reduce((m, v) => (v.price < m.price ? v : m), vars[0]) : null;
        productsWithPrice.push({ ...prod, price: min ? min.price : 0 });
      } catch (e) {
        productsWithPrice.push({ ...prod, price: 0 });
      }
    }

    products.value = productsWithPrice;
    totalItems.value = result.totalItems || productsWithPrice.length;
    setAutoCancellation(true);
  } catch (error) {
    console.error('Error cargando productos:', error);
    products.value = [];
    totalItems.value = 0;
    setAutoCancellation(true);
  }
};

const onSearch = () => {
  currentPage.value = 1;
  loadProducts();
};

const onCategoryClick = (c: any) => {
  if (selectedCategory.value === c.id) {
    selectedCategory.value = null;
  } else {
    selectedCategory.value = c.id;
  }
  selectedSubcategory.value = null;
  currentPage.value = 1;
  loadProducts();
};

const onSubcategoryClick = (s: any) => {
  if (selectedSubcategory.value === s.id) {
    selectedSubcategory.value = null;
  } else {
    selectedSubcategory.value = s.id;
    if (s.category && s.category !== selectedCategory.value) {
      selectedCategory.value = s.category;
    }
  }
  currentPage.value = 1;
  loadProducts();
};

const clearFilters = () => {
  selectedCategory.value = null;
  selectedSubcategory.value = null;
  currentPage.value = 1;
  searchTerm.value = '';
  dismissFilters();
  loadProducts();
};

const dismissFilters = () => {
  filterModal.value?.$el.dismiss();
};

const onFilterModalDismiss = () => {
  // Modal dismissed
};

const goToPage = (n: number) => {
  currentPage.value = n;
  loadProducts();

  content.value?.$el.scrollToTop(300);
};

const totalPages = computed(() => Math.ceil((totalItems.value || 0) / perPage));

const formatPrice = (v: any) => (typeof v === 'number' ? v.toFixed(2) : v);

onMounted(() => {
  loadCategories();
  loadSubcategories();
  loadProducts();
});
</script>

<style scoped>
.product-meta {
  color: var(--ion-color-medium);
  margin: 0.5rem 0;
}

.product-card {
  margin-bottom: 1rem;
}

.products-grid {
  padding-bottom: 80px;
}

.pagination-btn {
  margin: 0 4px;
}

ion-fab-button {
  --background: var(--ion-color-primary);
  --background-activated: var(--ion-color-primary-shade);
}
</style>

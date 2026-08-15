<template>
  <TheHeader />
  <main>
    <div class="products-container">
      <aside class="sidebar-filters">
        <h3>Filtros</h3>
        <div class="filter-section">
          <h4>Categorías</h4>
          <ul id="categories-list" class="filter-list">
            <li v-for="c in categories" :key="c.id" class="filter-item" :data-id="c.id" :class="{ active: selectedCategory === c.id }" @click="onCategoryClick(c)">
              {{ c.name }}
            </li>
          </ul>
        </div>
        <div class="filter-section">
          <h4>Subcategorías</h4>
          <ul id="subcategories-list" class="filter-list">
            <li v-for="s in subcategories" :key="s.id" class="filter-item" :class="{ active: selectedSubcategory === s.id }" @click="onSubcategoryClick(s)" :data-category="s.category">{{ s.name }} <small v-if="s.expand?.category">({{ s.expand.category.name }})</small></li>
          </ul>
        </div>
        <button id="clear-filters" class="btn-clear-filters" @click="clearFilters">Limpiar filtros</button>
      </aside>

      <div class="content-products">
        <div class="products-main">
          <header class="products-header">
            <h2 class="product-list__title">Todos los productos</h2>
            <input id="inputBuscar" type="search" v-model="searchTerm" placeholder="Buscar productos..." @input="onSearch"/>
          </header>

          <transition-group name="list" tag="section" class="product-list__grid" id="productGrid" v-if="products.length > 0">
            <article v-for="p in products" :key="p.id" class="product-card">
              <h3>{{ p.name }}</h3>
              <p>{{ p.description }}</p>
              <div class="product-meta" v-if="p.expand?.subcategory">
                <small>{{ p.expand.subcategory.name }}{{ p.expand.subcategory.expand?.category ? ` - ${p.expand.subcategory.expand.category.name}` : '' }}</small>
              </div>
              <strong>{{ formatPrice(p.price) }} €</strong>
              <router-link :to="`/productos/${p.id}`" class="btn">Ver</router-link>
            </article>
          </transition-group>

          <div class="no-products" v-else>
            <div class="no-products__box">
              <h3>No se han encontrado productos</h3>
              <p>No quedan productos que coincidan con esos filtros o búsqueda.</p>
            </div>
          </div>

          <nav class="pagination" v-if="totalPages > 1">
            <button v-for="n in totalPages" :key="n" :disabled="n===currentPage" @click="goToPage(n)">{{ n }}</button>
          </nav>
        </div>
      </div>
    </div>
  </main>
  <TheFooter />
</template>

<script>
  import { ref, onMounted, computed } from 'vue';
  import { getProducts, getProductsWithOptions, setAutoCancellation } from '@/services/productService';
  import { getCategories } from '@/services/categoryService';
  import { getSubcategories } from '@/services/subcategoryService';
  import { getVariantsOfProduct } from '@/services/variantService';
  import TheHeader from '@/components/TheHeader.vue';
  import TheFooter from '@/components/TheFooter.vue';

  export default {
    components: { TheHeader, TheFooter },
    setup() {
      const products = ref([]);
      const categories = ref([]);
      const subcategories = ref([]);
      const searchTerm = ref('');
      const currentPage = ref(1);
      const perPage = 12;
      const totalItems = ref(0);
      const selectedCategory = ref(null);
      const selectedSubcategory = ref(null);
      let subcategoriesData = [];

      const loadCategories = async () => {
        try { categories.value = await getCategories(); } catch(e){ categories.value = []; }
      }

      const loadSubcategories = async () => {
        try {
          const subs = await getSubcategories({ expand: 'category' });
          subcategoriesData = subs;
          subcategories.value = subs;

        } catch(e) { subcategories.value = []; }
      }

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
            let filterParts = [];

            if (hasSearch) {
              const s = searchTerm.value.trim().replace(/"/g, '\\"');
              filterParts.push(`(name ~ "${s}" || description ~ "${s}")`);
            }

            if (hasSubcategory) {
              filterParts.push(`subcategory = "${selectedSubcategory.value}"`);

            } else if (hasCategory) {
              const subcatsOfCategory = subcategoriesData.filter(sub => sub.category === selectedCategory.value).map(sub => sub.id);

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
            result = await getProductsWithOptions(currentPage.value, perPage, { filter: finalFilter, sort: '-created', expand: 'subcategory,subcategory.category' });
          }
          const items = result.items || [];

          if (items.length === 0) {
            products.value = [];
            totalItems.value = result.totalItems || 0;
            setAutoCancellation(true);

            return;
          }
          const productsWithPrice = [];

          for (let prod of items) {

            try {
              const vars = await getVariantsOfProduct(prod.id);
              const min = vars.length > 0 ? vars.reduce((m, v) => v.price < m.price ? v : m, vars[0]) : null;
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
      }

      const onSearch = () => {
        currentPage.value = 1;
        loadProducts();
      }

      const onCategoryClick = (c) => {
        if (selectedCategory.value === c.id) selectedCategory.value = null; else selectedCategory.value = c.id;
        selectedSubcategory.value = null;
        currentPage.value = 1;
        loadProducts();
      }

      const onSubcategoryClick = (s) => {
        if (selectedSubcategory.value === s.id) {
          selectedSubcategory.value = null;

        } else {
          selectedSubcategory.value = s.id;

          if (s.category && s.category !== selectedCategory.value) selectedCategory.value = s.category;
        }
        currentPage.value = 1;
        loadProducts();
      }

      const clearFilters = () => {
        selectedCategory.value = null;
        selectedSubcategory.value = null;
        currentPage.value = 1;
        searchTerm.value = '';
        loadProducts();
      }

      const goToPage = (n) => {
        currentPage.value = n;
        loadProducts();
      }

      const totalPages = computed(() => Math.ceil((totalItems.value || 0) / perPage));

      onMounted(() => { loadCategories(); loadSubcategories(); loadProducts(); });

      const formatPrice = (v) => (typeof v === 'number' ? v.toFixed(2) : v);
      
      return { products, categories, subcategories, searchTerm, onSearch, formatPrice, currentPage, totalPages, goToPage, clearFilters, onCategoryClick, onSubcategoryClick, selectedCategory, selectedSubcategory };
    }
  }
</script>
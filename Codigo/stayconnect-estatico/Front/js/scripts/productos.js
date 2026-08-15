import { getProducts, getProductsWithOptions, setAutoCancellation } from '@/services/productService.js';
import { getVariantsOfProduct } from '@/services/variantService.js';
import { getCurrentUser } from '@/services/authService.js';
import { getCategories } from '@/services/categoryService.js';
import { getSubcategories } from '@/services/subcategoryService.js';
import { initStayConnectMap } from '@/services/mapService.js';

document.addEventListener('DOMContentLoaded', () => initStayConnectMap('stay-map'))

const user = getCurrentUser();
if (!user) {
    window.location.href = 'login.html';
}

function renderUserNav() {
    const nav = document.getElementById("user-nav");
    if (!nav) return;
    if (user) {
        nav.href = "perfil.html";
        nav.innerHTML = `<i class="fas fa-user"></i> Perfil`;
    } else {
        nav.href = "login.html";
        nav.innerHTML = `<i class="fas fa-user"></i> Login`;
    }
}
renderUserNav();

let currentPage = 1;
let searchTerm = '';
const perPage = 12;
let selectedCategory = null;
let selectedSubcategory = null;
let subcategoriesData = [];

async function loadCategories() {
    try {
        const categories = await getCategories();
        const ul = document.getElementById("categories-list");

        ul.innerHTML = categories.map(cat =>
            `<li data-id="${cat.id}" class="filter-item">${cat.name}</li>`
        ).join('');
        ul.addEventListener('click', handleCategoryClick);
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

async function loadSubcategories() {
    try {
        const subcategories = await getSubcategories({
            expand: 'category'
        });
        subcategoriesData = subcategories;
        const ul = document.getElementById("subcategories-list");

        ul.innerHTML = subcategories.map(sub => {
            const catName = sub.expand?.category?.name;
            return `
            <li data-id="${sub.id}" data-category="${sub.category}" class="filter-item">
                ${sub.name}
                ${catName ? `<span class="category-label">(${catName})</span>` : ''}
            </li>
            `;
        }).join('');
        ul.addEventListener('click', handleSubcategoryClick);
    } catch (error) {
        console.error('Error cargando subcategorías:', error);
    }
}

function handleCategoryClick(e) {
    if (!e.target.classList.contains('filter-item')) return;
    
    document.querySelectorAll('#categories-list .filter-item').forEach(item => 
        item.classList.remove('active')
    );
    
    if (selectedCategory === e.target.dataset.id) {
        selectedCategory = null;
    } else {
        selectedCategory = e.target.dataset.id;
        e.target.classList.add('active');
    }
    
    selectedSubcategory = null;
    document.querySelectorAll('#subcategories-list .filter-item').forEach(item => 
        item.classList.remove('active')
    );
    
    currentPage = 1;
    loadProducts();
}

function handleSubcategoryClick(e) {
    if (!e.target.classList.contains('filter-item')) return;
    
    document.querySelectorAll('#subcategories-list .filter-item').forEach(item => 
        item.classList.remove('active')
    );
    
    if (selectedSubcategory === e.target.dataset.id) {
        selectedSubcategory = null;
    } else {
        selectedSubcategory = e.target.dataset.id;
        e.target.classList.add('active');
        const categoryId = e.target.dataset.category;

        if (categoryId && categoryId !== selectedCategory) {
            selectedCategory = categoryId;
            document.querySelectorAll('#categories-list .filter-item').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.id === categoryId) {
                    item.classList.add('active');
                }
            });
        }
    }
    
    currentPage = 1;
    loadProducts();
}

function clearFilters() {
    selectedCategory = null;
    selectedSubcategory = null;
    
    document.querySelectorAll('.filter-item').forEach(item => 
    item.classList.remove('active')
    );
    
    currentPage = 1;
    loadProducts();
}

async function loadProducts() {
    try {
    setAutoCancellation(false);

        let result;
        
        const hasSearch = searchTerm && searchTerm.trim() !== '';
        const hasCategory = selectedCategory !== null;
        const hasSubcategory = selectedSubcategory !== null;
        
        if (!hasSearch && !hasCategory && !hasSubcategory) {
            result = await getProducts(currentPage, perPage);
        } else {
            let filterParts = [];
            
            if (hasSearch) {
                const searchTerm_clean = searchTerm.trim().replace(/"/g, '\\"');
                filterParts.push(`(name ~ "${searchTerm_clean}" || description ~ "${searchTerm_clean}")`);
            }
            
            if (hasSubcategory) {
                filterParts.push(`subcategory = "${selectedSubcategory}"`);
            } else if (hasCategory) {
                const subcatsOfCategory = subcategoriesData
                    .filter(sub => sub.category === selectedCategory)
                    .map(sub => sub.id);
                
                if (subcatsOfCategory.length > 0) {
                    const subcatFilters = subcatsOfCategory.map(id => `subcategory = "${id}"`).join(' || ');
                    filterParts.push(`(${subcatFilters})`);
                } else {
                    const grid = document.getElementById('productGrid');
                    grid.innerHTML = '<p>No hay productos para esta categoría</p>';
                    document.getElementById('pagination').innerHTML = '';
                    setAutoCancellation(true);
                    return;
                }
            }
            
            const finalFilter = filterParts.join(' && ');
            result = await getProductsWithOptions(currentPage, perPage, {
            filter: finalFilter,
            sort: '-created',
            expand: 'subcategory,subcategory.category'
            });
        }

        const items = result.items;
        const grid = document.getElementById('productGrid');

        if (items.length === 0) {
            grid.innerHTML = '<p>No se encontraron productos con los filtros aplicados</p>';
            document.getElementById('pagination').innerHTML = '';
            setAutoCancellation(true);
            return;
        }

        let productsWithPrice = [];
        for (let prod of items) {
            try {
                const vars = await getVariantsOfProduct(prod.id);
                const minPriceVariant = vars.length > 0 ? vars.reduce((min, v) => v.price < min.price ? v : min) : null;
                productsWithPrice.push({ ...prod, price: minPriceVariant ? minPriceVariant.price : 0 });
            } catch(e) {
                productsWithPrice.push({ ...prod, price: 0 });
            }
        }

        grid.innerHTML = productsWithPrice.map(prod => {
        const subName = prod.expand?.subcategory?.name;
        const catName = prod.expand?.subcategory?.expand?.category?.name;
        return `
            <article class="product-card">
            <h3>${prod.name}</h3>
            <p>${prod.description}</p>
            ${subName ? `
                <div class="product-meta">
                <small>
                    ${subName}${catName ? ` - ${catName}` : ''}
                </small>
                </div>
            ` : ''}
            <strong>${prod.price.toFixed(2)} €</strong>
            <a href="detalle_producto.html?id=${prod.id}" class="btn">Ver</a>
            </article>
        `;
        }).join('');

    renderPagination(result.totalItems, currentPage, perPage);
    setAutoCancellation(true);
    
    } catch (error) {
        console.error('Error cargando productos:', error);
        const grid = document.getElementById('productGrid');
        grid.innerHTML = '<p>Error al cargar productos. Intenta limpiar los filtros.</p>';
        document.getElementById('pagination').innerHTML = '';
        setAutoCancellation(true);
    }
}

function renderPagination(totalItems, currentPage, perPage) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / perPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    let html = '';

    for (let i = 1; i <= totalPages; i++) {
        html += `<button ${i === currentPage ? 'disabled' : ''} onclick="goToPage(${i})">${i}</button>`;
    }
    pagination.innerHTML = html;
}

window.goToPage = (page) => {
    currentPage = page;
    loadProducts();
};

document.getElementById('inputBuscar').addEventListener('input', (e) => {
    searchTerm = e.target.value;
    currentPage = 1;
    loadProducts();
});

document.getElementById('clear-filters').addEventListener('click', clearFilters);

function addToCart(id) {
    alert('Producto añadido al carrito: ' + id);
}
window.addToCart = addToCart;

async function init() {
    await loadCategories();
    await loadSubcategories();
    await loadProducts();
}

init();
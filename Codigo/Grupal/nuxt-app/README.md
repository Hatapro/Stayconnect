# Vue + Nuxt App

## 🌐 Descripción

Esta es una aplicación web moderna construida con **Vue 3** y **Nuxt 3**. Implementa un sistema de gestión de tareas con autenticación y aprovecha las capacidades de SSR (Server-Side Rendering) de Nuxt.

## ✨ Características

- **Login/Autenticación**: Sistema de login ficticio con validación
- **Gestión de Tareas**: Crear, completar y eliminar tareas
- **Persistencia Local**: Los datos se guardan en localStorage
- **SSR Ready**: Preparada para Server-Side Rendering
- **File-based Routing**: Routing automático basado en la estructura de archivos
- **Middleware**: Protección de rutas con middleware personalizado
- **Responsive**: Diseño adaptado a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves entre estados

## 🛠️ Tecnologías

- **Vue 3** (Composition API con `<script setup>`)
- **Nuxt 3** (Framework de alto nivel para Vue)
- **File-based Routing** (Automático)
- **Middleware** (Guards de navegación)
- **CSS Variables** (Theming)

## 📦 Instalación

```bash
# Instalar dependencias
npm install
```

## 🚀 Ejecución

```bash
# Modo desarrollo
npm run dev
```

La aplicación se abrirá en: `http://localhost:3000`

```bash
# Build para producción
npm run build

# Preview de producción
npm run preview

# Generar sitio estático (SSG)
npm run generate
```

## 🔑 Credenciales de Prueba

- **Usuario**: `demo`
- **Contraseña**: `demo123`

## 📂 Estructura del Proyecto

```
nuxt-app/
├── pages/               # Páginas (routing automático)
│   ├── index.vue        # Página de login (/)
│   └── tasks.vue        # Página de tareas (/tasks)
├── middleware/          # Middlewares
│   └── auth.js          # Middleware de autenticación
├── assets/              # Assets estáticos
│   └── css/
│       └── main.css     # Estilos globales
├── app.vue              # Componente raíz
├── nuxt.config.ts       # Configuración de Nuxt
└── package.json
```

## 🎯 Funcionalidades Implementadas

### 1. Autenticación
- Login con validación de credenciales
- Middleware para proteger rutas privadas
- Almacenamiento de sesión en localStorage
- Redirección automática según estado de autenticación
- Botón de cerrar sesión con confirmación

### 2. Gestión de Tareas
- Añadir nuevas tareas con formulario
- Marcar tareas como completadas (checkbox)
- Eliminar tareas con modal de confirmación
- Contador de tareas pendientes
- Persistencia en localStorage

### 3. UI/UX Moderna
- Diseño limpio y profesional
- Gradientes y sombras suaves
- Animaciones y transiciones
- Modales para confirmaciones
- Toasts para notificaciones
- Iconos SVG inline
- Responsive design

## 🔧 Conceptos de Nuxt Utilizados

### 1. File-based Routing
Nuxt genera automáticamente las rutas basándose en la estructura de archivos en `/pages`:
- `pages/index.vue` → `/`
- `pages/tasks.vue` → `/tasks`

### 2. Auto-imports
Nuxt importa automáticamente:
- Componentes de Vue (`ref`, `computed`, `onMounted`)
- Composables de Nuxt (`useRouter`, `navigateTo`)
- Componentes en `/components`

### 3. Middleware
Los middlewares se ejecutan antes de renderizar una página:
```javascript
definePageMeta({
  middleware: 'auth'
})
```

### 4. SSR/SSG
- **SSR**: Server-Side Rendering para mejor SEO y performance inicial
- **SSG**: Static Site Generation para sitios completamente estáticos
- Nuxt maneja automáticamente la diferencia entre servidor y cliente con `process.client`

### 5. Composables
Nuxt proporciona composables útiles:
- `useRouter()`: Acceso al router de Vue
- `navigateTo()`: Navegación programática
- `definePageMeta()`: Metadata de página

## 🎨 Características de Diseño

### Variables CSS
El proyecto usa CSS Variables para un theming consistente:
```css
--primary-color: #3880ff
--danger-color: #eb445a
--success-color: #2dd36f
```

### Componentes Reutilizables
- Cards con sombras y border-radius
- Botones con estados hover
- Inputs con animación en focus
- Toasts para notificaciones
- Modales para confirmaciones

### Animaciones
- Transiciones de entrada/salida para toasts
- Transiciones para modales
- Hover effects en elementos interactivos
- Transform animations para feedback visual

## 🚀 Ventajas de Nuxt sobre Vue puro

| Aspecto | Nuxt 3 | Vue 3 Puro |
|---------|--------|------------|
| **Routing** | Automático (file-based) | Manual (vue-router) |
| **SEO** | Excelente (SSR/SSG) | Limitado (CSR) |
| **Performance inicial** | Muy rápida (SSR) | Depende del bundle |
| **Configuración** | Mínima | Requiere setup |
| **Auto-imports** | Sí | No |
| **Middleware** | Built-in | Manual |
| **Meta tags** | useHead() integrado | Requiere librería |
| **API Routes** | Sí (`/server`) | No (necesita backend separado) |

## 📊 Modos de Renderizado

### SSR (Server-Side Rendering)
```bash
npm run build
npm run preview
```
- HTML generado en el servidor
- Mejor SEO
- Carga inicial más rápida

### SSG (Static Site Generation)
```bash
npm run generate
```
- HTML pre-renderizado en build time
- Deploy a CDN
- Máxima performance

### CSR (Client-Side Rendering)
Configurar en `nuxt.config.ts`:
```javascript
export default defineNuxtConfig({
  ssr: false
})
```

## 🔍 Comparación con Ionic

| Aspecto | Nuxt | Ionic |
|---------|------|-------|
| **Target** | Web | Móvil |
| **SEO** | Excelente | Limitado |
| **Componentes** | Web custom | Nativos móviles |
| **Routing** | File-based | Ionic Router |
| **SSR** | Sí | No |
| **Build size** | Pequeño (~500KB) | Grande (~2-3MB) |
| **Performance web** | Excelente | Buena |
| **Apps nativas** | No | Sí |

## 📝 Notas de Desarrollo

### Process.client
Nuxt ejecuta código en servidor y cliente. Para código que solo debe ejecutarse en el cliente (como `localStorage`):
```javascript
if (process.client) {
  localStorage.getItem('key')
}
```

### Middleware
El middleware `auth.js` protege rutas privadas. Se aplica a nivel de página con:
```javascript
definePageMeta({
  middleware: 'auth'
})
```

### Auto-imports
No necesitas importar:
- `ref`, `computed`, `onMounted` de Vue
- `useRouter`, `navigateTo` de Nuxt
- Componentes en `/components`

## 🐛 Troubleshooting

**Problema**: localStorage is not defined
- **Solución**: Usa `process.client` antes de acceder a localStorage

**Problema**: Las rutas no se generan
- **Solución**: Asegúrate de que los archivos estén en `/pages`

**Problema**: El middleware no funciona
- **Solución**: Verifica que el archivo esté en `/middleware` y uses `definePageMeta`

**Problema**: Los estilos no se aplican
- **Solución**: Asegúrate de importar el CSS en `nuxt.config.ts`

## 📚 Recursos

- [Nuxt 3 Documentation](https://nuxt.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Nuxt Routing](https://nuxt.com/docs/getting-started/routing)
- [Nuxt Middleware](https://nuxt.com/docs/guide/directory-structure/middleware)
- [Nuxt Composables](https://nuxt.com/docs/api/composables/use-router)

## 🎓 Conceptos Aprendidos

1. **File-based Routing**: El routing se genera automáticamente
2. **SSR vs CSR**: Diferencias y cuándo usar cada uno
3. **Middleware**: Protección de rutas de manera declarativa
4. **Auto-imports**: Menos boilerplate, más productividad
5. **Composition API**: Código más limpio y reutilizable
6. **CSS Variables**: Theming consistente y mantenible

---

**Desarrollado para:** Proyecto ADI - Comparación de Frameworks  
**Universidad de Alicante** - Enero 2026

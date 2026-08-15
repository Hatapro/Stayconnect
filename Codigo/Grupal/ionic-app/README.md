# Vue + Ionic App

## 📱 Descripción

Esta es una aplicación móvil híbrida construida con **Vue 3** e **Ionic Framework 7**. Implementa un sistema de gestión de tareas con autenticación.

## ✨ Características

- **Login/Autenticación**: Sistema de login ficticio con validación
- **Gestión de Tareas**: Crear, completar y eliminar tareas
- **Persistencia Local**: Los datos se guardan en localStorage
- **Componentes Ionic**: Utiliza componentes nativos de Ionic optimizados para móviles
- **Responsive**: Diseño adaptado a diferentes tamaños de pantalla
- **Toasts y Alerts**: Notificaciones y confirmaciones al estilo nativo

## 🛠️ Tecnologías

- **Vue 3** (Composition API)
- **Ionic Framework 7**
- **Ionic Vue Router**
- **Ionicons** (iconos)
- **Vite** (bundler)

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

La aplicación se abrirá en: `http://localhost:8100`

Para ver la aplicación en modo móvil, abre las DevTools de tu navegador y activa el modo responsive.

## 🔑 Credenciales de Prueba

- **Usuario**: `demo`
- **Contraseña**: `demo123`

## 📂 Estructura del Proyecto

```
ionic-app/
├── src/
│   ├── views/           # Vistas/Páginas
│   │   ├── Login.vue    # Vista de inicio de sesión
│   │   └── TaskList.vue # Vista de lista de tareas
│   ├── router/          # Configuración de rutas
│   │   └── index.js     # Router con guards
│   ├── App.vue          # Componente raíz
│   └── main.js          # Punto de entrada
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Funcionalidades Implementadas

### 1. Autenticación
- Login con validación de credenciales
- Guard de navegación para proteger rutas
- Almacenamiento de sesión en localStorage
- Botón de cerrar sesión

### 2. Gestión de Tareas
- Añadir nuevas tareas
- Marcar tareas como completadas
- Eliminar tareas con confirmación
- Contador de tareas pendientes
- Persistencia de datos en localStorage

### 3. UI/UX Móvil
- Toolbar con acciones
- Cards para información
- Listas interactivas
- Checkboxes nativos
- Toasts para notificaciones
- Alerts para confirmaciones
- Iconos de Ionicons

## 🔧 Componentes Ionic Utilizados

- `IonPage`: Contenedor principal de página
- `IonHeader` / `IonToolbar`: Cabecera de la app
- `IonContent`: Contenido scrollable
- `IonCard`: Tarjetas de información
- `IonList` / `IonItem`: Listas interactivas
- `IonButton`: Botones nativos
- `IonInput`: Campos de entrada
- `IonCheckbox`: Casillas de verificación
- `IonIcon`: Iconos
- `toastController`: Notificaciones
- `alertController`: Diálogos de confirmación

## 🎨 Características de Ionic

### Ventajas demostradas en esta app:

1. **Componentes Nativos**: Los componentes se ven y se comportan como nativos en cada plataforma
2. **Gestos Táctiles**: Soporte optimizado para interacciones táctiles
3. **Performance**: Renderizado optimizado para dispositivos móviles
4. **Capacitor Ready**: Preparada para compilar a APK/IPA
5. **PWA Ready**: Puede funcionar como Progressive Web App

### Routing con Ionic Router

El routing utiliza `@ionic/vue-router` que extiende Vue Router con:
- Transiciones de página nativas
- Gestión de historial al estilo móvil
- Soporte para tabs y menús laterales
- Guards de navegación

## 📱 Compilación para Móvil (opcional)

Para compilar esta app a una aplicación nativa:

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli

# Inicializar
npx cap init

# Añadir plataforma
npx cap add android  # Para Android
npx cap add ios      # Para iOS

# Build y sync
npm run build
npx cap sync

# Abrir en IDE nativo
npx cap open android
npx cap open ios
```

## 💡 Conceptos Clave de Ionic

### 1. Ion-Page
Cada vista debe estar envuelta en un `<ion-page>` para el correcto funcionamiento de transiciones y gestos.

### 2. Ion-Content
El contenido scrollable debe ir dentro de `<ion-content>`.

### 3. Controllers
Ionic usa controllers para elementos dinámicos como toasts, alerts, modals:
- `toastController`
- `alertController`
- `modalController`
- `loadingController`

### 4. Theming
Ionic usa variables CSS para temas. Los colores principales son:
- primary
- secondary
- tertiary
- success
- warning
- danger
- light
- medium
- dark

## 🔍 Comparación con Vue puro

| Aspecto | Ionic | Vue Puro |
|---------|-------|----------|
| Componentes UI | Nativos móviles | Web estándar |
| Gestos | Optimizados touch | Eventos DOM |
| Transiciones | Nativas iOS/Android | CSS custom |
| Compilación móvil | Integrado (Capacitor) | Requiere configuración |
| Look & Feel | Nativo | Web |

## 📝 Notas de Desarrollo

- Ionic recomienda usar Composition API de Vue 3
- Los componentes Ionic deben importarse individualmente
- Se requieren los CSS core de Ionic
- La navegación usa el stack de historial al estilo móvil
- localStorage simula el backend (en producción usar API real)

## 🐛 Troubleshooting

**Problema**: Los estilos de Ionic no se cargan
- **Solución**: Asegúrate de importar los CSS en main.js

**Problema**: Las transiciones no funcionan
- **Solución**: Verifica que cada vista esté envuelta en `<ion-page>`

**Problema**: Los iconos no aparecen
- **Solución**: Importa los iconos desde `ionicons/icons`

## 📚 Recursos

- [Documentación de Ionic](https://ionicframework.com/docs/)
- [Ionic Vue](https://ionicframework.com/docs/vue/overview)
- [Ionicons](https://ionic.io/ionicons)
- [Capacitor](https://capacitorjs.com/)

---

**Desarrollado para:** Proyecto ADI - Comparación de Frameworks  
**Universidad de Alicante** - Enero 2026

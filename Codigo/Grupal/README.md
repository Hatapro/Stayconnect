# Comparación Vue + Ionic vs Vue + Nuxt

## Integrantes

- Haytam Abaran Said
- Maria Jover Espi

## Descripción
Proyecto docente que implementa la misma app de tareas con autenticación en dos stacks:
- Vue + Ionic (enfocado a experiencia móvil híbrida, listo para Capacitor/PWA).
- Vue + Nuxt (enfocado a web con SSR/SSG y mejor SEO).

## Estructura
- ionic-app/: SPA móvil híbrida con Ionic Vue, routing con guards y UI nativa.
- nuxt-app/: App web con Nuxt 3, routing file-based, middleware de auth y SSR/SSG.

## Requisitos previos
- Node.js 18+ y npm.
- Navegador con DevTools (para ver modo móvil en Ionic y ver HTML prerenderizado en Nuxt).

## Instalación
```bash
cd ionic-app
npm install

cd ../nuxt-app
npm install
```

## Ejecución
- Ionic: `npm run dev` dentro de ionic-app → http://localhost:8100 (usar DevTools en modo móvil).
- Nuxt: `npm run dev` dentro de nuxt-app → http://localhost:3000 (puedes ver el código fuente SSR con Ctrl+U).

Credenciales de prueba en ambas apps: usuario `demo`, contraseña `demo123`.

## Referencias
- Vue.js: https://vuejs.org/
- Ionic Framework y Ionic Vue: https://ionicframework.com/docs/vue/overview
- Capacitor: https://capacitorjs.com/docs
- Nuxt: https://nuxt.com/docs
- Vue Router: https://router.vuejs.org/
- Ionicons: https://ionic.io/ionicons
- Nuxt Modules: https://nuxt.com/modules
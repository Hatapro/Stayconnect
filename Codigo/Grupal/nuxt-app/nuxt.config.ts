import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  app: {
    head: {
      title: 'Vue + Nuxt App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplicación Vue + Nuxt para comparación de frameworks' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  devServer: {
    port: 3000
  }
})

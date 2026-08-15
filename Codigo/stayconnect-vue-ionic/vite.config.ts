/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy(),
     VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'SC192.png', 'SC512.png'],
      manifest: {
        name: 'StayConnect',
        short_name: 'StayConnect',
        description: 'Tienda online - Los mejores productos al mejor precio',
          id: '/',
          start_url: '/',
          scope: '/',
        theme_color: '#3880ff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/SC192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/SC512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/SC512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
          ],
          screenshots: [
            {
              src: '/screenshots/home-wide.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Catálogo de productos'
            },
            {
              src: '/screenshots/home-narrow.png',
              sizes: '720x1280',
              type: 'image/png',
              label: 'Catálogo (móvil)'
            }
          ],
          protocol_handlers: [
            {
              protocol: 'web+stayconnect',
              url: '/?q=%s'
            }
          ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  server: {
    host: '0.0.0.0'
  }
})

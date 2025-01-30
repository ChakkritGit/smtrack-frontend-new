import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: 'module'
      },
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      injectManifest: {
        swDest: 'dist/sw.js',
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024 // 100MB
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,json,mp3}'],
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // 100MB
        runtimeCaching: [
          {
            urlPattern: /.*\.js$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'js-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 8 * 60 * 60
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'SMTrack+',
        short_name: 'SMTrack+',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: 'desktop01.png',
            sizes: '3840x2160',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Login'
          },
          {
            src: 'desktop02.png',
            sizes: '3840x2160',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Home'
          },
          {
            src: 'desktop03.png',
            sizes: '3840x2160',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Dashboard'
          },
          {
            src: 'desktop04.png',
            sizes: '3840x2160',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Chart'
          },
          {
            src: 'desktop05.png',
            sizes: '3840x2160',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Table'
          },
          {
            src: 'mobile01.png',
            sizes: '1125x2436',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Login'
          },
          {
            src: 'mobile02.png',
            sizes: '1125x2436',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Home'
          },
          {
            src: 'mobile03.png',
            sizes: '1125x2436',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Dashboard'
          }
        ],
        prefer_related_applications: true,
        related_applications: [
          {
            platform: 'play',
            url: 'https://play.google.com/store/apps/details?id=com.thanes.temp_noti',
            id: 'com.thanes.temp_noti'
          },
          {
            platform: 'ios',
            url: 'https://apps.apple.com/th/app/smtrack/id6670781090',
            id: 'id6670781090'
          }
        ],
        description:
          'The system show all smtrack box detect temperature realtime and nofi when temperture higher then limit.',
        theme_color: '#fdfdfd',
        background_color: '#fdfdfd',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait'
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 100000, // Unit is in KB => 100MB
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    port: 12345,
    strictPort: true,
    host: true,
    cors: true,
    fs: {
      strict: true,
      deny: ['.env', '.env.*', '*.{crt,pem}', 'custom.secret']
    }
  },
  optimizeDeps: {
    exclude: ['fs']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../"),
    }
  }
})

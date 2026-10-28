import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Bing image search, keyless endpoint (same one Smart Buddy uses).
 * It sends no `access-control-allow-origin`, so the browser cannot call it
 * directly — the dev server proxies it and appends the credentials, which keeps
 * them out of the client bundle. On the intranet host the same path must be
 * fronted by a same-origin backend proxy.
 */
const BING_HOST = 'https://www.bingapis.com'
const BING_PATH = '/api/v7/images/search'
const BING_APPID =
  process.env.BING_APPID ?? 'D41D8CD98F00B204E9800998ECF8427E1510C791'

// base './' so the static build works from any intranet sub-path on Web Hub
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api/bing': {
        target: BING_HOST,
        changeOrigin: true,
        rewrite: (path) => {
          const qs = new URLSearchParams(path.split('?')[1] ?? '')
          qs.set('appId', BING_APPID)
          if (!qs.get('mkt')) qs.set('mkt', 'en-US')
          if (!qs.get('safeSearch')) qs.set('safeSearch', 'Moderate')
          return `${BING_PATH}?${qs.toString()}`
        },
      },
    },
  },
})

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import nightwatchPlugin from 'vite-plugin-nightwatch'
import vueDevTools from 'vite-plugin-vue-devtools'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      nightwatchPlugin({
        renderPage: './nightwatch/index.html'
      }),
      vueDevTools(),
      inject({
        process: 'process/browser',
        querystring: 'querystring-es3'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        process: 'process/browser',
        querystring: 'querystring-es3'
      }
    }
  })
}

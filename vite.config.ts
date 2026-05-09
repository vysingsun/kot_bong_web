import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    console.log(env.VITE_APP_MODE, 'mode')

    return {
        base: env.VITE_APP_MODE === 'development' ? '/' : '/app/',
        server: {
            proxy: {
                '/api': {
                    target: 'https://kot-bong-api-dev.onrender.com',
                    changeOrigin: true,
                },
            },
        },
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    }
})

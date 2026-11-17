import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// GitHub Pages não conhece as rotas do Vue Router (/parcelar, /mei...):
// o 404.html é uma cópia do index.html, e o app resolve a rota no navegador.
const paginasSpa = () => ({
  name: 'spa-404',
  apply: 'build',
  closeBundle() {
    copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'))
  },
})

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [vue(), tailwindcss(), paginasSpa()],
  // Local: http://localhost:5173/ · Publicado no GitHub Pages: /grana-na-mao/
  base: command === 'build' ? '/grana-na-mao/' : '/',
}))

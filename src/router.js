import { createRouter, createWebHistory } from 'vue-router'
import InicioView from './views/InicioView.vue'
import SimuladorParcelar from './components/SimuladorParcelar.vue'
import CalculadoraMei from './components/CalculadoraMei.vue'
import GuiaServicos from './components/GuiaServicos.vue'
import SobreProjeto from './components/SobreProjeto.vue'

const titulo = (t) => `${t} · Grana na Mão`

export const routes = [
  { path: '/', name: 'inicio', component: InicioView, meta: { titulo: 'Grana na Mão: simulador de juros e guia para o MEI' } },
  { path: '/parcelar', name: 'parcelar', component: SimuladorParcelar, meta: { titulo: titulo('Vale a pena parcelar?') } },
  { path: '/mei', name: 'mei', component: CalculadoraMei, meta: { titulo: titulo('Calculadora para MEI') } },
  { path: '/guia', name: 'guia', component: GuiaServicos, meta: { titulo: titulo('Guia financeiro') } },
  { path: '/sobre', name: 'sobre', component: SobreProjeto, meta: { titulo: titulo('Sobre o projeto') } },
  { path: '/:caminho(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, salvo) {
    if (salvo) return salvo
    if (to.hash) return { el: to.hash, top: 72 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  if (to.meta.titulo) document.title = to.meta.titulo
})

export default router

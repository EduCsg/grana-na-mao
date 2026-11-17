<script setup>
// Header único de todas as páginas. CSS próprio (com escopo) e não Tailwind:
// na página inicial o CSS do kit visual, sem camada, venceria as classes utilitárias.
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const links = [
  { to: '/parcelar', nome: 'Parcelamento' },
  { to: '/mei', nome: 'MEI' },
  { to: '/guia', nome: 'Guia' },
  { to: '/#perguntas', nome: 'Perguntas' },
  { to: '/sobre', nome: 'Sobre' },
]

// "Perguntas" é uma âncora da página inicial: nunca marcada como página atual
const ativa = (l) => (l.to.includes('#') ? 'ancora' : 'ativo')

const route = useRoute()
const aberto = ref(false)
watch(() => route.fullPath, () => (aberto.value = false))
</script>

<template>
  <header class="topo" :class="{ 'topo--aberto': aberto }">
    <div class="topo__barra">
      <a class="topo__pular" href="#top">Pular para o conteúdo</a>
      <RouterLink class="topo__logo" to="/">Grana na Mão</RouterLink>

      <nav class="topo__links" aria-label="Principal">
        <RouterLink v-for="l in links" :key="l.to" class="topo__link" :to="l.to" :exact-active-class="ativa(l)" active-class="">{{ l.nome }}</RouterLink>
      </nav>

      <button class="topo__menu" type="button" :aria-expanded="aberto" aria-controls="menu-celular" aria-label="Menu" @click="aberto = !aberto">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path v-if="!aberto" d="M2 5h14M2 13h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          <path v-else d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <nav v-if="aberto" id="menu-celular" class="topo__folha" aria-label="Principal">
      <RouterLink v-for="l in links" :key="l.to" class="topo__item" :to="l.to" :exact-active-class="ativa(l)" active-class="">{{ l.nome }}</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.topo {
  position: fixed; inset: 0 0 auto 0; z-index: 50;
  background: #f7f9fa; border-bottom: 1px solid rgb(31 48 56 / 0.11);
  font-family: "Host Grotesk", system-ui, sans-serif; color: #1f3038;
}
.topo__barra {
  position: relative; display: flex; align-items: center; justify-content: space-between;
  width: min(100% - 160px, 1280px); height: 72px; margin-inline: auto;
}
.topo__logo { font-size: 20px; font-weight: 500; letter-spacing: -0.02em; color: #1f3038; text-decoration: none; }
.topo__links { position: absolute; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; }
.topo__link {
  position: relative; display: inline-flex; align-items: center; height: 44px; padding: 0 12px;
  font-size: 15px; font-weight: 500; white-space: nowrap; color: #3f4f57; text-decoration: none; transition: color .15s;
}
.topo__link::after {
  content: ""; position: absolute; left: 12px; right: 12px; bottom: 8px; height: 2px;
  background: #0d7480; transform: scaleX(0); transform-origin: left; transition: transform .2s ease;
}
.topo__link:hover { color: #1f3038; }
.topo__link:hover::after { transform: scaleX(1); }
.topo__link.ativo { color: #1f3038; }
.topo__link.ativo::after { transform: scaleX(1); }
.topo__menu {
  display: none; width: 44px; height: 44px; place-items: center; border: 0; border-radius: 999px;
  background: #ecf0f2; color: #1f3038; cursor: pointer; transition: background-color 150ms;
}
.topo__menu:hover { background: #dde3e6; }
.topo__pular {
  position: absolute; left: 0; top: 50%; transform: translateY(-50%); z-index: 2;
  padding: 8px 12px; border-radius: 8px; background: #fff; color: #1f3038; opacity: 0; pointer-events: none;
}
.topo__pular:focus-visible { opacity: 1; pointer-events: auto; }
.topo a:focus-visible, .topo button:focus-visible { outline: 2px solid #0d7480; outline-offset: 2px; }
.topo__folha { display: none; }

@media (max-width: 1023px) {
  .topo__barra { width: min(100% - 96px, 1280px); }
  .topo__links { display: none; }
  .topo__menu { display: grid; }
  .topo__folha { display: flex; flex-direction: column; width: min(100% - 96px, 1280px); margin-inline: auto; padding: 8px 0 16px; }
  .topo__item {
    display: flex; align-items: center; height: 56px; border-bottom: 1px solid rgb(31 48 56 / 0.11);
    font-size: 18px; font-weight: 500; color: #1f3038; text-decoration: none;
  }
  .topo__item.ativo { color: #0d7480; }
}
@media (max-width: 639px) {
  .topo__barra { width: calc(100% - 48px); height: 56px; }
  .topo__folha { width: calc(100% - 48px); }
  .topo--aberto { bottom: 0; }
}
</style>

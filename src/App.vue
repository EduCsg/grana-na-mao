<script setup>
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { entrada } from './movimento'

const route = useRoute()
const conteudo = ref(null)

// cada ferramenta entra como a página inicial: título, depois o texto e os blocos
watch(
  () => route.name,
  async (nome) => {
    if (!nome || nome === 'inicio') return
    await nextTick()
    entrada(conteudo.value)
  },
  { immediate: true, flush: 'post' },
)
</script>

<template>
  <AppHeader />

  <!-- A página inicial traz o próprio <main> e o rodapé (kit visual) -->
  <RouterView v-if="route.name === 'inicio'" />

  <div v-else class="flex min-h-screen flex-col pt-14 sm:pt-[72px]">
    <main id="top" ref="conteudo" class="mx-auto w-[calc(100%-48px)] max-w-[1280px] flex-1 py-10 sm:w-[calc(100%-96px)] sm:py-16 lg:w-[calc(100%-160px)]">
      <RouterView />
    </main>

    <footer class="border-t border-stone-900/10">
      <div class="mx-auto flex w-[calc(100%-48px)] max-w-[1280px] flex-col gap-2 py-8 text-sm text-stone-600 sm:w-[calc(100%-96px)] lg:w-[calc(100%-160px)]">
        <p>
          <RouterLink to="/" class="font-medium text-stone-900 hover:underline">Grana na Mão</RouterLink> é um projeto de extensão
          universitária ligado ao ODS 8, trabalho decente e crescimento econômico.
        </p>
        <p>Conteúdo educativo, não é recomendação de investimento. Os dados que você digita ficam só no seu navegador.</p>
      </div>
    </footer>
  </div>
</template>

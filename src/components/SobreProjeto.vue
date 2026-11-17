<template>
  <header class="mb-6">
    <h1 class="titulo-secao">Sobre o projeto</h1>
    <p class="mt-2 max-w-3xl text-stone-600">
      Um projeto de extensão universitária que explica, em linguagem simples, o dinheiro do dia a dia.
    </p>
  </header>

  <div class="grid gap-6 lg:grid-cols-2">
    <section class="card space-y-3 text-stone-700">
      <h2 class="text-xl font-bold text-stone-900">Por que o Grana na Mão existe</h2>
      <p>
        Muita gente usa banco digital, Pix e cartão de crédito todos os dias sem conhecer os próprios direitos ou o custo real das
        compras parceladas. Pequenos empreendedores, por sua vez, costumam definir preços “de olho” e perder o controle do
        faturamento do MEI.
      </p>
      <p>
        Este site reúne, em linguagem simples, um guia de serviços financeiros básicos, um simulador de parcelamento e uma
        calculadora para MEI e autônomos. Tudo gratuito, sem cadastro e sem coletar dados: as informações digitadas ficam apenas
        no navegador de quem usa.
      </p>
    </section>

    <section class="card space-y-3 text-stone-700">
      <h2 class="text-xl font-bold text-stone-900">Projeto de extensão</h2>
      <p>
        Desenvolvido como atividade de extensão do curso de <strong>Ciência da Computação</strong>, na área temática
        <strong>Inclusão Econômica e Acesso a Serviços Financeiros</strong>, alinhada ao
        <strong>ODS 8 – Trabalho decente e crescimento econômico</strong> da Agenda 2030 da ONU.
      </p>
      <p>Autor: <strong>Eduardo Casagrande</strong>.</p>
      <p class="text-sm text-stone-500">
        Tecnologias: Vue.js, Vue Router, Vite e Tailwind CSS, com publicação no GitHub Pages. Valores de referência de 2026:
        salário mínimo, DAS-MEI, limite do MEI e taxas médias do Banco Central.
      </p>
    </section>

    <section class="card space-y-2 text-stone-700 lg:col-span-2">
      <h2 class="text-xl font-bold text-stone-900">Aviso importante</h2>
      <p>
        O conteúdo tem caráter educativo e não substitui orientação de contador, advogado ou consultor financeiro. Regras e valores
        (como o DAS e o limite do MEI) mudam com o tempo: confirme sempre nos canais oficiais (gov.br, Banco Central e Portal do
        Empreendedor).
      </p>
    </section>
  </div>
</template>

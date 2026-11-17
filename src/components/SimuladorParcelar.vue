<script setup>
import { computed, ref } from 'vue'
import { TAXA_ROTATIVO_ANO } from '../data/constantes.js'
import { anualParaMensal, brl, compararParcelamento, pct, simularRotativo } from '../utils/financas.js'

// ---------- À vista x parcelado ----------
const aVista = ref(900)
const n = ref(10)
const modo = ref('parcela') // 'parcela' | 'total'
const parcela = ref(100)
const total = ref(1000)
const primeiraNoAto = ref(false)
const rendimento = ref(0.8)

const valorParcela = computed(() => (modo.value === 'parcela' ? Number(parcela.value) : Number(total.value) / Number(n.value || 1)))

const r = computed(() =>
  compararParcelamento({
    aVista: Number(aVista.value),
    parcela: valorParcela.value,
    n: Math.round(Number(n.value)),
    primeiraNoAto: primeiraNoAto.value,
    rendimentoMes: Number(rendimento.value) || 0,
  }),
)

const veredito = computed(() => {
  const v = r.value
  switch (v.veredito) {
    case 'avista':
      return {
        cor: 'border-amber-300 bg-amber-50',
        titulo: 'Melhor pagar à vista',
        texto: `Mesmo deixando o dinheiro rendendo, parcelar custa cerca de ${brl(v.diferencaHoje)} a mais em valores de hoje. Se você tem o dinheiro guardado, aproveite o desconto.`,
      }
    case 'parcelar':
      return {
        cor: 'border-marca-600 bg-marca-50',
        titulo: 'Parcelar compensa (se o dinheiro ficar rendendo)',
        texto: `Deixando o valor aplicado a ${pct(Number(rendimento.value))} ao mês e pagando as parcelas, você economiza cerca de ${brl(-v.diferencaHoje)}. Só vale se você realmente guardar o dinheiro e não atrasar nenhuma parcela.`,
      }
    case 'empate':
      return {
        cor: 'border-stone-300 bg-white',
        titulo: 'Praticamente empate',
        texto: 'A diferença é pequena. Escolha o que deixa seu orçamento mais tranquilo, sem comprometer as parcelas dos próximos meses.',
      }
    default:
      return {
        cor: 'border-stone-300 bg-stone-50',
        titulo: 'Confira os valores',
        texto: 'Preencha o preço à vista, a quantidade e o valor das parcelas com números maiores que zero.',
      }
  }
})

// ---------- Rotativo do cartão ----------
const divida = ref(1000)
const taxaRotativo = ref(+anualParaMensal(TAXA_ROTATIVO_ANO).toFixed(2))
const meses = ref(12)
const rot = computed(() => simularRotativo(Number(divida.value) || 0, Number(taxaRotativo.value) || 0, Math.min(36, Math.max(1, Math.round(Number(meses.value) || 1)))))
const maxSaldo = computed(() => Math.max(...rot.value.linhas.map((l) => l.saldo), 1))
</script>

<template>
  <header class="mb-6">
    <h1 class="titulo-secao">Vale a pena parcelar?</h1>
    <p class="mt-2 max-w-3xl text-stone-600">
      Muitas vezes o “sem juros” tem juros escondidos no desconto que você perde. Compare e descubra o custo real.
    </p>
  </header>

  <section class="grid gap-6 lg:grid-cols-2">
    <form class="card space-y-4" @submit.prevent>
      <h2 class="text-xl font-bold text-stone-900">1. Dados da compra</h2>

      <div>
        <label class="rotulo" for="avista">Preço à vista (com desconto, se tiver)</label>
        <input id="avista" v-model.number="aVista" class="campo" type="number" min="0" step="0.01" inputmode="decimal" />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="rotulo" for="n">Nº de parcelas</label>
          <input id="n" v-model.number="n" class="campo" type="number" min="1" max="120" step="1" inputmode="numeric" />
        </div>
        <fieldset>
          <legend class="rotulo">Informar</legend>
          <div v-pilula class="flex h-12 rounded-full border border-stone-300 bg-white p-1">
            <button type="button" :aria-pressed="modo === 'parcela'" :class="['flex-1 rounded-full text-sm font-medium', modo === 'parcela' ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900']" @click="modo = 'parcela'">Parcela</button>
            <button type="button" :aria-pressed="modo === 'total'" :class="['flex-1 rounded-full text-sm font-medium', modo === 'total' ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900']" @click="modo = 'total'">Total</button>
          </div>
        </fieldset>
      </div>

      <div v-if="modo === 'parcela'">
        <label class="rotulo" for="parcela">Valor de cada parcela</label>
        <input id="parcela" v-model.number="parcela" class="campo" type="number" min="0" step="0.01" inputmode="decimal" />
      </div>
      <div v-else>
        <label class="rotulo" for="total">Valor total parcelado</label>
        <input id="total" v-model.number="total" class="campo" type="number" min="0" step="0.01" inputmode="decimal" />
      </div>

      <label class="flex items-center gap-3 text-stone-700">
        <input v-model="primeiraNoAto" type="checkbox" class="h-5 w-5 accent-marca-700" />
        A primeira parcela é paga no ato da compra (1 + {{ Math.max(0, n - 1) }})
      </label>

      <div>
        <label class="rotulo" for="rend">Quanto seu dinheiro rende por mês (%)</label>
        <input id="rend" v-model.number="rendimento" class="campo" type="number" min="0" step="0.05" inputmode="decimal" />
        <p class="ajuda">Ex.: dinheiro parado na conta = 0%; poupança e CDBs costumam render entre 0,5% e 1% ao mês.</p>
      </div>
    </form>

    <div class="space-y-4">
      <div class="card grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <p class="text-sm text-stone-500">Total parcelado</p>
          <p v-valor class="text-xl font-bold text-stone-900 sm:text-2xl">{{ brl(r.totalParcelado) }}</p>
          <p class="text-sm text-stone-500">{{ n }}x de {{ brl(valorParcela) }}</p>
        </div>
        <div>
          <p class="text-sm text-stone-500">A mais que à vista</p>
          <p v-valor :class="['text-xl font-bold sm:text-2xl', r.jurosPagos > 0 ? 'text-red-700' : 'text-marca-700']">{{ brl(r.jurosPagos) }}</p>
        </div>
        <div class="col-span-2 rounded-xl bg-stone-100 p-4">
          <p class="text-sm text-stone-600">Juros escondidos no parcelamento</p>
          <p v-valor class="text-3xl font-extrabold text-stone-900">
            {{ Number.isFinite(r.taxaMes) ? pct(r.taxaMes) : '—' }} <span class="text-base font-semibold text-stone-500">ao mês</span>
          </p>
          <p class="text-sm text-stone-600">equivale a {{ Number.isFinite(r.taxaAno) ? pct(r.taxaAno, 1) : '—' }} ao ano</p>
        </div>
      </div>

      <div :class="['rounded-2xl border-2 p-5', veredito.cor]" role="status" aria-live="polite">
        <p class="text-xl font-bold text-stone-900">{{ veredito.titulo }}</p>
        <p class="mt-2 text-stone-700">{{ veredito.texto }}</p>
      </div>

      <div class="card text-sm text-stone-600">
        <p class="font-semibold text-stone-800">Como o cálculo funciona</p>
        <p class="mt-1">
          Calculamos a taxa que transforma o preço à vista nas parcelas (taxa interna de retorno) e trazemos as parcelas para
          valores de hoje usando o rendimento informado. Se as parcelas “valem” menos que o preço à vista, parcelar compensa.
        </p>
      </div>
    </div>
  </section>

  <section class="mt-10">
    <h2 class="text-2xl font-bold text-stone-900">2. E se a fatura não for paga inteira?</h2>
    <p class="mt-1 max-w-3xl text-stone-600">
      Pagar o mínimo leva a dívida para o <strong>rotativo do cartão</strong>, um dos créditos mais caros do país. Pela regra em vigor
      desde 2024, os juros e encargos param de crescer quando chegam a 100% da dívida original, ou seja, ela pode dobrar.
    </p>

    <div class="mt-4 grid gap-6 lg:grid-cols-[320px_1fr]">
      <form class="card space-y-4" @submit.prevent>
        <div>
          <label class="rotulo" for="divida">Valor que ficou sem pagar</label>
          <input id="divida" v-model.number="divida" class="campo" type="number" min="0" step="0.01" inputmode="decimal" />
        </div>
        <div>
          <label class="rotulo" for="taxa">Juros do rotativo (% ao mês)</label>
          <input id="taxa" v-model.number="taxaRotativo" class="campo" type="number" min="0" step="0.1" inputmode="decimal" />
          <p class="ajuda">Padrão: média do Banco Central em 2026 (≈ {{ pct(TAXA_ROTATIVO_ANO, 1) }} ao ano).</p>
        </div>
        <div>
          <label class="rotulo" for="meses">Meses sem quitar (até 36)</label>
          <input id="meses" v-model.number="meses" class="campo" type="number" min="1" max="36" step="1" inputmode="numeric" />
        </div>
        <div class="rounded-xl bg-red-50 p-4 text-red-900">
          <p class="text-sm">Depois de {{ rot.linhas.length }} meses você deveria</p>
          <p v-valor class="text-3xl font-extrabold">{{ brl(rot.saldoFinal) }}</p>
          <p class="text-sm">dos quais {{ brl(rot.jurosAcumulados) }} são só juros.</p>
        </div>
      </form>

      <div class="card">
        <p class="mb-3 font-semibold text-stone-800">Evolução da dívida mês a mês</p>
        <ol class="space-y-1.5">
          <li v-for="l in rot.linhas" :key="l.mes" class="grid grid-cols-[64px_1fr_110px] items-center gap-2 text-sm">
            <span class="text-stone-500">Mês {{ l.mes }}</span>
            <span class="h-5 overflow-hidden rounded bg-stone-100">
              <span :class="['block h-full rounded', l.noTeto ? 'bg-red-700' : 'bg-red-400']" :style="{ width: `${(l.saldo / maxSaldo) * 100}%` }" />
            </span>
            <span class="text-right font-semibold tabular-nums text-stone-800">{{ brl(l.saldo) }}</span>
          </li>
        </ol>
        <p class="mt-3 text-sm text-stone-600">Barras em vermelho escuro: a dívida chegou ao teto legal (juros = 100% do valor original).</p>
        <p class="mt-3 rounded-xl bg-marca-50 p-3 text-sm text-marca-900">
          Saída: troque o rotativo por um empréstimo mais barato (veja “Crédito: do mais barato ao mais caro” no Guia) ou negocie um parcelamento com taxa menor.
        </p>
      </div>
    </div>
  </section>
</template>

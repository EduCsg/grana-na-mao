<script setup>
import { computed, ref, watch } from 'vue'
import {
  ANO_REFERENCIA,
  ATIVIDADES_MEI,
  INSS_MEI,
  LIMITE_MEI_ANUAL,
  LIMITE_MEI_TOLERANCIA,
  SALARIO_MINIMO,
} from '../data/constantes.js'
import { brl, pct, precoVenda, valorHoraDesejado } from '../utils/financas.js'

const aba = ref('preco')
const abas = [
  { id: 'preco', nome: 'Preço de venda', curto: 'Preço' },
  { id: 'das', nome: 'DAS e limite', curto: 'DAS e limite' },
  { id: 'caixa', nome: 'Controle de caixa', curto: 'Caixa' },
]

// ---------- Preço de venda ----------
const rendaDesejada = ref(2500)
const horasMes = ref(160)
const valorHora = ref(+valorHoraDesejado(2500, 160).toFixed(2))
const usarSugestaoHora = () => (valorHora.value = +valorHoraDesejado(Number(rendaDesejada.value), Number(horasMes.value)).toFixed(2))

const material = ref(20)
const horasUnidade = ref(1)
const custosFixos = ref(300)
const unidadesMes = ref(100)
const margem = ref(20)
const taxaCartao = ref(3)

const preco = computed(() =>
  precoVenda({
    material: Number(material.value),
    horas: Number(horasUnidade.value),
    valorHora: Number(valorHora.value),
    custosFixosMes: Number(custosFixos.value),
    unidadesMes: Number(unidadesMes.value),
    margem: Number(margem.value),
    taxaCartao: Number(taxaCartao.value),
  }),
)

// ---------- DAS e limite ----------
const atividade = ref('servicos')
const atividadeSel = computed(() => ATIVIDADES_MEI.find((a) => a.id === atividade.value))
const das = computed(() => INSS_MEI + atividadeSel.value.extra)
const mesAbertura = ref(1) // 1 = já era MEI em janeiro
const limiteProporcional = computed(() => (LIMITE_MEI_ANUAL / 12) * (13 - Number(mesAbertura.value)))
const meses = ['Janeiro (ou antes)', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

// ---------- Controle de caixa ----------
const CHAVE = 'gnm-caixa-v1'
const carregar = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || []
  } catch {
    return []
  }
}
const lancamentos = ref(carregar())
watch(
  lancamentos,
  (v) => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(v))
    } catch {
      /* sem armazenamento */
    }
  },
  { deep: true },
)

// data local (toISOString usaria o horário UTC e, à noite no Brasil, já mostraria o dia seguinte)
const hoje = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const novo = ref({ data: hoje(), descricao: '', tipo: 'entrada', valor: null })
const erro = ref('')

const adicionar = () => {
  const valor = Number(novo.value.valor)
  if (!novo.value.descricao.trim()) return (erro.value = 'Escreva uma descrição.')
  if (!(valor > 0)) return (erro.value = 'Informe um valor maior que zero.')
  if (!novo.value.data) return (erro.value = 'Informe a data.')
  erro.value = ''
  lancamentos.value.push({ id: Date.now(), ...novo.value, descricao: novo.value.descricao.trim(), valor })
  lancamentos.value.sort((a, b) => b.data.localeCompare(a.data))
  novo.value = { data: novo.value.data, descricao: '', tipo: novo.value.tipo, valor: null }
}
const remover = (id) => (lancamentos.value = lancamentos.value.filter((l) => l.id !== id))

const anoFiltro = ref(new Date().getFullYear())
const anosDisponiveis = computed(() => {
  const anos = new Set(lancamentos.value.map((l) => Number(l.data.slice(0, 4))))
  anos.add(new Date().getFullYear())
  return [...anos].sort((a, b) => b - a)
})
const doAno = computed(() => lancamentos.value.filter((l) => Number(l.data.slice(0, 4)) === Number(anoFiltro.value)))
const entradas = computed(() => doAno.value.filter((l) => l.tipo === 'entrada').reduce((s, l) => s + l.valor, 0))
const saidas = computed(() => doAno.value.filter((l) => l.tipo === 'saida').reduce((s, l) => s + l.valor, 0))
const usoLimite = computed(() => (entradas.value / limiteProporcional.value) * 100)
const alertaLimite = computed(() => {
  if (entradas.value > LIMITE_MEI_TOLERANCIA) return { cor: 'bg-red-100 text-red-900', txt: 'Faturamento passou de 20% acima do limite. Procure um contador: o desenquadramento retroage ao início do ano.' }
  if (usoLimite.value > 100) return { cor: 'bg-red-50 text-red-900', txt: 'Você passou do limite do MEI. Até 20% acima, dá para continuar até dezembro pagando um DAS complementar; procure orientação contábil.' }
  if (usoLimite.value >= 80) return { cor: 'bg-amber-50 text-amber-900', txt: 'Atenção: você já usou mais de 80% do limite do ano. Planeje-se.' }
  return { cor: 'bg-marca-50 text-marca-900', txt: 'Faturamento dentro do limite do MEI.' }
})

const porMes = computed(() => {
  const m = Array.from({ length: 12 }, () => ({ e: 0, s: 0 }))
  doAno.value.forEach((l) => {
    const i = Number(l.data.slice(5, 7)) - 1
    if (l.tipo === 'entrada') m[i].e += l.valor
    else m[i].s += l.valor
  })
  return m
})
const maxMes = computed(() => Math.max(1, ...porMes.value.map((x) => Math.max(x.e, x.s))))
const siglas = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const exportarCsv = () => {
  const linhas = [['Data', 'Descricao', 'Tipo', 'Valor']]
  doAno.value.forEach((l) => linhas.push([l.data, `"${l.descricao.replace(/"/g, '""')}"`, l.tipo, l.valor.toFixed(2).replace('.', ',')]))
  const blob = new Blob(['﻿' + linhas.map((l) => l.join(';')).join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `caixa-mei-${anoFiltro.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const confirmarLimpar = ref(false)
const limparTudo = () => {
  if (!confirmarLimpar.value) return (confirmarLimpar.value = true)
  lancamentos.value = []
  confirmarLimpar.value = false
}

const carregarExemplo = () => {
  const ano = new Date().getFullYear()
  lancamentos.value = [
    { id: 1, data: `${ano}-01-10`, descricao: 'Vendas de bolos (semana)', tipo: 'entrada', valor: 850 },
    { id: 2, data: `${ano}-01-15`, descricao: 'Compra de ingredientes', tipo: 'saida', valor: 320 },
    { id: 3, data: `${ano}-01-20`, descricao: 'DAS MEI', tipo: 'saida', valor: 82.05 },
    { id: 4, data: `${ano}-02-08`, descricao: 'Encomenda de festa', tipo: 'entrada', valor: 1200 },
    { id: 5, data: `${ano}-02-12`, descricao: 'Embalagens', tipo: 'saida', valor: 140 },
    { id: 6, data: `${ano}-03-05`, descricao: 'Vendas da feira', tipo: 'entrada', valor: 980 },
  ].sort((a, b) => b.data.localeCompare(a.data))
}
</script>

<template>
  <header class="mb-6">
    <h1 class="titulo-secao">Calculadora para MEI e autônomos</h1>
    <p class="mt-2 max-w-3xl text-stone-600">
      Para quem vende produtos ou serviços por conta própria: precifique sem prejuízo, saiba quanto pagar de DAS e acompanhe o faturamento.
    </p>
  </header>

  <div v-pilula class="mb-6 flex h-12 w-full rounded-full border border-stone-300 bg-white p-1 sm:w-fit" role="tablist" aria-label="Ferramentas do MEI">
    <button
      v-for="a in abas"
      :key="a.id"
      role="tab"
      :aria-selected="aba === a.id"
      :class="['flex-1 whitespace-nowrap rounded-full px-2 text-sm font-medium sm:flex-none sm:px-5 sm:text-base', aba === a.id ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900']"
      @click="aba = a.id"
    >
      <span class="sm:hidden">{{ a.curto }}</span><span class="hidden sm:inline">{{ a.nome }}</span>
    </button>
  </div>

  <Transition name="m-troca" mode="out-in">
  <!-- PREÇO -->
  <section v-if="aba === 'preco'" class="grid gap-6 lg:grid-cols-2">
    <form class="space-y-4" @submit.prevent>
      <div class="card space-y-4">
        <h2 class="text-lg font-bold text-stone-900">Quanto vale a sua hora?</h2>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="rotulo" for="renda">Quanto quer ganhar por mês</label>
            <input id="renda" v-model.number="rendaDesejada" class="campo" type="number" min="0" step="50" inputmode="decimal" />
          </div>
          <div>
            <label class="rotulo" for="hmes">Horas de trabalho por mês</label>
            <input id="hmes" v-model.number="horasMes" class="campo" type="number" min="1" step="1" inputmode="numeric" />
          </div>
        </div>
        <button type="button" class="btn-secundario w-full" @click="usarSugestaoHora">
          Usar {{ brl(valorHoraDesejado(rendaDesejada, horasMes)) }} por hora
        </button>
      </div>

      <div class="card space-y-4">
        <h2 class="text-lg font-bold text-stone-900">Custos de cada produto ou serviço</h2>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="rotulo" for="mat">Material / insumos (R$)</label>
            <input id="mat" v-model.number="material" class="campo" type="number" min="0" step="0.01" inputmode="decimal" />
          </div>
          <div>
            <label class="rotulo" for="hu">Horas por unidade</label>
            <input id="hu" v-model.number="horasUnidade" class="campo" type="number" min="0" step="0.25" inputmode="decimal" />
          </div>
          <div>
            <label class="rotulo" for="vh">Valor da hora (R$)</label>
            <input id="vh" v-model.number="valorHora" class="campo" type="number" min="0" step="0.5" inputmode="decimal" />
          </div>
          <div>
            <label class="rotulo" for="cf">Custos fixos do mês (R$)</label>
            <input id="cf" v-model.number="custosFixos" class="campo" type="number" min="0" step="1" inputmode="decimal" />
            <p class="ajuda">Internet, luz, aluguel, DAS…</p>
          </div>
          <div>
            <label class="rotulo" for="um">Unidades vendidas no mês</label>
            <input id="um" v-model.number="unidadesMes" class="campo" type="number" min="1" step="1" inputmode="numeric" />
          </div>
          <div>
            <label class="rotulo" for="mg">Margem de lucro (%)</label>
            <input id="mg" v-model.number="margem" class="campo" type="number" min="0" max="90" step="1" inputmode="decimal" />
          </div>
          <div class="sm:col-span-2">
            <label class="rotulo" for="tx">Taxa da maquininha / app (%)</label>
            <input id="tx" v-model.number="taxaCartao" class="campo" type="number" min="0" max="50" step="0.1" inputmode="decimal" />
          </div>
        </div>
      </div>
    </form>

    <div class="space-y-4">
      <div class="rounded-2xl bg-marca-700 p-6 text-white">
        <p class="text-marca-100">Preço de venda sugerido</p>
        <p v-valor class="text-5xl font-extrabold">{{ preco.invalido ? '—' : brl(preco.preco) }}</p>
        <p v-if="preco.invalido" class="mt-2 text-sm">Margem + taxa precisam somar menos de 100%.</p>
      </div>
      <div class="card">
        <h3 class="font-bold text-stone-900">De onde vem esse preço</h3>
        <dl class="mt-3 divide-y divide-stone-100">
          <div class="flex justify-between py-2"><dt>Material</dt><dd class="font-semibold">{{ brl(material) }}</dd></div>
          <div class="flex justify-between py-2"><dt>Mão de obra ({{ horasUnidade }} h × {{ brl(valorHora) }})</dt><dd class="font-semibold">{{ brl(preco.maoDeObra) }}</dd></div>
          <div class="flex justify-between py-2"><dt>Parte dos custos fixos</dt><dd class="font-semibold">{{ brl(preco.rateio) }}</dd></div>
          <div class="flex justify-between py-2 font-bold"><dt>Custo total por unidade</dt><dd>{{ brl(preco.custoUnitario) }}</dd></div>
          <div class="flex justify-between py-2"><dt>Taxa da maquininha</dt><dd class="font-semibold">{{ brl(preco.taxaUnidade) }}</dd></div>
          <div class="flex justify-between py-2 text-marca-800"><dt>Lucro por unidade</dt><dd class="font-bold">{{ brl(preco.lucroUnidade) }}</dd></div>
        </dl>
        <p class="mt-3 text-sm text-stone-600">
          Vendendo {{ unidadesMes }} unidades nesse preço, o lucro do mês fica em torno de
          <strong>{{ brl(preco.lucroUnidade * unidadesMes) }}</strong>, além da sua mão de obra já paga.
        </p>
      </div>
    </div>
  </section>

  <!-- DAS -->
  <section v-else-if="aba === 'das'" class="grid gap-6 lg:grid-cols-2">
    <div class="card space-y-4">
      <h2 class="text-lg font-bold text-stone-900">Quanto pago de DAS em {{ ANO_REFERENCIA }}?</h2>
      <fieldset class="space-y-2">
        <legend class="rotulo">Sua atividade</legend>
        <label
          v-for="a in ATIVIDADES_MEI"
          :key="a.id"
          :class="['m-opcao flex cursor-pointer items-center gap-3 rounded-xl border p-3', atividade === a.id ? 'border-marca-600 bg-marca-50' : 'border-stone-200 hover:border-stone-400 hover:bg-stone-50']"
        >
          <input v-model="atividade" type="radio" :value="a.id" class="h-5 w-5 accent-marca-700" />
          <span class="flex-1">
            <span class="block font-semibold">{{ a.nome }}</span>
            <span class="block text-sm text-stone-500">{{ a.detalhe }}</span>
          </span>
          <span class="font-bold">{{ brl(INSS_MEI + a.extra) }}</span>
        </label>
      </fieldset>
      <div class="rounded-xl bg-stone-100 p-4">
        <p class="text-sm text-stone-600">Seu DAS mensal</p>
        <p v-valor class="text-4xl font-extrabold text-stone-900">{{ brl(das) }}</p>
        <p class="text-sm text-stone-600">Vence todo dia 20 · {{ brl(das * 12) }} por ano</p>
      </div>
      <p class="ajuda">
        Composição: 5% do salário mínimo de {{ brl(SALARIO_MINIMO) }} para o INSS ({{ brl(INSS_MEI) }}) + ICMS e/ou ISS. O DAS é pago mesmo em meses sem venda.
        MEI caminhoneiro tem regras próprias.
      </p>
    </div>

    <div class="card space-y-4">
      <h2 class="text-lg font-bold text-stone-900">Limite de faturamento</h2>
      <p class="text-stone-700">
        Em {{ ANO_REFERENCIA }}, o MEI pode faturar até <strong>{{ brl(LIMITE_MEI_ANUAL) }}</strong> por ano
        (média de {{ brl(LIMITE_MEI_ANUAL / 12) }} por mês). O que conta é a soma do ano, não cada mês.
      </p>
      <div>
        <label class="rotulo" for="abertura">Mês em que virou MEI neste ano</label>
        <select id="abertura" v-model.number="mesAbertura" class="campo">
          <option v-for="(m, i) in meses" :key="m" :value="i + 1">{{ m }}</option>
        </select>
        <p class="ajuda">Quem abriu o MEI no meio do ano tem limite proporcional aos meses de atividade.</p>
      </div>
      <div class="rounded-xl bg-marca-50 p-4 text-marca-900">
        <p class="text-sm">Seu limite neste ano</p>
        <p v-valor class="text-3xl font-extrabold">{{ brl(limiteProporcional) }}</p>
      </div>
      <ul class="space-y-1 text-sm text-stone-700">
        <li>• Passou até 20% do limite: continua MEI até dezembro e paga um DAS complementar sobre o excesso.</li>
        <li>• Passou mais de 20%: é desenquadrado desde o início do ano. Procure um contador.</li>
        <li>• Há mudanças de limite previstas para os próximos anos: confira sempre no Portal do Empreendedor (gov.br/mei).</li>
      </ul>
    </div>
  </section>

  <!-- CAIXA -->
  <section v-else class="space-y-6">
    <div class="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form class="card space-y-3" @submit.prevent="adicionar">
        <h2 class="text-lg font-bold text-stone-900">Novo lançamento</h2>
        <div v-pilula class="flex h-12 rounded-full border border-stone-300 bg-white p-1" :style="{ '--pilula': novo.tipo === 'saida' ? '#b42318' : '#0d7480' }">
          <button type="button" :aria-pressed="novo.tipo === 'entrada'" :class="['flex-1 rounded-full font-medium', novo.tipo === 'entrada' ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900']" @click="novo.tipo = 'entrada'">Entrada</button>
          <button type="button" :aria-pressed="novo.tipo === 'saida'" :class="['flex-1 rounded-full font-medium', novo.tipo === 'saida' ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900']" @click="novo.tipo = 'saida'">Saída</button>
        </div>
        <div>
          <label class="rotulo" for="ld">Data</label>
          <input id="ld" v-model="novo.data" class="campo" type="date" />
        </div>
        <div>
          <label class="rotulo" for="ldesc">Descrição</label>
          <input id="ldesc" v-model="novo.descricao" class="campo" type="text" maxlength="80" placeholder="Ex.: venda de 10 marmitas" />
        </div>
        <div>
          <label class="rotulo" for="lv">Valor (R$)</label>
          <input id="lv" v-model.number="novo.valor" class="campo" type="number" min="0" step="0.01" inputmode="decimal" />
        </div>
        <p v-if="erro" class="text-sm font-semibold text-red-700" role="alert">{{ erro }}</p>
        <button class="btn-primario w-full" type="submit">Adicionar</button>
        <p class="ajuda">Os lançamentos ficam salvos só neste navegador.</p>
      </form>

      <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-3">
          <label class="rotulo mb-0" for="ano">Ano</label>
          <select id="ano" v-model.number="anoFiltro" class="campo w-auto">
            <option v-for="a in anosDisponiveis" :key="a" :value="a">{{ a }}</option>
          </select>
          <button class="btn-secundario" :disabled="!doAno.length" @click="exportarCsv">Exportar planilha (CSV)</button>
          <button v-if="!lancamentos.length" class="btn-secundario" @click="carregarExemplo">Ver exemplo</button>
          <button v-else class="btn-secundario text-red-700" @click="limparTudo">{{ confirmarLimpar ? 'Clique de novo para apagar tudo' : 'Apagar tudo' }}</button>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div class="card p-4 sm:p-4"><p class="text-sm text-stone-500">Entradas</p><p v-valor class="text-2xl font-bold text-marca-700">{{ brl(entradas) }}</p></div>
          <div class="card p-4 sm:p-4"><p class="text-sm text-stone-500">Saídas</p><p v-valor class="text-2xl font-bold text-red-700">{{ brl(saidas) }}</p></div>
          <div class="card p-4 sm:p-4"><p class="text-sm text-stone-500">Saldo</p><p v-valor :class="['text-2xl font-bold', entradas - saidas >= 0 ? 'text-stone-900' : 'text-red-700']">{{ brl(entradas - saidas) }}</p></div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between text-sm">
            <span class="font-semibold text-stone-800">Uso do limite do MEI ({{ brl(limiteProporcional) }})</span>
            <span class="font-bold">{{ pct(usoLimite, 1) }}</span>
          </div>
          <div class="mt-2 h-3 overflow-hidden rounded-full bg-stone-200">
            <div
              :class="['h-full transition-all', usoLimite >= 100 ? 'bg-red-600' : usoLimite >= 80 ? 'bg-amber-500' : 'bg-marca-600']"
              :style="{ width: `${Math.min(100, usoLimite)}%` }"
            />
          </div>
          <p :class="['mt-3 rounded-lg p-2 text-sm', alertaLimite.cor]">{{ alertaLimite.txt }}</p>
        </div>

        <div class="card">
          <p class="mb-3 font-semibold text-stone-800">Entradas e saídas por mês</p>
          <div class="flex h-40 items-end gap-1.5" aria-hidden="true">
            <div v-for="(m, i) in porMes" :key="i" class="flex flex-1 flex-col items-center gap-1">
              <div class="flex h-32 w-full items-end justify-center gap-0.5">
                <div class="w-1/2 rounded-t bg-marca-600" :style="{ height: `${(m.e / maxMes) * 100}%` }" />
                <div class="w-1/2 rounded-t bg-red-400" :style="{ height: `${(m.s / maxMes) * 100}%` }" />
              </div>
              <span class="text-xs text-stone-600">{{ siglas[i] }}</span>
            </div>
          </div>
          <p class="mt-2 text-sm text-stone-600"><span class="text-marca-600">■</span> entradas · <span class="text-red-400">■</span> saídas</p>
        </div>
      </div>
    </div>

    <div class="card overflow-x-auto">
      <h2 class="mb-3 text-lg font-bold text-stone-900">Lançamentos de {{ anoFiltro }}</h2>
      <p v-if="!doAno.length" class="text-stone-500">Nenhum lançamento ainda.</p>
      <table v-else class="w-full min-w-[520px] text-left text-sm">
        <thead class="text-stone-500">
          <tr><th class="py-2">Data</th><th>Descrição</th><th>Tipo</th><th class="text-right">Valor</th><th class="sr-only">Ações</th></tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <tr v-for="l in doAno" :key="l.id">
            <td class="py-2 tabular-nums">{{ l.data.split('-').reverse().join('/') }}</td>
            <td>{{ l.descricao }}</td>
            <td><span :class="['rounded-full px-2 py-0.5 text-[13px] font-medium', l.tipo === 'entrada' ? 'bg-marca-100 text-marca-800' : 'bg-red-100 text-red-800']">{{ l.tipo === 'entrada' ? 'Entrada' : 'Saída' }}</span></td>
            <td :class="['text-right font-semibold tabular-nums', l.tipo === 'entrada' ? 'text-marca-700' : 'text-red-700']">{{ brl(l.valor) }}</td>
            <td class="text-right"><button class="rounded-lg px-2 py-1 text-stone-500 hover:bg-stone-100 hover:text-red-700" :aria-label="`Remover ${l.descricao}`" @click="remover(l.id)">✕</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  </Transition>
</template>

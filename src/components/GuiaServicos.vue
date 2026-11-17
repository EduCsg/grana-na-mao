<script setup>
import { ref, watch } from 'vue'
import { TAXA_CHEQUE_ESPECIAL_ANO, TAXA_ROTATIVO_ANO } from '../data/constantes.js'
import { pct } from '../utils/financas.js'

const topicos = [
  {
    id: 'conta',
    titulo: 'Conta no banco sem pagar tarifa',
    resumo: 'Você tem direito a uma conta com serviços essenciais gratuitos.',
    itens: [
      'Todo banco é obrigado a oferecer um pacote de serviços essenciais gratuito. Peça explicitamente por ele: muitos bancos oferecem primeiro um pacote pago.',
      'Bancos digitais costumam ter conta 100% gratuita, abertas pelo celular com documento com foto e CPF.',
      'O Pix é gratuito para pessoas físicas no uso pessoal (enviar e receber).',
      'Antes de abrir conta, confira se a instituição é autorizada pelo Banco Central (busca “Encontre uma instituição” no site do BC).',
    ],
  },
  {
    id: 'pix',
    titulo: 'Pix com segurança',
    resumo: 'Os golpes mais comuns e como se proteger.',
    itens: [
      'Desconfie de pressa: “mãe, troquei de número”, “seu pedido está retido”, “sua conta será bloqueada”. Ligue para a pessoa ou para o banco pelo número oficial antes de pagar.',
      'Confira sempre o nome e o banco de quem vai receber na tela de confirmação. QR Code também pode ser falso.',
      'Das 20h às 6h, o Pix entre pessoas tem um limite menor, de R$ 1.000 por padrão. Mantenha esse limite baixo: o banco leva de 24 a 48 horas para aumentá-lo, o que atrapalha golpistas.',
      'Caiu em golpe? Avise o banco na hora e peça o MED (Mecanismo Especial de Devolução). Registre boletim de ocorrência.',
      'Banco e Banco Central não pedem senha, código por SMS nem “teste de Pix”.',
    ],
  },
  {
    id: 'registrato',
    titulo: 'Descubra empréstimos e contas no seu nome',
    resumo: 'O Registrato, do Banco Central, é gratuito.',
    itens: [
      'No Registrato (registrato.bcb.gov.br) você entra com a conta gov.br e vê empréstimos, financiamentos, contas abertas e chaves Pix no seu CPF.',
      'Use para conferir se alguém abriu conta ou pegou empréstimo no seu nome.',
      'Também ajuda a organizar dívidas: o relatório mostra quanto você deve e para quem.',
    ],
  },
  {
    id: 'svr',
    titulo: 'Dinheiro esquecido no banco',
    resumo: 'Consulte o Sistema Valores a Receber (SVR).',
    itens: [
      'Acesse somente o site oficial: valoresareceber.bcb.gov.br (entre com gov.br).',
      'Pode haver dinheiro de contas antigas, tarifas cobradas indevidamente e cotas de consórcio, inclusive de parentes falecidos.',
      'O Banco Central não manda link por SMS, e-mail ou WhatsApp e não cobra nada. Mensagem dizendo isso é golpe.',
    ],
  },
  {
    id: 'credito',
    titulo: 'Crédito: do mais barato ao mais caro',
    resumo: 'Precisa pegar dinheiro? Compare antes.',
    itens: [
      'Sempre compare o CET (Custo Efetivo Total), não só a taxa de juros. O banco é obrigado a informar.',
      'Em geral, do mais barato ao mais caro: consignado → financiamento com garantia → empréstimo pessoal → cheque especial → rotativo do cartão.',
      `Taxas médias recentes (Banco Central, 2026): cheque especial ≈ ${pct(TAXA_CHEQUE_ESPECIAL_ANO, 1)} ao ano; rotativo do cartão ≈ ${pct(TAXA_ROTATIVO_ANO, 1)} ao ano.`,
      'Desde 2024, os juros e encargos do rotativo e do parcelamento da fatura não podem passar de 100% do valor original da dívida. Mesmo assim, a dívida pode dobrar.',
      'Se entrou no cheque especial ou no rotativo, troque essa dívida por um empréstimo mais barato o quanto antes.',
    ],
  },
  {
    id: 'negociar',
    titulo: 'Nome sujo? Como renegociar',
    resumo: 'Passo a passo para sair do vermelho.',
    itens: [
      'Liste todas as dívidas (o Registrato ajuda) e comece pelas de juros mais altos.',
      'Negocie direto com o credor ou em plataformas e feirões de renegociação. Só aceite parcela que caiba no orçamento.',
      'Peça o acordo por escrito e guarde os comprovantes. Depois de pagar, o nome deve sair dos cadastros de inadimplentes.',
      'Problema com banco ou empresa? Registre reclamação no consumidor.gov.br ou no Procon da sua cidade.',
    ],
  },
  {
    id: 'mei',
    titulo: 'Formalizar o seu trabalho (MEI)',
    resumo: 'Virar MEI é gratuito e dá direito a benefícios do INSS.',
    itens: [
      'A abertura é gratuita no Portal do Empreendedor (gov.br/mei). Sites que cobram para abrir MEI ou para emitir o DAS não são oficiais.',
      'Como MEI você tem CNPJ, pode emitir nota fiscal e contribui para aposentadoria, auxílio-doença e salário-maternidade.',
      'O DAS vence todo dia 20 e pode ser pago pelo app MEI ou pelo PGMEI, inclusive com Pix.',
      'Na página MEI deste site você calcula o preço de venda e o DAS e acompanha o limite de faturamento.',
    ],
  },
]

const aberto = ref('conta')
const alternar = (id) => (aberto.value = aberto.value === id ? null : id)

// Checklist com salvamento local
const tarefas = [
  { id: 't1', texto: 'Pedi o pacote de serviços essenciais gratuito (ou uso conta gratuita)' },
  { id: 't2', texto: 'Ajustei um limite de Pix noturno baixo' },
  { id: 't3', texto: 'Consultei o Registrato' },
  { id: 't4', texto: 'Consultei o Valores a Receber no site oficial' },
  { id: 't5', texto: 'Listei minhas dívidas da mais cara para a mais barata' },
  { id: 't6', texto: 'Combinei com a família uma “palavra-senha” contra golpe do falso parente' },
]
const CHAVE = 'gnm-checklist-v1'
const ler = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || {}
  } catch {
    return {}
  }
}
const feitos = ref(ler())
watch(
  feitos,
  (v) => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(v))
    } catch {
      /* sem armazenamento */
    }
  },
  { deep: true },
)
const concluidas = () => tarefas.filter((t) => feitos.value[t.id]).length
</script>

<template>
  <header class="mb-6">
    <h1 class="titulo-secao">Guia de serviços financeiros básicos</h1>
    <p class="mt-2 max-w-3xl text-stone-600">
      O essencial para usar o banco a seu favor: seus direitos, como se proteger de golpes e onde buscar ajuda gratuita.
    </p>
  </header>

  <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
    <section class="space-y-3" aria-label="Tópicos do guia">
      <article v-for="t in topicos" :key="t.id" class="card m-topico p-0 sm:p-0">
        <h2>
          <button
            class="m-sem-passo flex w-full items-center gap-3 p-5 text-left"
            :aria-expanded="aberto === t.id"
            :aria-controls="`painel-${t.id}`"
            @click="alternar(t.id)"
          >
            <span class="flex-1">
              <span class="block text-lg font-bold text-stone-900">{{ t.titulo }}</span>
              <span class="block text-sm text-stone-600">{{ t.resumo }}</span>
            </span>
            <span class="m-mais" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 7h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /><path class="v" d="M7 1v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg></span>
          </button>
        </h2>
        <Transition name="m-abre">
        <div v-show="aberto === t.id" :id="`painel-${t.id}`" class="border-t border-stone-100 px-5 pb-5 pt-3">
          <ul class="space-y-2">
            <li v-for="(item, i) in t.itens" :key="i" class="flex gap-2 text-stone-700">
              <span class="mt-1 text-marca-600" aria-hidden="true">●</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        </Transition>
      </article>
    </section>

    <aside class="card h-fit lg:sticky lg:top-24">
      <h2 class="text-lg font-bold text-stone-900">Meu checklist</h2>
      <p class="text-sm text-stone-600">{{ concluidas() }} de {{ tarefas.length }} feitos</p>
      <div class="mt-2 h-2 overflow-hidden rounded-full bg-stone-200">
        <div class="h-full bg-marca-600 transition-all" :style="{ width: `${(concluidas() / tarefas.length) * 100}%` }" />
      </div>
      <ul class="mt-4 space-y-3">
        <li v-for="t in tarefas" :key="t.id">
          <label class="flex cursor-pointer gap-3 text-stone-700">
            <input v-model="feitos[t.id]" type="checkbox" class="mt-1 h-5 w-5 shrink-0 accent-marca-700" />
            <span :class="feitos[t.id] ? 'text-stone-400 line-through' : ''">{{ t.texto }}</span>
          </label>
        </li>
      </ul>
    </aside>
  </div>
</template>

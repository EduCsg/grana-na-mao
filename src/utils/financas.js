// Funções puras de cálculo financeiro (fáceis de testar).

export const brl = (v) =>
  (Number.isFinite(v) ? v : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const pct = (v, casas = 2) =>
  `${(Number.isFinite(v) ? v : 0).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`

/** Converte taxa anual (%) em mensal equivalente (%). */
export const anualParaMensal = (taxaAno) => (Math.pow(1 + taxaAno / 100, 1 / 12) - 1) * 100

/** Converte taxa mensal (%) em anual equivalente (%). */
export const mensalParaAnual = (taxaMes) => (Math.pow(1 + taxaMes / 100, 12) - 1) * 100

/** Valor presente de uma série de parcelas iguais (1ª parcela daqui a 1 mês). */
export function valorPresente(parcela, n, taxaMes) {
  const i = taxaMes / 100
  if (i === 0) return parcela * n
  return (parcela * (1 - Math.pow(1 + i, -n))) / i
}

/**
 * Taxa de juros mensal "escondida" no parcelamento.
 * @param {number} aVista preço à vista (com desconto, se houver)
 * @param {number} parcela valor de cada parcela
 * @param {number} n número de parcelas
 * @param {boolean} primeiraNoAto se a 1ª parcela é paga no ato (1 + n-1)
 * @returns {number} taxa mensal em %, 0 se não há juros, NaN se dados inválidos
 */
export function taxaImplicita(aVista, parcela, n, primeiraNoAto = false) {
  if (!(aVista > 0 && parcela > 0 && n >= 1)) return NaN
  const financiado = primeiraNoAto ? aVista - parcela : aVista
  const parcelasFuturas = primeiraNoAto ? n - 1 : n
  if (parcelasFuturas === 0) return parcela >= aVista ? 0 : NaN
  if (financiado <= 0) return NaN
  if (parcela * parcelasFuturas <= financiado + 1e-9) return 0
  let lo = 0
  let hi = 1 // 100% ao mês
  while (valorPresente(parcela, parcelasFuturas, hi * 100) > financiado) hi *= 2
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2
    if (valorPresente(parcela, parcelasFuturas, mid * 100) > financiado) lo = mid
    else hi = mid
  }
  return ((lo + hi) / 2) * 100
}

/**
 * Compara pagar à vista com parcelar deixando o dinheiro rendendo.
 * Retorna quanto o parcelamento "custa" a mais (ou economiza) em valores de hoje.
 */
export function compararParcelamento({ aVista, parcela, n, primeiraNoAto, rendimentoMes }) {
  const totalParcelado = parcela * n
  const taxaMes = taxaImplicita(aVista, parcela, n, primeiraNoAto)
  const futuras = primeiraNoAto ? n - 1 : n
  const vpParcelas = (primeiraNoAto ? parcela : 0) + valorPresente(parcela, futuras, rendimentoMes)
  const diferencaHoje = vpParcelas - aVista // > 0: parcelar sai mais caro
  let veredito
  if (!Number.isFinite(taxaMes)) veredito = 'invalido'
  else if (diferencaHoje > 0.005 * aVista) veredito = 'avista'
  else if (diferencaHoje < -0.005 * aVista) veredito = 'parcelar'
  else veredito = 'empate'
  return {
    totalParcelado,
    jurosPagos: totalParcelado - aVista,
    taxaMes,
    taxaAno: Number.isFinite(taxaMes) ? mensalParaAnual(taxaMes) : NaN,
    vpParcelas,
    diferencaHoje,
    veredito,
  }
}

/**
 * Simula a dívida do cartão no rotativo/parcelamento da fatura mês a mês,
 * respeitando o teto legal: juros e encargos limitados a 100% do valor original.
 */
export function simularRotativo(divida, taxaMes, meses) {
  const linhas = []
  let saldo = divida
  let jurosAcumulados = 0
  for (let m = 1; m <= meses; m++) {
    let juros = saldo * (taxaMes / 100)
    if (jurosAcumulados + juros > divida) juros = Math.max(0, divida - jurosAcumulados)
    jurosAcumulados += juros
    saldo += juros
    linhas.push({ mes: m, juros, saldo, noTeto: jurosAcumulados >= divida - 1e-9 })
  }
  return { linhas, saldoFinal: saldo, jurosAcumulados }
}

/**
 * Preço de venda sugerido para MEI/autônomo.
 * custoUnitario = material + mão de obra + rateio dos custos fixos
 * preço = custoUnitario / (1 - (margem + taxas)/100)
 */
export function precoVenda({ material, horas, valorHora, custosFixosMes, unidadesMes, margem, taxaCartao }) {
  const maoDeObra = (horas || 0) * (valorHora || 0)
  const rateio = unidadesMes > 0 ? (custosFixosMes || 0) / unidadesMes : 0
  const custoUnitario = (material || 0) + maoDeObra + rateio
  const percentual = ((margem || 0) + (taxaCartao || 0)) / 100
  const preco = percentual < 1 ? custoUnitario / (1 - percentual) : NaN
  return {
    maoDeObra,
    rateio,
    custoUnitario,
    preco,
    lucroUnidade: preco * ((margem || 0) / 100),
    taxaUnidade: preco * ((taxaCartao || 0) / 100),
    invalido: !(percentual < 1),
  }
}

/** Valor da hora de trabalho a partir da renda desejada. */
export const valorHoraDesejado = (rendaMes, horasMes) => (horasMes > 0 ? rendaMes / horasMes : 0)

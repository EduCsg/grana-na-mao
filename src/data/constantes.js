// Valores de referência para 2026.
// Revise todo início de ano: o DAS acompanha o salário mínimo.
export const ANO_REFERENCIA = 2026
export const SALARIO_MINIMO = 1621.0

// DAS-MEI = 5% do salário mínimo (INSS) + ICMS (R$ 1) e/ou ISS (R$ 5)
export const INSS_MEI = +(SALARIO_MINIMO * 0.05).toFixed(2) // 81,05

export const ATIVIDADES_MEI = [
  { id: 'comercio', nome: 'Comércio ou indústria', extra: 1, detalhe: 'INSS + ICMS (R$ 1,00)' },
  { id: 'servicos', nome: 'Prestação de serviços', extra: 5, detalhe: 'INSS + ISS (R$ 5,00)' },
  { id: 'ambos', nome: 'Comércio e serviços', extra: 6, detalhe: 'INSS + ICMS + ISS (R$ 6,00)' },
]

export const LIMITE_MEI_ANUAL = 81000
export const LIMITE_MEI_TOLERANCIA = 97200 // até 20% acima

// Taxas médias de referência (Banco Central, 2026) — só para exemplos
export const TAXA_ROTATIVO_ANO = 442.4 // % ao ano (média, jun/2026)
export const TAXA_CHEQUE_ESPECIAL_ANO = 139.8 // % ao ano (média, jun/2026)

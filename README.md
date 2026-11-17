# Grana na Mão 💸

Site educativo de **inclusão financeira**, desenvolvido como **projeto de extensão** do curso de Ciência da Computação
(área temática *Inclusão Econômica e Acesso a Serviços Financeiros* — **ODS 8**).

## Ferramentas

- 📘 **Guia de serviços financeiros básicos** — conta gratuita, Pix seguro, Registrato, Valores a Receber, crédito e renegociação, com checklist salvo no navegador.
- 💳 **Vale a pena parcelar?** — calcula os juros escondidos no parcelamento, compara com pagar à vista e simula a dívida no rotativo do cartão (com o teto legal de 100%).
- 🧮 **Calculadora para MEI e autônomos** — preço de venda, valor do DAS 2026, limite de faturamento (proporcional) e controle de caixa com exportação em CSV.

Sem backend e sem coleta de dados: tudo roda no navegador (`localStorage`).

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173/`. Rotas (Vue Router, modo history):

| Rota | Página |
| --- | --- |
| `/` | Página inicial |
| `/parcelar` | Vale a pena parcelar? |
| `/mei` | Calculadora para MEI e autônomos |
| `/guia` | Guia de serviços financeiros |
| `/sobre` | Sobre o projeto |

A página inicial usa o kit visual em `public/assets/` (CSS e scripts próprios, ativos só na rota `/`).

## Deploy

Cada push na branch `main` publica no GitHub Pages pelo workflow `.github/workflows/deploy.yml`, que roda o build e publica a pasta `dist/`
(em *Settings → Pages*, selecione **Source: GitHub Actions**). Também dá para rodar à mão na aba *Actions*.
No build o site fica em `/grana-na-mao/`, e o `dist/404.html` (cópia do `index.html`) faz as rotas do Vue Router abrirem direto no GitHub Pages.

## Tecnologias

Vue 3 · Vue Router · Vite · Tailwind CSS 4 · GitHub Pages

Valores de referência (2026): salário mínimo R$ 1.621, DAS-MEI R$ 82,05 a R$ 87,05, limite MEI R$ 81 mil, taxas médias do Banco Central.

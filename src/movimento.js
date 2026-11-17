// Camada de movimento das ferramentas, no mesmo estilo da página inicial (kit design-taste-frontend, motion.md):
// - entrada uma vez por página: o h1 sobe palavra por palavra de dentro de máscaras, linha a linha,
//   depois o texto de apoio e os blocos sobem em sequência;
// - pílula que desliza até a aba ou opção escolhida;
// - um número de resultado que muda sobe de leve no lugar.
// Só transform e opacity. Com "reduzir movimento" no sistema, nada se mexe.

const ENTRA = 'cubic-bezier(.22,1,.36,1)' // assentar (entradas)
const VIAJA = 'cubic-bezier(.65,0,.35,1)' // deslocar (pílula)
const quieto = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Quebra o h1 em palavras dentro de máscaras e as faz subir, linha a linha. */
function entradaTitulo(h1) {
  const original = h1.textContent
  const palavras = original.trim().split(/\s+/)
  h1.setAttribute('aria-label', original.trim())
  h1.textContent = ''
  const internos = palavras.map((p, i) => {
    const mascara = document.createElement('span')
    mascara.className = 'm-mascara'
    mascara.setAttribute('aria-hidden', 'true')
    const interno = document.createElement('span')
    interno.textContent = p
    mascara.appendChild(interno)
    h1.appendChild(mascara)
    if (i < palavras.length - 1) h1.appendChild(document.createTextNode(' '))
    return interno
  })
  // linhas pela posição vertical; 80ms entre linhas, no máximo 240ms entre a primeira e a última
  const tops = [...new Set(internos.map((el) => el.parentElement.offsetTop))]
  const animacoes = internos.map((el) => {
    const linha = tops.indexOf(el.parentElement.offsetTop)
    return el.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], {
      duration: 700,
      delay: Math.min(linha * 80, 240),
      easing: ENTRA,
      fill: 'backwards',
    })
  })
  // ao terminar, o h1 volta a ser texto simples
  Promise.all(animacoes.map((a) => a.finished)).then(
    () => {
      h1.textContent = original
      h1.removeAttribute('aria-label')
    },
    () => {},
  )
  return tops.length
}

/** Entrada da página: título, texto de apoio e os primeiros blocos. */
export function entrada(raiz) {
  if (!raiz || quieto()) return
  const h1 = raiz.querySelector('h1')
  if (!h1) return
  const linhas = entradaTitulo(h1)
  // o resto começa quando a última linha do título está na metade do caminho
  const inicio = 350 + Math.min((linhas - 1) * 80, 240)
  const cabecalho = h1.closest('header')
  const blocos = [
    ...(cabecalho ? [...cabecalho.children].filter((el) => el !== h1) : []),
    ...[...raiz.children].filter((el) => el !== cabecalho),
  ]
  const altura = window.innerHeight
  blocos
    .filter((el) => el.getBoundingClientRect().top < altura) // só o que está na primeira tela
    .slice(0, 6)
    .forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 520, delay: inicio + i * 60, easing: ENTRA, fill: 'backwards' },
      )
    })
}

/**
 * v-pilula: num grupo de botões, uma pílula atrás do botão ativo
 * (aria-selected="true" ou aria-pressed="true") desliza até o novo ativo e acompanha a largura dele.
 * Os rótulos ficam sempre escuros; uma cópia branca deles, recortada no formato da pílula,
 * anda junto com ela. Assim o texto nunca troca de cor pela metade no meio do caminho.
 */
function copiarRotulos(grupo) {
  const camada = grupo.__camada
  camada.textContent = ''
  grupo.querySelectorAll(':scope > button').forEach((b) => {
    const c = document.createElement('span')
    c.className = b.className
    c.innerHTML = b.innerHTML
    Object.assign(c.style, {
      position: 'absolute',
      left: `${b.offsetLeft}px`,
      top: `${b.offsetTop}px`,
      width: `${b.offsetWidth}px`,
      height: `${b.offsetHeight}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    })
    camada.appendChild(c)
  })
}

const recorte = (grupo, { x, y, w, h }) =>
  `inset(${y}px ${grupo.clientWidth - x - w}px ${grupo.clientHeight - y - h}px ${x}px round 999px)`

function posicionar(grupo, animar) {
  const pilula = grupo.__pilula
  const camada = grupo.__camada
  const ativo = grupo.querySelector('[aria-selected="true"], [aria-pressed="true"]')
  if (!pilula || !ativo) return
  copiarRotulos(grupo)
  const agora = { x: ativo.offsetLeft, y: ativo.offsetTop, w: ativo.offsetWidth, h: ativo.offsetHeight }
  const antes = grupo.__antes
  pilula.style.width = `${agora.w}px`
  pilula.style.height = `${agora.h}px`
  pilula.style.transform = `translate(${agora.x}px, ${agora.y}px)`
  pilula.style.opacity = '1'
  camada.style.clipPath = recorte(grupo, agora)
  if (animar && antes && !quieto() && (antes.x !== agora.x || antes.y !== agora.y)) {
    const tempo = { duration: 280, easing: VIAJA }
    pilula.animate(
      [
        { transform: `translate(${antes.x}px, ${antes.y}px)`, width: `${antes.w}px`, height: `${antes.h}px` },
        { transform: `translate(${agora.x}px, ${agora.y}px)`, width: `${agora.w}px`, height: `${agora.h}px` },
      ],
      tempo,
    )
    camada.animate([{ clipPath: recorte(grupo, antes) }, { clipPath: recorte(grupo, agora) }], tempo)
  }
  grupo.__antes = agora
}

export const vPilula = {
  mounted(grupo) {
    grupo.classList.add('m-pilula-grupo')
    const pilula = document.createElement('span')
    pilula.className = 'm-pilula'
    pilula.setAttribute('aria-hidden', 'true')
    const camada = document.createElement('span')
    camada.className = 'm-pilula-texto'
    camada.setAttribute('aria-hidden', 'true')
    grupo.prepend(pilula)
    grupo.append(camada)
    grupo.__pilula = pilula
    grupo.__camada = camada
    posicionar(grupo, false)
    grupo.__ro = new ResizeObserver(() => posicionar(grupo, false))
    grupo.__ro.observe(grupo)
  },
  updated(grupo) {
    // o Vue pode ter reposto os botões depois da camada: ela volta para o fim do grupo
    if (grupo.lastElementChild !== grupo.__camada) grupo.append(grupo.__camada)
    posicionar(grupo, true)
  },
  unmounted(grupo) {
    grupo.__ro?.disconnect()
  },
}

/** v-valor: quando o número mostrado muda, ele sobe 6px e assenta. */
export const vValor = {
  mounted(el) {
    el.__texto = el.textContent
  },
  updated(el) {
    if (el.textContent === el.__texto) return
    el.__texto = el.textContent
    if (quieto()) return
    el.animate(
      [
        { opacity: 0.35, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 260, easing: ENTRA },
    )
  },
}

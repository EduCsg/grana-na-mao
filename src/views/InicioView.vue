<script setup>
// Página inicial. Usa o kit visual do design-taste-frontend (public/assets), que só fica ativo nesta rota:
// o CSS dele não tem camada e brigaria com o Tailwind das ferramentas.
import { onBeforeMount, onMounted, onBeforeUnmount } from 'vue'

const base = import.meta.env.BASE_URL
const asset = (p) => base + p

const html = document.documentElement
const atributos = { 'data-type': 'software', 'data-radius': 'round', 'data-ground': 'sage', 'data-buttons': 'tonal', 'data-motion': '' }
const kitCss = (ativo) => document.querySelectorAll('link[data-kit]').forEach((l) => (l.media = ativo ? 'all' : 'not all'))

let timer
// Os scripts do kit ficam em public/ e o Vite (em dev) não deixa usar import() neles:
// um <script type="module"> injetado busca direto e guarda os módulos em window.__kit.
const carregarKit = () => {
  if (window.__kit) {
    // voltando para a página: roda de novo a inicialização de cada script
    ;['sistema', 'movimento', 'layout'].forEach((k) => window.__kit[k].init?.())
    window.__kit.momentos.mountAll(document)
    return
  }
  const s = document.createElement('script')
  s.type = 'module'
  s.textContent = `
    import sistema from '${asset('assets/system.js')}'
    import movimento from '${asset('assets/motion/motion.js')}'
    import layout from '${asset('assets/layout/layout.js')}'
    import * as momentos from '${asset('assets/moments/moments.js')}'
    movimento.init() // motion.js não se inicia sozinho quando a página já carregou
    window.__kit = { sistema, movimento, layout, momentos }
  `
  document.body.appendChild(s)
}

onBeforeMount(() => {
  Object.entries(atributos).forEach(([k, v]) => html.setAttribute(k, v))
  html.classList.add('m-enter', 'mo-js')
  html.classList.remove('m-enter-done')
  timer = setTimeout(() => html.classList.add('m-enter-done', 'mo-safe'), 700)
  kitCss(true)
})
onMounted(() => {
  carregarKit()
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  window.__kit?.momentos.unmountAll(document)
  Object.keys(atributos).forEach((k) => html.removeAttribute(k))
  html.classList.remove('m-enter', 'm-enter-done', 'mo-js', 'mo-safe')
  kitCss(false)
})
</script>

<template>
  <main id="top">
    <section class="hero hero--centred" data-enter aria-labelledby="hero-h">
      <div class="wrap"><div class="hero-text">
        <div class="hero__c">
          <a class="pill" href="#perguntas"><span>Valores de 2026</span><span class="muted">DAS-MEI a partir de R$ 82,05</span></a>
          <h1 id="hero-h">Simulador de juros e guia para o MEI</h1>
          <p class="hero__lead">Digite o preço à vista e as parcelas e veja o juro escondido no “sem juros”. Grátis e sem cadastro.</p>
          <div class="btn-row"><RouterLink class="btn btn--primary" to="/parcelar">Simular parcelamento</RouterLink><RouterLink class="btn btn--secondary" to="/guia">Ler o guia financeiro</RouterLink></div>
        </div>
        <div class="hero__window" data-fx="painterly-landscape" data-fx-seed="7" role="img" aria-label="O simulador mostrando que uma geladeira em 12 parcelas sai R$ 599,80 mais cara que à vista">
          <div class="ly-piece sim" aria-hidden="true">
            <div class="sim__bar"><span class="sim__dots"><i></i><i></i><i></i></span><span><b>Vale a pena parcelar?</b> · Geladeira</span><span class="sp"></span><span>Juros ao mês e ao ano</span></div>
            <div class="sim__body">
              <div class="sim__list">
                <div class="sim__q">Nova simulação</div>
                <div class="sim__t is-on"><b>Geladeira</b><em>12x</em><span>12x de R$ 299,90</span></div>
                <div class="sim__t"><b>Celular</b><em>10x</em><span>10x de R$ 219</span></div>
                <div class="sim__t"><b>Notebook</b><em>12x</em><span>12x de R$ 329</span></div>
                <div class="sim__t"><b>Bicicleta</b><em>10x</em><span>10x de R$ 139</span></div>
                <div class="sim__t"><b>Fogão</b><em>10x</em><span>10x de R$ 99,90</span></div>
                <div class="sim__t"><b>Televisão</b><em>24x</em><span>24x de R$ 239</span></div>
              </div>
              <div class="sim__open">
                <div class="d-chat sim__chat" data-ly-steps="900">
                  <div class="sim__msg sim__msg--me">Geladeira: R$ 2.999 à vista ou 12x de R$ 299,90 “sem juros”?</div>
                  <div class="sim__tool" data-step>Calculando o juro das 12 parcelas</div>
                  <div class="sim__msg sim__msg--res" data-step>O parcelado soma R$ 3.598,80, ou <b>R$ 599,80 a mais</b>. É um juro de 2,92% ao mês. Se o dinheiro já está na mão, pague à vista.</div>
                  <div class="sim__acts" data-step><span>Pagar à vista</span><span>Mudar as parcelas</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></div>
    </section>

    <section class="section g2" id="ferramentas" aria-labelledby="ferramentas-h">
      <div class="wrap">
        <div class="group">
          <div class="section-head">
            <h2 id="ferramentas-h">Três ferramentas para o seu dinheiro. <span class="muted">Tudo roda no seu navegador.</span></h2>
          </div>
          <div class="grid">
            <article class="card card--row card--open span-6 m-nolift">
              <h3>Explica conta, Pix e Registrato</h3>
              <p>O guia mostra, passo a passo, os serviços que todo banco oferece de graça. Seu checklist fica salvo.</p>
              <div class="panel" data-fx="painterly-landscape" data-fx-seed="21" data-fx-params='{"drift":0}'>
                <div class="stage stage--fade-b"><div class="at-rise fit" style="--fit-max:340px;--ax:max(24px, 50% - 170px);--ay:40px;--ay-sm:24px" data-ui-loop>
                  <div class="ui ui-panel ui-checks" data-ui="checklist">
                    <div class="ui-checks__head">
                      <div class="ui-title">Meu checklist</div>
                      <span class="ui-spacer"></span>
                      <div class="ui-meta" data-checks-count>2 de 5</div>
                    </div>
                    <div class="ui-checks__bar"><i data-checks-bar style="--k:0.4"></i></div>
                    <ul class="ui-checks__list">
                      <li class="ui-check is-done"><span class="ui-check__box"><svg viewBox="0 0 16 16"><path d="m4.5 8.2 2.3 2.3 4.7-5"/></svg></span><span class="ui-check__label">Abrir uma conta sem tarifa</span></li>
                      <li class="ui-check is-done"><span class="ui-check__box"><svg viewBox="0 0 16 16"><path d="m4.5 8.2 2.3 2.3 4.7-5"/></svg></span><span class="ui-check__label">Baixar o limite do Pix à noite</span></li>
                      <li class="ui-check"><span class="ui-check__box"><svg viewBox="0 0 16 16"><path d="m4.5 8.2 2.3 2.3 4.7-5"/></svg></span><span class="ui-check__label">Consultar o Registrato</span></li>
                      <li class="ui-check"><span class="ui-check__box"><svg viewBox="0 0 16 16"><path d="m4.5 8.2 2.3 2.3 4.7-5"/></svg></span><span class="ui-check__label">Buscar Valores a Receber</span></li>
                      <li class="ui-check"><span class="ui-check__box"><svg viewBox="0 0 16 16"><path d="m4.5 8.2 2.3 2.3 4.7-5"/></svg></span><span class="ui-check__label">Renegociar a dívida mais cara</span></li>
                    </ul>
                  </div>
                </div></div>
              </div>
            </article>
            <article class="card card--row card--open span-6 m-nolift">
              <h3>Mostra quanto cresce o rotativo</h3>
              <p>A 15,13% ao mês, R$ 1.000 na fatura viram R$ 2.000 em cinco meses. Aí a lei trava os juros.</p>
              <div class="panel" data-fx="painterly-landscape" data-fx-seed="34" data-fx-params='{"drift":0}'>
                <div class="stage stage--fade-b"><div class="at-corner to-edge" style="--ax:32px;--ay:40px">
                  <div class="ui ui-panel ui-stat" data-ui="stat" data-ui-opts='{"fill":true}' data-values="1000,1151,1326,1526,1757,2000,2000,2000,2000,2000,2000,2000" data-prev="1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000">
                    <div class="ui-stat__head">
                      <div class="ui-stat__top">
                        <span class="ui-stat__label">Fatura de R$ 1.000 no rotativo</span>
                        <span class="ui-stat__range">12 meses</span>
                      </div>
                      <div class="ui-stat__line">
                        <span class="ui-stat__num" data-stat-num>R$ 2.000</span>
                        <span class="ui-chip ui-chip--plain ui-stat__delta">teto legal</span>
                        <span class="ui-stat__sub">no 5º mês</span>
                      </div>
                    </div>
                    <div class="ui-stat__chart">
                      <svg class="ui-stat__svg" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
                        <path class="ui-stat__grid" d="M0 30.5H400M0 60.5H400M0 90.5H400"/>
                        <path class="ui-stat__cover" fill-rule="evenodd" d=""/>
                        <g class="ui-stat__bars"></g>
                      </svg>
                      <div class="ui-stat__axis" aria-hidden="true"><span>Mês 1</span><span>Mês 6</span><span>Mês 12</span></div>
                    </div>
                  </div>
                </div></div>
              </div>
            </article>
          </div>
        </div>
        <div class="grid">
          <article class="card card--row card--open span-6 m-nolift">
            <h3>Calcula o DAS do MEI</h3>
            <p>Escolha comércio, serviços ou os dois. Em 2026 o boleto mensal vai de R$ 82,05 a R$ 87,05.</p>
            <div class="panel" data-fx="painterly-landscape" data-fx-seed="48" data-fx-params='{"drift":0}'>
              <div class="stage stage--fade-b"><div class="at-rise fit" style="--fit-max:288px;--ax:max(24px, 50% - 144px);--ay:40px;--ay-sm:24px">
                <div class="ui ui-panel ui-slider" data-ui="slider" data-ui-opts='{"stops":[0.42,0.66]}'>
                  <div class="ui-slider__head">
                    <span class="ui-slider__name"><span class="ui-title">DAS 2026</span><span class="ui-meta">R$ 86,05 por mês</span></span>
                    <span class="ui-spacer"></span>
                  </div>
                  <div class="ui-slider__row">
                    <div class="ui-slider__top"><span>Faturamento no ano</span><output data-slider-val>R$ 34.000</output></div>
                    <div class="ui-slider__track" data-slider-track style="--v:0.42"><i class="ui-slider__fill"></i><i class="ui-slider__thumb"></i></div>
                  </div>
                  <div class="ui-slider__row">
                    <div class="ui-slider__top"><span>Limite do MEI</span><output>R$ 81.000</output></div>
                    <div class="ui-slider__track" style="--v:1"><i class="ui-slider__fill"></i><i class="ui-slider__thumb"></i></div>
                  </div>
                  <div class="ui-slider__seg" role="group" aria-label="Atividade">
                    <span>Comércio</span><span class="is-on">Serviços</span><span>Os dois</span>
                  </div>
                </div>
              </div></div>
            </div>
          </article>
          <article class="card card--row card--open span-6 m-nolift">
            <h3>Avisa antes de estourar o limite</h3>
            <p>O controle de caixa soma o que entrou no ano e mostra quanto falta para os R$ 81 mil.</p>
            <div class="panel" data-fx="painterly-landscape" data-fx-seed="63" data-fx-params='{"drift":0}'>
              <div class="stage stage--fade-b"><div class="at-rise fit" style="--fit-max:340px;--ax:max(24px, 50% - 170px);--ay:calc(100% - 180px);--ay-sm:calc(100% - 180px)">
                <div class="ui ui-notify" data-ui="notify">
                  <ul class="ui-notify__list" data-notify-list>
                    <li class="ui-note"><span class="ui-agent ui-note__av" aria-hidden="true"></span><span class="ui-note__text"><span class="ui-note__title">Faltam R$ 12.600 para o limite<time>agora</time></span><span class="ui-note__body">Você já faturou R$ 68.400 em 2026</span></span><span class="ui-btn ui-btn--sm ui-note__btn">Ver</span></li>
                    <li class="ui-note"><span class="ui-note__ico"><svg class="ui-icon" viewBox="0 0 16 16"><path d="m3.5 8.4 2.8 2.8 6.2-6.4"/></svg></span><span class="ui-note__text"><span class="ui-note__title">Caixa de outubro salvo<time>2 min</time></span><span class="ui-note__body">38 lançamentos exportados em CSV</span></span></li>
                    <li class="ui-note"><span class="ui-note__ico"><svg class="ui-icon" viewBox="0 0 16 16"><path d="m3.5 8.4 2.8 2.8 6.2-6.4"/></svg></span><span class="ui-note__text"><span class="ui-note__title">DAS de outubro pago<time>3 dias</time></span><span class="ui-note__body">R$ 86,05, serviços</span></span></li>
                  </ul>
                </div>
              </div></div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section ground-surface" id="preco" aria-labelledby="preco-h" data-moment="iris-opens" data-moment-opts='{"from": "base"}'>
      <div class="wrap">
        <div class="grid">
          <div class="span-5 stack-5">
            <h2 id="preco-h">Preço de venda para quem trabalha por conta</h2>
            <p class="t-lead">Some o material, as suas horas e a parte das contas fixas. A calculadora junta a taxa da maquininha e a sua margem e mostra o preço de cada unidade.</p>
            <p>Valor da sua hora a partir da renda que você quer.<br>Lucro e taxa separados em cada venda.</p>
            <RouterLink class="link" to="/mei">Calcular meu preço de venda</RouterLink>
          </div>
          <div class="frame frame--photo frame--split span-6 start-7">
            <img class="frame__img" :src="asset('assets/img/photo-f119327670-960.jpg')" :srcset="`${asset('assets/img/photo-f119327670-500.jpg')} 500w, ${asset('assets/img/photo-f119327670-960.jpg')} 960w`" sizes="(max-width: 1023px) 100vw, 50vw" width="960" height="636" alt="Feirante arrumando abacaxis, mamões e cebolas na banca" loading="lazy" decoding="async" data-source="stand-in" data-subject="feirante na banca">
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="perguntas" aria-labelledby="perguntas-h">
      <div class="wrap">
        <div class="grid grid--top">
          <div class="span-5 stack-4">
            <h2 id="perguntas-h">Perguntas sobre o Grana na Mão</h2>
            <p class="muted">Projeto de extensão de Ciência da Computação ligado ao ODS 8.</p>
            <RouterLink class="link" to="/sobre">Ver quem fez o projeto</RouterLink>
          </div>
          <div class="faq span-6 start-7">
            <div class="faq__item"><h3>Preciso criar uma conta?</h3><p>Não. Abra a ferramenta e digite os valores. Nada pede nome, e-mail ou CPF.</p></div>
            <div class="faq__item"><h3>Para onde vão os números que eu digito?</h3><p>Ficam só no seu navegador. O site não tem servidor que guarde seus dados.</p></div>
            <div class="faq__item"><h3>De onde vêm os valores de 2026?</h3><p>Salário mínimo de R$ 1.621, limite do MEI de R$ 81 mil e taxas médias do Banco Central.</p></div>
            <div class="faq__item"><h3>O site substitui um contador?</h3><p>Não. Ele ajuda a entender as contas; para abrir ou fechar empresa, fale com um contador.</p></div>
            <div class="faq__item"><h3>Os juros do cartão são os do meu banco?</h3><p>Não. O simulador parte da média do Banco Central, 442,4% ao ano. Troque pela taxa da sua fatura.</p></div>
            <div class="faq__item"><h3>Dá para usar no celular?</h3><p>Sim. As telas se ajustam ao celular, e o zoom do navegador aumenta a letra.</p></div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer closing" id="contact" aria-labelledby="close-h">
    <div class="wrap">
      <div class="closing__cta close--type">
        <div class="section-head">
          <h2 id="close-h">Descubra o juro da próxima compra</h2>
          <p>Grátis, sem cadastro e funciona no celular.</p>
        </div>
        <RouterLink class="btn btn--primary btn--xl btn--wide" to="/parcelar">Simular parcelamento<svg class="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/><path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg></RouterLink>
      </div>
      <div class="closing__links">
        <div class="grid">
          <div class="span-4 stack-4">
            <RouterLink class="nav__logo" to="/">Grana na Mão</RouterLink>
            <p class="footer__lede">Contas do dia a dia explicadas sem economês.</p>
          </div>
          <div class="span-2 start-7 footer__col"><h3>Ferramentas</h3><ul><li><RouterLink to="/parcelar">Parcelamento</RouterLink></li><li><RouterLink to="/mei">Calculadora MEI</RouterLink></li><li><RouterLink to="/guia">Guia financeiro</RouterLink></li></ul></div>
          <div class="span-2 footer__col"><h3>Nesta página</h3><ul><li><a href="#preco">Preço de venda</a></li><li><a href="#perguntas">Perguntas</a></li></ul></div>
          <div class="span-2 footer__col"><h3>Sobre</h3><ul><li><RouterLink to="/sobre">Sobre o projeto</RouterLink></li></ul></div>
        </div>
        <div class="footer__legal">
          <span>&copy; 2026 Grana na Mão &nbsp; Conteúdo educativo, não é recomendação de investimento.</span>
          <div class="socials"></div>
          <a class="credits" href="https://commons.wikimedia.org/wiki/File:Feira_livre_(47528864102).jpg" rel="noopener">Foto: Ministério Público de Pernambuco, CC BY 2.0, via Wikimedia Commons</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
  /* the hero frame's painted ground while WebGL is not there */
  .hero__window { background:
    radial-gradient(120% 60% at 70% 118%, #6f8a52 0 40%, transparent 41%),
    radial-gradient(90% 50% at 10% 108%, #5b7a55 0 42%, transparent 43%),
    radial-gradient(80% 40% at 60% 92%, #a9bfb6 0 40%, transparent 41%),
    linear-gradient(#7fa9b4, #b9d0d3 70%, #d3dfdc); }
  /* the simulator window: the list of simulations beside the open one */
  .sim { background: #fff; color: #1f3038; border-radius: 14px; overflow: hidden; font: 400 14px/1.45 var(--font-text); text-align: left;
         box-shadow: 0 0 0 1px rgb(31 48 56 / .08), 0 30px 70px -30px rgb(31 48 56 / .55); }
  .sim__bar { display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 14px; border-bottom: 1px solid rgb(31 48 56 / .08); font-size: 13px; color: #5d6b72; }
  .sim__bar b { color: #1f3038; font-weight: 500; } .sim__bar .sp { flex: 1; }
  .sim__dots { display: flex; gap: 6px; } .sim__dots i { width: 10px; height: 10px; border-radius: 50%; background: #dfe5e8; }
  .sim__body { display: grid; grid-template-columns: 250px 1fr; min-height: 420px; }
  .sim__list { border-right: 1px solid rgb(31 48 56 / .08); padding: 10px; display: grid; align-content: start; gap: 2px; }
  .sim__q { height: 34px; margin-bottom: 6px; border-radius: 9px; background: #f1f4f5; display: flex; align-items: center; padding: 0 10px; color: #6b787e; font-size: 13px; }
  .sim__t { display: grid; grid-template-columns: 1fr auto; gap: 1px 10px; padding: 9px 10px; border-radius: 9px; font-size: 13px; }
  .sim__t.is-on { background: #e6f1f2; }
  .sim__t b { font-weight: 500; color: #1f3038; } .sim__t em { font-style: normal; color: #6b787e; font-variant-numeric: tabular-nums; }
  .sim__t span { grid-column: 1 / -1; color: #5d6b72; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sim__open { display: grid; align-content: start; gap: 10px; padding: 16px 20px; min-width: 0; }
  .sim__msg { max-width: 86%; padding: 10px 14px; border-radius: 16px; line-height: 1.45; }
  .sim__msg--me { justify-self: end; background: #1f3038; color: #f7f9fa; border-bottom-right-radius: 6px; }
  .sim__msg--res { background: #eef3f4; color: #1f3038; border-bottom-left-radius: 6px; }
  .sim__msg--res b { font-weight: 500; color: #0d7480; }
  .sim__tool { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #5d6b72; }
  .sim__tool::before { content: ""; width: 12px; height: 12px; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; }
  .sim__acts { display: flex; gap: 8px; }
  .sim__acts span { height: 30px; padding: 0 12px; border-radius: 99px; display: inline-flex; align-items: center; font-size: 13px; font-weight: 500; background: #0d7480; color: #fff; }
  .sim__acts span + span { background: #eef3f4; color: #1f3038; }
  @media (max-width: 639px) {
    .sim__body { grid-template-columns: 1fr; } .sim__list { display: none; }
    .sim__bar .sp ~ span { display: none; } .sim__msg { max-width: 100%; }
  }
  #ferramentas .panel { --p-h: 300px; }
  @media (max-width: 639px) { #ferramentas .panel { --p-h: 200px; } }
  #preco .frame--photo { --ratio: 100%; }
</style>

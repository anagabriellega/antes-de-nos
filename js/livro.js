(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg';
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Números "aleatórios" repetíveis: a ilustração sai igual toda vez.
  function sorteio(semente) {
    let s = (semente >>> 0) || 1;
    return () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function svg(tag, attrs, pai) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
    if (pai) pai.appendChild(el);
    return el;
  }

  // Reinicia uma animação CSS tirando e recolocando a classe.
  function reiniciar(el, classe = 'tocando') {
    el.classList.remove(classe);
    el.getBoundingClientRect();
    el.classList.add(classe);
  }

  /* ---------- céus estrelados ---------- */
  $$('[data-estrelas]').forEach((g) => {
    const n = Number(g.dataset.estrelas);
    const w = Number(g.dataset.w || 460);
    const h = Number(g.dataset.h || 640);
    const r = sorteio(Number(g.dataset.semente || 1));
    for (let i = 0; i < n; i++) {
      const c = svg('circle', {
        cx: (r() * w).toFixed(1),
        cy: (r() * h).toFixed(1),
        r: (0.35 + r() ** 3 * 1.4).toFixed(2),
        fill: '#fff',
        opacity: (0.3 + r() * 0.6).toFixed(2),
      }, g);
      if (r() < 0.3) {
        c.classList.add('pisca');
        c.style.animationDelay = (-r() * 4).toFixed(2) + 's';
        c.style.animationDuration = (2.5 + r() * 3).toFixed(2) + 's';
      }
    }
  });

  /* ---------- capítulo 1: Big Bang ---------- */
  const bb = $('#bb');
  if (bb) {
    const g = $('.bb-particulas', bb);
    const r = sorteio(42);
    const cores = ['#fff3c4', '#ffd27a', '#ff9a5a', '#f2557a', '#a98bff', '#7fd6ff', '#ffffff'];
    for (let i = 0; i < 130; i++) {
      const ang = r() * Math.PI * 2;
      const dist = 34 + Math.pow(r(), 0.7) * 330;
      const c = svg('circle', {
        class: 'bb-p',
        cx: 230,
        cy: 300,
        r: (0.6 + r() * 1.9).toFixed(2),
        fill: cores[Math.floor(r() * cores.length)],
      }, g);
      c.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px');
      c.style.setProperty('--dy', (Math.sin(ang) * dist * 1.2).toFixed(1) + 'px');
      c.style.setProperty('--dur', (1.8 + r() * 1.8).toFixed(2) + 's');
      c.style.setProperty('--del', (0.05 + r() * 0.4).toFixed(2) + 's');
    }
    $('#bb-repetir').addEventListener('click', () => tocarBigBang());
  }
  function tocarBigBang() {
    if (!bb || semMovimento) return;
    bb.classList.remove('pronto');
    reiniciar(bb);
  }
  function prepararBigBang() {
    if (!bb || semMovimento) return;
    bb.classList.remove('tocando');
    bb.classList.add('pronto');
  }

  const PASSOS = [
    'Nos primeiros minutos, o Universo é uma sopa quente de partículas. Formam-se os núcleos dos elementos mais leves: hidrogênio e hélio.',
    'O Universo esfria o bastante para formar os primeiros átomos. A luz enfim viaja livre, e ainda podemos captá-la: é a radiação cósmica de fundo.',
    'A gravidade junta nuvens de gás e acendem as primeiras estrelas. Dentro delas são forjados elementos mais pesados, como carbono e oxigênio.',
    'Num canto da Via Láctea, uma nuvem de gás e poeira desaba sobre si mesma e forma o Sol. É aqui que a nossa história continua.',
  ];
  const abasPasso = $$('[data-passo]');
  function mostrarPasso(n) {
    abasPasso.forEach((b) => b.setAttribute('aria-selected', String(Number(b.dataset.passo) === n)));
    $('#bb-passo').textContent = PASSOS[n];
  }
  abasPasso.forEach((b) => b.addEventListener('click', () => mostrarPasso(Number(b.dataset.passo))));
  mostrarPasso(0);

  /* ---------- pilha do tempo ---------- */
  const CAMADAS = {
    hadeano: { tipo: 'Éon', nome: 'Hadeano', cor: '--c-hadeano', quando: '4,54 a 4,0 bilhões de anos atrás',
      texto: 'A Terra nasce quente e é bombardeada por meteoros. Uma colisão gigante forma a Lua e, no fim do éon, já existem os primeiros oceanos.' },
    arqueano: { tipo: 'Éon', nome: 'Arqueano', cor: '--c-arqueano', quando: '4,0 a 2,5 bilhões de anos atrás',
      texto: 'Surgem os primeiros continentes e os primeiros seres vivos, micróbios simples. Eles constroem os estromatólitos, as estruturas feitas por seres vivos mais antigas que conhecemos.' },
    proterozoico: { tipo: 'Éon', nome: 'Proterozoico', cor: '--c-proterozoico', quando: '2,5 bilhões a 539 milhões de anos atrás',
      texto: 'Micróbios enchem o ar de oxigênio. Aparecem as células complexas e, no fim, os primeiros seres com muitas células. A Terra congela quase por inteiro pelo menos duas vezes.' },
    fanerozoico: { tipo: 'Éon', nome: 'Fanerozoico', cor: '--c-fanerozoico', quando: '539 milhões de anos atrás até hoje',
      texto: 'O nome quer dizer “vida visível”. Tudo o que tem concha, osso ou folha cabe nesta faixa, que é só 12% da história da Terra. Ela aparece ampliada ao lado.' },
    paleozoico: { tipo: 'Era', nome: 'Paleozoico', cor: '--c-paleozoico', quando: '539 a 252 milhões de anos atrás',
      texto: 'A vida se espalha: trilobitas, peixes, as primeiras plantas e animais em terra firme e florestas de samambaias gigantes. Termina com a maior extinção da história.' },
    mesozoico: { tipo: 'Era', nome: 'Mesozoico', cor: '--c-mesozoico', quando: '252 a 66 milhões de anos atrás',
      texto: 'A era dos dinossauros, com pterossauros no céu e grandes répteis no mar. Surgem os mamíferos, as aves e as plantas com flores.' },
    cenozoico: { tipo: 'Era', nome: 'Cenozoico', cor: '--c-cenozoico', quando: '66 milhões de anos atrás até hoje',
      texto: 'Depois do asteroide, mamíferos e aves se diversificam. Toda a história humana caberia numa camada mais fina que um fio de cabelo no topo desta pilha.' },
  };
  const botoesCamada = $$('.camada');
  function mostrarCamada(id) {
    const d = CAMADAS[id];
    const cartao = $('#cartao-camada');
    cartao.style.setProperty('--c', `var(${d.cor})`);
    cartao.innerHTML = `
      <div class="cartao-cab"><h3 class="cartao-nome">${d.nome}</h3><span class="cartao-tipo">${d.tipo}</span></div>
      <p class="cartao-quando">${d.quando}</p>
      <p class="cartao-texto">${d.texto}</p>`;
    botoesCamada.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.camada === id)));
  }
  botoesCamada.forEach((b) => b.addEventListener('click', () => mostrarCamada(b.dataset.camada)));
  mostrarCamada('hadeano');

  /* ---------- ano cósmico (ano de 365 dias, como no calendário de Carl Sagan) ---------- */
  const IDADE = 13.8e9;
  const EVENTOS = [
    { id: 'bigbang', nome: 'Big Bang', atras: IDADE, data: '1º de janeiro, 0h', real: 'há 13,8 bilhões de anos',
      texto: 'O Universo começa a se expandir. O calendário começa aqui.' },
    { id: 'terra', nome: 'Terra', atras: 4.54e9, data: '2 de setembro', real: 'há 4,54 bilhões de anos',
      texto: 'Dois terços do ano já passaram quando a Terra se forma.' },
    { id: 'vida', nome: 'Primeira vida', atras: 3.5e9, data: 'Fim de setembro', real: 'há mais de 3,5 bilhões de anos',
      texto: 'Poucas semanas depois, micróbios já deixam sinais nas rochas.' },
    { id: 'cambriano', nome: 'Explosão Cambriana', atras: 5.39e8, data: '17 de dezembro', real: 'há 539 milhões de anos',
      texto: 'Só em meados de dezembro aparecem animais com conchas, patas e olhos.' },
    { id: 'dinos', nome: 'Dinossauros', atras: 2.33e8, data: '25 de dezembro, à noite', real: 'há cerca de 233 milhões de anos',
      texto: 'Os dinossauros chegam na noite de Natal.' },
    { id: 'asteroide', nome: 'Asteroide', atras: 6.6e7, data: '30 de dezembro, de manhã', real: 'há 66 milhões de anos',
      texto: 'Somem os dinossauros que não eram aves. Eles reinaram por pouco mais de 4 dias deste calendário.' },
    { id: 'homininios', nome: 'Primeiros hominínios', atras: 7e6, data: '31 de dezembro, 19h30', real: 'há cerca de 7 milhões de anos',
      texto: 'Nossos primeiros parentes que andavam sobre duas pernas aparecem na noite do último dia.' },
    { id: 'sapiens', nome: '<i>Homo sapiens</i>', atras: 3e5, data: '31 de dezembro, 23h48', real: 'há cerca de 300 mil anos',
      texto: 'Nossa espécie surge a uns 11 minutos da meia-noite.' },
    { id: 'piramides', nome: 'Pirâmides', atras: 4500, data: '31 de dezembro, 23h59min50s', real: 'há 4.500 anos',
      texto: 'As pirâmides do Egito ficam a 10 segundos da meia-noite. Toda a história escrita cabe nos últimos 12 segundos.' },
  ];
  const faixaDez = $('#faixa-dez');
  const faixaDia = $('#faixa-dia');
  if (faixaDez) {
    for (let d = 1; d <= 31; d++) faixaDez.insertBefore(Object.assign(document.createElement('span'), { className: d === 31 ? 'realce' : '' }), faixaDez.lastElementChild);
    for (let h = 0; h < 24; h++) faixaDia.insertBefore(document.createElement('span'), faixaDia.lastElementChild);
    const marcas = { ano: $('#faixa-ano .faixa-marcas'), dez: $('.faixa-marcas', faixaDez), dia: $('.faixa-marcas', faixaDia) };
    const chips = $('#chips-eventos');
    EVENTOS.forEach((ev) => {
      const dia = (1 - ev.atras / IDADE) * 365;
      const pos = { ano: dia / 365, dez: dia >= 334 ? (dia - 334) / 31 : null, dia: dia >= 364 ? dia - 364 : null };
      ev.marcas = [];
      for (const k of Object.keys(pos)) {
        if (pos[k] === null) continue;
        const m = document.createElement('span');
        m.className = 'mk';
        m.style.left = (Math.min(pos[k], 0.995) * 100).toFixed(2) + '%';
        marcas[k].appendChild(m);
        ev.marcas.push(m);
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.innerHTML = ev.nome;
      b.addEventListener('click', () => mostrarEvento(ev.id));
      chips.appendChild(b);
      ev.chip = b;
    });
  }
  function mostrarEvento(id) {
    EVENTOS.forEach((ev) => {
      const sel = ev.id === id;
      ev.chip.setAttribute('aria-pressed', String(sel));
      ev.marcas.forEach((m) => m.classList.toggle('sel', sel));
      if (sel) {
        $('#cartao-evento').innerHTML = `
          <p class="cartao-data">${ev.data}</p>
          <p class="cartao-quando">${ev.nome} · ${ev.real}</p>
          <p class="cartao-texto">${ev.texto}</p>`;
      }
    });
  }
  if (faixaDez) mostrarEvento('sapiens');

  /* ---------- capítulo 2: formação da Terra ---------- */
  const ETAPAS = [
    { quando: 'Há 4,6 bilhões de anos', titulo: 'Uma nuvem de poeira',
      desc: 'Uma nuvem de gás e poeira desaba sobre si mesma. No centro acende o Sol; em volta, grãos se grudam e formam rochas cada vez maiores.' },
    { quando: 'Há 4,54 bilhões de anos', titulo: 'Uma bola de lava',
      desc: 'A Terra nasce como uma bola de rocha derretida, aquecida pelo choque constante de meteoros. É o começo do Hadeano.' },
    { quando: 'Há cerca de 4,5 bilhões de anos', titulo: 'O choque com Theia',
      desc: 'Theia, um planeta do tamanho de Marte, se choca com a Terra. Os destroços entram em órbita e se juntam: nasce a Lua.' },
    { quando: 'Entre 4,4 e 3,8 bilhões de anos', titulo: 'Chegam os oceanos',
      desc: 'A superfície esfria, o vapor dos vulcões vira chuva e se formam os primeiros oceanos. O palco para a vida está pronto.' },
  ];
  const estagios = $$('#terra-cena [data-etapas]');
  const theiaCena = $('#terra-cena .theia-cena');
  const marcasEtapa = $$('[data-etapa]');
  const sliderEtapa = $('#terra-etapa');
  let etapaAtual = -1;
  let timerTerra = null;
  function mostrarEtapa(n) {
    if (n === etapaAtual) return;
    etapaAtual = n;
    estagios.forEach((g) => g.classList.toggle('on', g.dataset.etapas.split(' ').includes(String(n))));
    if (n === 2 && !semMovimento) reiniciar(theiaCena);
    const e = ETAPAS[n];
    $('#terra-quando').textContent = e.quando;
    $('#terra-titulo').textContent = e.titulo;
    $('#terra-desc').textContent = e.desc;
    sliderEtapa.value = String(n);
    marcasEtapa.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.etapa) === n)));
  }
  function pararTerra() {
    clearInterval(timerTerra);
    timerTerra = null;
    const play = $('#terra-play');
    play.setAttribute('aria-pressed', 'false');
    $('span', play).textContent = 'Animar';
  }
  if (sliderEtapa) {
    sliderEtapa.addEventListener('input', () => { pararTerra(); mostrarEtapa(Number(sliderEtapa.value)); });
    marcasEtapa.forEach((b) => b.addEventListener('click', () => { pararTerra(); mostrarEtapa(Number(b.dataset.etapa)); }));
    $('#terra-play').addEventListener('click', (e) => {
      if (timerTerra) { pararTerra(); return; }
      const play = e.currentTarget;
      play.setAttribute('aria-pressed', 'true');
      $('span', play).textContent = 'Pausar';
      etapaAtual = -1;
      mostrarEtapa(0);
      timerTerra = setInterval(() => {
        if (etapaAtual >= 3) { pararTerra(); return; }
        mostrarEtapa(etapaAtual + 1);
      }, 4200);
    });
    mostrarEtapa(0);
  }

  /* ---------- capítulo 9: T. rex ---------- */
  const TREX = {
    ficha: { rot: 'Ficha do fóssil', titulo: '<i>Tyrannosaurus rex</i>', html: `
      <dl class="ficha">
        <div><dt>Nome</dt><dd>“rei lagarto tirano”</dd></div>
        <div><dt>Quando</dt><dd>68 a 66 milhões de anos atrás</dd></div>
        <div><dt>Onde</dt><dd>oeste da América do Norte</dd></div>
        <div><dt>Comprimento</dt><dd>cerca de 12 metros</dd></div>
        <div><dt>Peso</dt><dd>cerca de 8 toneladas</dd></div>
        <div><dt>Dieta</dt><dd>carnívoro</dd></div>
      </dl>` },
    cabeca: { rot: 'Cabeça', titulo: 'Uma mordida que esmagava ossos',
      texto: 'Estimativas chegam a 57 mil newtons, uma das mordidas mais fortes de qualquer animal terrestre. Um estudo de 2023 sugere que lábios cobriam os dentes, como nos lagartos.' },
    pele: { rot: 'Pele', titulo: 'Escamas ou penas?',
      texto: 'Pedaços de pele fossilizada mostram escamas pequenas. Mas parentes dele, como o Yutyrannus, tinham penas, e os filhotes podem ter tido penugem.' },
    bracos: { rot: 'Braços', titulo: 'Curtos, mas fortes',
      texto: 'Cada braço tinha cerca de 1 metro e só dois dedos. Eram musculosos, mas para que serviam ainda é um mistério.' },
    pernas: { rot: 'Pernas', titulo: 'Grande, mas não tão veloz',
      texto: 'As pernas sustentavam 8 toneladas. Vários estudos sugerem que ele não corria de verdade: andava rápido, talvez a uns 20 km/h.' },
    cauda: { rot: 'Cauda', titulo: 'O contrapeso',
      texto: 'A cauda equilibrava a cabeça pesada. Um músculo enorme ligava a cauda às coxas e puxava as pernas a cada passo.' },
    som: { rot: 'Som', titulo: 'Que som ele fazia?',
      texto: 'Ninguém sabe: o rugido dos filmes foi inventado. Os parentes vivos dele são aves e crocodilos, então alguns cientistas acham que ele fazia sons graves de boca fechada, como este.' },
    compara: { rot: 'Lado a lado', titulo: 'Você perto de um T. rex',
      texto: 'Uma pessoa de 1,75 m mal chegaria ao joelho dele. Só o crânio tinha cerca de 1,4 metro de comprimento.' },
  };
  const cenaTrex = $('#cena-trex');
  const pontos = $$('.ponto', cenaTrex || document);
  function mostrarTrex(chave) {
    const d = TREX[chave];
    const corpo = d.html || `<p class="cartao-texto">${d.texto}</p>`;
    $('#trex-info').innerHTML = `
      <div class="cartao-cab"><h3 class="cartao-nome">${d.titulo}</h3><span class="cartao-tipo">${d.rot}</span></div>
      ${corpo}`;
    pontos.forEach((p) => p.classList.toggle('sel', p.dataset.info === chave));
  }
  if (cenaTrex) {
    pontos.forEach((p) => {
      p.addEventListener('click', () => mostrarTrex(p.dataset.info));
      p.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mostrarTrex(p.dataset.info); }
      });
    });
    $('#trex-ficha').addEventListener('click', () => mostrarTrex('ficha'));
    const btnComparar = $('#trex-comparar');
    btnComparar.addEventListener('click', () => {
      const ligado = btnComparar.getAttribute('aria-pressed') !== 'true';
      btnComparar.setAttribute('aria-pressed', String(ligado));
      $('#trex-moldura').classList.toggle('comparando', ligado);
      mostrarTrex(ligado ? 'compara' : 'ficha');
    });
    $('#trex-som').addEventListener('click', () => {
      mostrarTrex('som');
      somGrave();
      if (!semMovimento) reiniciar(cenaTrex, 'cantando');
    });
    mostrarTrex('ficha');
  }

  // Um "bum" grave de boca fechada, sintetizado na hora (nenhum arquivo de áudio).
  let audio = null;
  function somGrave() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      audio = audio || new Ctx();
      if (audio.state === 'suspended') audio.resume();
      const t = audio.currentTime;
      const saida = audio.createGain();
      saida.gain.setValueAtTime(0.0001, t);
      saida.gain.exponentialRampToValueAtTime(0.8, t + 0.25);
      saida.gain.setValueAtTime(0.8, t + 1.2);
      saida.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      const filtro = audio.createBiquadFilter();
      filtro.type = 'lowpass';
      filtro.frequency.setValueAtTime(380, t);
      filtro.Q.value = 5;
      const modulacao = audio.createGain();
      modulacao.gain.value = 0.6;
      const tremor = audio.createOscillator();
      tremor.frequency.value = 7;
      const tremorGanho = audio.createGain();
      tremorGanho.gain.value = 0.4;
      tremor.connect(tremorGanho).connect(modulacao.gain);
      const o1 = audio.createOscillator();
      o1.type = 'sawtooth';
      o1.frequency.setValueAtTime(92, t);
      o1.frequency.exponentialRampToValueAtTime(58, t + 2.1);
      const o2 = audio.createOscillator();
      o2.type = 'sine';
      o2.frequency.setValueAtTime(46, t);
      o2.frequency.exponentialRampToValueAtTime(30, t + 2.1);
      o1.connect(filtro);
      o2.connect(filtro);
      filtro.connect(modulacao).connect(saida).connect(audio.destination);
      [o1, o2, tremor].forEach((o) => { o.start(t); o.stop(t + 2.3); });
    } catch (err) {
      // Sem áudio neste navegador: o texto explica do mesmo jeito.
    }
  }

  const PERIODOS = {
    triassico: 'Os primeiros dinossauros eram pequenos e ágeis. Alguns dos mais antigos do mundo viveram onde hoje é o Rio Grande do Sul, como o <i>Staurikosaurus</i> e o <i>Buriolestes</i>, há cerca de 233 milhões de anos.',
    jurassico: 'Gigantes de pescoço longo, como o <i>Diplodocus</i> e o Braquiossauro, se espalham. O Alossauro caça e o Estegossauro se defende com a cauda espinhosa. Surge o <i>Archaeopteryx</i>, uma das primeiras aves.',
    cretaceo: 'Aparecem as plantas com flores. Vivem o T. rex, o Tricerátops e o <i>Velociraptor</i>, que tinha penas e o tamanho de um peru. Tudo termina com a queda de um asteroide de uns 10 km.',
  };
  const botoesPeriodo = $$('.periodo');
  function mostrarPeriodo(id) {
    botoesPeriodo.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.periodo === id)));
    $('#periodo-texto').innerHTML = PERIODOS[id];
  }
  botoesPeriodo.forEach((b) => b.addEventListener('click', () => mostrarPeriodo(b.dataset.periodo)));
  if (botoesPeriodo.length) mostrarPeriodo('triassico');

  /* ---------- quiz ---------- */
  const perguntas = $$('.quiz-q');
  function atualizarPlacar() {
    const acertos = perguntas.filter((q) => q.dataset.acertou === '1').length;
    $('#placar').textContent = `Acertos: ${acertos} de ${perguntas.length}`;
  }
  perguntas.forEach((q) => {
    $$('button', q).forEach((b) => b.addEventListener('click', () => {
      if (q.dataset.respondida) return;
      q.dataset.respondida = '1';
      const certa = q.dataset.certa;
      const acertou = b.dataset.op === certa;
      q.dataset.acertou = acertou ? '1' : '0';
      b.classList.add(acertou ? 'certa' : 'errada');
      if (!acertou) $(`[data-op="${certa}"]`, q).classList.add('certa');
      $$('button', q).forEach((x) => { x.disabled = true; });
      $('.quiz-fb', q).textContent = (acertou ? 'Isso! ' : 'Não foi dessa vez. ') + q.dataset.explica;
      atualizarPlacar();
    }));
  });
  const btnReiniciarQuiz = $('#quiz-reiniciar');
  if (btnReiniciarQuiz) {
    btnReiniciarQuiz.addEventListener('click', () => {
      perguntas.forEach((q) => {
        delete q.dataset.respondida;
        delete q.dataset.acertou;
        $$('button', q).forEach((x) => { x.disabled = false; x.classList.remove('certa', 'errada'); });
        $('.quiz-fb', q).textContent = '';
      });
      atualizarPlacar();
    });
  }

  /* ---------- trilha de pegadas ---------- */
  const trilha = $('#trilha');
  if (trilha) {
    const g = $('#trilha-pegadas', trilha);
    const P0 = [52, 200];
    const C = [250, 222];
    const P2 = [412, 66];
    const ponto = (t) => [
      (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * C[0] + t * t * P2[0],
      (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * C[1] + t * t * P2[1],
    ];
    const direcao = (t) => [
      2 * (1 - t) * (C[0] - P0[0]) + 2 * t * (P2[0] - C[0]),
      2 * (1 - t) * (C[1] - P0[1]) + 2 * t * (P2[1] - C[1]),
    ];
    const passos = [];
    for (let i = 0; i < 5; i++) passos.push({ t: 0.02 + i * 0.105, tipo: 'dino', escala: 1.3 });
    for (let i = 0; i < 7; i++) passos.push({ t: 0.66 + i * 0.055, tipo: 'humana', escala: 1.05 });
    passos.forEach((p, i) => {
      const [x, y] = ponto(p.t);
      const [dx, dy] = direcao(p.t);
      const len = Math.hypot(dx, dy);
      const lado = i % 2 === 0 ? 1 : -1;
      const nx = (-dy / len) * 9 * lado;
      const ny = (dx / len) * 9 * lado;
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      const u = svg('use', {
        href: `#pegada-${p.tipo}`,
        class: 'pegada',
        transform: `translate(${(x + nx).toFixed(1)} ${(y + ny).toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${lado === -1 && p.tipo === 'humana' ? -p.escala : p.escala} ${p.escala})`,
      }, g);
      u.style.setProperty('--del', (i * 0.18).toFixed(2) + 's');
    });
  }

  /* ---------- o livro ---------- */
  const livroEl = $('#livro');
  const paginas = $$('.pagina', livroEl);
  const total = paginas.length;
  const aoMostrar = { 5: tocarBigBang, 12: () => !semMovimento && trilha && (trilha.classList.remove('pronto'), reiniciar(trilha)) };
  const aoEsconder = { 5: prepararBigBang, 7: pararTerra, 12: () => !semMovimento && trilha && (trilha.classList.remove('tocando'), trilha.classList.add('pronto')) };

  // Controles dentro das páginas não devem começar a virar a folha.
  $$('button, input, [role="button"], a', livroEl).forEach((el) => {
    ['mousedown', 'touchstart'].forEach((tipo) => el.addEventListener(tipo, (e) => e.stopPropagation(), { passive: true }));
  });

  let flip = null;
  let visiveis = [];

  function paginasVisiveis() {
    if (!flip) return paginas.map((_, i) => i);
    const i = flip.getCurrentPageIndex();
    if (flip.getOrientation() === 'portrait') return [i];
    if (i === 0) return [0];
    const esq = i % 2 === 1 ? i : i - 1;
    return [esq, esq + 1].filter((x) => x < total);
  }

  function atualizar() {
    const novas = paginasVisiveis();
    const paisagem = flip && flip.getOrientation() !== 'portrait';
    paginas.forEach((p, i) => {
      p.classList.toggle('pagina--esq', Boolean(paisagem && i % 2 === 1));
      p.classList.toggle('pagina--dir', Boolean(paisagem && i % 2 === 0 && i !== 0));
    });
    visiveis.filter((i) => !novas.includes(i)).forEach((i) => aoEsconder[i] && aoEsconder[i]());
    novas.filter((i) => !visiveis.includes(i)).forEach((i) => aoMostrar[i] && aoMostrar[i]());
    visiveis = novas;

    const ind = $('#indicador');
    if (novas.length === 1 && novas[0] === 0) ind.textContent = 'Capa';
    else if (novas.length === 1 && novas[0] === total - 1) ind.textContent = 'Contracapa';
    else if (novas.length === 1) ind.textContent = `Página ${novas[0] + 1} de ${total}`;
    else ind.textContent = `Páginas ${novas[0] + 1}–${novas[1] + 1} de ${total}`;
    const ultima = novas[novas.length - 1];
    $('#progresso').style.width = ((ultima + 1) / total * 100).toFixed(1) + '%';
    $('#btn-ant').disabled = novas[0] === 0;
    $('#btn-prox').disabled = ultima === total - 1;
  }

  function irPara(i) {
    if (flip) flip.flip(i, 'top');
    else paginas[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (window.St && window.St.PageFlip) {
    paginas.forEach((_, i) => { if (aoEsconder[i]) aoEsconder[i](); });
    flip = new window.St.PageFlip(livroEl, {
      width: 460,
      height: 640,
      size: 'stretch',
      minWidth: 250,
      maxWidth: 640,
      minHeight: 340,
      maxHeight: 890,
      showCover: true,
      usePortrait: true,
      autoSize: true,
      mobileScrollSupport: false,
      maxShadowOpacity: 0.45,
      flippingTime: semMovimento ? 300 : 900,
      drawShadow: true,
      showPageCorners: true,
      disableFlipByClick: true,
      clickEventForward: true,
      swipeDistance: 30,
    });
    flip.loadFromHTML(paginas);
    flip.on('flip', atualizar);
    flip.on('changeOrientation', atualizar);
    atualizar();
  } else {
    document.body.classList.add('sem-flip');
    visiveis = paginas.map((_, i) => i);
    $('#indicador').textContent = `${total} páginas`;
    $('#progresso').style.width = '100%';
  }

  $('#btn-ant').addEventListener('click', () => (flip ? flip.flipPrev('top') : window.scrollBy(0, -400)));
  $('#btn-prox').addEventListener('click', () => (flip ? flip.flipNext('top') : window.scrollBy(0, 400)));
  $('#btn-sumario').addEventListener('click', () => irPara(2));
  $$('[data-ir]').forEach((b) => b.addEventListener('click', () => irPara(Number(b.dataset.ir))));

  document.addEventListener('keydown', (e) => {
    if (!flip || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); flip.flipNext('top'); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); flip.flipPrev('top'); }
  });

  const btnTela = $('#btn-tela');
  if (document.fullscreenEnabled && document.documentElement.requestFullscreen) {
    btnTela.hidden = false;
    btnTela.addEventListener('click', () => {
      const p = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      if (p && p.catch) p.catch(() => {});
    });
  }

  if (semMovimento) $$('svg').forEach((s) => s.pauseAnimations && s.pauseAnimations());
})();

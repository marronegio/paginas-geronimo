(function () {
  'use strict';

  /* =========================================================================
     CONFIGURACAO DA ACAO — e so isto que muda. Ver README.md (secao "Pagina de vendas").
     Tudo que esta com SUBSTITUIR- precisa de valor real antes de subir.
     ========================================================================= */

  // Para onde o popup manda o lead depois de capturar os dados:
  //   'checkout' -> Hotmart (link da condicao escolhida: aluno ou nao aluno)
  //   'whatsapp' -> WhatsApp do comercial (WHATSAPP_URL)
  // Trocar aqui ja muda o texto do botao e a microcopy do popup.
  var DESTINO = 'checkout';

  // Links do produto/ofertas na Hotmart, cada um com o seu sck.
  var CHECKOUT_URLS = {
    'nao-aluno': 'https://pay.hotmart.com/X108449250H?off=ban29uns&split=12&checkoutMode=10&hidewallet=1&sck=oportunidade-bf-fim-da-media-nov26-nao-alunos',
    'aluno': 'https://pay.hotmart.com/X108449250H?off=jl1meldl&split=12&checkoutMode=10&hidewallet=1&sck=oportunidade-bf-fim-da-media-nov26-alunos'
  };

  // Comercial no WhatsApp (o mesmo link do bloco "Duvidas?" da pagina).
  var WHATSAPP_URL = 'https://links.igtcoaching.com.br/fale-com-o-comercial';

  // Webhooks do pre-checkout (proprios desta pagina).
  // NAO use os da captacao (55ece7e3 / b603d4a3): disparariam o fluxo de "inscrito na live".
  var WEBHOOKS = [
    // IGT (n8n): devolve headers CORS, aceita application/json.
    { url: 'https://webhook.igtcoaching.com.br/webhook/d2fb4990-1ca1-4241-bb56-850eeed4762b', mode: 'cors', ct: 'application/json' },
    // Clint (CRM): sem CORS no preflight -> enviar como "simple request" (text/plain + no-cors).
    { url: 'https://functions-api.clint.digital/endpoints/integration/webhook/f6f4e8b2-7db0-427b-81ba-ba455c310c71', mode: 'no-cors', ct: 'text/plain;charset=UTF-8' }
  ];

  // Sorteios do dia (contador do topo, faixa de bonus e bilhetes). Horario de Brasilia, -03:00 fixo.
  // Antes de 16/11 a pagina mostra o dia 16 (pra revisao). Depois de 17/11 23h59, tudo isso some.
  // Pra revisar um dia especifico: ?preview_dia=16 | 17 | off  (esse parametro nao vai pro checkout).
  var PHASES = [
    { id: 'd1', key: '16', end: '2026-11-16T23:59:59-03:00' },
    { id: 'd2', key: '17', end: '2026-11-17T23:59:59-03:00' }
  ];

  // Numeros oficiais do time (WhatsApp), com DDD, um por item. O verificador compara DDD + 8 ultimos
  // digitos, entao tanto faz ter ou nao o 9 da frente / o +55.
  // Lista vazia = o verificador responde neutro ("nao consegui confirmar"), nunca "nao e do meu time".
  var TEAM_NUMBERS = [
    '4391224134', '4391599898', '4391023675', '4391231264', '1151940411',
    '11997354745', '11950296377', '4391888979', '4331960267', '4331960142',
    '4331960636', '4331960637', '4331960271', '11958771837', '51974016829',
    '11978559858', '16993139975', '54991757042', '4331960964', '11948476785',
    '11971767704', '51991364869', '19992940796', '16991137322', '65993280252',
    '54999426878', '54981189098', '11914066180'
  ];

  var COUNTRIES = [
    { code: 'BR', dial: '+55', flag: '🇧🇷' }, { code: 'US', dial: '+1', flag: '🇺🇸' }, { code: 'CA', dial: '+1', flag: '🇨🇦' },
    { code: 'PT', dial: '+351', flag: '🇵🇹' }, { code: 'AR', dial: '+54', flag: '🇦🇷' }, { code: 'CL', dial: '+56', flag: '🇨🇱' },
    { code: 'CO', dial: '+57', flag: '🇨🇴' }, { code: 'PE', dial: '+51', flag: '🇵🇪' }, { code: 'UY', dial: '+598', flag: '🇺🇾' },
    { code: 'PY', dial: '+595', flag: '🇵🇾' }, { code: 'BO', dial: '+591', flag: '🇧🇴' }, { code: 'EC', dial: '+593', flag: '🇪🇨' },
    { code: 'VE', dial: '+58', flag: '🇻🇪' }, { code: 'MX', dial: '+52', flag: '🇲🇽' }, { code: 'ES', dial: '+34', flag: '🇪🇸' },
    { code: 'FR', dial: '+33', flag: '🇫🇷' }, { code: 'DE', dial: '+49', flag: '🇩🇪' }, { code: 'IT', dial: '+39', flag: '🇮🇹' },
    { code: 'GB', dial: '+44', flag: '🇬🇧' }, { code: 'IE', dial: '+353', flag: '🇮🇪' }, { code: 'NL', dial: '+31', flag: '🇳🇱' },
    { code: 'BE', dial: '+32', flag: '🇧🇪' }, { code: 'CH', dial: '+41', flag: '🇨🇭' }, { code: 'AT', dial: '+43', flag: '🇦🇹' },
    { code: 'SE', dial: '+46', flag: '🇸🇪' }, { code: 'NO', dial: '+47', flag: '🇳🇴' }, { code: 'DK', dial: '+45', flag: '🇩🇰' },
    { code: 'PL', dial: '+48', flag: '🇵🇱' }, { code: 'GR', dial: '+30', flag: '🇬🇷' }, { code: 'TR', dial: '+90', flag: '🇹🇷' },
    { code: 'ZA', dial: '+27', flag: '🇿🇦' }, { code: 'AE', dial: '+971', flag: '🇦🇪' }, { code: 'IN', dial: '+91', flag: '🇮🇳' },
    { code: 'CN', dial: '+86', flag: '🇨🇳' }, { code: 'JP', dial: '+81', flag: '🇯🇵' }, { code: 'AU', dial: '+61', flag: '🇦🇺' }
  ];

  /* ========================================================================= */

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $all = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function pad(n) { return String(n).padStart(2, '0'); }

  // Mascara (XX) XXXXX-XXXX — so para o Brasil. Reconstruida do zero a cada
  // input, entao backspace, colar e digitar no meio funcionam sem logica de cursor.
  function formatBrPhone(raw) {
    var d = raw.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  // ----- parametros da URL -----
  // Nenhum parametro pode se perder entre o anuncio e o checkout. O snapshot e tirado no
  // carregamento e guardado na sessao: se algum pixel limpar a query string, ou o visitante
  // recarregar/voltar sem os parametros, o redirect continua levando o rastreio completo.
  var PARAMS_KEY = 'bf26v:params';
  var PRIVATE_PARAMS = { preview_dia: true };   // so pra revisao interna: nao guarda, nao repassa

  var incomingParams = (function () {
    var current = new URLSearchParams(window.location.search);
    var merged = new URLSearchParams();
    current.forEach(function (value, key) { if (!PRIVATE_PARAMS[key]) merged.append(key, value); });
    try {
      // O que esta na URL agora manda; a sessao so completa o que faltar.
      new URLSearchParams(sessionStorage.getItem(PARAMS_KEY) || '').forEach(function (value, key) {
        if (!current.has(key) && !PRIVATE_PARAMS[key]) merged.append(key, value);
      });
      sessionStorage.setItem(PARAMS_KEY, merged.toString());
    } catch (e) {}   // sessionStorage bloqueado: segue so com o que veio na URL
    return merged;
  })();

  function withForwardedParams(baseUrl, withXcod) {
    try {
      var target = new URL(baseUrl, window.location.href);
      // O que o link ja define vence; chaves repetidas na origem (a=1&a=2) chegam todas.
      var own = new URLSearchParams(target.search);
      incomingParams.forEach(function (value, key) {
        if (!own.has(key)) target.searchParams.append(key, value);
      });
      if (withXcod) {
        // VK Metrics: identifica a venda com o anuncio Meta que originou o clique.
        var adId = incomingParams.get('vk_ad_id') || '';
        var vkSource = incomingParams.get('vk_source') || 'paid_metaads';
        var pageUrl = (window.location.origin + window.location.pathname).replace(/^https?:\/\//, '');
        target.searchParams.set('xcod', JSON.stringify({ vid: adId, vsrc: vkSource, url: pageUrl, v: 1 }));
      }
      return target.toString();
    } catch (e) {
      return baseUrl;   // qualquer erro: segue mesmo assim, nunca trava a venda
    }
  }

  // ----- fases dos sorteios (16/11, 17/11, depois) -----
  function currentPhase() {
    var forced = new URLSearchParams(window.location.search).get('preview_dia');
    if (forced) {
      if (forced === 'off') return null;
      for (var j = 0; j < PHASES.length; j++) if (PHASES[j].key === forced) return PHASES[j];
    }
    var now = Date.now();
    for (var i = 0; i < PHASES.length; i++) {
      if (now <= new Date(PHASES[i].end).getTime()) return PHASES[i];
    }
    return null;
  }

  // [data-phase="d1 d2"]: o elemento so aparece nas fases listadas (o HTML ja nasce com hidden).
  function applyPhase(phase) {
    $all('[data-phase]').forEach(function (el) {
      var list = el.getAttribute('data-phase').split(/\s+/);
      el.hidden = !phase || list.indexOf(phase.id) === -1;
    });
  }

  function initCountdown() {
    var phase = currentPhase();
    applyPhase(phase);
    if (!phase) return;
    var h = $('[data-clock="h"]'), m = $('[data-clock="m"]'), s = $('[data-clock="s"]');
    var end = new Date(phase.end).getTime();
    var timer = null;
    function tick() {
      var left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      h.textContent = pad(Math.floor(left / 3600));
      m.textContent = pad(Math.floor((left % 3600) / 60));
      s.textContent = pad(left % 60);
      // virou o dia com a pagina aberta: passa pra proxima fase (ou some) sem recarregar
      if (left <= 0 && !new URLSearchParams(window.location.search).get('preview_dia')) {
        clearInterval(timer);
        setTimeout(initCountdown, 1200);
      }
    }
    tick();
    timer = setInterval(tick, 1000);
  }

  // ----- popup pre-checkout -----
  var state = { country: 'BR', sent: false, offer: 'nao-aluno' };
  var modal, errorBox, lastFocus = null;

  function setOffer(offer) {
    if (!CHECKOUT_URLS[offer]) offer = 'nao-aluno';
    state.offer = offer;
    $all('.bv-choice__opt input').forEach(function (input) {
      input.checked = input.value === offer;
      input.closest('.bv-choice__opt').classList.toggle('is-checked', input.checked);
    });
  }

  function openForm(offer) {
    lastFocus = document.activeElement;
    if (offer) setOffer(offer);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = $('#in-nome');
    if (first) setTimeout(function () { first.focus(); }, 30);
  }

  function closeForm() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Tab fica preso dentro do popup enquanto ele esta aberto.
  function trapTab(ev) {
    var f = $all('button, input, select, a[href]', modal).filter(function (el) { return !el.disabled && el.offsetParent !== null && !(el.type === 'radio' && !el.checked); });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }

  function showError(msg, field) {
    $all('.bv-input[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    errorBox.textContent = msg;
    errorBox.hidden = false;
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  }

  // O <form> tem novalidate: a validacao e nossa, com mensagem logo abaixo dos campos.
  function validate() {
    var nome = $('#in-nome');
    var email = $('#in-email');
    var phone = $('#phone-input');
    if (nome.value.trim().length < 2) { showError('Digite seu nome.', nome); return null; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { showError('Digite um e-mail válido.', email); return null; }
    var digits = phone.value.replace(/\D/g, '');
    var min = state.country === 'BR' ? 10 : 6;
    if (digits.length < min) { showError('Digite seu WhatsApp com DDD.', phone); return null; }
    errorBox.hidden = true;
    $all('.bv-input[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    return { nome: nome.value.trim(), email: email.value.trim(), phoneRaw: phone.value.trim(), phoneDigits: digits };
  }

  function submitLabel() { return DESTINO === 'whatsapp' ? 'Falar com o meu time' : 'Ir para o pagamento'; }

  function submitForm() {
    if (state.sent) return;
    var v = validate();
    if (!v) return;

    var params = incomingParams;
    var today = new Date();
    var country = COUNTRIES.filter(function (c) { return c.code === state.country; })[0] || COUNTRIES[0];
    var form = $('#checkout-form');
    var payload = {
      nome: v.nome,
      email: v.email,
      whatsapp: country.dial + ' ' + v.phoneRaw,
      telefone: country.dial + v.phoneDigits,
      pagina: $('#in-pagina').value,
      form_name: form.elements.form_name.value,   // de qual pagina veio o lead
      oferta: state.offer,                         // 'nao-aluno' | 'aluno'
      status: state.offer === 'aluno' ? 'aluno' : 'não aluno',   // pro CRM: o lead é aluno ou não
      destino: DESTINO,                            // 'checkout' | 'whatsapp'
      utm_campaign: params.get('utm_campaign') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_source: params.get('utm_source') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
      data: pad(today.getDate()) + '/' + pad(today.getMonth() + 1) + '/' + today.getFullYear()
    };
    var body = JSON.stringify(payload);

    // Fire-and-forget: falha de webhook nunca pode impedir a venda.
    // keepalive:true e ESSENCIAL — sem ele o redirect abaixo cancela a request.
    WEBHOOKS.forEach(function (wh) {
      try {
        fetch(wh.url, { method: 'POST', mode: wh.mode, headers: { 'Content-Type': wh.ct }, body: body, keepalive: true }).catch(function () {});
      } catch (e) {}
    });

    state.sent = true;
    var btn = $('.bv-form__submit');
    if (btn) { btn.disabled = true; $('.bv-btn__label', btn).textContent = DESTINO === 'whatsapp' ? 'Abrindo o WhatsApp…' : 'Abrindo o pagamento…'; }

    var target = DESTINO === 'whatsapp'
      ? withForwardedParams(WHATSAPP_URL, false)
      : withBuyerData(withForwardedParams(CHECKOUT_URLS[state.offer], true), v);
    window.location.href = target;
  }

  // Checkout da Hotmart ja abre com nome, e-mail e telefone que o lead digitou no popup.
  // Parametros oficiais da Hotmart: name, email, phoneac (DDD) e phonenumber (numero sem DDD);
  // o codigo do pais a Hotmart preenche sozinha. Fora do Brasil nao ha DDD: vai so o numero.
  // set() (e nao append): se a URL de origem trouxer um "email" ou "name", vale o que foi digitado.
  function withBuyerData(url, v) {
    try {
      var target = new URL(url, window.location.href);
      target.searchParams.set('name', v.nome);
      target.searchParams.set('email', v.email);
      if (state.country === 'BR' && v.phoneDigits.length >= 10) {
        target.searchParams.set('phoneac', v.phoneDigits.slice(0, 2));
        target.searchParams.set('phonenumber', v.phoneDigits.slice(2));
      } else {
        target.searchParams.set('phonenumber', v.phoneDigits);
      }
      return target.toString();
    } catch (e) {
      return url;   // qualquer erro: segue sem pre-preencher, nunca trava a venda
    }
  }

  // ----- entra na tela -> .is-in (uma vez so) -----
  // Usado pelas etiquetas de preco, pelo carimbo, pelo risco do total, pelos circulos dos prints
  // e pelos totais das notinhas (que contam de 0 ate o valor).
  function countUp(el) {
    var to = parseInt(el.getAttribute('data-count'), 10);
    if (!to || reduceMotion) return;
    var final = el.textContent;
    var t0 = null, dur = 1400;
    function fmt(n) { return 'R$ ' + n.toLocaleString('pt-BR'); }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? fmt(Math.round(to * eased)) : final;
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = fmt(0);
    requestAnimationFrame(step);
  }

  function initInView() {
    var els = $all('[data-inview]');
    function enter(el) {
      if (el.classList.contains('is-in')) return;
      el.classList.add('is-in');
      if (el.hasAttribute('data-count')) countUp(el);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(enter); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { enter(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.3 });
    els.forEach(function (el) { io.observe(el); });
  }

  // ----- o "trecho circulado" dos prints -----
  // data-marks="x y w h [forma]; ..." em px da imagem. Cada trecho vira um contorno feito
  // "a mao": superelipse (forma 2 = elipse, 4 = quase retangulo) que passa um pouco do
  // ponto de partida, com leve espiral, inclinacao e tremida — nunca dois iguais.
  function seeded(seed) {
    return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  }

  function markPath(x, y, w, h, n, seed) {
    var rnd = seeded(seed);
    var cx = x + w / 2, cy = y + h / 2;
    // folga em px (nao em %): em trecho largo o contorno nao estoura a borda do print
    var a = w / 2 + 7 + Math.min(w * 0.02, 5);
    var b = h / 2 + 5 + Math.min(h * 0.03, 4);
    var tilt = (rnd() - 0.5) * 0.05 * Math.min(1, 160 / w);
    var start = Math.PI * (0.88 + rnd() * 0.12);
    var turns = 1.1 + rnd() * 0.06;
    var e = 2 / n, steps = 84, pts = [];
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var th = start + t * turns * 2 * Math.PI;
      // espiral leve: comeca ~3px pra dentro e termina ~4px pra fora, com tremida de 1px
      var g = (t - 0.43) * 7 + Math.sin(th * 3 + seed);
      var c = Math.cos(th), s = Math.sin(th);
      var ux = (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), e) * (a + g);
      var uy = (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), e) * (b + g * 0.6);
      pts.push([cx + ux * Math.cos(tilt) - uy * Math.sin(tilt), cy + ux * Math.sin(tilt) + uy * Math.cos(tilt)]);
    }
    // Catmull-Rom -> Bezier: curva lisa passando por todos os pontos
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var k = 0; k < pts.length - 1; k++) {
      var p0 = pts[k - 1] || pts[k], p1 = pts[k], p2 = pts[k + 1], p3 = pts[k + 2] || p2;
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
        ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
        ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }

  function initMarks() {
    var NS = 'http://www.w3.org/2000/svg';
    $all('[data-marks]').forEach(function (box, bi) {
      var img = $('img', box);
      if (!img) return;
      var W = +img.getAttribute('width'), H = +img.getAttribute('height');
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'bv-mark');
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('aria-hidden', 'true');
      var stroke = (W / 135).toFixed(2);   // ~3px na largura em que o print aparece
      box.getAttribute('data-marks').split(';').forEach(function (spec, i) {
        var v = spec.trim().split(/\s+/).map(Number);
        if (v.length < 4 || v.some(isNaN)) return;
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', markPath(v[0], v[1], v[2], v[3], v[4] || 2.6, 7 + bi * 13 + i * 5));
        path.setAttribute('pathLength', '1');
        path.setAttribute('stroke-width', stroke);
        path.style.setProperty('--d', (0.15 + i * 0.5) + 's');
        svg.appendChild(path);
      });
      box.appendChild(svg);
    });
  }

  // ----- "Verifique se o numero e mesmo do meu time" -----
  // Compara DDD + 8 ultimos digitos: aceita com ou sem +55, com ou sem o 9 da frente.
  function phoneKey(raw) {
    var d = String(raw).replace(/\D/g, '');
    if (d.length >= 12 && d.indexOf('55') === 0) d = d.slice(2);
    if (d.length < 10) return '';
    return d.slice(0, 2) + d.slice(-8);
  }

  function initVerify() {
    var form = $('#verify');
    if (!form) return;
    var input = $('#verify-input'), out = $('#verify-out');
    var team = TEAM_NUMBERS.map(phoneKey).filter(Boolean);
    input.addEventListener('input', function () { input.value = formatBrPhone(input.value); });
    function say(kind, msg) { out.className = 'bv-verify__out is-' + kind; out.textContent = msg; out.hidden = false; }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var key = phoneKey(input.value);
      if (!key) { say('bad', 'Digite o número com DDD pra eu conferir.'); input.focus(); return; }
      if (!team.length) { say('neutral', 'Não consegui confirmar esse número por aqui. Na dúvida, fale com o meu time pelo botão “Falar com o meu time”, que é o canal oficial.'); return; }
      if (team.indexOf(key) !== -1) say('ok', 'Pode confiar: esse número é do meu time.');
      else say('bad', 'Esse número não é do meu time. Não passe dados nem faça pagamentos por ele. Fale com a gente pelo botão “Falar com o meu time”.');
    });
  }

  // ----- CTA fixo -----
  // Aparece quando o botao do topo saiu da tela; some enquanto as etiquetas de preco
  // ou a chamada final estao visiveis (ja tem botao de compra ali) e no rodape.
  function initSticky() {
    var sticky = $('#sticky-cta');
    if (!sticky || !('IntersectionObserver' in window)) return;
    var seen = { hero: true, passed: false, tags: false, final: false };
    function sync() { sticky.classList.toggle('is-on', seen.passed && !seen.hero && !seen.tags && !seen.final); }
    new IntersectionObserver(function (e) {
      seen.hero = e[0].isIntersecting;
      seen.passed = e[0].boundingClientRect.top < 0 || seen.passed;
      sync();
    }).observe($('#hero-cta'));
    var tags = $('.bv-tags');
    if (tags) new IntersectionObserver(function (e) { seen.tags = e[0].isIntersecting; sync(); }).observe(tags);
    var final = $('.bv-final');
    // some na chamada final e nao volta depois dela (rodape fica livre)
    if (final) new IntersectionObserver(function (e) { seen.final = e[0].isIntersecting || e[0].boundingClientRect.top < 0; sync(); }).observe(final);
  }

  // ----- entradas no scroll, versao JS -----
  // So roda onde o CSS nao tem animation-timeline (o <head> marca com .bv-sl).
  // Mesma conta do CSS "entry 0% cover 30%": progresso 0 quando o topo do elemento
  // encosta no pe da tela, 1 quando ele ja subiu ~30% da altura. Ida e volta, sem estado.
  function initScrollLinked() {
    var root = document.documentElement;
    if (!root.classList.contains('bv-sl')) return;
    var items = $all('.bv-rv, .bv-shape');
    items.forEach(function (el) {
      var cs = getComputedStyle(el);
      var fy = cs.getPropertyValue('--fy').trim();
      el._bvFy = /vh$/.test(fy) ? parseFloat(fy) * window.innerHeight / 100 : (parseFloat(fy) || 0);
      el._bvRange = el.classList.contains('bv-shape') ? 0.45 : 0.3;
    });
    var ticking = false;
    function frame() {
      ticking = false;
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var top = el.getBoundingClientRect().top - (el._bvShift || 0);
        var p = Math.min(1, Math.max(0, (vh - top) / (vh * el._bvRange)));
        el._bvShift = (1 - p) * el._bvFy;
        el.style.setProperty('--p', p.toFixed(3));
      });
    }
    function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    frame();
  }

  // ----- init -----
  function init() {
    window.__bvReady = true;   // avisa a trava do <head> que o JS assumiu
    document.documentElement.setAttribute('data-dest', DESTINO);

    modal = $('#popup');
    errorBox = $('#form-error');

    // seletor de DDI — Brasil sempre primeiro (e o default)
    var sel = $('#country-select');
    COUNTRIES.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c.code;
      o.textContent = c.flag + ' ' + c.dial;   // "🇧🇷 +55"
      sel.appendChild(o);
    });
    sel.value = 'BR';

    var phone = $('#phone-input');
    sel.addEventListener('change', function () {
      state.country = sel.value;
      phone.value = '';                                                    // limpa: mascara antiga nao vale mais
      phone.placeholder = sel.value === 'BR' ? '(00) 00000-0000' : 'Número de telefone';
    });
    phone.addEventListener('input', function () {
      if (state.country === 'BR') phone.value = formatBrPhone(phone.value); // fora do BR: entrada livre
    });

    // condicao escolhida (aluno / nao aluno) -> link do checkout
    $all('.bv-choice__opt input').forEach(function (input) {
      input.addEventListener('change', function () { if (input.checked) setOffer(input.value); });
    });
    setOffer('nao-aluno');

    var submitBtn = $('.bv-form__submit');
    $('.bv-btn__label', submitBtn).textContent = submitLabel();

    // N botoes abrem o mesmo popup (os das etiquetas ja escolhem a condicao);
    // fecha pelo X, pelo fundo e pelo Esc
    $all('[data-action]').forEach(function (el) {
      el.addEventListener('click', function (ev) {
        var a = el.getAttribute('data-action');
        if (a === 'openForm') { ev.preventDefault(); openForm(el.getAttribute('data-offer')); }
        else if (a === 'closeForm') closeForm();
        else if (a === 'overlayClose') { if (ev.target === modal) closeForm(); }   // so o clique no fundo
      });
    });
    document.addEventListener('keydown', function (ev) {
      if (modal.hidden) return;
      if (ev.key === 'Escape') closeForm();
      else if (ev.key === 'Tab') trapTab(ev);
    });

    $('#checkout-form').addEventListener('submit', function (ev) { ev.preventDefault(); submitForm(); });

    // Voltar do checkout pelo botao do navegador (bfcache) nao pode deixar o form travado.
    window.addEventListener('pageshow', function (ev) {
      if (!ev.persisted) return;
      state.sent = false;
      submitBtn.disabled = false;
      $('.bv-btn__label', submitBtn).textContent = submitLabel();
    });

    initCountdown();
    initMarks();
    initInView();
    initVerify();
    initSticky();
    initScrollLinked();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

(function () {
  'use strict';

  /* =========================================================================
     CONFIGURACAO DA ACAO — e so isto que muda de uma acao para outra.
     Ver README.md desta pasta e o de referencia (protocolo-6-porcento-out26).
     ========================================================================= */

  var WEBHOOKS = [
    // IGT (n8n): devolve headers CORS, aceita application/json.
    { url: 'https://webhook.igtcoaching.com.br/webhook/55ece7e3-601b-4c8d-914f-dff2676eca9d', mode: 'cors', ct: 'application/json' },
    // Clint (CRM): sem CORS no preflight -> enviar como "simple request" (text/plain + no-cors).
    { url: 'https://functions-api.clint.digital/endpoints/integration/webhook/b603d4a3-4572-4930-b3d3-e8199117c80c', mode: 'no-cors', ct: 'text/plain;charset=UTF-8' }
  ];

  // Pagina de obrigado unica, compartilhada pelas 3 LPs (black-sai-da-media-2026/obrigado/).
  var THANKS_URL = '../obrigado/';

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

  // Nenhum parametro da URL pode se perder entre o anuncio e a pagina de obrigado.
  // O snapshot e tirado no carregamento e guardado na sessao: se algum pixel
  // limpar a query string, ou o visitante recarregar/voltar pra pagina ja sem
  // os parametros, o redirect continua levando o rastreio completo.
  var PARAMS_KEY = 'bf26:params';

  var incomingParams = (function () {
    var current = new URLSearchParams(window.location.search);
    var merged = new URLSearchParams(current.toString());
    try {
      // O que esta na URL agora manda; a sessao so completa o que faltar.
      new URLSearchParams(sessionStorage.getItem(PARAMS_KEY) || '').forEach(function (value, key) {
        if (!current.has(key)) merged.append(key, value);
      });
      sessionStorage.setItem(PARAMS_KEY, merged.toString());
    } catch (e) {}   // sessionStorage bloqueado: segue so com o que veio na URL
    return merged;
  })();

  function withForwardedParams(baseUrl) {
    try {
      var target = new URL(baseUrl, window.location.href);
      // O que o link ja define vence; chaves repetidas na origem (a=1&a=2) chegam todas.
      var own = new URLSearchParams(target.search);
      incomingParams.forEach(function (value, key) {
        if (!own.has(key)) target.searchParams.append(key, value);
      });
      return target.toString();
    } catch (e) {
      return baseUrl;   // qualquer erro: segue mesmo assim, nunca trava o lead
    }
  }

  var state = { country: 'BR', sent: false };

  var errorBox = $('#form-error');

  function showError(msg, field) {
    $all('.bf-input[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
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
    $all('.bf-input[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    return { nome: nome.value.trim(), email: email.value.trim(), phoneRaw: phone.value.trim(), phoneDigits: digits };
  }

  function submitForm() {
    if (state.sent) return;
    var v = validate();
    if (!v) return;

    var params = incomingParams;   // mesmo snapshot que vai pro obrigado
    var today = new Date();
    var country = COUNTRIES.filter(function (c) { return c.code === state.country; })[0] || COUNTRIES[0];
    var payload = {
      nome: v.nome,
      email: v.email,
      whatsapp: country.dial + ' ' + v.phoneRaw,
      telefone: country.dial + v.phoneDigits,
      pagina: (function () { var el = $('#in-pagina'); return el ? el.value : ''; })(),
      utm_campaign: params.get('utm_campaign') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_source: params.get('utm_source') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
      data: pad(today.getDate()) + '/' + pad(today.getMonth() + 1) + '/' + today.getFullYear()
    };
    var body = JSON.stringify(payload);

    // Fire-and-forget: falha de webhook nunca pode impedir a inscricao.
    // keepalive:true e ESSENCIAL — sem ele o redirect abaixo cancela a request.
    WEBHOOKS.forEach(function (wh) {
      try {
        fetch(wh.url, { method: 'POST', mode: wh.mode, headers: { 'Content-Type': wh.ct }, body: body, keepalive: true }).catch(function () {});
      } catch (e) {}
    });

    state.sent = true;
    var btn = $('.bf-form__submit');
    if (btn) { btn.disabled = true; $('.bf-btn__label', btn).textContent = 'Confirmando sua inscrição…'; }
    window.location.href = withForwardedParams(THANKS_URL);
  }

  // ----- popup de inscricao -----
  var modal = $('#popup');
  var lastFocus = null;

  function openForm() {
    lastFocus = document.activeElement;
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
    var f = $all('button, input, select, a[href]', modal).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }

  // Entradas no scroll, versao JS — so roda onde o CSS nao tem animation-timeline
  // (o <head> marca esses navegadores com .bf-sl). Mesma conta do CSS
  // "entry 0% cover 28%": progresso 0 quando o topo do elemento encosta no pe da
  // tela, 1 quando ele ja subiu ~28% da altura da tela. Ida e volta, sem estado.
  function initScrollLinked() {
    var root = document.documentElement;
    if (!root.classList.contains('bf-sl')) return;
    window.__bfSL = true;   // avisa a trava do <head> que o JS assumiu
    var items = $all('.bf-rv, .bf-shape');
    items.forEach(function (el) {
      var cs = getComputedStyle(el);
      var fy = cs.getPropertyValue('--fy').trim();
      // --fy pode vir em vh (formas): converte pra px uma vez so
      el._bfFy = /vh$/.test(fy) ? parseFloat(fy) * window.innerHeight / 100 : (parseFloat(fy) || 0);
      el._bfRange = el.classList.contains('bf-shape') ? 0.45 : 0.32;
    });
    var pillars = $all('.bf-pillar');
    var paired = window.matchMedia('(max-width: 900px)');   // tablet/mobile: fileiras de 2 colunas
    var ticking = false;
    function frame() {
      ticking = false;
      var vh = window.innerHeight;
      // colunas: mesma faixa do CSS, "cover (4% + i*3%) -> cover (30% + i*3%)"
      pillars.forEach(function (track, n) {
        var r = track.getBoundingClientRect();
        var i = paired.matches ? n % 2 : n;
        var c = (vh - r.top) / (vh + r.height);
        var p = Math.min(1, Math.max(0, (c - (0.04 + i * 0.03)) / 0.26));
        var body = $('.bf-pillar__body', track);
        body.style.transform = p >= 1 ? 'none' : 'translateY(' + ((1 - p) * 101).toFixed(1) + '%)';
      });
      // so o progresso vai pro elemento (--p); o CSS monta o transform com --fx/--fy/--fs/--fr
      items.forEach(function (el) {
        // tira o deslocamento vertical que a propria animacao aplicou: a conta usa a posicao de layout
        var top = el.getBoundingClientRect().top - (el._bfShift || 0);
        var p = Math.min(1, Math.max(0, (vh - top) / (vh * el._bfRange)));
        el._bfShift = (1 - p) * el._bfFy;
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

    // N botoes abrem o mesmo popup; fecha pelo X, pelo fundo e pelo Esc
    $all('[data-action]').forEach(function (el) {
      el.addEventListener('click', function (ev) {
        var a = el.getAttribute('data-action');
        if (a === 'openForm') { ev.preventDefault(); openForm(); }
        else if (a === 'closeForm') closeForm();
        else if (a === 'overlayClose') { if (ev.target === modal) closeForm(); }   // so o clique no fundo
      });
    });
    document.addEventListener('keydown', function (ev) {
      if (modal.hidden) return;
      if (ev.key === 'Escape') closeForm();
      else if (ev.key === 'Tab') trapTab(ev);
    });

    $('#inscricao').addEventListener('submit', function (ev) { ev.preventDefault(); submitForm(); });

    // Voltar do obrigado pelo botao do navegador (bfcache) nao pode deixar o form travado.
    window.addEventListener('pageshow', function (ev) {
      if (!ev.persisted) return;
      state.sent = false;
      var btn = $('.bf-form__submit');
      if (btn) { btn.disabled = false; $('.bf-btn__label', btn).textContent = btn.getAttribute('data-label'); }
    });
    var submitBtn = $('.bf-form__submit');
    if (submitBtn) submitBtn.setAttribute('data-label', $('.bf-btn__label', submitBtn).textContent);

    // CTA fixo do mobile: so aparece quando o botao do topo saiu da tela
    // e some de novo na chamada final, que ja tem o proprio botao.
    var sticky = $('#sticky-cta');
    var form = $('#hero-cta');
    var final = $('.bf-final__cta');
    if (sticky && 'IntersectionObserver' in window) {
      var seen = { form: true, final: false, passed: false };
      var sync = function () { sticky.classList.toggle('is-on', seen.passed && !seen.form && !seen.final); };
      new IntersectionObserver(function (e) {
        seen.form = e[0].isIntersecting;
        seen.passed = e[0].boundingClientRect.top < 0 || seen.passed;
        sync();
      }).observe(form);
      // some quando o CTA final aparece e nao volta depois dele (rodape fica livre)
      if (final) new IntersectionObserver(function (e) { seen.final = e[0].isIntersecting || e[0].boundingClientRect.top < 0; sync(); }).observe(final);
    }

    initScrollLinked();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

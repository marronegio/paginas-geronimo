(function () {
  'use strict';

  /* =========================================================================
     CONFIGURACAO — LP "Estamos ao vivo" (igual nas variantes v1 e v2).
     Diferente das LPs de captacao: aqui nao tem obrigado nem Grupo VIP.
     O lead preenche e vai DIRETO pra live.
     ========================================================================= */

  var WEBHOOKS = [
    // IGT (n8n): devolve headers CORS, aceita application/json.
    { url: 'https://webhook.igtcoaching.com.br/webhook/55ece7e3-601b-4c8d-914f-dff2676eca9d', mode: 'cors', ct: 'application/json' },
    // Clint (CRM): sem CORS no preflight -> enviar como "simple request" (text/plain + no-cors).
    { url: 'https://functions-api.clint.digital/endpoints/integration/webhook/b603d4a3-4572-4930-b3d3-e8199117c80c', mode: 'no-cors', ct: 'text/plain;charset=UTF-8' }
  ];

  // Para onde o lead vai depois do formulario.
  var LIVE_URL = 'https://www.youtube.com/watch?v=GXj1yJ9gjlI';

  // Inicio da live: segunda, 16/11/2026, 20h em Brasilia (UTC-3, sem horario de verao) = 23h UTC.
  // O tempo do REC no visor conta a partir daqui enquanto a live esta no ar (ate 5h depois).
  // Fora dessa janela (teste antes, acesso muito depois) ele conta a partir da abertura da pagina.
  var LIVE_START = Date.UTC(2026, 10, 16, 23, 0, 0);
  var LIVE_WINDOW = 5 * 60 * 60 * 1000;

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

  // UTMs: snapshot da URL completado pela sessao (mesma chave das outras LPs da Black),
  // pra nao perder o rastreio se algum pixel limpar a query string ou a pagina recarregar.
  var PARAMS_KEY = 'bf26:params';

  var incomingParams = (function () {
    var current = new URLSearchParams(window.location.search);
    var merged = new URLSearchParams(current.toString());
    try {
      new URLSearchParams(sessionStorage.getItem(PARAMS_KEY) || '').forEach(function (value, key) {
        if (!current.has(key)) merged.append(key, value);
      });
      sessionStorage.setItem(PARAMS_KEY, merged.toString());
    } catch (e) {}   // sessionStorage bloqueado: segue so com o que veio na URL
    return merged;
  })();

  var state = { country: 'BR', sent: false };

  var form = $('#inscricao');
  var errorBox = $('#form-error');

  function hiddenValue(name) {
    var el = form && form.elements[name];
    return el ? el.value : '';
  }

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

    var params = incomingParams;
    var today = new Date();
    var country = COUNTRIES.filter(function (c) { return c.code === state.country; })[0] || COUNTRIES[0];
    var payload = {
      nome: v.nome,
      email: v.email,
      whatsapp: country.dial + ' ' + v.phoneRaw,
      telefone: country.dial + v.phoneDigits,
      pagina: hiddenValue('pagina'),
      form_name: hiddenValue('form_name'),   // de qual pagina veio o lead
      utm_campaign: params.get('utm_campaign') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_source: params.get('utm_source') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
      data: pad(today.getDate()) + '/' + pad(today.getMonth() + 1) + '/' + today.getFullYear()
    };
    var body = JSON.stringify(payload);

    // Fire-and-forget: falha de webhook nunca pode impedir o lead de entrar na live.
    // keepalive:true e ESSENCIAL — sem ele o redirect abaixo cancela a request.
    WEBHOOKS.forEach(function (wh) {
      try {
        fetch(wh.url, { method: 'POST', mode: wh.mode, headers: { 'Content-Type': wh.ct }, body: body, keepalive: true }).catch(function () {});
      } catch (e) {}
    });

    state.sent = true;
    var btn = $('.bf-form__submit');
    if (btn) { btn.disabled = true; $('.bf-btn__label', btn).textContent = 'Entrando na live…'; }
    window.location.href = LIVE_URL;
  }

  // ----- tempo de gravacao no visor (HH:MM:SS) -----
  function initTimecode() {
    var out = $('#vf-tc');
    if (!out) return;
    var now = Date.now();
    var onAir = now >= LIVE_START && now - LIVE_START < LIVE_WINDOW;
    var base = onAir ? LIVE_START : now;
    function tick() {
      var s = Math.max(0, Math.floor((Date.now() - base) / 1000));
      out.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60);
      // acerta na virada do segundo, pra nao "pular" numero
      setTimeout(tick, 1000 - ((Date.now() - base) % 1000) + 5);
    }
    tick();
  }

  // ----- CTA fixo: aparece enquanto o formulario ainda esta abaixo da tela -----
  // (mobile, na chegada). Toque: rola ate o form e ja abre o teclado no nome.
  function initSticky() {
    var sticky = $('#sticky-cta');
    if (!sticky || !form) return;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        var r = e[0].boundingClientRect;
        sticky.classList.toggle('is-on', !e[0].isIntersecting && r.top > 0);
      }, { threshold: 0.35 }).observe(form);
    }
    $('a', sticky).addEventListener('click', function (ev) {
      ev.preventDefault();
      var nome = $('#in-nome');
      if (nome) nome.focus({ preventScroll: true });
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
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
      phone.placeholder = sel.value === 'BR' ? 'Seu WhatsApp com DDD' : 'Seu WhatsApp';
    });
    phone.addEventListener('input', function () {
      if (state.country === 'BR') phone.value = formatBrPhone(phone.value); // fora do BR: entrada livre
    });

    form.addEventListener('submit', function (ev) { ev.preventDefault(); submitForm(); });

    // Voltar da live pelo botao do navegador (bfcache) nao pode deixar o form travado.
    var submitBtn = $('.bf-form__submit');
    if (submitBtn) submitBtn.setAttribute('data-label', $('.bf-btn__label', submitBtn).textContent);
    window.addEventListener('pageshow', function (ev) {
      if (!ev.persisted) return;
      state.sent = false;
      if (submitBtn) { submitBtn.disabled = false; $('.bf-btn__label', submitBtn).textContent = submitBtn.getAttribute('data-label'); }
    });

    initTimecode();
    initSticky();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

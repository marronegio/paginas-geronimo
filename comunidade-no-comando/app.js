(function () {
  'use strict';

  /* =========================================================================
     CONFIGURACAO DA ACAO — e so isto que muda de uma acao para outra.
     Ver README.md do repositorio de referencia (protocolo-6-porcento), secao 11.
     ========================================================================= */

  // TODO(acao): pedir os dois UUIDs ao responsavel por automacao antes de subir.
  var WEBHOOKS = [
    // IGT (n8n): devolve headers CORS, aceita application/json.
    { url: 'https://webhook.igtcoaching.com.br/webhook/e9a439c7-9764-4c99-be1e-f472d0b4c998', mode: 'cors', ct: 'application/json' },
    // Clint (CRM): sem CORS no preflight -> enviar como "simple request" (text/plain + no-cors).
    { url: 'https://functions-api.clint.digital/endpoints/integration/webhook/bc122b46-ad8a-4800-a34e-e2c899c5bbc8', mode: 'no-cors', ct: 'text/plain;charset=UTF-8' }
  ];

  // TODO(acao): trocar pelo link real do produto/oferta na Hotmart (com sck da origem).
  var CHECKOUT_URL = 'https://pay.hotmart.com/C97417827Q?off=paio32a6&split=12&checkoutMode=10&hidewallet=1&sck=oportunidade-cnc-p6p';

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

  // Nenhum parametro da URL pode se perder entre o anuncio e o checkout.
  // O snapshot e tirado no carregamento e guardado na sessao: se algum pixel
  // limpar a query string, ou o visitante recarregar/voltar pra pagina ja sem
  // os parametros, o clique no checkout continua levando o rastreio completo.
  var PARAMS_KEY = 'cnc:params';

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
      // Snapshot dos parametros do proprio link: o que o checkout ja define
      // vence, e chaves repetidas na origem (a=1&a=2) chegam todas.
      var own = new URLSearchParams(target.search);
      incomingParams.forEach(function (value, key) {
        if (!own.has(key)) target.searchParams.append(key, value);
      });
      // VK Metrics: identifica a venda com o anuncio Meta que originou o clique.
      var adId = incomingParams.get('vk_ad_id') || '';
      var vkSource = incomingParams.get('vk_source') || 'paid_metaads';
      var pageUrl = (window.location.origin + window.location.pathname).replace(/^https?:\/\//, '');
      target.searchParams.set('xcod', JSON.stringify({ vid: adId, vsrc: vkSource, url: pageUrl, v: 1 }));
      return target.toString();
    } catch (e) {
      return baseUrl;   // qualquer erro: manda pro checkout mesmo assim, nunca trava a venda
    }
  }

  var state = { country: 'BR' };

  // ----- modal de checkout -----
  var overlay = $('#checkout');
  var modalForm = $('#modal-form');
  var modalSuccess = $('#modal-success');
  var errorBox = $('#modal-error');
  var lastFocus = null;

  function openCheckout() {
    lastFocus = document.activeElement;
    modalForm.hidden = false;      // sempre reseta para o estado de formulario
    modalSuccess.hidden = true;
    errorBox.hidden = true;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = $('#in-nome');
    if (first) setTimeout(function () { first.focus(); }, 30);
  }

  function closeCheckout() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function goOffer() {
    var el = $('#oferta');
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - 68;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function showError(msg, field) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
    if (field) field.focus();
  }

  // O <form> tem novalidate: a validacao e nossa, com mensagem no proprio modal.
  function validate() {
    var nome = $('#in-nome');
    var email = $('#in-email');
    var phone = $('#phone-input');
    if (nome.value.trim().length < 2) { showError('Digite seu nome completo.', nome); return null; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { showError('Digite um e-mail válido.', email); return null; }
    var digits = phone.value.replace(/\D/g, '');
    var min = state.country === 'BR' ? 10 : 6;
    if (digits.length < min) { showError('Digite um número de WhatsApp válido com DDD.', phone); return null; }
    errorBox.hidden = true;
    return { nome: nome.value.trim(), email: email.value.trim(), phoneRaw: phone.value.trim(), phoneDigits: digits };
  }

  function submitForm() {
    var v = validate();
    if (!v) return;

    var params = incomingParams;   // mesmo snapshot que vai pro checkout
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

    // Fire-and-forget: falha de webhook nunca pode impedir a venda.
    // keepalive:true e ESSENCIAL — sem ele o redirect abaixo cancela a request.
    WEBHOOKS.forEach(function (wh) {
      try {
        fetch(wh.url, { method: 'POST', mode: wh.mode, headers: { 'Content-Type': wh.ct }, body: body, keepalive: true }).catch(function () {});
      } catch (e) {}
    });

    modalForm.hidden = true;
    modalSuccess.hidden = false;
    window.location.href = withForwardedParams(CHECKOUT_URL);
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

    // acoes por delegacao — N botoes abrem o mesmo modal sem duplicar codigo
    $all('[data-action]').forEach(function (el) {
      el.addEventListener('click', function (ev) {
        var a = el.getAttribute('data-action');
        if (a === 'goOffer') goOffer();
        else if (a === 'openCheckout') openCheckout();
        else if (a === 'closeCheckout') closeCheckout();
        else if (a === 'overlayClose') { if (ev.target === overlay) closeCheckout(); }   // so o clique no fundo
      });
    });

    $('#checkout-form').addEventListener('submit', function (ev) { ev.preventDefault(); submitForm(); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !overlay.hidden) closeCheckout(); });

    // CTA fixo do mobile: aparece depois do hero e some de novo na dobra de oferta,
    // pra nunca duplicar um botao que ja esta visivel na tela.
    var sticky = $('#sticky-cta');
    var hero = $('#hero');
    var oferta = $('#oferta');
    if (sticky) {
      if ('IntersectionObserver' in window) {
        var seen = { hero: true, oferta: false };
        var sync = function () { sticky.style.visibility = (seen.hero || seen.oferta) ? 'hidden' : 'visible'; };
        if (hero) new IntersectionObserver(function (e) { seen.hero = e[0].isIntersecting; sync(); }).observe(hero);
        if (oferta) new IntersectionObserver(function (e) { seen.oferta = e[0].isIntersecting; sync(); },
          { rootMargin: '-35% 0px -35% 0px' }).observe(oferta);
        sync();
      } else {
        sticky.style.visibility = 'visible';   // sem IntersectionObserver: melhor sempre visivel
      }
    }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

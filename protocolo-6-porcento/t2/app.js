(function () {
  'use strict';

  var EVENT_DATE = '2026-08-29T09:00:00-03:00';
  var VAGAS_PCT = 35;

  var WEBHOOKS = [
    // IGT: devolve headers CORS, aceita application/json.
    { url: 'https://webhook.igtcoaching.com.br/webhook/72fdafc9-eaef-48ca-935a-b2009fa0d996', mode: 'cors', ct: 'application/json' },
    // Clint: sem CORS no preflight -> enviar como "simple request" (text/plain + no-cors).
    { url: 'https://functions-api.clint.digital/endpoints/integration/webhook/cbaced4a-d1c0-44cf-a55e-be395352c953', mode: 'no-cors', ct: 'text/plain;charset=UTF-8' }
  ];

  // Viradas automaticas por data retomadas em 18/08/2026.
  // Para travar a pagina em um lote especifico: LOTE_FIXO = <numero do lote>.
  var LOTE_FIXO = null;

  var LOTES = [
    { num: 1, price: 32, start: '2026-07-02T00:00:00-03:00', end: '2026-08-18T23:59:59.999-03:00', url: 'https://pay.hotmart.com/X106563861U?off=g9tanbl4&split=12&checkoutMode=10&hidewallet=1&sck=protocolo6porcento-ago26-lote1-org' },
    { num: 2, price: 37, start: '2026-08-19T00:00:00-03:00', end: '2026-08-25T23:59:59.999-03:00', url: 'https://pay.hotmart.com/X106563861U?off=qwgs2eny&split=12&checkoutMode=10&hidewallet=1&sck=protocolo6porcento-ago26-lote2-org' },
    { num: 3, price: 42, start: '2026-08-26T00:00:00-03:00', end: '2026-08-28T23:59:59.999-03:00', url: 'https://pay.hotmart.com/X106563861U?off=9sb3xkmn&split=12&checkoutMode=10&hidewallet=1&sck=protocolo6porcento-ago26-lote3-org' }
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

  function pad(n) { return String(n).padStart(2, '0'); }

  function currentLote(now) {
    if (LOTE_FIXO !== null) {
      for (var f = 0; f < LOTES.length; f++) {
        if (LOTES[f].num === LOTE_FIXO) return LOTES[f];
      }
    }
    var t = now.getTime();
    for (var i = 0; i < LOTES.length; i++) {
      if (t >= new Date(LOTES[i].start).getTime() && t <= new Date(LOTES[i].end).getTime()) return LOTES[i];
    }
    return t < new Date(LOTES[0].start).getTime() ? LOTES[0] : LOTES[LOTES.length - 1];
  }

  function formatBrPhone(raw) {
    var d = raw.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  function withForwardedParams(baseUrl) {
    try {
      var target = new URL(baseUrl, window.location.href);
      var incoming = new URLSearchParams(window.location.search);
      incoming.forEach(function (value, key) {
        if (!target.searchParams.has(key)) target.searchParams.append(key, value);
      });
      // VK Metrics: identifica a venda com o anuncio Meta que originou o clique.
      var adId = incoming.get('vk_ad_id') || '';
      var vkSource = incoming.get('vk_source') || 'paid_metaads';
      var pageUrl = (window.location.origin + window.location.pathname).replace(/^https?:\/\//, '');
      target.searchParams.set('xcod', JSON.stringify({ vid: adId, vsrc: vkSource, url: pageUrl, v: 1 }));
      return target.toString();
    } catch (e) {
      return baseUrl;
    }
  }

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $all = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var state = { country: 'BR', loteUrl: LOTES[0].url };

  function updateLoteBar(l) {
    var bar = $('#lote-bar');
    if (!bar) return;
    var left = new Date(l.end).getTime() - Date.now();
    // Lote fixo/encerrado nao tem contagem util: esconde a faixa em vez de zerar.
    if (left <= 0) { bar.hidden = true; return; }
    bar.hidden = false;
    $('#lb-days').textContent = pad(Math.floor(left / 86400000));
    $('#lb-hours').textContent = pad(Math.floor(left % 86400000 / 3600000));
    $('#lb-mins').textContent = pad(Math.floor(left % 3600000 / 60000));
    $('#lb-secs').textContent = pad(Math.floor(left % 60000 / 1000));
  }

  function applyLote() {
    var l = currentLote(new Date());
    state.loteUrl = l.url;
    updateLoteBar(l);
    $all('[data-lote="num"]').forEach(function (e) { e.textContent = l.num; });
    $all('[data-lote="price"]').forEach(function (e) { e.textContent = l.price; });
    var lbl = $('#lote-progress-label');
    if (lbl) lbl.textContent = 'Lote ' + l.num + ' — vagas preenchidas';
  }

  function tick() {
    var diff = Math.max(0, new Date(EVENT_DATE).getTime() - Date.now());
    var d = Math.floor(diff / 86400000); diff -= d * 86400000;
    var h = Math.floor(diff / 3600000); diff -= h * 3600000;
    var m = Math.floor(diff / 60000); diff -= m * 60000;
    var s = Math.floor(diff / 1000);
    $('#cd-days').textContent = String(d);
    $('#cd-hours').textContent = pad(h);
    $('#cd-mins').textContent = pad(m);
    $('#cd-secs').textContent = pad(s);
    applyLote();
  }

  // ----- checkout modal -----
  var overlay = $('#checkout');
  var modalForm = $('#modal-form');
  var modalSuccess = $('#modal-success');

  function openCheckout() {
    modalForm.hidden = false;
    modalSuccess.hidden = true;
    overlay.hidden = false;
  }
  function closeCheckout() { overlay.hidden = true; }

  function goOffer() {
    var el = $('#ingresso');
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function submitForm() {
    var params = new URLSearchParams(window.location.search);
    var today = new Date();
    var country = COUNTRIES.filter(function (c) { return c.code === state.country; })[0] || COUNTRIES[0];
    var whatsappRaw = $('#phone-input').value;
    var payload = {
      nome: $('#in-nome').value,
      email: $('#in-email').value,
      whatsapp: country.dial + ' ' + whatsappRaw,
      telefone: country.dial + whatsappRaw.replace(/\D/g, ''),
      pagina: (function () { var el = $('#in-pagina'); return el ? el.value : ''; })(),
      utm_campaign: params.get('utm_campaign') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_source: params.get('utm_source') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
      data: pad(today.getDate()) + '/' + pad(today.getMonth() + 1) + '/' + today.getFullYear()
    };
    var body = JSON.stringify(payload);
    WEBHOOKS.forEach(function (wh) {
      try {
        fetch(wh.url, { method: 'POST', mode: wh.mode, headers: { 'Content-Type': wh.ct }, body: body, keepalive: true }).catch(function () {});
      } catch (e) {}
    });
    modalForm.hidden = true;
    modalSuccess.hidden = false;
    window.location.href = withForwardedParams(state.loteUrl);
  }

  // ----- init -----
  function init() {
    // progress
    var pct = Math.max(0, Math.min(100, VAGAS_PCT));
    $('#vagas-fill').style.width = pct + '%';
    $('#vagas-label').textContent = pct + '% PREENCHIDO';
    var track = $('.p6-progress__track');
    if (track) track.setAttribute('aria-valuenow', String(pct));

    // country select
    var sel = $('#country-select');
    COUNTRIES.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c.code;
      o.textContent = c.flag + ' ' + c.dial;
      sel.appendChild(o);
    });
    sel.value = 'BR';
    var phone = $('#phone-input');
    sel.addEventListener('change', function () {
      state.country = sel.value;
      phone.value = '';
      phone.placeholder = sel.value === 'BR' ? '(00) 00000-0000' : 'Número de telefone';
    });
    phone.addEventListener('input', function () {
      if (state.country === 'BR') phone.value = formatBrPhone(phone.value);
    });

    // actions
    $all('[data-action]').forEach(function (el) {
      el.addEventListener('click', function (ev) {
        var a = el.getAttribute('data-action');
        if (a === 'goOffer') goOffer();
        else if (a === 'openCheckout') openCheckout();
        else if (a === 'closeCheckout') closeCheckout();
        else if (a === 'overlayClose') { if (ev.target === overlay) closeCheckout(); }
      });
    });
    $('#checkout-form').addEventListener('submit', function (ev) { ev.preventDefault(); submitForm(); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !overlay.hidden) closeCheckout(); });

    // countdown + lote
    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

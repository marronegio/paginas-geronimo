/* Animacoes de entrada (GSAP + ScrollTrigger, self-hosted em assets/vendor/).
   Marcacao declarativa no HTML, no mesmo espirito do data-action do app.js:
     [data-anim]              -> revela o proprio elemento
     [data-anim="card"]       -> idem, com um leve scale (card de oferta)
     [data-anim="zoom"]       -> entra crescendo (selo da garantia)
     [data-anim-group]        -> revela os filhos diretos em cascata
     [data-anim-group="hero"] -> idem, mas no load, sem esperar scroll

   Regra que nao pode ser quebrada: a pagina NUNCA pode ficar invisivel por causa
   daqui. O estado inicial escondido vive na classe .anim-pending do <html>, que:
     - so e aplicada pelo script inline do <head> (e nunca com reduced-motion);
     - tem uma trava de 2s la mesmo, caso este arquivo nao carregue;
     - e removida abaixo assim que o GSAP assume os estados inline.
*/
(function () {
  'use strict';

  var root = document.documentElement;
  function revelarTudo() { root.classList.remove('anim-pending'); }

  // GSAP nao carregou (bloqueador, rede, erro): mostra tudo e sai.
  if (!window.gsap || !window.ScrollTrigger) { revelarTudo(); return; }

  // Reduced-motion: a guarda do <head> impede o estado inicial via CSS, mas ela
  // sozinha nao basta — sem este return o GSAP escreveria opacity:0 inline aqui
  // e animaria assim mesmo. O @media do CSS nao alcanca animacao feita em JS.
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { revelarTudo(); return; }

  var $all = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  gsap.registerPlugin(ScrollTrigger);

  var EASE = 'power2.out';
  var START = 'top 85%';          // dispara quando o topo do bloco cruza 85% da viewport
  var singles = $all('[data-anim]');
  var groups = $all('[data-anim-group]');

  // 1) Estados iniciais em estilo inline. Precisa vir ANTES de revelarTudo(),
  //    senao o conteudo pisca visivel por um frame.
  singles.forEach(function (el) {
    var tipo = el.getAttribute('data-anim');
    if (tipo === 'zoom') gsap.set(el, { opacity: 0, scale: .86 });
    else if (tipo === 'card') gsap.set(el, { opacity: 0, y: 30, scale: .985 });
    else gsap.set(el, { opacity: 0, y: 24 });
  });
  groups.forEach(function (g) {
    gsap.set(g.children, { opacity: 0, y: 18 });
  });

  revelarTudo();

  // 2) Elementos soltos
  singles.forEach(function (el) {
    var tipo = el.getAttribute('data-anim');
    var vars = { opacity: 1, duration: .7, ease: EASE, scrollTrigger: { trigger: el, start: START, once: true } };
    if (tipo === 'zoom') { vars.scale = 1; vars.duration = .8; vars.ease = 'back.out(1.4)'; }
    else if (tipo === 'card') { vars.y = 0; vars.scale = 1; vars.duration = .8; }
    else vars.y = 0;
    gsap.to(el, vars);
  });

  // 3) Grupos em cascata
  groups.forEach(function (g) {
    var filhos = g.children;
    if (!filhos.length) return;

    // O hero esta acima da dobra: entra no load, nao no scroll.
    if (g.getAttribute('data-anim-group') === 'hero') {
      gsap.to(filhos, { opacity: 1, y: 0, duration: .6, ease: EASE, stagger: .07, delay: .05 });
      return;
    }

    gsap.to(filhos, {
      opacity: 1, y: 0, duration: .65, ease: EASE, stagger: .08,
      scrollTrigger: { trigger: g, start: START, once: true }
    });
  });

  // 4) O FAQ muda de altura ao abrir/fechar: reposiciona os gatilhos abaixo dele.
  $all('.cnc-faq__item').forEach(function (item) {
    item.addEventListener('toggle', function () { ScrollTrigger.refresh(); });
  });

  // Fontes chegam depois e mudam a altura do texto — recalcula as posicoes.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();

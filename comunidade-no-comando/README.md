# Comunidade No Comando — página de vendas

LP de venda direta da CNC (programa de 12 meses, 12x de R$ 99,50).
Segue o padrão descrito em [`../protocolo-6-porcento/README.md`](../protocolo-6-porcento/README.md) — HTML/CSS/JS vanilla, sem build e sem dependência externa em runtime.

Prefixo de classe desta página: **`cnc-`**.

---

## Estrutura

```
comunidade-no-comando/
├── index.html     # LP completa — o CSS vai INLINE no <head> (minificado)
├── styles.css     # fonte de verdade do CSS (versão legível)
├── app.js         # config da ação, modal, máscara de telefone, UTMs, webhooks
├── animations.js  # animações de entrada (GSAP + ScrollTrigger)
├── .htaccess      # compressão + política de cache (cópia do padrão)
├── assets/        # imagens .webp e fontes .woff2 self-hosted
│   └── vendor/    # GSAP + ScrollTrigger self-hosted (licença no-charge)
└── obrigado/      # página de compra confirmada (index.html + styles.css próprios)
```

`styles.css` **não é carregado pela página** — o navegador só lê o `<style>` inline.
Sempre que editar o `styles.css`, regere o inline (ver [Regerar o CSS inline](#regerar-o-css-inline)).

---

## ⚠️ Antes de subir: o que ainda falta preencher

Tudo isto está marcado com `SUBSTITUIR-` no código e **precisa** ser trocado por valor real.

| Onde | O quê | Quem fornece |
|---|---|---|
| [`app.js`](app.js) `WEBHOOKS[0]` | UUID do webhook n8n da IGT | responsável por automação |
| [`app.js`](app.js) `WEBHOOKS[1]` | UUID do webhook do CRM Clint | responsável por automação |
| [`app.js`](app.js) `CHECKOUT_URL` | produto + oferta na Hotmart, com o `sck` da origem | responsável pelo produto |
| [`index.html`](index.html) link do WhatsApp | `https://wa.me/55DDDNUMERO` no bloco "Ainda com dúvidas?" | suporte |
| [`obrigado/index.html`](obrigado/index.html) link do WhatsApp | mesmo número, no botão "Chame meu time no WhatsApp" | suporte |
| Hotmart | URL de página de obrigado apontando para `/obrigado/` | responsável pelo produto |

**Não muda** (constantes da empresa, já configuradas): GTM `GTM-WSTL4F8` · conta VK `cK0i3FbAiLmfmeAOoJlK` ·
`withForwardedParams()` · `formatBrPhone()` · lista `COUNTRIES` · formato do payload dos webhooks · `.htaccess`.

---

## Fluxo do lead

```
Anúncio com UTMs → index.html
    CTA "Assuma o comando da sua vida agora" → abre o MODAL
        nome + e-mail + WhatsApp (DDI com bandeira, máscara BR)
        submit → POST webhook n8n  +  POST webhook Clint   (fire-and-forget, keepalive)
               → redirect ao checkout com UTMs repassadas + xcod da VK
```

O lead é capturado **antes** do checkout: quem preenche e desiste de pagar já está no CRM.
Falha de webhook nunca impede o redirect.

### Modal de checkout

- Três campos, nunca mais que isso.
- Seletor de DDI com 36 países, **Brasil primeiro e como padrão**. As bandeiras usam a fonte
  `TwemojiCountryFlags.woff2` (Windows não desenha emoji de bandeira).
- Máscara `(XX) XXXXX-XXXX` **só no Brasil** — fora do BR a entrada é livre, porque formato de
  telefone varia demais por país. Trocar o DDI limpa o campo e troca o placeholder.
- O `<form>` é `novalidate`: a validação (nome, e-mail, telefone) é feita no `app.js` e a mensagem
  aparece dentro do próprio modal, em `#modal-error` com `role="alert"`.
- Fecha por: botão X, clique no overlay e tecla `Esc`. Ao abrir, o foco vai pro primeiro campo;
  ao fechar, volta pro botão que abriu.

---

## Assets

| Arquivo | Origem | Uso |
|---|---|---|
| `hero-cnc.webp` | banner 1672×941 fornecido | fundo do hero (LCP, com `preload`) |
| `logo-cnc.webp` / `.png` | `LOGOTIPO VERSÃO 1.png` | logo principal — versão branca, para fundo escuro |
| `logo-cnc-dark.webp` | derivada da anterior | mesma logo com o texto em preto, caso surja seção de fundo claro |
| `fundo-guia.webp` | `fundo-guia.png` fornecido (1672×941) | fundo da seção "Seu guia pelos próximos 12 meses" |
| `garantia.webp` | `garantia.png` fornecido | selo "7 dias de garantia" na dobra da garantia |
| `favicon.png` | `#` da logo sobre o vermelho da marca | ícone da aba |

Identidade visual: preto (`#08080A`), vermelho da logo (`#D8221E` / `#F12026`), tipografia
Saira Condensed 900 em caixa alta nos títulos. A página inteira é escura; o **card de oferta é
branco** de propósito, para ser o único ponto de ruptura visual e concentrar a atenção na decisão.

---

## Responsividade

O conteúdo tem **largura máxima de 1280px** no desktop (`.cnc-section`, `.cnc-nav__inner`,
`.cnc-hero__inner`, `.cnc-promise__inner`, `.cnc-ias__inner`, `.cnc-offer`, `.cnc-author__inner`,
`.cnc-guarantee__inner`, `.cnc-footer__inner`), com `28px` de respiro lateral.
Alguns blocos são propositalmente mais estreitos, porque são **medida de leitura**, não container:
card de oferta `760px` · texto da garantia `760px` · lista do FAQ `860px` · fechamento `820px` ·
coluna de texto do hero `640px`.

Uma única media query (`max-width: 680px`), que muda **comportamento**, não tamanho.
Todo o resto se adapta com `clamp()`, `auto-fit` e `flex-wrap`.

- **Hero:** no desktop a foto é `cover` com `background-position: 76% top` e scrim escuro cobrindo o
  lado do texto. O ancoramento no **topo** é obrigatório: em tela larga e baixa (ex.: 1920×1080) o
  `cover` sobra em altura, e com `center` a sobra era descontada metade em cima — cortando a cabeça.
  O que sobra agora sai por baixo, onde já existe gradiente escuro.
  No mobile ela vira `contain` no topo, com máscara em gradiente dissolvendo no preto, e o texto desce
  (`padding-top: 46vw`). O `aspect-ratio: 1672/941` é o da imagem real.
- **Seção do autor:** é o espelho do hero — mesma imagem 1672×941, mas com o sujeito à esquerda,
  então o scrim vem da direita e o texto fica desse lado. O escurecimento atrás do texto **não** é
  o scrim da seção: é um gradiente no próprio `.cnc-author__body`. O scrim da seção é relativo ao
  viewport, e em ~1024px a coluna de texto cai proporcionalmente mais à esquerda, em cima do rosto,
  onde o scrim já está quase transparente. Ancorar no bloco resolve em qualquer largura.
- **CTA fixo:** só existe no mobile. Nasce escondido, aparece depois que o hero sai da tela e some
  de novo quando a dobra de oferta entra — nunca duplica um botão já visível.

Testado sem scroll horizontal em **360 · 390 · 680 · 900 · 1024 · 1280 · 1440 · 1920**.

---

## Página de obrigado (`/obrigado/`)

Página de **compra confirmada** — é para ela que a Hotmart deve redirecionar após o pagamento
(configurar no painel do produto). Mesma identidade da LP, mesmas fontes self-hosted (`../assets/`),
CSS inline, GTM nos dois blocos e `noindex` (não é página de busca).

Prefixo de classe: **`ty-`**. Tem o próprio `styles.css` — o inline se regera do mesmo jeito
(ver abaixo), apontando o script para a pasta `obrigado/`.

Duas armadilhas que já custaram tempo aqui, não desfaça:

- `.ty` precisa de **`width: 100%`** junto do `max-width`/`margin: 0 auto`. O pai (`.ty-root`) é
  flex, e margem `auto` no eixo cruzado **cancela o `stretch`** — sem o `width`, a seção vira
  shrink-to-fit e o grid de 3 passos quebra em duas linhas.
- O bloco `@media (min-width: 900px)` dimensiona a vertical em `vh` (não `vw`), para a página caber
  numa tela só no desktop. **Não** usa `overflow: hidden`: em tela muito baixa ela rola normalmente,
  em vez de cortar o CTA.

Cabe sem rolagem em 1024×768, 1280×800, 1366×768, 1440×900 e 1920×1080.

---

## Animações de entrada

GSAP + ScrollTrigger, **self-hosted** em `assets/vendor/`. Não use CDN: a §2 proíbe dependência
externa em runtime, e um bloqueador derrubando o script não pode derrubar a página junto.
Custo: **+47KB gzip** (o `.htaccess` já comprime `.js`).

Marcação declarativa no HTML, no mesmo espírito do `data-action`:

| Atributo | Efeito |
|---|---|
| `data-anim` | revela o elemento (fade + sobe 24px) |
| `data-anim="card"` | idem, com leve `scale` — usado no card de oferta |
| `data-anim="zoom"` | entra crescendo — usado no selo da garantia |
| `data-anim-group` | revela os filhos diretos em cascata (`stagger: .08`) |
| `data-anim-group="hero"` | idem, mas no load, sem esperar scroll |

### A regra que não pode ser quebrada

**A página nunca pode ficar invisível por causa da animação.** O estado inicial escondido vive
na classe `.anim-pending` do `<html>`, com três proteções:

1. Só é aplicada pelo **script inline do `<head>`** — síncrono e antes do `<style>`, senão o
   conteúdo aparece antes de ser escondido.
2. Esse mesmo script tem uma **trava de 2s** que remove a classe. Se o `animations.js` não
   carregar, a página aparece sozinha.
3. O `animations.js` sai cedo (revelando tudo) se o GSAP não estiver disponível.

**Reduced-motion precisa de guarda dupla:** no script do `<head>` (não aplica a classe) *e*
dentro do `animations.js` (`return` antes de qualquer `gsap.set`). Só a primeira não basta — sem
a segunda, o GSAP escreveria `opacity: 0` inline e animaria assim mesmo. O `@media
(prefers-reduced-motion)` do CSS **não alcança** animação feita em JS.

Os quatro cenários foram testados: fluxo normal, GSAP bloqueado, `animations.js` bloqueado e
reduced-motion. Nos três últimos, todo o conteúdo fica visível.

### Impacto medido (3G rápido + CPU 4×)

| | Sem animação | Com animação |
|---|---|---|
| FCP | 1024ms | 1007ms |
| LCP | 1405ms | 1007ms |
| CLS | — | **0.0000** |

LCP não piorou: o elemento LCP é o `background` do hero (com `preload`), não o texto. CLS é zero
porque só se anima `opacity` e `transform`, que não causam reflow — **não troque por `height`,
`margin` ou `top`.**

---

## Regerar o CSS inline

O `<style>` do `index.html` é o `styles.css` minificado. Depois de editar o `styles.css`:

```python
import re, io
css = io.open('styles.css', encoding='utf-8').read()
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
css = re.sub(r'\s+', ' ', css)
css = re.sub(r'\s*([{};,])\s*', r'\1', css)
css = re.sub(r':\s+', ':', css).replace(';}', '}')
css = re.sub(r'\s+!important', '!important', css).strip()
assert css.count('{') == css.count('}'), 'chaves desbalanceadas'
html = io.open('index.html', encoding='utf-8').read()
html = re.sub(r'<style>.*?</style>', lambda m: '<style>' + css + '</style>', html, count=1, flags=re.S)
io.open('index.html', 'w', encoding='utf-8', newline='\n').write(html)
```

Para a página de obrigado, rode o mesmo script dentro de `obrigado/` (ela tem `styles.css` e
`index.html` próprios).

O `assert` das chaves não é opcional: um `@font-face` sem fechamento derruba **todo** o CSS da
página e o sintoma é a LP renderizar sem estilo nenhum.

**Ao editar o `app.js` ou o `animations.js`, incremente o cache-buster** — `?v=1` vira `?v=2`.
O `.htaccess` guarda JS/CSS por 30 dias e já houve incidente de CDN servindo versão antiga.

---

## Variantes de hero

A copy traz duas variantes alternativas de headline para teste:

1. *"Entre para o grupo dos 6% que começam e terminam o que prometem."*
2. *"Comece, continue e termine o que é importante pra você."*

Ambas com a mesma subheadline: *"Uma jornada de 12 meses conduzida por Geronimo Theml para você
construir e sustentar os hábitos que constroem a vida que você quer. Mesmo que você já tenha
começado e abandonado tudo o que tentou até hoje."*

A página no ar usa a headline principal. Para rodar variante, duplique a pasta (padrão `t1/`…`t4/`
do repositório de referência), troque `.cnc-hero__title` / `.cnc-hero__sub` e o
`<input id="in-pagina">` — hoje `cnc-v1` — para o identificador da variante.

---

## Pendências conhecidas

- `formatBrPhone()` sempre aplica o formato de celular (5+4). Número fixo de 10 dígitos sai como
  `(11) 33334-444`. É o comportamento padrão da empresa e o campo é de WhatsApp, então fica assim
  para manter consistência entre as ações.
- O workflow de deploy fica na raiz do repositório e envia a raiz inteira (`local-dir: ./`), ou seja,
  todas as ações juntas. Se esta LP for para um domínio próprio, separe o repositório ou ajuste
  `FTP_SERVER_DIR`.

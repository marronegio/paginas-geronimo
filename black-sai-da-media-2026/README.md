# Black Fora da Média 2026 — LPs de captação, página de vendas + obrigados

Live de Black Friday do Geronimo Theml: **segunda-feira, 16/11/2026, às 20h, no YouTube**.
Páginas de captação gratuita (nome + e-mail + WhatsApp) → página de obrigado → Grupo VIP do WhatsApp.
Na live abre a **página de vendas** (acesso vitalício, no ar até 22/11) → popup pré-checkout → Hotmart → obrigado da venda.

Segue o padrão de [`../protocolo-6-porcento-out26/README.md`](../protocolo-6-porcento-out26/README.md):
HTML/CSS/JS vanilla, sem build, CSS inline no `<head>`, fontes self-hosted, GTM + pixels VK.
Prefixo de classe: **`bf-`** nas LPs de captação, **`bft-`** no obrigado delas,
**`bv-`** na página de vendas, **`bvt-`** no obrigado da venda.

---

## Estrutura

```
black-sai-da-media-2026/
├── oportunidade-org/        # orgânico — copy base (headline "Black Friday: O Fim da Vida na Média… Pra Sempre!")
├── oportunidade-traf-v1/    # tráfego — ALTERNATIVA B ("Não espere janeiro pra mudar…")
├── oportunidade-traf-v2/    # tráfego — ALTERNATIVA C ("No dia 16/11, eu vou te mostrar a condição de BLACK…")
├── oportunidade-ao-vivo-v1/ # DURANTE a live — Opção A, direta ("Eu tô ao vivo agora…") → form → YouTube
├── oportunidade-ao-vivo-v2/ # DURANTE a live — Opção B, na ferida ("O seu 'eu' de 18 anos…") → form → YouTube
├── obrigado/                # página de obrigado ÚNICA, usada pelas 3 LPs de captação
├── oportunidade-vendas/     # PÁGINA DE VENDAS — acesso vitalício (ver "Página de vendas" abaixo)
└── oportunidade-vendas-obrigado/  # obrigado da COMPRA (a Hotmart redireciona pra cá)
```

Cada LP é autocontida (`index.html`, `styles.css`, `app.js`, `.htaccess`, `assets/`).
As 3 são idênticas **exceto o topo**:

| | org | traf-v1 (Alt. B) | traf-v2 (Alt. C) |
|---|---|---|---|
| Headline / subheadline | da copy base | Alt. B | Alt. C |
| Botão do formulário | EU VOU ESTAR AO VIVO | QUERO ESTAR AO VIVO NA BLACK | QUERO ESTAR AO VIVO NA BLACK |
| Microcopy | …e os bônus são só pra quem estiver comigo. | Gratuito. As inscrições abrem durante a live. | idem |
| Campos `pagina` e `form_name` no webhook | `black26-org` | `black26-traf-v1` | `black26-traf-v2` |

Seções 2 a 8 são as mesmas nas três. **Editou o corpo numa LP? Replique nas outras duas.**
O `styles.css` também é igual nas três.

### `form_name` — de qual página veio o lead

Todo formulário da Black tem o campo oculto `<input type="hidden" name="form_name" value="…">`
e o `app.js` manda esse valor no payload dos dois webhooks (ao lado do `pagina`, mesmo valor).
**Página nova? Dê a ela um `form_name` próprio** (padrão `black26-<pasta sem "oportunidade-">`).

| Página | `form_name` |
|---|---|
| oportunidade-org | `black26-org` |
| oportunidade-traf-v1 | `black26-traf-v1` |
| oportunidade-traf-v2 | `black26-traf-v2` |
| oportunidade-ao-vivo-v1 | `black26-ao-vivo-v1` |
| oportunidade-ao-vivo-v2 | `black26-ao-vivo-v2` |
| oportunidade-vendas | `black26-vendas` |

---

## LPs "Estamos ao vivo" (`oportunidade-ao-vivo-v1` / `-v2`)

Pra usar **durante** a live (16/11, a partir das 20h). Uma tela só, sem obrigado e sem Grupo VIP:

```
Anúncio / mensagem → LP ao vivo
   formulário aberto no topo (nome + e-mail + WhatsApp com DDI), sem popup
   ├── POST webhook n8n IGT + CRM Clint (mesmos da captação, com form_name)
   └── redirect → https://www.youtube.com/watch?v=GXj1yJ9gjlI   (LIVE_URL no app.js)
```

- v1 e v2 só mudam headline, subheadline, microcopy, `<title>` e o `form_name`/`pagina`. `styles.css` e `app.js` são iguais nas duas.
- **Trocou o link da live?** Edite `LIVE_URL` no `app.js` das duas e incremente o `?v=` no `index.html`.
- Sinais de "ao vivo" (todos piscam no mesmo compasso, `--bf-beat`): faixa rodando no topo, lâmpada vermelha
  "Estamos ao vivo" e o visor de câmera sobre a foto (cantoneiras que travam o foco ao carregar, REC + tempo
  de gravação e medidor de áudio). O vermelho (`--bf-live`) é **só** pra esses sinais.
- O tempo do REC conta a partir de 16/11 20h (Brasília) enquanto a live está no ar (até 5h depois);
  fora dessa janela, conta a partir da abertura da página.
- Abaixo de 1100px a foto sobe pro topo e o logo vira a "marca do canal" no canto do visor.
  No mobile, um botão fixo "Entrar na live agora" aparece enquanto o formulário está abaixo da tela
  (rola até ele e já abre o teclado no nome).

---

## Página de vendas (`oportunidade-vendas`)

Acesso vitalício a todos os treinamentos. Condição no ar **até 22/11**. Duas condições de preço:
**não aluno** 12x R$ 199,61 / R$ 2.000 e **aluno** 12x R$ 149,71 / R$ 1.500.

```
Live / anúncio / mensagem (com UTMs) → LP de vendas
   todo CTA de compra abre o POPUP PRÉ-CHECKOUT
   popup: escolha da condição (aluno / não aluno) + nome + e-mail + WhatsApp com DDI
          (os botões das etiquetas de preço já abrem com a condição marcada)
   ├── POST webhook n8n IGT (d2fb4990…) + CRM Clint (f6f4e8b2…)   (payload da casa + oferta + status + destino)
   └── DESTINO = 'checkout' → Hotmart (link da condição escolhida, com UTMs + xcod da VK +
                              name/email/phoneac/phonenumber: o checkout abre pré-preenchido)
       DESTINO = 'whatsapp' → WhatsApp do comercial (WHATSAPP_URL, com UTMs, sem xcod)
                                  └── Hotmart → ../oportunidade-vendas-obrigado/
```

### Checkout ou WhatsApp?

Uma chave só, no topo do `app.js`: **`DESTINO = 'checkout'`** (padrão) ou **`'whatsapp'`**.
Ela muda o redirect, o texto do botão do popup ("Ir para o pagamento" / "Falar com o meu time") e a
microcopy embaixo dele (as duas versões estão no HTML com `.bv-only-checkout` / `.bv-only-whatsapp`).
O payload dos webhooks leva `destino`, `oferta` (`nao-aluno` | `aluno`) e `status` (`não aluno` | `aluno`, pro CRM) além dos campos de sempre.
Webhooks próprios do pré-checkout: n8n `d2fb4990-1ca1-4241-bb56-850eeed4762b` e Clint `f6f4e8b2-7db0-427b-81ba-ba455c310c71`.
**Mexeu no `app.js`? Incremente o `?v=` no `index.html`.**

### Sorteios do dia (16 e 17/11)

O contador do topo, a faixa de bônus e os bilhetes dos sorteios seguem `PHASES` no `app.js`
(horário de Brasília, `-03:00`):

| Quando | O que aparece |
|---|---|
| primeira hora de vendas (enquanto `PRIMEIRA_HORA = true`; inclui a revisão antes da live) | contador até 23h59 de hoje + faixa "na primeira hora de vendas… coaching, 1 iPad, 3 kits e AirPods ↓" + os 3 bilhetes: 4 sorteios (sozinho em cima), 16/11 (iPad + kits) e AirPods ("Só até amanhã, 23h59") |
| resto do 16/11, até 23h59 | contador + faixa "até 23h59 de hoje… 1 iPad, 3 kits de livros autografados e AirPods ↓" + bilhete de 16/11 e bilhete das AirPods |
| 17/11 | contador + faixa "você ainda concorre a 1 par de AirPods" + só o bilhete das AirPods ("Só até hoje, 23h59") |
| a partir de 18/11 | tudo isso some (o HTML já nasce `hidden`; sem JS também não aparece) |

**A primeira hora não tem horário fixo** (depende do pitch): quando acabar, troque `PRIMEIRA_HORA` para `false`
no `app.js` e incremente o `?v=`. Se ninguém desligar, ela acaba sozinha às 23h59 de 16/11.
Se a página estiver aberta na virada do dia, troca sozinha. **Pra revisar uma fase específica:**
`?preview_dia=h1`, `?preview_dia=16`, `?preview_dia=17` ou `?preview_dia=off` (esse parâmetro não é guardado nem repassado ao checkout).

### O que é de cada seção

- **Etiquetas de preço** (seção 8): caem do fio e balançam até parar quando entram na tela; o
  "INDECENTE!" bate como carimbo. Disparo único via `[data-inview]` → `.is-in`. Cada etiqueta é uma
  imagem (`assets/etiqueta-amarela.webp` / `etiqueta-clara.webp`, com barbante, furo e picote); o texto
  fica entre o furo e o picote e o botão abaixo do picote, em posições % da imagem (`.bv-tag__info` / `.bv-tag__stub`).
- **Topo** (vendas): no desktop (a partir de 1100px) a foto ocupa a largura toda, a headline fica em 3 linhas
  (amarelo / branco / amarelo) e o relógio dos sorteios flutua sobre o peito do Geronimo, posicionado em `cqw`
  (% da largura da foto: `.bv-today` no bloco `min-width:1100px`). Abaixo de 1100px a foto sobe pro topo e o
  relógio volta pro fluxo, abaixo do card "Quanto você paga?". O ∞ do selo "Acesso vitalício" tem um trecho aceso
  que percorre o laço (parado para quem desativa animações).
- **Arsenal** (seção 4): um card por treinamento, com a capa em destaque (vitrine de 5 colunas a partir de 1240px;
  capa à esquerda e texto à direita abaixo disso). O brilho colorido atrás de cada capa é a própria capa desfocada
  (`.bv-item__glow`, mesmo arquivo): ao trocar uma capa, troque o `src` das duas `<img>` do item.
- **Bilhetes dos sorteios** (seção 7): a moldura é `assets/bilhete.webp` fatiada em 9 partes (`border-image` no
  `.bv-ticket::before`), então cantos, ornamentos e furos não deformam com a altura do texto. O picote dourado
  foi tirado da imagem e é desenhado no `.bv-ticket__stub::before` (esticado, ele ficaria com traços longos).
  Fundo: palco com os prêmios no chão (`assets/sorteios-palco.webp` acima de 900px, `sorteios-palco-mobile.webp`
  abaixo), preso no pé da seção na largura toda. No desktop a seção tem no mínimo a altura da imagem e os bilhetes,
  na largura normal, ficam centralizados por cima do palco (podem cobrir um pouco os livros e o iPad, aprovado).
  No mobile o `padding-bottom: 52vw` reserva o chão pros prêmios aparecerem abaixo dos bilhetes.
- **Uma decisão** (seção 10): tudo centralizado. As 4 frases "espera…" formam uma escada no centro e, ao entrar
  na tela (`[data-inview]` → `.is-in`), caem uma por vez a cada 0,5s: a que cai acende e a anterior apaga pro
  cinza; "espera o próximo ano" fica acesa. No mobile viram uma coluna centrada.
- **Notinhas da conta** (seções 5 e 6): papel picotado com `mask`; o total conta de 0 até o valor (`data-count`).
- **Depoimentos**: o "trecho circulado" da copy é desenhado por cima de cada print. As coordenadas ficam
  no HTML, em `data-marks="x y largura altura [forma]; …"` (px da imagem original; forma 2 = elipse,
  4 = quase retângulo). **Trocou um print? Remeça os trechos.**
- **Verificador de número** (seção 17): compara DDD + 8 últimos dígitos com `TEAM_NUMBERS` no `app.js`.
  Com a lista vazia, responde neutro ("não consegui confirmar"), nunca "não é do meu time".
- **CTA fixo**: aparece depois do botão do topo; some enquanto as etiquetas ou a chamada final estão na tela.
- As 6 áreas usam as colunas como imagem de fundo (`assets/areas-colunas.webp` a partir de 1024px, `assets/areas-colunas-mobile.webp` abaixo, 2 colunas x 3 fileiras); o texto de cada área fica dentro do quadrado preto da coluna. Se a imagem mudar, remedir os quadrados e atualizar as coordenadas `--x/--y/--w/--h` no `styles.css`.
- **Retícula de pontos** (popup, sóis amarelos e fundos `.bv-dots`): usa `assets/textura-pontos-escura.webp`, que é
  a `textura-pontos.webp` já "assada" em pontos pretos com transparência (alfa = 255 − cinza). Pintada normal ela dá
  o mesmo resultado do antigo `multiply`; com `filter: invert(1)` vira pontos claros (o antigo `screen`).
  **Não use `mix-blend-mode` / `background-blend-mode` aqui**: em celulares (Android e iOS) o blend falha dentro
  do popup com rolagem e a textura aparece como um cinza claro com pontos pretos. A página também declara
  `color-scheme: dark` para o "tema escuro automático" do Chrome no Android não recolorir nada.
- Animações respeitam `prefers-reduced-motion`. A classe `.bv-js` (estados de espera) sai sozinha em 3s se o `app.js` não carregar.

### ⚠️ Antes de subir a página de vendas

| Onde | O quê |
|---|---|
| `app.js` → `DESTINO` | confirmar checkout ou WhatsApp |
| `index.html` → FAQ "Por onde chega o meu acesso?" | e-mail do suporte (hoje `[E-MAIL DO SUPORTE]`, `mailto:SUBSTITUIR-EMAIL-SUPORTE`) |
| `index.html` → FAQ "Os treinamentos que você lançar depois…" | resposta a confirmar com a Gi (a copy marcou) |
| `index.html` → bio | a copy pede "Geronimo sorridente"; hoje é a mesma foto da captação. Números da bio (4.000.000 / 63.000.000 / 5.719.000) vieram entre colchetes na copy: confirmar |
| `assets/cursos/` | capas **provisórias** de `mentoria-no-comando`, `ias-da-cnc` e `protocolo-6` (geradas a partir das fotos de hero da CNC e do P6). Trocar pelas oficiais, mesmo nome, 400×654 |
| Hotmart | URL de obrigado apontando pra `/oportunidade-vendas-obrigado/` |

## Obrigado da venda (`oportunidade-vendas-obrigado`)

Barra de 90% → a "nota" de quem comprou (H1 impresso no papel + carimbo "Pra sempre") → 3 passos
(e-mail, pesquisa em destaque — é o que falta pros 100% —, agenda) → "Ainda com dúvidas?".
GTM + `noindex`, sem pixel da VK (mesmo padrão do obrigado da CNC).

- Pesquisa: botão `#survey-btn` → `https://igtcoaching.typeform.com/to/sE0RKEta`.
  Os parâmetros da URL do obrigado são repassados pro link.
- "Salvar no Google Agenda" cria o evento de 08/12, das 19h às 21h (Brasília). A copy não diz a duração:
  ajuste o fim no link se precisar.

---

## ⚠️ Antes de subir: o que falta preencher (LPs de captação)

Nada pendente no código. Link do Grupo VIP: `https://links.geronimo.com.br/black-friday-fim-da-vida-na-media-grupos-wpp-nov26` (o obrigado redireciona sozinho em 5s).

**Webhooks desta ação** (já configurados no `app.js` das 3 LPs): n8n `55ece7e3-601b-4c8d-914f-dff2676eca9d` · Clint `b603d4a3-4572-4930-b3d3-e8199117c80c`.

---

## Fluxo do lead

```
Anúncio / orgânico (com UTMs) → LP
   qualquer CTA (topo, chamada final, CTA fixo do mobile) abre o POPUP
   popup: logo + frase + formulário (nome + e-mail + WhatsApp com DDI)
   ├── POST webhook n8n IGT     (cors, application/json)
   ├── POST webhook CRM Clint   (no-cors, text/plain)
   └── redirect → ../obrigado/?<todos os parâmetros da LP>
                     └── botão "Entrar no Grupo VIP agora" (repassa os parâmetros)
```

- O popup fecha pelo X, por clique no fundo e por `Esc`; o Tab fica preso dentro dele enquanto está aberto.
- Payload do webhook = o padrão da casa (`nome`, `email`, `whatsapp`, `telefone`, `pagina`, `form_name`, `utm_*`, `data`).
- Os parâmetros da URL ficam guardados na sessão (`bf26:params`), então sobrevivem a recarregar a página.

---

## Grafismo

- **Faixas** (`.bf-tape`): o logo em versão de uma linha (`assets/logo-linha.png` branco/amarelo e
  `assets/logo-linha-preto.png` para a faixa amarela), repetido e rolando. Gerado a partir do logo principal.
  Não use `mask-image` aqui: exige CORS e quebra em alguns ambientes — por isso existe a versão preta em PNG.
- **Colunas da média** (seção 3): as 6 áreas são colunas gregas (frontão, capitel jônico em SVG `#bf-capital`, fuste canelado, base) que sobem do chão conforme a rolagem e atravessam a linha tracejada "A média". Abaixo de 900px ficam em 3 fileiras de 2. Fundo com a textura de retícula `assets/textura-pontos.webp` (multiply sobre o amarelo).
- Triângulos e círculos seguem o manual (amarelo / preto / vazados).

---

## Regerar o CSS inline

O `<style>` do `index.html` é o `styles.css` minificado. Depois de editar o `styles.css`, rode dentro da pasta da página:

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

**Editou o `app.js`? Incremente o `?v=` no `index.html`** (`app.js?v=1` → `?v=2`).

---

## Testar localmente

Abrir o `index.html` direto do disco funciona, mas o redirect para `../obrigado/` mostra a listagem
da pasta (no servidor abre o `index.html`). Para testar o fluxo completo, sirva a pasta:
`python -m http.server` dentro de `black-sai-da-media-2026/` e acesse
`http://localhost:8000/oportunidade-org/?utm_source=teste&vk_ad_id=123`.

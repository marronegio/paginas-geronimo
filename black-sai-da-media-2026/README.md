# Black Fora da Média 2026 — LPs de captação + obrigado

Live de Black Friday do Geronimo Theml: **segunda-feira, 16/11/2026, às 20h, no YouTube**.
Páginas de captação gratuita (nome + e-mail + WhatsApp) → página de obrigado → Grupo VIP do WhatsApp.

Segue o padrão de [`../protocolo-6-porcento-out26/README.md`](../protocolo-6-porcento-out26/README.md):
HTML/CSS/JS vanilla, sem build, CSS inline no `<head>`, fontes self-hosted, GTM + pixels VK.
Prefixo de classe: **`bf-`** nas LPs, **`bft-`** no obrigado.

---

## Estrutura

```
black-sai-da-media-2026/
├── oportunidade-org/        # orgânico — copy base (headline "Black Friday: O Fim da Vida na Média… Pra Sempre!")
├── oportunidade-traf-v1/    # tráfego — ALTERNATIVA B ("Não espere janeiro pra mudar…")
├── oportunidade-traf-v2/    # tráfego — ALTERNATIVA C ("No dia 16/11, eu vou te mostrar a condição de BLACK…")
├── oportunidade-ao-vivo-v1/ # DURANTE a live — Opção A, direta ("Eu tô ao vivo agora…") → form → YouTube
├── oportunidade-ao-vivo-v2/ # DURANTE a live — Opção B, na ferida ("O seu 'eu' de 18 anos…") → form → YouTube
└── obrigado/                # página de obrigado ÚNICA, usada pelas 3 LPs de captação
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

## ⚠️ Antes de subir: o que falta preencher

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

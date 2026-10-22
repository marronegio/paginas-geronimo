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
└── obrigado/                # página de obrigado ÚNICA, usada pelas 3 LPs
```

Cada LP é autocontida (`index.html`, `styles.css`, `app.js`, `.htaccess`, `assets/`).
As 3 são idênticas **exceto o topo**:

| | org | traf-v1 (Alt. B) | traf-v2 (Alt. C) |
|---|---|---|---|
| Headline / subheadline | da copy base | Alt. B | Alt. C |
| Botão do formulário | EU VOU ESTAR AO VIVO | QUERO ESTAR AO VIVO NA BLACK | QUERO ESTAR AO VIVO NA BLACK |
| Microcopy | …e os bônus são só pra quem estiver comigo. | Gratuito. As inscrições abrem durante a live. | idem |
| Campo `pagina` no webhook | `black26-org` | `black26-traf-v1` | `black26-traf-v2` |

Seções 2 a 8 são as mesmas nas três. **Editou o corpo numa LP? Replique nas outras duas.**
O `styles.css` também é igual nas três.

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
- Payload do webhook = o padrão da casa (`nome`, `email`, `whatsapp`, `telefone`, `pagina`, `utm_*`, `data`).
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

# COMANDO — Design System

The brand system for **COMANDO**, the flagship leadership & personal-development training by **Geronimo Theml / IGT International Coaching** (igtbox.com.br). Built on the promise *"Assuma o comando da sua vida"* — stop trying, start commanding — using a disciplined, military **"Plano de Batalha"** (battle plan) metaphor.

> **Brand voice in one line:** Bold, direct, high-contrast command. Black and red, white text, decisive verbs.

---

## Sources & provenance

No codebase or Figma was provided. This system was defined from:
- **Brand wordmark** (user-uploaded): `assets/comando-logo.png` — "COMANDO" in heavy condensed italic, red `#F12026` with a black forward-arrow replacing the "D".
- **Public brand context** (Geronimo Theml books, IGT, Comunidade No Comando, Wide Awake immersion): themes of productivity, focus, discipline, the "three groups" framing, and the Battle Plan method.
- **User direction:** black + red palette, mostly white text, bold military/command aesthetic, bold/insignia icons, Portuguese (BR), marketing landing page as the primary surface.

All visual decisions (type scale, spacing, components) are original, grounded in the wordmark and the command metaphor.

---

## Content fundamentals — how COMANDO writes

- **Language:** Portuguese (Brazil). Direct, second-person **"você"**. Speaks *to* the reader, never about itself.
- **Tone:** Imperative and decisive. Commands and short declaratives: *"Pare de tentar. Assuma o comando."*, *"Chegou a sua hora."*, *"Garanta sua vaga."*
- **Verbs of command:** assumir, comandar, decidir, executar, conquistar, vencer. Avoid hedging ("talvez", "quem sabe").
- **Casing:** Display headlines are **UPPERCASE** (matching the wordmark). Body and UI are sentence case. Eyebrows/labels are UPPERCASE with wide tracking.
- **Rhythm:** Two-beat constructions are signature — a problem then a command: *"Pare de tentar / Comece a conseguir."* Short sentences. One idea per line.
- **Numbers as proof:** Big skewed figures (+50 mil alunos, +2,4M seguidores, 20 anos). Always concrete.
- **No emoji.** The brand never uses emoji. Iconography is geometric and tactical (chevrons, arrows, checks), never playful.
- **Metaphor:** military / mission language used tastefully — "missões", "plano de batalha", "operação", "turma" — motivational, not aggressive or violent.

Examples:
- Hero: *"Pare de tentar. Assuma o comando."*
- CTA: *"Quero assumir o comando"*, *"Garantir minha vaga"*
- Eyebrow: *"PLANO DE BATALHA"*, *"A DECISÃO"*
- Reassurance: *"7 dias de garantia incondicional · Acesso imediato"*

---

## Visual foundations

**Palette.** Black-first. `#000000` base, layered near-black inks (`#0A0A0B` → `#262629`) for surfaces and hairlines. **Command red `#F12026`** (sampled from the wordmark) is the single brand accent — reserved for CTAs, the arrow motif, the command edge, and key numbers. **White is the dominant text color.** Gray (`Ink 300/400`) carries secondary hierarchy. Gold and green appear *only* on badges (honor/achievement, success) — never as primary color. Red is never used as a large body-text fill.

**Type.** A condensed superfamily for tactical discipline:
- **Display / headlines:** Saira Condensed **Black (900)**, UPPERCASE, tight leading (~0.9), with a signature **−7° forward skew** that echoes the italic wordmark.
- **Body / UI:** Saira (400–700) — a clean, slightly technical grotesque.
- **Eyebrows / labels / micro-data:** Saira Semi Condensed, UPPERCASE, wide tracking (0.14–0.24em).
> ⚠️ **Font substitution:** the wordmark uses a proprietary heavy condensed italic; no binaries were provided. The Saira family (Google Fonts) is the closest free match and is loaded via CDN in `tokens/fonts.css`. **Please send the real brand font files to replace it.**

**Spacing & shape.** 4px base grid. **Tight, tactical radii** (2–8px on most surfaces; never soft/pill on large blocks). The **3px red "command edge"** (left border) flags priority cards. Border widths: 1px hairline, 2px strong, 3px command.

**Backgrounds.** Predominantly flat black. Accents: a **radial red spotlight glow** behind heroes/offers (subtle, top-center), the **command gradient** (red→deep-red) for solid CTAs and price headers, and **diagonal hazard/chevron stripes** (red/black −45°) as a tactical edge accent. No photographic textures by default (add brand photography when available — warm, high-contrast, confident).

**Elevation.** Shadows deepen to near-black (`0 6px 20px rgba(0,0,0,.55)` etc.). The **red glow** (`--glow-red`) elevates *only* primary CTAs on hover — nothing else glows.

**Motion.** Decisive ease-out (`cubic-bezier(0.22,1,0.36,1)`), 120–360ms. Arrows slide forward on CTA hover (the brand's core gesture). FAQ rows expand; cards lift 2px. No bounces, no infinite loops, no parallax.

**Hover / press states.** Hover: primary darkens to `--red-600` + red glow; secondary border goes white; ghost text goes white. Press: nudges down 1px + scales to 0.99 (decisive "commit" feel). Focus: 3px red focus ring.

**Cards.** Ink-800 surface, 1px hairline border, 8px radius, subtle shadow. The `command` variant adds the 3px red left edge; `solid-red` is a full red-gradient fill with white text. Interactive cards lift on hover.

**Transparency / blur.** Used sparingly: sticky nav goes `rgba(0,0,0,.82)` + blur on scroll; modal scrim is `rgba(0,0,0,.72)` + light blur. Otherwise surfaces are opaque.

---

## Iconography

- **Approach:** bold, geometric, **insignia/tactical** — thick strokes (3px), square caps, no rounded "friendly" line icons. The hero motif is the **forward arrow** (from the wordmark) and the **chevron**.
- **In-system icons** are drawn inline as minimal 3px-stroke SVG (arrow, check) using `currentColor` — see `Button` (arrow) and `Offer`/`CheckoutModal` (check). These match the wordmark's weight.
- **For broader icon needs**, use **Phosphor Icons** at the **Bold** weight (CDN: `https://unpkg.com/@phosphor-icons/web`) — it's the closest match to the brand's thick, square, tactical feel. *Substitution flagged: no brand icon set was provided.* Prefer Phosphor "Bold"; avoid thin/duotone weights.
- **No emoji. No unicode glyph icons.** Never use decorative emoji as iconography.
- When a true rank/insignia or chevron is needed, use the brand chevron/arrow motif rather than a generic icon.

---

## Index / manifest

**Root**
- `styles.css` — global entry point (consumers link this). `@import` lines only.
- `readme.md` — this file.
- `SKILL.md` — portable Agent-Skill manifest.

**`tokens/`** — design tokens (all reachable from `styles.css`)
- `fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `effects.css`

**`assets/`**
- `comando-logo.png` — original (red letters, black arrow; for light backgrounds)
- `comando-logo-onblack.png` — red letters + **white** arrow (primary, for dark UI)
- `comando-logo-white.png` — all-white wordmark (for red / photo backgrounds)

**`guidelines/`** — foundation specimen cards (Design System tab)
- Colors: `colors-red`, `colors-neutral`, `colors-semantic`
- Type: `type-display`, `type-body`, `type-labels`
- Spacing: `spacing-scale`, `spacing-radii`, `effects-elevation`
- Brand: `effects-gradients`, `brand-logo`

**`components/core/`** — reusable React primitives (namespace `window.COMANDODesignSystem_e8c522`)
- `Button` · `Badge` · `Card` · `Eyebrow` · `Stat` · `Input` · `Progress`
- `core.card.html` — component specimen card

**`ui_kits/landing/`** — Course sales page (interactive recreation)
- `index.html` (composes), `Nav` · `Hero` · `Proof` · `Method` · `Testimonials` · `Offer` · `Faq` · `Footer` · `CheckoutModal` · `App`

---

## Using the components

In a card or kit HTML, after linking `styles.css` and loading `_ds_bundle.js`:

```js
const { Button, Badge, Card, Eyebrow, Stat, Input, Progress } = window.COMANDODesignSystem_e8c522;
```

See each component's `.prompt.md` for usage and variants.

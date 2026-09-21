/* @ds-bundle: {"format":3,"namespace":"COMANDODesignSystem_e8c522","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Progress","sourcePath":"components/core/Progress.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"8e22aa9bdb65","components/core/Button.jsx":"52a6222b3c81","components/core/Card.jsx":"5e27dad8f264","components/core/Eyebrow.jsx":"c13ffca7b429","components/core/Input.jsx":"7b1ae2d3296d","components/core/Progress.jsx":"cc94ece57f07","components/core/Stat.jsx":"a6bd09ef977b","ui_kits/landing/App.jsx":"814ac130049b","ui_kits/landing/CheckoutModal.jsx":"7acaf41fab61","ui_kits/landing/Faq.jsx":"db4e3f18428f","ui_kits/landing/Footer.jsx":"8c722d83f58a","ui_kits/landing/Hero.jsx":"383c46afe1dc","ui_kits/landing/Method.jsx":"cb6475722c92","ui_kits/landing/Nav.jsx":"6b4d13b41576","ui_kits/landing/Offer.jsx":"36b8a810ab4e","ui_kits/landing/Proof.jsx":"441057129b1e","ui_kits/landing/Testimonials.jsx":"c604d4b8b7f5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.COMANDODesignSystem_e8c522 = window.COMANDODesignSystem_e8c522 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * COMANDO Badge — compact status / category marker.
 * tones: command (red), neutral, honor (gold), success (green), outline.
 */
function Badge({
  children,
  tone = 'command',
  solid = true,
  style,
  ...rest
}) {
  const tones = {
    command: {
      bg: 'var(--red-500)',
      fg: '#fff',
      bd: 'var(--red-500)'
    },
    neutral: {
      bg: 'var(--ink-700)',
      fg: 'var(--white)',
      bd: 'var(--ink-600)'
    },
    honor: {
      bg: 'var(--gold-500)',
      fg: '#1A1A1D',
      bd: 'var(--gold-500)'
    },
    success: {
      bg: 'var(--green-500)',
      fg: '#0A2912',
      bd: 'var(--green-500)'
    }
  };
  const t = tones[tone] || tones.command;
  const s = solid ? {
    background: t.bg,
    color: t.fg,
    border: '1px solid ' + t.bd
  } : {
    background: 'transparent',
    color: t.bg === 'var(--ink-700)' ? 'var(--ink-300)' : t.bg,
    border: '1px solid ' + t.bd
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 9px',
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      fontSize: '11px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      lineHeight: 1,
      borderRadius: 'var(--radius-xs)',
      whiteSpace: 'nowrap',
      ...s,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * COMANDO Button — decisive, tactical call-to-action.
 * Variants: primary (red command), secondary (outlined), ghost (text), danger.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  arrow = false,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: '12px'
    },
    md: {
      padding: '13px 24px',
      fontSize: '14px'
    },
    lg: {
      padding: '17px 34px',
      fontSize: '16px'
    }
  };
  const base = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: 'var(--font-label)',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    lineHeight: 1,
    border: '2px solid transparent',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'var(--transition-base)',
    whiteSpace: 'nowrap',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--red-500)',
      color: 'var(--white)',
      boxShadow: 'var(--shadow-sm)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--white)',
      borderColor: 'var(--ink-600)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink-300)'
    },
    danger: {
      background: 'transparent',
      color: 'var(--red-500)',
      borderColor: 'var(--red-500)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverStyle = !disabled && hover ? {
    primary: {
      background: 'var(--red-600)',
      boxShadow: 'var(--glow-red)'
    },
    secondary: {
      borderColor: 'var(--white)',
      background: 'rgba(255,255,255,0.04)'
    },
    ghost: {
      color: 'var(--white)'
    },
    danger: {
      background: 'var(--red-500)',
      color: 'var(--white)'
    }
  }[variant] : {};
  const pressStyle = press && !disabled ? {
    transform: 'translateY(1px) scale(0.99)'
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle,
      ...pressStyle,
      ...style
    }
  }, rest), children, arrow && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      transform: 'translateX(0)',
      transition: 'transform var(--dur-base) var(--ease-command)',
      ...(hover && !disabled ? {
        transform: 'translateX(4px)'
      } : {})
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "square",
    strokeLinejoin: "miter"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12h14M13 6l6 6-6 6"
  }))));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * COMANDO Card — surface container.
 * variant: default (ink surface), command (red left edge), outline, solid-red.
 */
function Card({
  children,
  variant = 'default',
  interactive = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    default: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)'
    },
    command: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderLeft: '3px solid var(--red-500)'
    },
    outline: {
      background: 'transparent',
      border: '1px solid var(--border-strong)'
    },
    'solid-red': {
      background: 'var(--grad-command)',
      border: 'none'
    }
  };
  const hoverStyle = interactive && hover ? {
    background: 'var(--surface-card-hover)',
    borderColor: 'var(--border-strong)',
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-md)'
  } : {};
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: 'var(--radius-card)',
      padding: 'var(--space-5)',
      color: variant === 'solid-red' ? 'var(--white)' : 'var(--text-primary)',
      transition: 'var(--transition-base)',
      cursor: interactive ? 'pointer' : 'default',
      ...variants[variant],
      ...hoverStyle,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * COMANDO Eyebrow — tactical kicker above headings.
 * A red tick + wide-tracked uppercase label. The signature section opener.
 */
function Eyebrow({
  children,
  color = 'var(--red-500)',
  tick = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      fontSize: '13px',
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color,
      ...style
    }
  }, rest), tick && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: '24px',
      height: '2px',
      background: color,
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * COMANDO Input — dark tactical text field with red focus edge.
 */
function Input({
  label,
  hint,
  error,
  type = 'text',
  style,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? 'in-' + String(label).replace(/\s+/g, '-').toLowerCase() : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '7px',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-label)',
      fontWeight: 600,
      fontSize: '12px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '13px 15px',
      fontFamily: 'var(--font-body)',
      fontSize: '15px',
      color: 'var(--white)',
      background: 'var(--ink-850)',
      border: '1px solid ' + (error ? 'var(--red-500)' : focus ? 'var(--red-500)' : 'var(--ink-700)'),
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      boxShadow: focus ? 'var(--ring)' : 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: error ? 'var(--red-400)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Progress.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * COMANDO Progress — mission/module completion bar.
 */
function Progress({
  value = 0,
  max = 100,
  label,
  showValue = true,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...style
    }
  }, rest), (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: '8px'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontWeight: 600,
      fontSize: '12px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      fontSize: '12px',
      letterSpacing: '0.06em',
      color: 'var(--white)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value, "/", max)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px',
      background: 'var(--ink-700)',
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: 'var(--grad-command)',
      borderRadius: 'var(--radius-pill)',
      transition: 'width var(--dur-slow) var(--ease-command)'
    }
  })));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Progress.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * COMANDO Stat — big tactical number for proof points (alunos, anos, etc).
 */
function Stat({
  value,
  label,
  accent = true,
  align = 'left',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      lineHeight: 0.9,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
      transform: 'skewX(-7deg)',
      transformOrigin: align === 'center' ? 'center' : 'left',
      color: accent ? 'var(--red-500)' : 'var(--white)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)',
      fontFamily: 'var(--font-label)',
      fontWeight: 600,
      fontSize: '12px',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/App.jsx
try { (() => {
// COMANDO landing — app shell composing all sections
function LandingApp() {
  const [checkout, setCheckout] = React.useState(false);
  const openCheckout = () => setCheckout(true);
  return /*#__PURE__*/React.createElement("div", {
    id: "kit-scroll",
    style: {
      height: '100%',
      overflowY: 'auto',
      background: 'var(--black)',
      color: 'var(--white)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(LandingNav, {
    onCTA: openCheckout
  }), /*#__PURE__*/React.createElement(LandingHero, {
    onCTA: openCheckout
  }), /*#__PURE__*/React.createElement(LandingProof, null), /*#__PURE__*/React.createElement(LandingMethod, null), /*#__PURE__*/React.createElement(LandingTestimonials, null), /*#__PURE__*/React.createElement(LandingOffer, {
    onCTA: openCheckout
  }), /*#__PURE__*/React.createElement(LandingFaq, null), /*#__PURE__*/React.createElement(LandingFooter, null), /*#__PURE__*/React.createElement(CheckoutModal, {
    open: checkout,
    onClose: () => setCheckout(false)
  }));
}
window.LandingApp = LandingApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/CheckoutModal.jsx
try { (() => {
// COMANDO landing — checkout / lead-capture modal (interactive)
function CheckoutModal({
  open,
  onClose
}) {
  const [step, setStep] = React.useState(0); // 0 form, 1 success
  React.useEffect(() => {
    if (open) setStep(0);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'var(--overlay-scrim)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(440px, 100%)',
      background: 'var(--ink-850)',
      border: '1px solid var(--ink-600)',
      borderTop: '3px solid var(--red-500)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden'
    }
  }, step === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Turma 12"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '12px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 30,
      textTransform: 'uppercase',
      transform: 'skewX(-7deg)'
    }
  }, "Garanta sua vaga")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fechar",
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--ink-400)',
      fontSize: 26,
      lineHeight: 1,
      cursor: 'pointer'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '10px 0 22px',
      color: 'var(--ink-400)',
      fontSize: 14
    }
  }, "Comece agora. Acesso imediato e 7 dias de garantia."), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setStep(1);
    },
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nome completo",
    placeholder: "Seu nome",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Seu melhor e-mail",
    type: "email",
    placeholder: "voce@email.com",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "WhatsApp",
    placeholder: "(00) 00000-0000"
  }), /*#__PURE__*/React.createElement(Button, {
    block: true,
    size: "lg",
    variant: "primary",
    arrow: true,
    type: "submit"
  }, "Quero assumir o comando"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '44px 30px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      margin: '0 auto 20px',
      borderRadius: '50%',
      background: 'var(--red-tint-20)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "30",
    height: "30",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--red-500)",
    strokeWidth: "3",
    strokeLinecap: "square"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 28,
      textTransform: 'uppercase',
      transform: 'skewX(-7deg)'
    }
  }, "Vaga reservada!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px auto 24px',
      maxWidth: 300,
      color: 'var(--ink-300)',
      fontSize: 15,
      lineHeight: 1.6
    }
  }, "Enviamos os pr\xF3ximos passos para o seu e-mail. Bem-vindo ao comando."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onClose
  }, "Fechar"))));
}
window.CheckoutModal = CheckoutModal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/CheckoutModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Faq.jsx
try { (() => {
// COMANDO landing — FAQ
function LandingFaq() {
  const faqs = [{
    q: 'Para quem é o Comando?',
    a: 'Para quem sabe que quer mais da vida mas trava na execução. Funciona tanto para a vida pessoal quanto para liderança e trabalho.'
  }, {
    q: 'Quanto tempo preciso por semana?',
    a: 'O método foi desenhado para rotinas cheias: cerca de 2 a 3 horas por semana, incluindo o encontro ao vivo.'
  }, {
    q: 'E se eu não gostar?',
    a: 'Você tem 7 dias de garantia incondicional. Se não for para você, devolvemos 100% do valor.'
  }, {
    q: 'O acesso é por quanto tempo?',
    a: 'Acesso de 12 meses a todo o conteúdo, incluindo as atualizações da turma.'
  }];
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'clamp(56px, 9vw, 110px) clamp(20px, 5vw, 56px)',
      background: 'var(--ink-850)',
      borderTop: '1px solid var(--ink-700)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Perguntas")), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(1.8rem, 4vw, 3rem)',
      lineHeight: .95,
      textTransform: 'uppercase',
      transform: 'skewX(-7deg)'
    }
  }, "Antes de assumir")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, faqs.map((f, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: 'var(--ink-800)',
        border: '1px solid var(--ink-700)',
        borderLeft: isOpen ? '3px solid var(--red-500)' : '1px solid var(--ink-700)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      style: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        padding: '18px 20px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 16,
        color: 'var(--white)'
      }
    }, f.q, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--red-500)',
        fontSize: 22,
        lineHeight: 1,
        transform: isOpen ? 'rotate(45deg)' : 'none',
        transition: 'transform .2s var(--ease-command)',
        flex: 'none'
      }
    }, "+")), /*#__PURE__*/React.createElement("div", {
      style: {
        maxHeight: isOpen ? 200 : 0,
        transition: 'max-height .3s var(--ease-command)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        padding: '0 20px 20px',
        color: 'var(--ink-300)',
        fontSize: 15,
        lineHeight: 1.6
      }
    }, f.a)));
  }))));
}
window.LandingFaq = LandingFaq;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Faq.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Footer.jsx
try { (() => {
// COMANDO landing — footer
function LandingFooter() {
  const col = (title, items) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--ink-500)',
      marginBottom: 14
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 9
    }
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it,
    style: {
      color: 'var(--ink-300)',
      fontSize: 14,
      textDecoration: 'none',
      cursor: 'pointer'
    }
  }, it))));
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--black)',
      borderTop: '1px solid var(--ink-700)',
      padding: 'clamp(48px, 7vw, 80px) clamp(20px, 5vw, 56px) 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
      gap: 40
    },
    className: "kit-footgrid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/comando-logo-onblack.png",
    alt: "COMANDO",
    style: {
      height: 28
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      maxWidth: 260,
      color: 'var(--ink-400)',
      fontSize: 14,
      lineHeight: 1.6
    }
  }, "Pare de tentar. Comece a conseguir. O treinamento para voc\xEA assumir o comando da sua vida.")), col('Programa', ['O método', 'A imersão', 'Resultados', 'Comunidade']), col('Conteúdo', ['Livros', 'Podcast', 'YouTube', 'Blog']), col('Suporte', ['Central de ajuda', 'Contato', 'Termos', 'Privacidade'])), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '40px auto 0',
      paddingTop: 24,
      borderTop: '1px solid var(--ink-800)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      color: 'var(--ink-500)',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 COMANDO \xB7 IGT International Coaching"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      letterSpacing: '.1em',
      textTransform: 'uppercase'
    }
  }, "Assuma o comando \u2192")));
}
window.LandingFooter = LandingFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Hero.jsx
try { (() => {
// COMANDO landing — hero
function LandingHero({
  onCTA
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(48px, 9vw, 120px) clamp(20px, 5vw, 56px) clamp(40px, 6vw, 80px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--grad-spotlight)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: 'var(--stripes-red)',
      opacity: .9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 980,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "command"
  }, "Turma 12 \xB7 Inscri\xE7\xF5es abertas")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
      lineHeight: .9,
      textTransform: 'uppercase',
      letterSpacing: '-.01em',
      transform: 'skewX(-7deg)'
    }
  }, "Pare de tentar.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--red-500)'
    }
  }, "Assuma o comando.")), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 600,
      margin: '28px auto 0',
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      lineHeight: 1.6,
      color: 'var(--ink-300)'
    }
  }, "O treinamento que transforma inten\xE7\xE3o em execu\xE7\xE3o di\xE1ria. Um plano de batalha claro para voc\xEA conquistar o que sempre quis \u2014 com disciplina, foco e const\xE2ncia."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "primary",
    arrow: true,
    onClick: onCTA
  }, "Quero assumir o comando"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary"
  }, "Ver o m\xE9todo")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--ink-500)'
    }
  }, "7 dias de garantia \xB7 Acesso imediato")));
}
window.LandingHero = LandingHero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Method.jsx
try { (() => {
// COMANDO landing — the method (3 fronts)
function LandingMethod() {
  const modules = [{
    n: '01',
    t: 'Clareza',
    d: 'Defina com precisão o que você quer — e por quê. Sem clareza, não há comando.'
  }, {
    n: '02',
    t: 'Compromisso',
    d: 'Transforme desejo em decisão. Um plano de batalha que você assume publicamente.'
  }, {
    n: '03',
    t: 'Constância',
    d: 'Sistemas que vencem a motivação. Revisões semanais para nunca parar no meio.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'clamp(56px, 9vw, 110px) clamp(20px, 5vw, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Plano de batalha")), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      lineHeight: .95,
      textTransform: 'uppercase',
      transform: 'skewX(-7deg)'
    }
  }, "O m\xE9todo em tr\xEAs frentes"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 520,
      margin: '20px auto 0',
      color: 'var(--ink-400)',
      fontSize: 16,
      lineHeight: 1.6
    }
  }, "A maioria n\xE3o falha por falta de vontade \u2014 falha por falta de sistema.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    },
    className: "kit-methodgrid"
  }, modules.map(m => /*#__PURE__*/React.createElement(Card, {
    key: m.n,
    variant: "command",
    interactive: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 52,
      lineHeight: 1,
      color: 'var(--ink-700)',
      transform: 'skewX(-7deg)'
    }
  }, m.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '14px 0 10px',
      fontSize: 22,
      fontWeight: 700
    }
  }, m.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--ink-300)',
      fontSize: 15,
      lineHeight: 1.6
    }
  }, m.d))))));
}
window.LandingMethod = LandingMethod;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Method.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Nav.jsx
try { (() => {
// COMANDO landing — top navigation
function LandingNav({
  onCTA
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const root = document.getElementById('kit-scroll');
    const onScroll = () => setScrolled((root ? root.scrollTop : window.scrollY) > 20);
    const target = root || window;
    target.addEventListener('scroll', onScroll);
    return () => target.removeEventListener('scroll', onScroll);
  }, []);
  const link = {
    fontFamily: 'var(--font-label)',
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'var(--ink-300)',
    textDecoration: 'none',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px clamp(20px, 5vw, 56px)',
      background: scrolled ? 'rgba(0,0,0,0.82)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: '1px solid ' + (scrolled ? 'var(--ink-700)' : 'transparent'),
      transition: 'all .25s var(--ease-command)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/comando-logo-onblack.png",
    alt: "COMANDO",
    style: {
      height: 26
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 28,
      alignItems: 'center'
    },
    className: "kit-navlinks"
  }, /*#__PURE__*/React.createElement("a", {
    style: link
  }, "O m\xE9todo"), /*#__PURE__*/React.createElement("a", {
    style: link
  }, "Resultados"), /*#__PURE__*/React.createElement("a", {
    style: link
  }, "A imers\xE3o"), /*#__PURE__*/React.createElement("a", {
    style: link
  }, "Perguntas")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary",
    onClick: onCTA
  }, "Quero entrar"));
}
window.LandingNav = LandingNav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Offer.jsx
try { (() => {
// COMANDO landing — offer / pricing
function LandingOffer({
  onCTA
}) {
  const includes = ['Acesso completo aos 3 módulos do método', 'Plano de Batalha aplicável já na primeira semana', 'Encontros semanais ao vivo de revisão', 'Comunidade No Comando — suporte entre pares', 'Certificado de conclusão'];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(56px, 9vw, 110px) clamp(20px, 5vw, 56px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--grad-spotlight)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 720,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "A decis\xE3o")), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      lineHeight: .95,
      textTransform: 'uppercase',
      transform: 'skewX(-7deg)'
    }
  }, "Chegou a sua hora")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 460,
      margin: '40px auto 0'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "default",
    style: {
      padding: 0,
      overflow: 'hidden',
      border: '1px solid var(--ink-600)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--grad-command)',
      padding: '22px 28px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.85)'
    }
  }, "Programa Comando \xB7 Turma 12")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-400)',
      fontSize: 15
    }
  }, "12x de"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 64,
      lineHeight: .9,
      color: 'var(--white)',
      transform: 'skewX(-7deg)'
    }
  }, "R$197")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: 'var(--ink-400)',
      fontSize: 13,
      marginTop: 4
    }
  }, "ou R$1.970 \xE0 vista"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--ink-700)',
      margin: '24px 0'
    }
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 12
    }
  }, includes.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      fontSize: 14,
      color: 'var(--ink-200, var(--ink-300))',
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--red-500)",
    strokeWidth: "3",
    strokeLinecap: "square",
    style: {
      flex: 'none',
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  })), /*#__PURE__*/React.createElement("span", null, it)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(Button, {
    block: true,
    size: "lg",
    variant: "primary",
    arrow: true,
    onClick: onCTA
  }, "Garantir minha vaga")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 14,
      fontSize: 12,
      color: 'var(--ink-500)',
      fontFamily: 'var(--font-label)',
      letterSpacing: '.08em',
      textTransform: 'uppercase'
    }
  }, "7 dias de garantia incondicional")))));
}
window.LandingOffer = LandingOffer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Offer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Proof.jsx
try { (() => {
// COMANDO landing — proof bar (stats strip)
function LandingProof() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderTop: '1px solid var(--ink-700)',
      borderBottom: '1px solid var(--ink-700)',
      background: 'var(--ink-850)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '40px clamp(20px, 5vw, 56px)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24
    },
    className: "kit-proofgrid"
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "+50 mil",
    label: "Alunos treinados"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "+2,4M",
    label: "Seguidores",
    accent: false
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "20",
    label: "Anos de palco",
    accent: false
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "4,9",
    label: "Nota m\xE9dia"
  })));
}
window.LandingProof = LandingProof;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Proof.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Testimonials.jsx
try { (() => {
// COMANDO landing — testimonial / authority block
function LandingTestimonials() {
  const quotes = [{
    q: 'Em 90 dias eu saí da estagnação e finalmente comecei a executar. O plano de batalha mudou minha rotina por completo.',
    a: 'Marina R.',
    r: 'Empreendedora'
  }, {
    q: 'Disciplina deixou de ser sofrimento e virou sistema. Hoje entrego mais trabalhando menos horas.',
    a: 'Diego F.',
    r: 'Gestor de equipe'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'clamp(56px, 9vw, 110px) clamp(20px, 5vw, 56px)',
      background: 'var(--ink-850)',
      borderTop: '1px solid var(--ink-700)',
      borderBottom: '1px solid var(--ink-700)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 56,
      alignItems: 'center'
    },
    className: "kit-testgrid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Quem comanda"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '18px 0 0',
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 'clamp(1.8rem, 4vw, 3rem)',
      lineHeight: .95,
      textTransform: 'uppercase',
      transform: 'skewX(-7deg)'
    }
  }, "Resultados que falam mais alto"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      color: 'var(--ink-300)',
      fontSize: 16,
      lineHeight: 1.65
    }
  }, "Mais de 50 mil pessoas j\xE1 passaram pelos treinamentos. A const\xE2ncia de quem assumiu o comando vira prova."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "honor"
  }, "Best-seller"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    solid: false
  }, "Forbes"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    solid: false
  }, "Exame"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 18
    }
  }, quotes.map((t, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    variant: "default"
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 40,
      color: 'var(--red-500)',
      lineHeight: .6,
      height: 22
    }
  }, "\""), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 17,
      lineHeight: 1.55,
      color: 'var(--white)'
    }
  }, t.q), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'var(--ink-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      color: 'var(--white)',
      fontSize: 14
    }
  }, t.a[0]), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14
    }
  }, t.a), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-400)'
    }
  }, t.r))))))));
}
window.LandingTestimonials = LandingTestimonials;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Testimonials.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.Stat = __ds_scope.Stat;

})();

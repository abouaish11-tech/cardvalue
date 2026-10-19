// Card faces for all 52 cards, plus the locked (embossed) card.
// Each face is drawn in HTML/CSS/SVG from the issuer's own card art (colour, material, layout,
// wordmark, network); no issuer images are used. Positions are % of the card, sizes are cqw,
// so one face renders from a 48px table thumbnail up to the 300px detail card.
(function () {
const S = (vb, body, extra = '') => `<svg viewBox="${vb}" preserveAspectRatio="${extra || 'xMidYMid meet'}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const at = (style, inner = '', cls = '') => `<span class="${cls}" style="${style}">${inner}</span>`;

/* ---------- shared marks ---------- */
const CHASE = (c = '#fff') => S('0 0 100 100', `<g fill="${c}"><polygon points="31,0 70,0 98,28 31,28"/><polygon points="100,31 100,70 72,98 72,31"/><polygon points="69,100 30,100 2,72 69,72"/><polygon points="0,69 0,30 28,2 28,69"/></g>`);
const NFC = (c = '#fff', o = .9) => S('0 0 24 30', `<g fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="2.4" stroke-linecap="round"><path d="M3 11c2 2.5 2 5.5 0 8"/><path d="M8.5 7.5c3.6 4.6 3.6 10.4 0 15"/><path d="M14 4c5.3 6.7 5.3 15.3 0 22"/><path d="M19.5 1c6.8 8.7 6.8 19.3 0 28"/></g>`);
const chip = (l, t, kind = '') => at(`left:${l}%;top:${t}%`, '', `emv ${kind}`);
const nfc = (l, t, c, o) => at(`left:${l}%;top:${t}%`, NFC(c, o), 'nfc');
const visa = (sub = '', c = '#fff', pos = '') => at(`color:${c};${pos}`, `VISA${sub ? `<small>${sub}</small>` : ''}`, 'visa');
const mc = (mono, tier = '', pos = '', label = true) => at(pos, `${tier ? `<span class="tier">${tier}</span>` : ''}${S('0 0 60 38', mono
  ? `<circle cx="19" cy="19" r="18" fill="${mono}" fill-opacity=".75"/><circle cx="41" cy="19" r="18" fill="${mono}" fill-opacity=".5"/>`
  : `<circle cx="19" cy="19" r="18" fill="#eb001b"/><circle cx="41" cy="19" r="18" fill="#f79e1b"/><path d="M30 4.75A18 18 0 0 1 30 33.25A18 18 0 0 1 30 4.75Z" fill="#ff5f00"/>`)}${label ? '<small>mastercard</small>' : ''}`, 'mc');

// Amex centurion: helmeted profile, engraved with fine lines, in an oval or round medallion
let centN = 0;
const CENT = (fill, bg, frame = 'oval') => { const id = 'en' + (centN++);
  const ring = frame === 'oval' ? `<ellipse cx="50" cy="50" rx="39" ry="48.5" fill="none" stroke="${fill}" stroke-width="1"/><ellipse cx="50" cy="50" rx="36.5" ry="46" fill="none" stroke="${fill}" stroke-width=".45"/>`
    : frame === 'round' ? `<circle cx="50" cy="50" r="48.5" fill="none" stroke="${fill}" stroke-width="1"/><circle cx="50" cy="50" r="46" fill="none" stroke="${fill}" stroke-width=".45"/>` : '';
  const head = frame === 'oval' ? 'transform="translate(10 7) scale(.86)"' : '';
  return S('0 0 100 100', `<defs><pattern id="${id}" width="1.3" height="1.3" patternUnits="userSpaceOnUse"><rect width="1.3" height=".85" fill="${fill}"/></pattern></defs>${ring}
  <g ${head}><g stroke="${fill}" stroke-width=".9" stroke-linejoin="round" fill="url(#${id})">
    <path d="M29 56C21 38 30 15 53 11C66 9 76 14 80 22C71 18.5 59 19 50 24.5C40.5 30.5 34.5 41 35 54Z"/>
    <path d="M40 94L42.5 79C36 75 32.5 67 32.5 57C32.5 41 44.5 28.5 59 28.5C67.5 28.5 71.5 34.5 69.5 40.5L70.8 46.5C73.8 50 76.6 53 77.6 56.6L72.6 58.6C73.6 60.6 73.6 62.6 71.6 64C72.6 67 71.6 70 68.6 71C64.6 72 61 72.6 59 74.6L61.2 83.5L63.5 94Z"/></g>
    <path fill="${fill}" d="M62 41.5C66 41 69 41 69.5 40.5L70.8 46.5C73.8 50 76.6 53 77.6 56.6L72.6 58.6C73.6 60.6 73.6 62.6 71.6 64C72.6 67 71.6 70 68.6 71C64.6 72 61 72.6 59 74.6L57 66C59 60 60 50 62 41.5Z"/>
    <g fill="none" stroke="${bg}" stroke-linecap="round"><path stroke-width="1.6" d="M69.6 40.6C62 40.2 55.5 43.5 52.5 50.5L53 67.5C55 71 57 73 59 74.6"/><path stroke-width="1.1" d="M52.5 50.5C48.5 49 44.5 51 42.5 55"/><path stroke-width="1" d="M64.5 48.6L68.3 48.2"/><path stroke-width=".9" d="M34 47C40 40 47 34 56 31"/><path stroke-width=".8" d="M38 22C44 17 52 15 60 15.5M33 33C38 26 46 21 55 19.5"/></g></g>`); };
const AMEX_LINE = (c, size = 5.2, pos = 'left:50%;top:11%;transform:translateX(-50%)') =>
  at(`${pos};color:${c};font:800 ${size}cqw 'Archivo',sans-serif;font-stretch:108%;letter-spacing:.03em`, 'AMERICAN EXPRESS', 't');
const AMEX_STACK = (c, sub = '', pos = 'right:6%;top:8%') =>
  at(`${pos};color:${c};text-align:right;font:800 6.4cqw/.92 'Archivo',sans-serif;font-stretch:104%;letter-spacing:.01em`,
     `AMERICAN<br>EXPRESS${sub ? `<span style="display:block;font:500 2.2cqw 'Geist';letter-spacing:.24em;margin-top:1.2cqw">${sub}</span>` : ''}`, 't');

const CITI = (c = '#fff', size = 9, pos = 'left:7%;top:7%') => at(`${pos};color:${c};font:600 ${size}cqw/1 'Geist',sans-serif;letter-spacing:-.03em;width:${size * 1.7}cqw;height:${size * 1.1}cqw`,
  `<span style="position:absolute;left:0;bottom:0">citi</span><span style="position:absolute;left:${size * .42}cqw;top:-${size * .02}cqw;width:${size * 1.28}cqw;height:${size * .5}cqw">${S('0 0 40 14', `<path d="M2 13C10 2 30 2 38 13" fill="none" stroke="${c === '#fff' ? '#fff' : '#e31c23'}" stroke-width="2.6"/>`)}</span>`);
const C1 = (c = '#fff', size = 5.2, pos = 'right:6%;top:8%') => at(`${pos};color:${c};font:italic 700 ${size}cqw 'Archivo',sans-serif;letter-spacing:-.03em`,
  `Capital<span style="font-weight:600">One</span><span style="position:absolute;left:28%;top:-55%;width:80%;height:80%">${S('0 0 60 14', `<path d="M2 13C18 -1 44 -2 58 9" fill="none" stroke="#d22e1e" stroke-width="2.4" stroke-linecap="round"/>`)}</span>`, 't');
const BOFA_FLAG = (c = '#fff') => S('0 0 100 50', `<g fill="${c}"><path d="M4 30L30 6H44L18 30Z"/><path d="M22 40C34 28 46 18 62 10H76C60 18 48 28 36 40Z"/><path d="M42 48C56 36 70 28 86 22H98C82 28 68 36 56 48Z"/><path d="M8 44L18 34H30L20 44Z" opacity=".9"/></g>`);
const USB = (c = '#fff', size = 6, pos = '') => at(`${pos};color:${c};font:700 ${size}cqw 'Geist',sans-serif;letter-spacing:-.03em;display:flex;align-items:center;gap:.6cqw`,
  `<span style="border:${size * .09}cqw solid ${c};border-radius:${size * .12}cqw;padding:0 ${size * .12}cqw;line-height:1.05">us</span>bank`, 't');
const WF = (c = '#fff', size = 5.4, pos = 'left:7%;top:8%') => at(`${pos};color:${c};font:700 ${size}cqw 'Libre Caslon Text',serif;letter-spacing:.02em`, 'WELLS FARGO', 't');
const GOLD_STREAK = (top) => at(`left:28%;right:0;top:${top}%;height:1.1%;background:linear-gradient(90deg,rgba(230,194,122,0),#e6c27a 35%,#fbe7b5 65%,rgba(230,194,122,.2))`);
const freedomMark = (sub) => at('left:6.5%;top:7%;display:flex;align-items:center;gap:1.6cqw',
  `<span style="width:7.4cqw;height:7.4cqw">${CHASE()}</span><span style="font:italic 700 8.4cqw/1 'Montserrat',sans-serif;letter-spacing:-.03em">freedom<span style="display:block;font:600 2.4cqw 'Geist';font-style:normal;letter-spacing:.32em;margin:.6cqw 0 0 1.4cqw">${sub}</span></span>`);
const chaseMark = (l1, l2) => at('left:6.5%;top:7.5%;display:flex;align-items:flex-start;gap:2cqw',
  `<span style="width:7cqw;height:7cqw">${CHASE()}</span><span style="font:300 5cqw/1 'Geist';letter-spacing:.14em;margin-top:.3cqw">${l1}<span style="display:block;font-size:3cqw;letter-spacing:.24em;margin-top:.8cqw;opacity:.85">${l2}</span></span>`);
const inkMark = (label) => at('inset:0', `
  <span style="position:absolute;left:6.5%;top:8%;width:7cqw;height:7cqw">${CHASE()}</span>
  <span style="position:absolute;right:6%;top:9%;font:400 3.8cqw 'Geist';letter-spacing:.04em">${label}</span>
  <span style="position:absolute;right:9%;top:24%;font:400 19cqw/1 'Yellowtail',cursive">ink.</span>
  <span style="position:absolute;left:24%;right:31%;top:47%;height:7%">${S('0 0 100 10', `<path d="M0 9C30 9.5 70 7 100 1" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`, 'none')}</span>`);
const deltaWidget = (a, b) => S('0 0 100 70', `<polygon points="14,14 90,8 52,40" fill="${a}"/><polygon points="52,40 90,8 60,68" fill="${b}"/><polygon points="14,14 52,40 40,44" fill="${b}" opacity=".55"/>`);
const amexFrame = (c, h = 'rgba(0,0,0,.14)') => at(`left:2.4%;right:2.4%;top:3.8%;bottom:3.8%;border:.3cqw solid ${c};border-radius:2.4cqw;background:repeating-linear-gradient(45deg,${h} 0 .14cqw,transparent .14cqw .6cqw),repeating-linear-gradient(-45deg,${h} 0 .14cqw,transparent .14cqw .6cqw)`)
  + at(`left:4.4%;right:4.4%;top:7%;bottom:7%;border:.3cqw solid ${c};border-radius:1.6cqw;background:inherit`, '', 'amexin');

/* ---------- motifs ---------- */
const lines = (d, c, w = .5, o = 1, ar = 'none') => at('inset:0', S('0 0 160 101', `<g fill="none" stroke="${c}" stroke-width="${w}" stroke-opacity="${o}">${d}</g>`, ar));
const waves = (n, c, o, y0, amp, x0 = 40) => { let p = ''; for (let i = 0; i < n; i++) { const y = y0 + i * 3.1; p += `<path d="M${x0} ${y}C${x0 + 30} ${y - amp} ${x0 + 55} ${y + amp} ${x0 + 80} ${y - amp * .4}S${x0 + 110} ${y + amp * .6} 170 ${y - amp}"/>`; } return lines(p, c, .45, o); };
const grid = (c, o, rot, step = 9) => { let p = ''; for (let i = -200; i < 360; i += step) p += `<path d="M${i} -80V200"/>`; for (let j = -80; j < 200; j += step * 1.4) p += `<path d="M-200 ${j}H360"/>`; return at('inset:0', S('0 0 160 101', `<g transform="rotate(${rot} 80 50)" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width=".55">${p}</g>`, 'none')); };
const hexes = (cols) => { let p = ''; const r = 6.2, h = r * Math.sqrt(3); let k = 0;
  for (let row = 0; row < 7; row++) for (let col = 0; col < 6; col++) { const x = col * h + (row % 2) * h / 2, y = 55 + row * r * 1.5; const pts = [0, 1, 2, 3, 4, 5].map(i => { const a = Math.PI / 180 * (60 * i - 30); return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
    p += `<polygon points="${pts}" fill="none" stroke="${cols[(k++ * 7) % cols.length]}" stroke-width="1"/>`; }
  return at('inset:0', S('0 0 63 100', p, 'none')); };
const dots = () => { let p = ''; for (let c = 0; c < 6; c++) for (let r = 0; r < 9; r++) { const s = .5 + 1.6 * Math.abs(Math.sin((c + 1) * (r + 2) * .7)); p += `<circle cx="${112 + c * 7.2}" cy="${12 + r * 9 + (c % 2) * 3}" r="${s.toFixed(2)}"/>`; } return at('inset:0', S('0 0 160 101', `<g fill="#c3c7cd">${p}</g>`, 'none')); };
const rnd = (a, b) => { const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return x - Math.floor(x); };
const mosaic = () => { const C = ['#d71e28', '#0c2074', '#5a8ed6', '#c9ced6', '#d71e28', '#0c2074', '#e8eaee']; let p = '';
  for (let r = 0; r < 16; r++) for (let c = 0; c < 10; c++) { const k = rnd(r, c); const zone = (r < 6 && c < 7 - r * .6) || (r > 9 && c > 12 - r * .55); if (zone && k > .5) p += `<rect x="${c * 6.3}" y="${r * 6.3}" width="6.3" height="6.3" fill="${C[Math.floor(k * 97) % C.length]}" opacity="${k > .85 ? .4 : 1}"/>`; }
  return at('inset:0', S('0 0 63 100', p, 'none')); };

/* ---------- the 52 faces ---------- */
const ART = {
  // Colours below were sampled from Chase's own 2026 card art (6x4 average grid per card).
  chase_sapphire_preferred: { bg: 'radial-gradient(70% 95% at 62% 55%,#1a7aab 0%,#0b5a8f 26%,#063a69 52%,rgba(6,58,105,0) 80%),linear-gradient(135deg,#0a1d3f 0%,#04122e 50%,#010818 100%)', h:
    lines('<path d="M30 101L160 18"/><path d="M62 101L160 48"/><path d="M90 0L160 60"/>', '#bfefff', 2.6, .22)
    + lines('<path d="M30 101L160 18"/><path d="M62 101L160 48"/><path d="M90 0L160 60"/>', '#e8fbff', .7, .95)
    + chaseMark('SAPPHIRE', 'PREFERRED') + chip(7.5, 37, 'silver') + visa('Signature') },
  chase_sapphire_reserve: { bg: 'radial-gradient(80% 90% at 100% 0%,#4b5a72 0%,#1d2a44 30%,#090f1e 60%,#000005 100%)', h:
    at('inset:0;-webkit-mask-image:radial-gradient(60% 80% at 100% 0%,#000 0%,transparent 70%);mask-image:radial-gradient(60% 80% at 100% 0%,#000 0%,transparent 70%);background:repeating-linear-gradient(0deg,rgba(255,255,255,.07) 0 .3cqw,transparent .3cqw 2.4cqw),repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 .3cqw,transparent .3cqw 2.4cqw)')
    + chaseMark('SAPPHIRE', 'RESERVE') + chip(7.5, 37, 'silver') + visa('Infinite') },
  chase_freedom_unlimited: { bg: 'radial-gradient(45% 60% at 8% 8%,rgba(150,155,200,.8) 0%,rgba(150,155,200,0) 70%),linear-gradient(112deg,rgba(80,145,110,0) 46%,rgba(125,165,90,.7) 60%,rgba(70,150,140,.55) 70%,rgba(70,150,140,0) 84%),linear-gradient(160deg,#2f4a8c 0%,#17356a 45%,#12213f 100%)', h:
    lines('<path d="M-10 92C30 60 80 52 170 64"/><path d="M-10 98C40 70 90 64 170 74"/><path d="M-10 86C25 50 70 40 170 52"/>', '#a8e0c4', .5, .4)
    + freedomMark('UNLIMITED') + chip(7.5, 40, 'silver') + nfc(22, 41.5) + visa() },
  chase_freedom_flex: { bg: 'radial-gradient(50% 36% at 48% 66%,rgba(60,190,215,.95) 0%,rgba(30,150,195,.55) 45%,rgba(0,90,160,0) 78%),radial-gradient(30% 30% at 92% 10%,rgba(120,160,70,.5) 0%,rgba(120,160,70,0) 70%),linear-gradient(160deg,#1a4d8a 0%,#004786 50%,#003b7e 100%)', h:
    lines('<path d="M10 80C50 50 110 48 165 58"/><path d="M0 88C50 58 115 56 165 66"/>', '#d8fbff', .6, .45)
    + freedomMark('FLEX') + chip(7.5, 40, 'silver') + nfc(22, 41.5) + mc('#fff') },
  chase_ink_cash: { bg: 'linear-gradient(160deg,#a3a8ad 0%,#7b8186 45%,#5c6269 100%)', h: inkMark('BUSINESS CASH') + chip(7.5, 46, 'silver') + nfc(22, 47.5) + visa('Signature Business') },
  chase_ink_preferred: { bg: 'linear-gradient(160deg,#0a1b3c 0%,#0b2048 45%,#2c3449 100%)', h: inkMark('BUSINESS PREFERRED') + chip(7.5, 46, 'silver') + nfc(22, 47.5) + visa('Signature Business') },
  amazon_prime_rewards: { bg: 'linear-gradient(150deg,#1e2d48 0%,#111b2e 55%,#0b1220 100%)', h:
    at('right:7%;top:8%;color:#3fb6ec;font:700 9cqw/1 \'Montserrat\',sans-serif;letter-spacing:-.03em', `prime<span style="position:absolute;left:4%;right:-6%;top:86%;height:4.4cqw">${S('0 0 60 12', '<path d="M2 3C18 11 40 11 54 4" fill="none" stroke="#3fb6ec" stroke-width="2.6" stroke-linecap="round"/><path d="M49 2L56 3.5L52 9" fill="none" stroke="#3fb6ec" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>')}</span>`, 't')
    + chip(8, 40, 'silver') + nfc(23, 41.5) + visa('Signature') },
  united_explorer: { bg: 'radial-gradient(45% 55% at 0% 0%,#4b6a94 0%,rgba(75,106,148,0) 70%),radial-gradient(35% 45% at 100% 100%,#55697f 0%,rgba(85,105,127,0) 70%),linear-gradient(135deg,#2a5a92 0%,#0d4689 45%,#083c7a 100%)', h:
    at('left:-9%;bottom:-24%;width:42cqw;height:42cqw', S('0 0 100 100', '<g fill="none" stroke="#a9d4ff" stroke-opacity=".75" stroke-width="1.6"><circle cx="50" cy="50" r="47"/><ellipse cx="50" cy="50" rx="24" ry="47"/><ellipse cx="50" cy="50" rx="8" ry="47"/><path d="M5 34H95M3 50H97M5 66H95"/></g>'))
    + at('left:6.5%;top:8%;width:5.4cqw;height:5.4cqw', CHASE())
    + at('right:6%;top:8%;font:800 6.2cqw \'Archivo\';font-stretch:125%;letter-spacing:.2em', 'UNITED <span style="font:300 4.2cqw \'Geist\';letter-spacing:0">MileagePlus</span>', 't')
    + at('right:6%;top:20%;color:#8cc7ff;font:700 7cqw \'Archivo\';font-stretch:125%;letter-spacing:.16em', 'EXPLORER', 't')
    + chip(8, 45, 'silver') + visa('Signature') },
  southwest_priority: { bg: 'radial-gradient(40% 50% at 0% 0%,#6d78a0 0%,rgba(109,120,160,0) 70%),radial-gradient(35% 40% at 100% 100%,#8a92b2 0%,rgba(138,146,178,0) 70%),linear-gradient(135deg,#3a4a85 0%,#2b3d77 50%,#1b2350 100%)', h:
    at('right:-12%;top:-4%;width:56cqw;height:56cqw', S('0 0 100 100', '<path d="M50 88C20 66 6 50 6 32C6 18 17 8 30 8C39 8 46 13 50 21C54 13 61 8 70 8C83 8 94 18 94 32C94 50 80 66 50 88Z" fill="none" stroke="#dfe4f2" stroke-width="3.2" stroke-opacity=".85"/><path d="M50 88L70 8" stroke="#dfe4f2" stroke-width="2" stroke-opacity=".5"/>'))
    + at('left:6%;top:8%;font:800 6.6cqw \'Archivo\';letter-spacing:-.02em', `Southwest<span style="display:inline-block;width:3cqw;height:3cqw;margin-left:.6cqw;vertical-align:top">${S('0 0 20 20', '<path d="M10 18C3 12 1 9 1 6C1 3 3 1 6 1C8 1 9 2 10 4Z" fill="#c8102e"/><path d="M10 18C17 12 19 9 19 6C19 3 17 1 14 1C12 1 11 2 10 4Z" fill="#ffbf27"/><path d="M10 18L6 9L14 9Z" fill="#304cb2"/>')}</span><span style="display:block;font:400 2.9cqw 'Geist';letter-spacing:0;margin-top:1.2cqw">Rapid Rewards</span>`, 't')
    + chip(7, 42, 'silver') + nfc(21.5, 43.5) + at('left:7%;bottom:21%;font:500 3.4cqw \'Geist\'', 'Priority', 't') + visa() },
  marriott_bonvoy_boundless: { bg: 'linear-gradient(150deg,#5b6a82 0%,#2f4b6d 35%,#1e3859 70%,#263f62 100%)', h:
    lines('<path d="M-4 88C14 70 22 40 34 34C44 30 40 72 50 74C60 76 66 30 78 28C88 26 86 60 96 60C108 60 120 46 132 40"/><circle cx="136" cy="38" r="2.2"/>', '#f2876a', 1.5, .95)
    + at('left:6%;top:8%;width:5cqw;height:5cqw', CHASE())
    + at('right:6%;top:7%;text-align:right;font:500 3cqw \'Geist\';letter-spacing:.24em', 'MARRIOTT<span style="display:block;font:400 7.4cqw/1.05 \'Geist\';letter-spacing:.06em">BONVOY</span><span style="letter-spacing:.3em">BOUNDLESS</span>', 't')
    + chip(7.5, 44, 'silver') + nfc(22, 45.5) + visa('Signature') },
  world_of_hyatt: { bg: 'repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 .1cqw,rgba(0,0,0,.018) .1cqw .22cqw),linear-gradient(160deg,#c8c8c8 0%,#a4a4a6 42%,#bfbfc0 66%,#969699 100%)', h:
    at('right:6%;top:7%;background:#1d3b6e;padding:1.2cqw 1.6cqw;text-align:center;font:400 2.6cqw/1.25 \'Libre Caslon Text\',serif;letter-spacing:.24em;color:#fff', 'WORLD<br>OF<br>HYATT')
    + chip(8, 44, 'silver') + nfc(22.5, 45.5, '#fff') + visa('Signature') },
  ihg_one_rewards_premier: { bg: 'linear-gradient(160deg,#9aa7b4 0%,#8595a3 45%,#9da9b6 100%)', h:
    at('left:6%;top:8%;width:5cqw;height:5cqw', CHASE())
    + at('right:6%;top:9%;font:400 2.8cqw \'Geist\';letter-spacing:.4em', 'PREMIER', 't')
    + at('left:50%;top:15%;width:.3cqw;height:14%;background:rgba(255,255,255,.8)')
    + at('left:50%;top:33%;transform:translateX(-50%);text-align:center;font:300 13cqw/1 \'Cormorant Garamond\',serif;letter-spacing:.08em', 'IHG<span style="display:block;font:400 2.2cqw \'Geist\';letter-spacing:.22em;margin-top:.6cqw">ONE REWARDS</span>', 't')
    + chip(7.5, 44, 'silver') + nfc(22, 45.5) + mc('#fff') },

  amex_platinum: { bg: 'linear-gradient(135deg,#f1f2f4 0%,#c8ccd1 30%,#f6f7f8 52%,#b5bac0 78%,#e1e4e7 100%)', ink: '#2c3036', h:
    amexFrame('rgba(60,64,72,.5)') + AMEX_LINE('#2c3036') + at('left:50%;top:56%;width:34cqw;height:34cqw;transform:translate(-50%,-50%)', CENT('#353a41', '#dfe2e6')) + chip(9, 34, 'silver') },
  // Amex, Citi, Capital One, BofA, Wells Fargo and Robinhood colours below were sampled from each issuer's own card art.
  amex_gold: { bg: 'linear-gradient(135deg,#b9a864 0%,#9a8c53 30%,#d0bc71 52%,#8e814c 78%,#bead6e 100%)', ink: '#3b2c12', h:
    amexFrame('rgba(90,64,20,.45)') + AMEX_LINE('#3b2c12') + at('left:50%;top:56%;width:34cqw;height:34cqw;transform:translate(-50%,-50%)', CENT('#4a3812', '#c9b56d')) + chip(9, 34) },
  amex_green: { bg: 'linear-gradient(135deg,#a2c2a9 0%,#859f88 35%,#bad0bd 60%,#849e87 100%)', ink: '#203d29', h:
    amexFrame('rgba(30,70,45,.4)') + AMEX_LINE('#203d29') + at('left:50%;top:56%;width:34cqw;height:34cqw;transform:translate(-50%,-50%)', CENT('#24442d', '#a8c6ad')) + chip(9, 34, 'silver') },
  amex_blue_cash_preferred: { bg: 'radial-gradient(60% 80% at 22% 45%,#4c6084 0%,rgba(76,96,132,0) 72%),linear-gradient(135deg,#2f3f5e 0%,#1d2539 55%,#0f1528 100%)', h:
    at('left:-12%;top:-16%;width:76cqw;height:76cqw', CENT('rgba(150,170,205,.45)', '#1d2539', 'none'))
    + AMEX_STACK('#fff', 'CASH PREFERRED') + chip(9, 38, 'silver') + nfc(70, 47) },
  amex_blue_cash_everyday: { bg: 'radial-gradient(55% 70% at 45% 45%,#8abde5 0%,rgba(138,189,229,0) 70%),linear-gradient(135deg,#1256a4 0%,#2268cb 50%,#063a86 100%)', h:
    at('left:-12%;top:-16%;width:76cqw;height:76cqw', CENT('rgba(185,215,255,.55)', '#2468c8', 'none'))
    + AMEX_STACK('#fff') + chip(9, 38, 'silver') + nfc(70, 47) },
  amex_everyday_preferred: { bg: 'linear-gradient(135deg,#f7f8f9 0%,#e1e5e9 60%,#cbd0d6 100%)', ink: '#1f4f8f', h:
    at('left:-12%;top:-16%;width:76cqw;height:76cqw', CENT('rgba(120,132,148,.32)', '#e4e7ea', 'none'))
    + AMEX_STACK('#1f4f8f', 'PREFERRED') + chip(9, 38, 'silver') + nfc(70, 47, '#1f4f8f') },
  amex_blue_business_plus: { bg: 'radial-gradient(70% 80% at 50% 55%,#5f7290 0%,#3b5880 55%,#2f466d 100%)', h:
    AMEX_LINE('#fff', 5, 'left:50%;top:8%;transform:translateX(-50%)')
    + at('left:50%;top:16%;transform:translateX(-50%);font:500 2.2cqw \'Geist\';letter-spacing:.26em', 'BUSINESS PLUS', 't')
    + at('left:50%;top:57%;width:34cqw;height:34cqw;transform:translate(-50%,-50%)', CENT('#dbe6f5', '#3b5880', 'round')) + chip(9, 38, 'silver') + nfc(76, 47) },
  delta_skymiles_gold: { bg: 'linear-gradient(135deg,#cdb685 0%,#b59f6f 35%,#e0c790 55%,#a5884f 100%)', ink: '#3b2c12', h:
    at('left:26%;top:22%;width:58cqw;height:40cqw', deltaWidget('#f3deaa', '#a5884f'))
    + at('left:7%;top:8%;font:800 3.6cqw \'Archivo\';font-stretch:108%;letter-spacing:.03em', 'AMERICAN EXPRESS', 't')
    + at('right:6%;top:7%;text-align:right;font:600 2.2cqw \'Geist\';letter-spacing:.26em', '▲ DELTA<span style="display:block;font:300 5.4cqw \'Geist\';letter-spacing:.1em;margin-top:.6cqw">SKYMILES</span>', 't')
    + chip(7, 34) },
  delta_skymiles_platinum: { bg: 'linear-gradient(135deg,#c6cacb 0%,#aaaeaf 35%,#d8dadb 55%,#959d9e 100%)', ink: '#2f333a', h:
    at('left:26%;top:22%;width:58cqw;height:40cqw', deltaWidget('#ffffff', '#9aa0a8'))
    + at('left:7%;top:8%;font:800 3.6cqw \'Archivo\';font-stretch:108%;letter-spacing:.03em', 'AMERICAN EXPRESS', 't')
    + at('right:6%;top:7%;text-align:right;font:600 2.2cqw \'Geist\';letter-spacing:.26em', '▲ DELTA<span style="display:block;font:300 5.4cqw \'Geist\';letter-spacing:.1em;margin-top:.6cqw">SKYMILES</span>', 't')
    + chip(7, 34, 'silver') },
  hilton_honors_surpass: { bg: 'repeating-linear-gradient(45deg,rgba(255,255,255,.025) 0 .4cqw,transparent .4cqw .8cqw),radial-gradient(40% 50% at 100% 0%,#5b718e 0%,rgba(91,113,142,0) 70%),linear-gradient(140deg,#2b4a73 0%,#1f3d65 55%,#1c395f 100%)', h:
    at('left:3.4%;top:50%;transform:translate(-38%,-50%) rotate(-90deg);font:700 2.3cqw \'Archivo\';letter-spacing:.22em;opacity:.45', 'AMERICAN EXPRESS', 't')
    + at('right:6%;top:7%;border:.35cqw solid #fff;padding:1cqw 1.8cqw .9cqw;text-align:center;font:700 6cqw/1 \'Libre Caslon Text\',serif', 'Hilton<span style="display:block;font:500 1.9cqw \'Geist\';letter-spacing:.34em;margin-top:.7cqw">HONORS</span>', 't')
    + chip(10, 36, 'silver')
    + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';letter-spacing:.02em', 'AMERICAN<br>EXPRESS') },

  citi_double_cash: { bg: 'linear-gradient(180deg,rgba(0,0,0,0) 38%,rgba(120,210,255,.32) 46%,rgba(0,0,0,0) 54%),radial-gradient(55% 55% at 62% 62%,#279e75 0%,rgba(22,151,100,.55) 40%,rgba(0,0,0,0) 72%),linear-gradient(180deg,#0b3575 0%,#1b72aa 30%,#219ccf 45%,#169764 65%,#0f5340 85%,#0c3637 100%)', h:
    at('left:38%;top:12%;width:36cqw;height:14cqw', S('0 0 60 22', '<path d="M3 21C14 2 46 2 57 21" fill="none" stroke="#bfe6ff" stroke-width="3.4" stroke-opacity=".85"/>'))
    + CITI() + at('left:44%;top:44%;font:700 4.6cqw \'Geist\';letter-spacing:.1em', 'DOUBLE<span style="position:relative;top:2.4cqw;margin-left:1cqw">CASH</span>', 't')
    + nfc(4, 39.5) + chip(9, 37, 'silver') + mc('#e6e8ea') },
  citi_custom_cash: { bg: 'linear-gradient(180deg,rgba(0,0,0,0) 38%,rgba(170,230,255,.4) 47%,rgba(0,0,0,0) 56%),linear-gradient(180deg,#0e2e66 0%,#123f7f 25%,#1280b9 50%,#15afdb 78%,#23b6dd 100%)', h:
    at('left:46%;top:12%;width:36cqw;height:14cqw', S('0 0 60 22', '<path d="M3 21C14 2 46 2 57 21" fill="none" stroke="#e2f4ff" stroke-width="3.4" stroke-opacity=".9"/>'))
    + CITI() + at('left:44%;top:44%;font:700 4.6cqw \'Geist\';letter-spacing:.1em', 'CUSTOM<span style="position:relative;top:2.4cqw;margin-left:1cqw">CASH</span>', 't')
    + nfc(4, 39.5) + chip(9, 37, 'silver') + mc('#e6e8ea') },
  citi_strata_premier: { bg: 'linear-gradient(135deg,#8a8d93 0%,#5d6066 45%,#3a3c41 100%)', h:
    waves(22, '#111214', .55, -2, 11, 44) + waves(22, '#ffffff', .12, -1.4, 11, 44)
    + CITI() + at('left:28%;top:8%;font:500 2.8cqw/1.15 \'Geist\';letter-spacing:.12em', 'STRATA<br>PREMIER', 't')
    + nfc(4, 39.5) + chip(9, 37, 'silver') + mc('#e6e8ea') },
  costco_anywhere_visa: { bg: 'linear-gradient(160deg,#0f1115 0%,#1d1f22 55%,#3a3c3e 100%)', h:
    waves(24, '#ffffff', .07, -6, 12, -10)
    + at('right:0;top:8%;width:1.8%;height:11%;background:#e31837') + at('right:0;top:19%;width:1.8%;height:7%;background:#005daa')
    + CITI() + chip(8, 33, 'silver')
    + at('left:7%;top:58%;font:500 5.6cqw \'Geist Mono\';letter-spacing:.04em;opacity:.92', '4000 1234 5678 9010', 't') + visa() },
  citi_aadvantage_platinum_select: { bg: 'linear-gradient(135deg,#c1c5ca 0%,#9fa4ab 40%,#ccd0d4 70%,#91969d 100%)', h:
    waves(22, '#ffffff', .5, 18, 7, 30) + waves(10, '#5d636b', .25, 40, 9, 60)
    + at('left:7%;top:62%;width:9cqw;height:9cqw;opacity:.55', S('0 0 24 24', '<path fill="#fff" d="M21 15L13 10V4.5C13 3.7 12.3 3 11.5 3S10 3.7 10 4.5V10L2 15V17L10 14.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V14.5L21 17Z"/>'))
    + at('left:17%;top:76%;width:6cqw;height:6cqw;opacity:.4;transform:rotate(-30deg)', S('0 0 24 24', '<path fill="#fff" d="M21 15L13 10V4.5C13 3.7 12.3 3 11.5 3S10 3.7 10 4.5V10L2 15V17L10 14.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V14.5L21 17Z"/>'))
    + at('right:0;top:0;bottom:0;width:1.6%;background:#c8102e')
    + CITI() + at('left:38%;top:7%;font:400 1.9cqw \'Geist\';letter-spacing:.02em', 'American Airlines', 't')
    + at('left:38%;top:11%;font:500 6.6cqw \'Geist\';letter-spacing:-.02em', 'AAdvantage', 't')
    + at('right:7%;top:9%;width:7cqw;height:6cqw', S('0 0 30 26', '<path d="M2 24L20 2L28 2L12 24Z" fill="#c8102e"/><path d="M14 24L26 9L29 12L20 24Z" fill="#0078d2"/>'))
    + nfc(4, 39.5) + chip(9, 37, 'silver') + at('left:38%;bottom:20%;font:400 3cqw \'Geist\'', 'Platinum Select', 't') + mc('#f4f5f6') },

  capital_one_venture_x: { bg: 'radial-gradient(55% 60% at 90% 10%,#356f90 0%,#0b4f77 35%,rgba(11,79,119,0) 75%),linear-gradient(160deg,#0b3454 0%,#082642 50%,#06162d 100%)', h:
    C1() + chip(8, 30, 'silver') + nfc(23, 33) + at('left:8%;top:58%;font:300 5cqw \'Geist\';letter-spacing:.36em', 'VENTURE X', 't') + visa('Infinite', '#fff', 'font-size:7cqw') },
  capital_one_venture: { bg: 'radial-gradient(40% 50% at 10% 10%,#5d6c7e 0%,rgba(93,108,126,0) 70%),linear-gradient(160deg,#0a2b51 0%,#021c40 50%,#021130 100%)', h:
    at('left:-10%;top:-30%;width:62cqw;height:62cqw', S('0 0 100 100', '<g fill="none" stroke="#fff" stroke-opacity=".2"><circle cx="50" cy="50" r="46" stroke-width="1"/><circle cx="50" cy="50" r="36" stroke-width="5" stroke-dasharray="1 3"/><circle cx="50" cy="50" r="26" stroke-width=".8"/></g>'))
    + C1() + chip(8, 30, 'silver') + nfc(23, 33) + at('left:8%;top:58%;font:300 5cqw \'Geist\';letter-spacing:.36em', 'VENTURE', 't') + visa('Signature', '#fff', 'font-size:7cqw') },
  capital_one_quicksilver: { bg: 'linear-gradient(170deg,#54616d 0%,#6a7681 35%,#838f9b 65%,#9eaab2 100%)', h:
    C1() + chip(8, 30, 'silver') + nfc(23, 33) + at('left:8%;top:58%;font:300 5cqw \'Geist\';letter-spacing:.36em', 'QUICKSILVER', 't') + mc('#fff') },
  capital_one_savor: { bg: 'linear-gradient(170deg,#933423 0%,#9c4634 45%,#a65a4a 70%,#b35733 100%)', h:
    C1() + chip(8, 30, 'silver') + nfc(23, 33) + at('left:8%;top:58%;font:300 5cqw \'Geist\';letter-spacing:.36em', 'SAVOR', 't') + mc('#fff') },
  capital_one_savorone: { bg: 'linear-gradient(170deg,#9a3a27 0%,#a44c38 45%,#ae604e 70%,#b85d37 100%)', h:
    C1() + chip(8, 30, 'silver') + nfc(23, 33) + at('left:8%;top:56%;font:300 5cqw \'Geist\';letter-spacing:.36em', 'SAVOR<span style="display:block;font-size:2.6cqw;letter-spacing:.4em;margin-top:1cqw">ONE</span>', 't') + mc('#fff') },

  discover_it_cashback: { bg: 'repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 .3cqw,transparent .3cqw .9cqw),linear-gradient(160deg,#98d2f0 0%,#64b5e2 45%,#3f97cf 100%)', ink: '#1b1b1d', h:
    at('left:50%;top:50%;transform:translate(-56%,-50%);font:800 8cqw \'Archivo\';letter-spacing:-.01em;color:#1b1b1d', 'DISC<span style="display:inline-block;width:6.6cqw;height:6.6cqw;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffb15c,#f26b1d 70%);vertical-align:-.6cqw;margin:0 .2cqw"></span>VER', 't')
    + at('right:-5%;top:50%;transform:translateY(-50%);width:15cqw;height:15cqw;border-radius:50%;background:#2a7fc0;box-shadow:0 0 0 1cqw rgba(255,255,255,.35);color:#fff;font:600 6cqw/15cqw \'Geist\';padding-left:3cqw', 'it')
    + chip(8, 40, 'silver') },
  discover_it_miles: { bg: 'repeating-linear-gradient(0deg,rgba(255,255,255,.04) 0 .3cqw,transparent .3cqw .9cqw),linear-gradient(160deg,#2a74c4 0%,#1d5fae 50%,#174e94 100%)', h:
    at('left:50%;top:46%;transform:translate(-56%,-50%);font:800 8cqw \'Archivo\';letter-spacing:-.01em', 'DISC<span style="display:inline-block;width:6.6cqw;height:6.6cqw;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffb15c,#f26b1d 70%);vertical-align:-.6cqw;margin:0 .2cqw"></span>VER', 't')
    + at('left:50%;top:62%;transform:translateX(-50%);font:400 3.4cqw \'Geist\';letter-spacing:.06em', 'Miles', 't')
    + at('right:-5%;top:50%;transform:translateY(-50%);width:15cqw;height:15cqw;border-radius:50%;background:#fff;color:#1d5fae;font:600 6cqw/15cqw \'Geist\';padding-left:3cqw', 'it')
    + chip(8, 40, 'silver') },

  bofa_premium_rewards: { bg: 'linear-gradient(160deg,#3c3e42 0%,#26282b 50%,#151618 100%)', h:
    lines('<path d="M40 101L120 -10"/><path d="M60 101L140 -10"/><path d="M80 101L160 -10"/>', '#fff', 9, .045)
    + at('left:50%;top:22%;width:22cqw;height:11cqw;transform:translateX(-50%)', BOFA_FLAG('#e8e9eb'))
    + at('left:50%;top:50%;transform:translateX(-50%);font:600 2.9cqw \'Geist\';letter-spacing:.22em', 'BANK OF AMERICA', 't')
    + chip(8, 33, 'silver') + nfc(8, 74) + visa('Signature') },
  bofa_customized_cash: { bg: 'radial-gradient(40% 55% at 0% 0%,#6d4e77 0%,rgba(109,78,119,0) 70%),linear-gradient(160deg,#bf1c2a 0%,#b31926 55%,#a41521 100%)', h:
    lines('<path d="M40 101L120 -10"/><path d="M60 101L140 -10"/><path d="M80 101L160 -10"/>', '#fff', 9, .06)
    + at('left:50%;top:22%;width:22cqw;height:11cqw;transform:translateX(-50%)', BOFA_FLAG())
    + at('left:50%;top:50%;transform:translateX(-50%);font:600 2.9cqw \'Geist\';letter-spacing:.22em', 'BANK OF AMERICA', 't')
    + chip(8, 33, 'silver') + nfc(8, 74) + visa('Signature') },
  bofa_travel_rewards: { bg: 'radial-gradient(45% 55% at 30% 40%,#3d6a9d 0%,rgba(61,106,157,0) 70%),linear-gradient(160deg,#103a80 0%,#054389 55%,#024f95 100%)', h:
    lines('<path d="M40 101L120 -10"/><path d="M60 101L140 -10"/><path d="M80 101L160 -10"/>', '#fff', 9, .06)
    + at('left:50%;top:22%;width:22cqw;height:11cqw;transform:translateX(-50%)', BOFA_FLAG())
    + at('left:50%;top:50%;transform:translateX(-50%);font:600 2.9cqw \'Geist\';letter-spacing:.22em', 'BANK OF AMERICA', 't')
    + chip(8, 33, 'silver') + nfc(8, 74) + visa('Signature') },

  wells_fargo_autograph: { bg: 'linear-gradient(100deg,#3d2967 0%,#532063 35%,#7b204d 62%,#9e203a 82%,#bc3f42 100%)', h:
    GOLD_STREAK(47) + WF() + at('right:6%;top:9%;font:400 4.2cqw \'Geist\';letter-spacing:.1em', 'AUTOGRAPH', 't')
    + chip(8, 38, 'silver') + nfc(22.5, 39.5) + visa('Signature') },
  wells_fargo_active_cash: { bg: 'linear-gradient(118deg,#e6e6e8 0%,#cfcfd2 36%,#b5212f 60%,#8e1424 100%)', h:
    lines('<path d="M70 101L120 0"/>', '#fff', .6, .5) + WF('#2a2a2c')
    + at('right:6%;top:8%;text-align:right;font:600 2.6cqw/1.15 \'Geist\';letter-spacing:.12em', 'ACTIVE<br>CASH', 't')
    + chip(8, 38, 'silver') + nfc(22.5, 39.5, '#555') + visa('Signature') },
  wells_fargo_autograph_journey: { bg: 'radial-gradient(45% 55% at 100% 0%,#c2303b 0%,#8c3a3f 35%,rgba(60,40,40,0) 75%),linear-gradient(160deg,#4a4848 0%,#2b2a2a 45%,#2d2d2d 100%)', h:
    GOLD_STREAK(47) + WF() + at('right:6%;top:8%;text-align:right;font:400 4.2cqw \'Geist\';letter-spacing:.1em', 'AUTOGRAPH<span style="display:block;font:400 6.4cqw/1 \'Allura\',cursive;letter-spacing:0;color:#e6cd92;margin-top:.4cqw">Journey</span>', 't')
    + chip(8, 38, 'silver') + nfc(22.5, 39.5) + visa('Signature') },
  bilt_blue: { bg: 'linear-gradient(160deg,#173159 0%,#112748 55%,#0c1c36 100%)', h:
    grid('#5b8fd6', .32, 24, 10) + grid('#5b8fd6', .18, -40, 23)
    + at('left:6%;top:8%;display:flex;align-items:center;gap:2.4cqw;font:200 10cqw/1 \'Geist\';letter-spacing:.22em', `BILT<span style="width:6cqw;height:7cqw;display:inline-block">${S('0 0 20 24', '<g fill="none" stroke="#fff" stroke-width="1.4"><rect x="1" y="1" width="18" height="22"/><path d="M1 9H19M1 16H19M10 1V23"/></g>')}</span>`, 't')
    + chip(9, 38, 'silver') + mc('#fff', 'world elite') },

  usbank_altitude_connect: { bg: 'linear-gradient(170deg,#3069e6 0%,#2453c6 100%)', h:
    at('', `<span style="position:absolute;right:1%;top:1.5%;writing-mode:vertical-rl;font:800 30cqw/.9 'Archivo';font-stretch:62%;letter-spacing:0;transform:scaleY(1.42);transform-origin:top">CONNECT</span>`
      + `<span class="emv silver v" style="left:44%;top:8%"></span><span class="nfc" style="left:22%;top:10%">${NFC()}</span>`
      + USB('#fff', 9, 'left:7%;top:48%') + `<span class="t fine" style="left:8%;top:56%;font:400 3.4cqw 'Geist'">Altitude Connect</span>`
      + `<span class="visa" style="left:8%;right:auto;bottom:5%;text-align:left;font-size:13cqw">VISA<small style="font-size:3.6cqw">Signature</small></span>`, 'vin') },
  usbank_altitude_go: { bg: 'linear-gradient(170deg,#ef1a3b 0%,#d8002a 100%)', h:
    at('', `<span style="position:absolute;right:-14%;top:-3%;writing-mode:vertical-rl;font:900 62cqw/1 'Archivo';font-stretch:85%;letter-spacing:-.04em;transform:scaleY(1.25);transform-origin:top">GO</span>`
      + `<span class="emv silver v" style="left:40%;top:8%"></span><span class="nfc" style="left:20%;top:10%">${NFC()}</span>`
      + USB('#fff', 9, 'left:7%;top:48%') + `<span class="t fine" style="left:8%;top:56%;font:400 3.4cqw 'Geist'">Altitude Go</span>`
      + `<span class="visa" style="left:8%;right:auto;bottom:5%;text-align:left;font-size:13cqw">VISA<small style="font-size:3.6cqw">Signature</small></span>`, 'vin') },
  usbank_cash_plus: { bg: 'repeating-linear-gradient(60deg,rgba(0,0,0,.025) 0 .4cqw,transparent .4cqw 3cqw),repeating-linear-gradient(-60deg,rgba(0,0,0,.025) 0 .4cqw,transparent .4cqw 3cqw),#f5f6f8', ink: '#0c2074', h:
    at('', mosaic() + `<span style="position:absolute;right:4%;top:4%;writing-mode:vertical-rl;font:700 7cqw 'Archivo';color:#0c2074;letter-spacing:.06em">CASH+</span>`
      + `<span class="emv silver v" style="left:52%;top:8%"></span>`
      + `<span style="position:absolute;left:6%;top:47%;background:#d71e28;padding:1.4cqw 2cqw">${USB('#fff', 8, 'position:relative')}</span>`
      + `<span class="visa" style="left:8%;right:auto;bottom:5%;text-align:left;font-size:13cqw;color:#1a1f71">VISA<small style="font-size:3.6cqw">Signature</small></span>`, 'vin') },
  us_bank_smartly: { bg: '#0f0f12', h:
    at('', hexes(['#e4002b', '#2a5fd8', '#ffffff', '#2a5fd8', '#e4002b', '#3a3a40', '#3a3a40']) + `<span class="emv silver v" style="left:52%;top:8%"></span><span class="nfc" style="left:30%;top:10%">${NFC()}</span>`
      + USB('#fff', 9, 'left:7%;top:38%') + `<span class="t fine" style="left:8%;top:46%;font:400 3.4cqw 'Geist'">Smartly</span>`
      + `<span class="visa" style="left:8%;right:auto;bottom:5%;text-align:left;font-size:13cqw">VISA<small style="font-size:3.6cqw">Signature</small></span>`, 'vin') },

  apple_card: { bg: 'linear-gradient(160deg,#fdfdfd 0%,#eeeeee 50%,#e2e2e3 100%)', ink: '#9a9a9c', h:
    at('left:7%;top:8%;width:9.5cqw;height:11.4cqw', S('0 0 100 120', '<path fill="#bdbdc0" d="M50 34C40 26 22 28 17 46C12 64 24 96 37 99C43 100 45 96 50 96C55 96 57 100 63 99C73 97 81 82 84 74C73 69 69 55 77 46C71 36 59 29 50 34Z"/><path fill="#bdbdc0" d="M51 29C51 17 60 9 69 8C69 19 61 28 51 29Z"/>'))
    + chip(8, 42, 'silver') + mc('#b5b5b8', '', '', false) },
  robinhood_gold: { bg: 'linear-gradient(135deg,#c9a452 0%,#a48140 40%,#b89343 60%,#7d612a 100%)', ink: '#3d2c10', h:
    at('left:7.5%;top:9%;width:7cqw;height:9cqw', S('0 0 40 52', '<path fill="#7a5a1c" fill-opacity=".55" d="M34 2C20 6 8 20 5 38L4 50L9 46C12 30 20 18 34 2ZM22 26C26 22 31 19 36 18C30 24 25 31 22 38C20 34 20 30 22 26Z"/>'))
    + chip(8, 40) + visa('Signature', 'rgba(107,79,23,.7)') },
  alliant_cashback_visa: { bg: 'linear-gradient(160deg,#222225 0%,#121214 100%)', h:
    dots() + at('left:7%;top:8.5%;display:flex;align-items:center;gap:1.6cqw;font:600 4.2cqw \'Geist\';letter-spacing:.26em', `<span style="width:6cqw;height:4.6cqw;display:inline-block">${S('0 0 26 20', '<circle cx="7" cy="12" r="6.5" fill="#0d4f9c"/><circle cx="17" cy="7" r="6.5" fill="#8cc63f"/><circle cx="19" cy="14" r="5.5" fill="#29a3e0"/>')}</span>ALLIANT`, 't')
    + chip(9, 38, 'silver') + nfc(24, 39.5) + visa('Signature') },
  fidelity_rewards_visa: { bg: 'linear-gradient(150deg,#46963f 0%,#2d7431 45%,#1b5426 100%)', h:
    at('right:-6%;bottom:-18%;width:62cqw;height:50cqw', S('0 0 100 80', '<g fill="#fff" fill-opacity=".09"><polygon points="50,4 96,78 4,78"/><polygon points="50,24 82,78 18,78"/></g>'))
    + at('left:7%;top:8%;font:italic 800 8.2cqw \'Archivo\';letter-spacing:-.02em', 'Fidelity', 't')
    + at('left:7.5%;top:22%;font:400 2.6cqw \'Geist\';letter-spacing:.06em;opacity:.85', 'REWARDS', 't')
    + chip(8, 40, 'silver') + nfc(22.5, 41.5) + visa('Signature') },
  sofi_credit_card: { bg: 'linear-gradient(150deg,#55c6db 0%,#37adc6 55%,#2a95b0 100%)', h:
    at('right:-20%;bottom:-48%;width:80cqw;height:80cqw', S('0 0 100 100', '<g fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="5"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="30"/></g>'))
    + at('left:7%;top:8%;font:400 2.6cqw \'Geist\';opacity:.9', 'world elite', 't')
    + at('right:6%;top:7%;display:flex;align-items:center;gap:1.4cqw;font:700 8.4cqw/1 \'Geist\';letter-spacing:-.04em', `SoFi<span style="width:6.6cqw;height:6.6cqw;display:inline-block">${S('0 0 30 30', '<g fill="#fff"><circle cx="5" cy="5" r="3.6"/><circle cx="15" cy="5" r="3.6"/><circle cx="25" cy="5" r="3.6"/><circle cx="5" cy="15" r="3.6"/><circle cx="25" cy="15" r="3.6"/><circle cx="5" cy="25" r="3.6"/><circle cx="15" cy="25" r="3.6"/><circle cx="25" cy="25" r="3.6"/></g>')}</span>`, 't')
    + chip(9, 40, 'silver') + mc('#fff') },
  venmo_credit_card: { bg: 'radial-gradient(70% 90% at 80% 10%,#7cc0ff 0%,rgba(124,192,255,0) 60%),linear-gradient(150deg,#4a9af0 0%,#2b78e0 50%,#1c5cc6 100%)', h:
    at('left:7%;top:8%;font:700 7.6cqw \'Geist\';letter-spacing:-.04em', 'venmo', 't')
    + at('right:7%;top:9%;width:14cqw;height:14cqw', S('0 0 21 21', (() => { let q = ''; const f = (x, y) => `<path d="M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z" fill-rule="evenodd"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
        q += f(0, 0) + f(14, 0) + f(0, 14); for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) { const fin = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12); if (!fin && rnd(x + 3, y + 7) > .55) q += `<rect x="${x}" y="${y}" width="1" height="1"/>`; } return `<g fill="#fff" fill-opacity=".92">${q}</g>`; })()))
    + chip(8, 40, 'silver') + nfc(22.5, 41.5) + visa() },
  pnc_cash_rewards: { bg: 'linear-gradient(150deg,#33904a 0%,#22743a 50%,#165c2b 100%)', h:
    at('inset:0', S('0 0 160 101', '<path d="M-10 101C30 40 90 20 170 30L170 60C110 50 60 66 30 101Z" fill="#fff" fill-opacity=".08"/><path d="M40 101C70 70 120 60 170 66L170 101Z" fill="#000" fill-opacity=".10"/>', 'none'))
    + at('right:6%;top:8%;display:flex;align-items:center;gap:1cqw;font:600 3.6cqw \'Geist\';letter-spacing:.02em', `<span style="width:3.6cqw;height:3.6cqw;display:inline-block">${S('0 0 20 20', '<path d="M2 2L18 10L2 18Z" fill="#ef7622"/><path d="M2 2L10 10L2 18Z" fill="#fbb040"/>')}</span>PNC BANK`, 't')
    + at('left:30%;top:42%;font:400 4.4cqw \'Libre Caslon Text\',serif;letter-spacing:.06em;color:#e3ebe4', 'PNC CASH REWARDS', 't')
    + chip(8, 39, 'silver') + visa() },
  /* ---------- added 2026-10-19: faces generated from each issuer's card art ---------- */
  // Delta SkyMiles Blue (sampled from American Express card art)
  delta_skymiles_blue: { bg: 'linear-gradient(140deg,#1f81bc 0%,#2c79b6 52%,#0b5d9d 100%)', h:
    AMEX_LINE('#fff', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'DELTA SKYMILES BLUE', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Delta SkyMiles Reserve (sampled from American Express card art)
  delta_skymiles_reserve: { bg: 'linear-gradient(140deg,#56646f 0%,#42525d 52%,#313f48 100%)', h:
    AMEX_LINE('#fff', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'DELTA SKYMILES RESERVE', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Hilton Honors (sampled from American Express card art)
  hilton_honors: { bg: 'linear-gradient(140deg,#f4f5f5 0%,#fbfbfb 52%,#bfd8ef 100%)', ink: '#1b1c1f', h:
    AMEX_LINE('#1b1c1f', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'HILTON HONORS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Hilton Honors Aspire (sampled from American Express card art)
  hilton_honors_aspire: { bg: 'linear-gradient(140deg,#2e4868 0%,#15355b 52%,#244266 100%)', h:
    AMEX_LINE('#fff', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'HILTON HONORS ASPIRE', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Marriott Bonvoy Brilliant (sampled from American Express card art)
  marriott_bonvoy_brilliant: { bg: 'linear-gradient(140deg,#363738 0%,#2a2a2a 52%,#131313 100%)', h:
    AMEX_LINE('#fff', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'MARRIOTT BONVOY BRILLIANT', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Marriott Bonvoy Bevy (sampled from American Express card art)
  marriott_bonvoy_bevy: { bg: 'linear-gradient(140deg,#77706d 0%,#6b6460 52%,#4a5e6f 100%)', h:
    AMEX_LINE('#fff', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'MARRIOTT BONVOY BEVY', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Amex Business Gold (sampled from American Express card art)
  amex_business_gold: { bg: 'linear-gradient(140deg,#b5a564 0%,#a09156 52%,#b6a563 100%)', ink: '#1b1c1f', h:
    AMEX_LINE('#1b1c1f', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'BUSINESS GOLD', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Amex Business Platinum (sampled from American Express card art)
  amex_business_platinum: { bg: 'linear-gradient(140deg,#a4a7aa 0%,#afb0b1 52%,#b2b4b7 100%)', ink: '#1b1c1f', h:
    AMEX_LINE('#1b1c1f', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'BUSINESS PLATINUM', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Amex Blue Business Cash (sampled from American Express card art)
  amex_blue_business_cash: { bg: 'linear-gradient(140deg,#435d81 0%,#587ba1 52%,#336398 100%)', h:
    AMEX_LINE('#fff', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'BLUE BUSINESS CASH', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Delta SkyMiles Gold Business (sampled from American Express card art)
  delta_skymiles_gold_business: { bg: 'linear-gradient(140deg,#ceb888 0%,#c4aa73 52%,#9c7e46 100%)', ink: '#1b1c1f', h:
    AMEX_LINE('#1b1c1f', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'DELTA SKYMILES GOLD BUSINESS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Delta SkyMiles Platinum Business (sampled from American Express card art)
  delta_skymiles_platinum_business: { bg: 'linear-gradient(140deg,#bcc0c2 0%,#b5b9ba 52%,#959c9e 100%)', ink: '#1b1c1f', h:
    AMEX_LINE('#1b1c1f', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 2.7cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'DELTA SKYMILES PLATINUM BUSINESS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Delta SkyMiles Reserve Business (sampled from American Express card art)
  delta_skymiles_reserve_business: { bg: 'linear-gradient(140deg,#5c6b76 0%,#485762 52%,#2f3c45 100%)', h:
    AMEX_LINE('#fff', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 2.7cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'DELTA SKYMILES RESERVE BUSINESS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Hilton Honors Business (sampled from American Express card art)
  hilton_honors_business: { bg: 'linear-gradient(140deg,#26599a 0%,#0f4994 52%,#20569b 100%)', h:
    AMEX_LINE('#fff', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'HILTON HONORS BUSINESS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Marriott Bonvoy Business (sampled from American Express card art)
  marriott_bonvoy_business: { bg: 'linear-gradient(140deg,#a1a6b3 0%,#98a2b1 52%,#6f91b3 100%)', ink: '#1b1c1f', h:
    AMEX_LINE('#1b1c1f', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'MARRIOTT BONVOY BUSINESS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // Amex Graphite Business Cash Unlimited (sampled from American Express card art)
  amex_graphite_business_cash_unlimited: { bg: 'linear-gradient(140deg,#5f6c76 0%,#677a87 52%,#4b5a65 100%)', h:
    AMEX_LINE('#fff', 4.2, 'left:6.5%;top:8.5%') + at('left:7%;top:21%;max-width:86%;font:500 2.7cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'GRAPHITE BUSINESS CASH UNLIMITED', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + at('right:6%;bottom:7%;width:10.5cqw;height:10.5cqw;background:#2671b9;display:flex;align-items:center;justify-content:center;text-align:center;font:800 1.6cqw/1.05 \'Archivo\';color:#fff', 'AMERICAN<br>EXPRESS') },
  // BofA Unlimited Cash Rewards (sampled from Bank of America card art)
  bofa_unlimited_cash: { bg: 'linear-gradient(140deg,#83899d 0%,#8d8e90 52%,#9e9fa1 100%)', h:
    at('left:6.5%;top:8%;width:15cqw;height:7.5cqw', BOFA_FLAG('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'UNLIMITED CASH REWARDS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Atmos Rewards Ascent (sampled from Bank of America (Alaska/Hawaiian) card art)
  atmos_rewards_ascent: { bg: 'linear-gradient(140deg,#24385b 0%,#304064 52%,#27385c 100%)', h:
    at('left:6.5%;top:8%;width:15cqw;height:7.5cqw', BOFA_FLAG('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'ATMOS REWARDS ASCENT', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Atmos Rewards Summit (sampled from Bank of America (Alaska/Hawaiian) card art)
  atmos_rewards_summit: { bg: 'linear-gradient(140deg,#3c3e42 0%,#1e1d1c 52%,#323437 100%)', h:
    at('left:6.5%;top:8%;width:15cqw;height:7.5cqw', BOFA_FLAG('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'ATMOS REWARDS SUMMIT', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // BofA Business Advantage Unlimited Cash Rewards (sampled from Bank of America card art)
  bofa_business_unlimited_cash: { bg: 'linear-gradient(140deg,#9b9c9f 0%,#818285 52%,#917066 100%)', h:
    at('left:6.5%;top:8%;width:15cqw;height:7.5cqw', BOFA_FLAG('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 2.7cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'BUSINESS ADVANTAGE UNLIMITED CASH REWARDS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // BofA Business Advantage Customized Cash Rewards (sampled from Bank of America card art)
  bofa_business_customized_cash: { bg: 'linear-gradient(140deg,#b54153 0%,#b63449 52%,#bc2428 100%)', h:
    at('left:6.5%;top:8%;width:15cqw;height:7.5cqw', BOFA_FLAG('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 2.7cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'BUSINESS ADVANTAGE CUSTOMIZED CASH REWARDS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // BofA Business Advantage Travel Rewards (sampled from Bank of America card art)
  bofa_business_travel_rewards: { bg: 'linear-gradient(140deg,#3e588e 0%,#2e548d 52%,#4b446a 100%)', h:
    at('left:6.5%;top:8%;width:15cqw;height:7.5cqw', BOFA_FLAG('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 2.7cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'BUSINESS ADVANTAGE TRAVEL REWARDS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Wells Fargo Signify Business Cash (sampled from Wells Fargo card art)
  wells_fargo_signify_business_cash: { bg: 'linear-gradient(140deg,#2d2d31 0%,#4b494c 52%,#252428 100%)', h:
    WF('#fff') + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'SIGNIFY BUSINESS CASH', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // One Key Card (sampled from Wells Fargo (Expedia) card art)
  wells_fargo_one_key: { bg: 'linear-gradient(140deg,#30355e 0%,#2c315b 52%,#393e60 100%)', h:
    WF('#fff') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'ONE KEY', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // One Key+ Card (sampled from Wells Fargo (Expedia) card art)
  wells_fargo_one_key_plus: { bg: 'linear-gradient(140deg,#383838 0%,#313131 52%,#3c3c3d 100%)', h:
    WF('#fff') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'ONE KEY+', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Prime Business Card (sampled from US Bank (Amazon) card art)
  usbank_prime_business: { bg: 'linear-gradient(140deg,#3a3f45 0%,#151a1f 52%,#2d3135 100%)', h:
    USB('#fff', 6, 'left:6.5%;top:8%') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'PRIME BUSINESS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // US Bank Business Triple Cash Rewards (sampled from US Bank card art)
  usbank_business_triple_cash: { bg: 'linear-gradient(140deg,#b4bac6 0%,#b2b9c6 52%,#aeb5c2 100%)', ink: '#1b1c1f', h:
    USB('#1b1c1f', 6, 'left:6.5%;top:8%') + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'BUSINESS TRIPLE CASH REWARDS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + visa('', '#1b1c1f') },
  // JetBlue Plus Card (sampled from Barclays (JetBlue) card art)
  jetblue_plus: { bg: 'linear-gradient(140deg,#1e2744 0%,#1b3765 52%,#4c6080 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'JETBLUE', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'PLUS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // JetBlue Premier Card (sampled from Barclays (JetBlue) card art)
  jetblue_premier: { bg: 'linear-gradient(140deg,#9e9e9e 0%,#c2c2c2 52%,#afb1b3 100%)', ink: '#1b1c1f', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#1b1c1f', 'JETBLUE', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'PREMIER', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + mc('#1b1c1f') },
  // Chase Freedom Rise (sampled from Chase card art)
  chase_freedom_rise: { bg: 'linear-gradient(140deg,#33a1c5 0%,#1e3c6b 52%,#1c3354 100%)', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'FREEDOM RISE', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // United Gateway (sampled from Chase card art)
  united_gateway: { bg: 'linear-gradient(140deg,#96a4aa 0%,#8eaba4 52%,#839e99 100%)', ink: '#1b1c1f', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#1b1c1f')) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'UNITED GATEWAY', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + visa('', '#1b1c1f') },
  // United Quest (sampled from Chase card art)
  united_quest: { bg: 'linear-gradient(140deg,#563262 0%,#53265b 52%,#4b2b53 100%)', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'UNITED QUEST', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // United Club (sampled from Chase card art)
  united_club: { bg: 'linear-gradient(140deg,#464647 0%,#353637 52%,#333434 100%)', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'UNITED CLUB', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Southwest Rapid Rewards Plus (sampled from Chase card art)
  southwest_plus: { bg: 'linear-gradient(140deg,#969aa0 0%,#868e95 52%,#8d949a 100%)', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'SOUTHWEST RAPID REWARDS PLUS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Southwest Rapid Rewards Premier (sampled from Chase card art)
  southwest_premier: { bg: 'linear-gradient(140deg,#4e5582 0%,#273980 52%,#384885 100%)', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 2.7cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'SOUTHWEST RAPID REWARDS PREMIER', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Marriott Bonvoy Bold (sampled from Chase card art)
  marriott_bonvoy_bold: { bg: 'linear-gradient(140deg,#8f8284 0%,#7c8ba1 52%,#7b8ea4 100%)', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'MARRIOTT BONVOY BOLD', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // IHG One Rewards (sampled from Chase card art)
  ihg_one_rewards: { bg: 'linear-gradient(140deg,#dce0e3 0%,#e7e9eb 52%,#cdd1d4 100%)', ink: '#1b1c1f', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#1b1c1f')) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'IHG ONE REWARDS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + mc('#1b1c1f') },
  // Chase Ink Business Unlimited (sampled from Chase card art)
  chase_ink_unlimited: { bg: 'linear-gradient(140deg,#474d53 0%,#52575d 52%,#5f6469 100%)', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'INK BUSINESS UNLIMITED', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Chase Ink Business Premier (sampled from Chase card art)
  chase_ink_premier: { bg: 'linear-gradient(140deg,#1e222f 0%,#121d34 52%,#212737 100%)', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'INK BUSINESS PREMIER', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Chase Sapphire Reserve for Business (sampled from Chase card art)
  chase_sapphire_reserve_business: { bg: 'linear-gradient(140deg,#32364a 0%,#14203f 52%,#5e6675 100%)', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'SAPPHIRE RESERVE FOR BUSINESS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // United Business (sampled from Chase card art)
  united_business: { bg: 'linear-gradient(140deg,#245477 0%,#114a72 52%,#224a6e 100%)', h:
    at('left:6.5%;top:8%;width:6.4cqw;height:6.4cqw', CHASE('#fff')) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'UNITED BUSINESS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Citi Strata (sampled from Citi card art)
  citi_strata: { bg: 'linear-gradient(140deg,#c4c9cf 0%,#ced2d8 52%,#bfc3c7 100%)', ink: '#1b1c1f', h:
    CITI('#1b1c1f', 8) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'STRATA', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + mc('#1b1c1f') },
  // Citi Strata Elite (sampled from Citi card art)
  citi_strata_elite: { bg: 'linear-gradient(140deg,#1d1f1f 0%,#131514 52%,#3d3d3d 100%)', h:
    CITI('#fff', 8) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'STRATA ELITE', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // AAdvantage MileUp (sampled from Citi card art)
  citi_aadvantage_mileup: { bg: 'linear-gradient(140deg,#2e828b 0%,#158593 52%,#2e8690 100%)', h:
    CITI('#fff', 8) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'AADVANTAGE MILEUP', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Citi AAdvantage Executive (sampled from Citi card art)
  citi_aadvantage_executive: { bg: 'linear-gradient(140deg,#616363 0%,#585a5a 52%,#525354 100%)', h:
    CITI('#fff', 8) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'AADVANTAGE EXECUTIVE', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Citi AAdvantage Globe (sampled from Citi card art)
  citi_aadvantage_globe: { bg: 'linear-gradient(140deg,#475a5f 0%,#32464b 52%,#3e474d 100%)', h:
    CITI('#fff', 8) + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'AADVANTAGE GLOBE', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Capital One QuicksilverOne (sampled from Capital One card art)
  capital_one_quicksilverone: { bg: 'linear-gradient(140deg,#637b91 0%,#718ba2 52%,#89a1b4 100%)', h:
    C1('#fff') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'QUICKSILVERONE', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Capital One Spark Cash Plus (sampled from Capital One card art)
  capital_one_spark_cash_plus: { bg: 'linear-gradient(140deg,#63691a 0%,#061c06 52%,#031b03 100%)', h:
    C1('#fff') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'SPARK CASH PLUS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Capital One Venture X Business (sampled from Capital One card art)
  capital_one_venture_x_business: { bg: 'linear-gradient(140deg,#202f45 0%,#092847 52%,#043253 100%)', h:
    C1('#fff') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'VENTURE X BUSINESS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Capital One Venture Business (sampled from Capital One card art)
  capital_one_venture_business: { bg: 'linear-gradient(140deg,#133154 0%,#042145 52%,#02193b 100%)', h:
    C1('#fff') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'VENTURE BUSINESS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Capital One Spark 1.5% Cash Select (sampled from Capital One card art)
  capital_one_spark_cash_select: { bg: 'linear-gradient(140deg,#145135 0%,#00663b 52%,#053e23 100%)', h:
    C1('#fff') + at('left:7%;top:21%;max-width:86%;font:500 3.2cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'SPARK 1.5% CASH SELECT', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Discover it Student Cash Back (sampled from Discover card art)
  discover_it_student_cash_back: { bg: 'linear-gradient(140deg,#94d1e3 0%,#b8b6ce 52%,#897bb2 100%)', ink: '#1b1c1f', h:
    at('right:6%;top:8%;font:800 5.4cqw \'Archivo\';letter-spacing:-.01em;color:#1b1c1f', 'DISCOVER', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'IT STUDENT CASH BACK', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + visa('', '#1b1c1f') },
  // Discover it Secured (from notes from Discover card art)
  discover_it_secured: { bg: 'linear-gradient(140deg,#c9ced4 0%,#b4b8be 52%,#8c8f94 100%)', ink: '#1b1c1f', h:
    at('right:6%;top:8%;font:800 5.4cqw \'Archivo\';letter-spacing:-.01em;color:#1b1c1f', 'DISCOVER', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'IT SECURED', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + visa('', '#1b1c1f') },
  // Discover it Chrome (sampled from Discover card art)
  discover_it_chrome: { bg: 'linear-gradient(140deg,#b4b4b4 0%,#ada7a2 52%,#9d9d9d 100%)', ink: '#1b1c1f', h:
    at('right:6%;top:8%;font:800 5.4cqw \'Archivo\';letter-spacing:-.01em;color:#1b1c1f', 'DISCOVER', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#1b1c1f;opacity:.92', 'IT CHROME', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + visa('', '#1b1c1f') },
  // OnePay CashRewards Mastercard (from notes from Synchrony (Walmart OnePay) card art)
  walmart_onepay_cashrewards: { bg: 'linear-gradient(140deg,#424048 0%,#282c34 52%,#181a1e 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'WALMART ONEPAY', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'CASHREWARDS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Target Circle Card (Credit) (sampled from TD Bank (Target) card art)
  target_circle_credit_card: { bg: 'linear-gradient(140deg,#cb0000 0%,#cb0000 52%,#cb0000 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'TARGET', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'CIRCLE', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Target Mastercard (from notes from TD Bank (Target) card art)
  target_mastercard: { bg: 'linear-gradient(140deg,#d42132 0%,#be1e2d 52%,#941723 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'TARGET', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'TARGET', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Sam's Club Mastercard (from notes from Synchrony (Sam's Club) card art)
  sams_club_mastercard: { bg: 'linear-gradient(140deg,#2159b3 0%,#1e50a0 52%,#173e7c 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'SAM\'S CLUB', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'SAM\'S CLUB', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Navy Federal cashRewards (sampled from Navy Federal Credit Union card art)
  navy_federal_cashrewards: { bg: 'linear-gradient(140deg,#547744 0%,#567642 52%,#5e7c47 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'NAVY FEDERAL CREDIT UNION', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'CASHREWARDS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Navy Federal cashRewards Plus (sampled from Navy Federal Credit Union card art)
  navy_federal_cashrewards_plus: { bg: 'linear-gradient(140deg,#547744 0%,#567642 52%,#5e7c47 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'NAVY FEDERAL CREDIT UNION', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'CASHREWARDS PLUS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Navy Federal More Rewards American Express (sampled from Navy Federal Credit Union card art)
  navy_federal_more_rewards: { bg: 'linear-gradient(140deg,#21567b 0%,#0d4f77 52%,#0f6097 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'NAVY FEDERAL CREDIT UNION', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'MORE REWARDS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // PenFed Power Cash Rewards Visa Signature (from notes from PenFed Credit Union card art)
  penfed_power_cash_rewards: { bg: 'linear-gradient(140deg,#4d4048 0%,#282c34 52%,#181a1e 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'PENFED CREDIT UNION', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'POWER CASH REWARDS', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Bilt Obsidian Card (sampled from Cardless (Bilt) card art)
  bilt_obsidian: { bg: 'linear-gradient(140deg,#121415 0%,#141415 52%,#0d0f10 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'BILT', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'OBSIDIAN', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Bilt Palladium Card (sampled from Cardless (Bilt) card art)
  bilt_palladium: { bg: 'linear-gradient(140deg,#181512 0%,#615d57 52%,#100f0d 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'BILT', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'PALLADIUM', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // PayPal Cashback Mastercard (from notes from Synchrony (PayPal) card art)
  paypal_cashback_mastercard: { bg: 'linear-gradient(140deg,#404048 0%,#282c34 52%,#181a1e 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'PAYPAL', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'CASHBACK', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + mc('#fff') },
  // Gemini Credit Card (from notes from WebBank (Gemini) card art)
  gemini_credit_card: { bg: 'linear-gradient(140deg,#e1bc64 0%,#c9a85a 52%,#9c8346 100%)', ink: '#1b1c1f', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#1b1c1f', 'GEMINI', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#1b1c1f') + mc('#1b1c1f') },
  // Coinbase One Card (from notes from First Electronic Bank (Coinbase / Cardless) card art)
  coinbase_one_card: { bg: 'linear-gradient(140deg,#654048 0%,#282c34 52%,#181a1e 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'COINBASE / CARDLESS', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'ONE', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
  // Rakuten American Express Card (from notes from First Electronic Bank (Rakuten / Imprint) card art)
  rakuten_amex: { bg: 'linear-gradient(140deg,#744048 0%,#282c34 52%,#181a1e 100%)', h:
    at('left:6.5%;top:8.5%;font:700 4.2cqw \'Geist\';letter-spacing:.06em;color:#fff', 'RAKUTEN / IMPRINT', 't') + at('left:7%;top:21%;max-width:86%;font:500 3.9cqw/1.15 \'Geist\';letter-spacing:.14em;color:#fff;opacity:.92', 'RAKUTEN', 't') + chip(7.5, 44, 'silver') + nfc(22, 45.5, '#fff') + visa('', '#fff') },
};

let uid = 0;
const LOCK_MATERIALS = ['ink', 'white', 'stone', 'graphite', 'cream'];
const money = v => `${v >= 0 ? '+' : '-'}$${Math.abs(Math.round(v)).toLocaleString()}`;

window.CARD_ART = ART;

/** A card face by card id. `w` in px; omit it to size the card from CSS (--w). */
window.cardFaceHTML = function (id, w, name = '') {
  const a = ART[id];
  const size = w ? `--w:${w}px;` : '';
  if (!a) {   // a card added to the data before its face is drawn: plain card with its name
    const safe = String(name).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    return `<div class="cc" style="${size}background:linear-gradient(150deg,#4b4b50,#232326)" aria-hidden="true">${chip(8, 36, 'silver')}`
      + `<span class="t" style="left:8%;bottom:9%;max-width:84%;overflow:hidden;text-overflow:ellipsis;font:500 4.8cqw 'Geist',sans-serif">${safe}</span><span class="gloss"></span><span class="edge"></span></div>`;
  }
  const n = uid++;   // pattern ids must be unique per copy on the page
  const h = a.h.replace(/(id="|url\(#)(en\d+)/g, (m, p, id2) => `${p}${id2}_${n}`);
  return `<div class="cc" style="${size}background:${a.bg};color:${a.ink || '#fff'}" aria-hidden="true">${h}<span class="gloss"></span><span class="edge"></span></div>`;
};

/** The locked card: neutral material by rank, the value embossed where the number goes. */
window.lockedCardHTML = function (rank, net, w) {
  const size = w ? ` style="--w:${w}px"` : '';
  const m = LOCK_MATERIALS[(Math.max(1, rank) - 1) % LOCK_MATERIALS.length];
  return `<div class="lk ${m}"${size} aria-hidden="true"><span class="brand">CARDVALUE</span><span class="rank">#${rank}</span>`
    + `<span class="emv"></span><span class="val">${money(net)}<small>/YR</small></span><span class="nm">UNLOCK TO SEE</span><span class="lock"></span></div>`;
};
})();

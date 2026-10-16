/* By & By — "Action!" clapboard easter egg. Vanilla, no deps. */
(function () {
  if (document.querySelector('.bb-clap')) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = '' +
  '.bb-clap{position:fixed;right:18px;bottom:18px;z-index:900;display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:var(--font-body,sans-serif);pointer-events:none}' +
  '.bb-clap__btn{pointer-events:auto;width:58px;height:58px;border-radius:50%;border:2px solid #332a1c;background:#f3ecdd;cursor:pointer;display:grid;place-items:center;box-shadow:0 6px 18px rgba(51,42,28,.22);transition:transform .2s ease}' +
  '.bb-clap__btn:hover{transform:translateY(-2px) rotate(-4deg)}' +
  '.bb-clap__btn:focus-visible{outline:3px solid #a8532a;outline-offset:3px}' +
  '.bb-clap__arm{transform-origin:5px 13px;transform:rotate(-28deg);transition:transform .12s cubic-bezier(.6,0,.9,.4)}' +
  '.bb-clap.is-snap .bb-clap__arm{transform:rotate(0)}' +
  '.bb-clap.is-snap .bb-clap__btn{animation:bbShake .25s ease}' +
  '@keyframes bbShake{30%{transform:scale(.92)}70%{transform:scale(1.05)}}' +
  '.bb-clap__slate{pointer-events:auto;background:#332a1c;color:#f3ecdd;border-radius:6px;padding:14px 16px 12px;width:min(250px,calc(100vw - 36px));box-shadow:0 10px 28px rgba(51,42,28,.3);opacity:0;transform:translateY(10px) scale(.96);transition:opacity .25s ease,transform .25s ease;visibility:hidden}' +
  '.bb-clap.is-open .bb-clap__slate{opacity:1;transform:none;visibility:visible}' +
  '.bb-clap__stripes{height:8px;margin:-14px -16px 10px;border-radius:6px 6px 0 0;background:repeating-linear-gradient(-45deg,#f3ecdd 0 10px,#332a1c 10px 20px)}' +
  '.bb-clap__row{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#c9bfa8}' +
  '.bb-clap__row b{color:#e4a264;font-weight:600}' +
  '.bb-clap__line{font-family:var(--font-display,serif);font-style:italic;font-size:19px;line-height:1.25;margin:8px 0 10px}' +
  '.bb-clap__cta{color:#e4a264;font-size:13px;font-weight:600;text-decoration:none;border-bottom:1px solid currentColor}' +
  '.bb-clap__cta:focus-visible{outline:2px solid #e4a264;outline-offset:2px}' +
  '@media (max-width:600px){.bb-clap{right:12px;bottom:12px}.bb-clap__btn{width:50px;height:50px}}' +
  '@media (prefers-reduced-motion:reduce){.bb-clap__arm,.bb-clap__slate,.bb-clap__btn{transition:none!important;animation:none!important}}' +
  '@media print{.bb-clap{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var lines = [
    'Every story has its time.',
    'Quiet on set — this one\u2019s yours.',
    'Golden hour waits for no one.',
    'Rolling. Speed. Charleston.',
    'One shoot. Twelve assets.',
    'That\u2019s a wrap. Let\u2019s make yours.'
  ];
  var wrap = document.createElement('div');
  wrap.className = 'bb-clap';
  wrap.innerHTML =
    '<div class="bb-clap__slate" id="bb-slate" role="status" aria-live="polite">' +
      '<div class="bb-clap__stripes" aria-hidden="true"></div>' +
      '<div class="bb-clap__row"><span>By &amp; By</span><span>Scene <b data-s>1</b> · Take <b data-t>1</b></span></div>' +
      '<p class="bb-clap__line" data-l></p>' +
      '<a class="bb-clap__cta" href="contact.html">Roll on your project →</a>' +
    '</div>' +
    '<button class="bb-clap__btn" type="button" aria-label="Clap the slate — action!" aria-expanded="false" aria-controls="bb-slate">' +
      '<svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">' +
        '<rect x="4" y="13" width="24" height="15" rx="2" fill="#332a1c"/>' +
        '<g class="bb-clap__arm"><rect x="4" y="7" width="24" height="5" rx="1" fill="#332a1c"/>' +
        '<path d="M8 7l3 5M14 7l3 5M20 7l3 5" stroke="#f3ecdd" stroke-width="2"/></g>' +
        '<circle cx="16" cy="20.5" r="3" fill="#a8532a"/>' +
      '</svg></button>';
  document.body.appendChild(wrap);

  var btn = wrap.querySelector('.bb-clap__btn');
  var sEl = wrap.querySelector('[data-s]'), tEl = wrap.querySelector('[data-t]'), lEl = wrap.querySelector('[data-l]');
  var take = 0, scene = 1, ctx, timer;

  function click() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      var len = Math.floor(ctx.sampleRate * 0.05), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
      var src = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 1800; g.gain.value = 0.35;
      src.buffer = buf; src.connect(f); f.connect(g); g.connect(ctx.destination); src.start();
    } catch (e) {}
  }
  function close() { wrap.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function () {
    take++; if (take > 3) { take = 1; scene++; }
    sEl.textContent = scene; tEl.textContent = take;
    lEl.textContent = lines[(scene * 3 + take - 4) % lines.length];
    wrap.classList.remove('is-snap'); void wrap.offsetWidth;
    wrap.classList.add('is-snap', 'is-open'); btn.setAttribute('aria-expanded', 'true');
    click();
    setTimeout(function () { wrap.classList.remove('is-snap'); }, reduce ? 0 : 260);
    clearTimeout(timer); timer = setTimeout(close, 6000);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();

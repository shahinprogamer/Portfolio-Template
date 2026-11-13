/* ===== Shared behaviour: reveal, spotlight, nav, ripple, counters, progress ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const toast = (msg) => { let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); } t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2800); };
(function base() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // reveal on scroll
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  window.observeReveal = (root = document) => $$('[data-r]:not(.in)', root).forEach((el) => io.observe(el));
  observeReveal();
  // counters
  const co = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; co.unobserve(e.target); const el = e.target, to = +el.dataset.count, suf = el.dataset.suf || ''; if (reduce) { el.textContent = to + suf; return; } const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / 1600), v = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(to * v).toLocaleString() + suf; if (k < 1) requestAnimationFrame(f); })(t0); }), { threshold: .6 });
  $$('[data-count]').forEach((el) => co.observe(el));
  // spotlight + progress + nav state
  const spot = $('.spot'), bar = $('.bar'), nav = $('.nav');
  let mx = innerWidth / 2, my = innerHeight / 3, sx = mx, sy = my;
  addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function loop() { sx += (mx - sx) * .12; sy += (my - sy) * .12; if (spot) spot.style.transform = `translate(${sx}px,${sy}px)`; requestAnimationFrame(loop); })();
  const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; if (nav) nav.classList.toggle('sm', scrollY > 30); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // nav links highlight + burger
  const links = $$('.links a[href^="#"]');
  const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { threshold: .5 });
  links.forEach((a) => { const s = $(a.getAttribute('href')); if (s) so.observe(s); a.addEventListener('click', () => $('.links')?.classList.remove('open')); });
  $('.burger')?.addEventListener('click', (e) => { const o = $('.links').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); });
  // ripple
  document.addEventListener('pointerdown', (e) => { const b = e.target.closest('.btn'); if (!b) return; const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), d = document.createElement('span'); d.className = 'rp'; d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`; b.append(d); setTimeout(() => d.remove(), 750); });
  // tilt
  if (!reduce && matchMedia('(hover:hover)').matches) document.addEventListener('pointermove', (e) => { const t = e.target.closest?.('[data-tilt]'); $$('[data-tilt].tilting').forEach((x) => { if (x !== t) { x.classList.remove('tilting'); x.style.transform = ''; } }); if (!t) return; const r = t.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; t.classList.add('tilting'); t.style.transform = `perspective(900px) rotateX(${-py * 7}deg) rotateY(${px * 9}deg) translateY(-6px)`; });
  $$('[data-year]').forEach((y) => (y.textContent = new Date().getFullYear()));
})();
/* ===== Demo 6: theme toggle, typing role, projects, skills ===== */
(function () {
  const root = document.documentElement;
  $('#theme').addEventListener('click', () => { const next = root.dataset.theme === 'light' ? 'dark' : 'light'; root.dataset.theme = next; try { localStorage.setItem('tpl-theme', next); } catch {} toast(next === 'light' ? 'Light mode' : 'Dark mode'); });
  // typing effect
  const words = ['digital products', 'smooth interfaces', 'fast websites', 'brand experiences'], el = $('#role'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) { let w = 0, c = 0, del = false; (function tick() { const word = words[w]; el.textContent = word.slice(0, c); if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); } if (del && c === 0) { del = false; w = (w + 1) % words.length; } c += del ? -1 : 1; setTimeout(tick, del ? 38 : 85); })(); }
  const P = [['🛍️', 'Aurora Shop', 'E-commerce redesign that lifted conversions by 40%.', ['UI', 'React', 'Stripe'], 330], ['📊', 'Pulse Dashboard', 'Analytics dashboard with live charts and dark mode.', ['Charts', 'JS', 'CSS'], 200], ['🎵', 'Wave Player', 'A minimal music player with animated visualiser.', ['Audio', 'Canvas'], 280], ['✈️', 'Trip Planner', 'Plan itineraries on an interactive map.', ['Maps', 'Node.js'], 160], ['🏋️', 'FitTrack', 'Mobile-first workout tracker with progress rings.', ['PWA', 'CSS'], 20], ['🎓', 'LearnHub', 'Course platform with lesson progress and quizzes.', ['Vue', 'API'], 245]];
  $('#proj').innerHTML = P.map(([e, t, d, tags, h], i) => `<article class="card pj" data-tilt data-r style="--h:${h};--d:${(i % 3) * 0.1}s"><div class="art"><span>${e}</span></div><div class="bd"><h3>${t}</h3><p>${d}</p><div class="tags">${tags.map((x) => `<span>${x}</span>`).join('')}</div></div></article>`).join('');
  const S = [['HTML5 & CSS3', 95], ['JavaScript', 90], ['React', 82], ['Node.js', 70], ['UI / UX Design', 85], ['Accessibility', 88]];
  $('#sk').innerHTML = S.map(([n, v], i) => `<div class="sk" data-r style="--w:${v}%;--d:${i * 0.07}s"><div><span>${n}</span><span>${v}%</span></div><div class="tr"><i></i></div></div>`).join('');
  observeReveal();
})();

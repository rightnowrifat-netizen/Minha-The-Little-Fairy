/* ============================================================
   EDIT HERE — names, music, secret message, dates
   Photos:     swap files in /images (minha1.webp … minha5.webp) or edit src in index.html
   Nicknames / favorite things / songs / texts: edit directly in index.html (marked with comments)
   Colors:     top of style.css
   ============================================================ */
const SITE_CONFIG = {
  name: "Minha",
  fullName: "Samiya Zannat Minha",
  creator: "Redwan Rifat",
  music: "audio/favorite-song.mp3",
  // DATE (optional): e.g. "Since 12 March 2025". Leave "" to hide.
  specialDate: "",
  // SECRET MESSAGE shown with the typewriter effect
  secretMessage:
`Minha,

You may never fully realize how deeply you are loved.

But if this little website could say one thing for me, it would simply be this:

You are one of the most beautiful chapters my heart has ever written.

And if life is a book, I hope your name stays somewhere in my favorite pages.

— Redwan Rifat ❤️`
};

(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- config hydrate ---------- */
  $$("[data-cfg]").forEach(el => { if (SITE_CONFIG[el.dataset.cfg]) el.textContent = SITE_CONFIG[el.dataset.cfg]; });
  if (SITE_CONFIG.specialDate) { const f = $(".foot"); f.append(" · " + SITE_CONFIG.specialDate); }

  /* ---------- scroll lock (gate + overlays) ---------- */
  let entered = false, openLayers = 0;
  const lock = on => {
    openLayers += on ? 1 : -1;
    document.body.classList.toggle("locked", !entered || openLayers > 0);
  };

  /* ---------- enter ---------- */
  $("#enter").addEventListener("click", () => {
    entered = true;
    document.body.classList.toggle("locked", openLayers > 0);
    $("#names").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- nav ---------- */
  const burger = $("#burger"), menu = $("#menu").parentElement;
  const setMenu = o => { menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  $$("#menu a").forEach(a => a.addEventListener("click", e => {
    setMenu(false);
    if (!entered) { // let people use the menu without pressing the button first
      entered = true; document.body.classList.toggle("locked", openLayers > 0);
    }
  }));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".rv").forEach(el => io.observe(el));

  /* ---------- parallax ---------- */
  const par = $$("[data-par]");
  let tick = false;
  const doPar = () => {
    tick = false;
    const vh = innerHeight;
    par.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.par);
      el.style.transform = `translate3d(0,${(-off).toFixed(1)}px,0)`;
    });
  };
  if (!reduce) {
    addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(doPar); } }, { passive: true });
    addEventListener("resize", doPar); doPar();
  }

  /* ---------- lightbox ---------- */
  const lb = $("#lb"), lbImg = $("#lbImg"), shots = $$("[data-lb]");
  let li = 0;
  const showShot = i => {
    li = (i + shots.length) % shots.length;
    lbImg.src = shots[li].currentSrc || shots[li].src;
    lbImg.alt = shots[li].alt;
  };
  const openLb = i => { showShot(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); lock(true); };
  const closeLb = () => { if (lb.classList.contains("open")) { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); lock(false); } };
  shots.forEach((im, i) => im.addEventListener("click", () => openLb(i)));
  $("#lbP").addEventListener("click", e => { e.stopPropagation(); showShot(li - 1); });
  $("#lbN").addEventListener("click", e => { e.stopPropagation(); showShot(li + 1); });
  lb.addEventListener("click", e => { if (e.target !== lbImg) closeLb(); });

  /* ---------- secret message ---------- */
  const sec = $("#secret"), tw = $("#tw"), theEnd = $("#theEnd");
  let typer = null;
  const openSecret = () => {
    sec.classList.add("open"); sec.setAttribute("aria-hidden", "false"); lock(true);
    tw.textContent = ""; theEnd.classList.remove("show");
    const msg = SITE_CONFIG.secretMessage; let i = 0;
    clearInterval(typer);
    typer = setInterval(() => {
      tw.textContent = msg.slice(0, ++i);
      if (i >= msg.length) { clearInterval(typer); setTimeout(() => theEnd.classList.add("show"), 1000); }
    }, reduce ? 4 : 55);
  };
  const closeSecret = () => {
    if (!sec.classList.contains("open")) return;
    clearInterval(typer); sec.classList.remove("open"); sec.setAttribute("aria-hidden", "true"); lock(false);
  };
  $("#secretBtn").addEventListener("click", openSecret);
  $$("[data-close]").forEach(b => b.addEventListener("click", e => { e.stopPropagation(); closeLb(); closeSecret(); }));
  addEventListener("keydown", e => {
    if (e.key === "Escape") { closeLb(); closeSecret(); setMenu(false); }
    if (lb.classList.contains("open")) { if (e.key === "ArrowLeft") showShot(li - 1); if (e.key === "ArrowRight") showShot(li + 1); }
  });

  /* ---------- music (never autoplays) ---------- */
  const mbtn = $("#mbtn"), toast = $("#toast");
  let audio = null, tt;
  const say = t => { toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); };
  mbtn.addEventListener("click", () => {
    if (!audio) {
      audio = new Audio(SITE_CONFIG.music); audio.loop = true; audio.volume = 0.6;
      audio.addEventListener("error", () => { mbtn.classList.remove("on"); say("Add your audio file at " + SITE_CONFIG.music); });
    }
    if (audio.paused) {
      audio.play().then(() => { mbtn.classList.add("on"); mbtn.setAttribute("aria-label", "Pause music"); })
        .catch(() => { mbtn.classList.remove("on"); say("Add your audio file at " + SITE_CONFIG.music); });
    } else { audio.pause(); mbtn.classList.remove("on"); mbtn.setAttribute("aria-label", "Play music"); }
  });

  /* ---------- particles (dust + occasional hearts + bursts) ---------- */
  const cv = $("#fx"), cx = cv.getContext("2d");
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0; const P = [];
  const size = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener("resize", size);
  const cols = ["243,201,209", "217,138,154", "201,166,107"];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const heart = (x, y, s) => {
    cx.beginPath(); cx.moveTo(x, y + s * .3);
    cx.bezierCurveTo(x, y - s * .3, x - s, y - s * .3, x - s, y + s * .3);
    cx.bezierCurveTo(x - s, y + s * .8, x, y + s, x, y + s * 1.3);
    cx.bezierCurveTo(x, y + s, x + s, y + s * .8, x + s, y + s * .3);
    cx.bezierCurveTo(x + s, y - s * .3, x, y - s * .3, x, y + s * .3); cx.fill();
  };
  const dust = Array.from({ length: innerWidth < 700 ? 18 : 36 }, () => ({ x: rnd(0, W), y: rnd(0, H), r: rnd(.5, 1.6), vx: rnd(-.12, .12), vy: rnd(-.2, -.04), a: rnd(.15, .5), c: cols[2] }));
  const spawnHeart = () => P.push({ h: 1, x: rnd(0, W), y: H + 20, vx: rnd(-.2, .2), vy: rnd(-.7, -.4), s: rnd(3, 6), a: .35, life: 0, max: rnd(500, 800), c: cols[Math.random() < .6 ? 1 : 0], ph: rnd(0, 6.28), g: 0 });
  const burst = (x, y, n) => {
    for (let i = 0; i < n; i++) {
      const an = rnd(0, 6.28), sp = rnd(2, 8);
      P.push({ h: Math.random() < .45, x, y, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp - 2, s: rnd(2, 6), a: 1, life: 0, max: rnd(70, 140), c: cols[i % 3], ph: 0, g: .09 });
    }
  };
  let last = 0, hearts = 0;
  const loop = t => {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    cx.clearRect(0, 0, W, H);
    dust.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.y < -5) { d.y = H + 5; d.x = rnd(0, W); } if (d.x < -5) d.x = W + 5; if (d.x > W + 5) d.x = -5;
      cx.fillStyle = `rgba(${d.c},${d.a})`; cx.beginPath(); cx.arc(d.x, d.y, d.r, 0, 6.28); cx.fill();
    });
    if (t - last > 2800 && hearts < 5) { last = t; spawnHeart(); }
    hearts = 0;
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i]; p.life++;
      p.vy += p.g; p.x += p.vx + (p.g ? 0 : Math.sin(p.life / 40 + p.ph) * .3); p.y += p.vy;
      const f = p.life / p.max;
      if (f >= 1 || p.y < -30 || p.y > H + 60) { P.splice(i, 1); continue; }
      if (p.h && !p.g) hearts++;
      cx.fillStyle = `rgba(${p.c},${p.a * Math.min(1, (1 - f) * 2.5, f * 6 + .2)})`;
      if (p.h) heart(p.x, p.y, p.s); else { cx.beginPath(); cx.arc(p.x, p.y, p.s / 2, 0, 6.28); cx.fill(); }
    }
  };
  if (!reduce) requestAnimationFrame(loop);

  /* ---------- love score ---------- */
  const sBtn = $("#scoreBtn"), sRes = $("#scoreRes");
  sBtn.addEventListener("click", () => {
    sBtn.disabled = true; sBtn.textContent = "Counting every little thing…";
    setTimeout(() => {
      sBtn.hidden = true; sRes.hidden = false;
      sRes.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      requestAnimationFrame(() => requestAnimationFrame(() => sRes.classList.add("show")));
      if (!reduce) setTimeout(() => {
        const b = sRes.getBoundingClientRect(), cxp = b.left + b.width / 2, cyp = b.top + b.height / 2;
        burst(cxp, cyp, 110); setTimeout(() => burst(cxp, cyp, 60), 450);
      }, 700);
    }, 1600);
  });

  /* ---------- custom cursor (desktop only) ---------- */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
    const dot = document.createElement("div"), ring = document.createElement("div");
    dot.className = "cur"; ring.className = "cur-r"; document.body.append(dot, ring);
    let mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    (function f() { rx += (mx - rx) * .15; ry += (my - ry) * .15; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(f); })();
  }
})();

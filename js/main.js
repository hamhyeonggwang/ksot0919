// hero 마우스 반짝임
(function () {
  const hero = document.querySelector('.hero');
  const canvas = document.querySelector('.hero-sparkle');
  const overlay = document.querySelector('.hero-overlay');
  if (!hero || !canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let mx = -999, my = -999, tx = -999, ty = -999;
  let lastSpawn = 0, lastX = -999, lastY = -999;
  let rafId = null;
  let heroVisible = true;
  let tabVisible = true;
  const sparks = [];
  const MAX = 40;

  function resize() {
    W = canvas.width = hero.clientWidth;
    H = canvas.height = hero.clientHeight;
  }

  function setCursor(x, y) {
    tx = x; ty = y;
    if (overlay) {
      overlay.style.setProperty('--mx', x + 'px');
      overlay.style.setProperty('--my', y + 'px');
    }
  }

  function clearCursor() {
    tx = ty = -999;
    if (overlay) {
      overlay.style.setProperty('--mx', '-999px');
      overlay.style.setProperty('--my', '-999px');
    }
  }

  function spawn(x, y) {
    for (let i = 0; i < 2; i++) {
      if (sparks.length >= MAX) sparks.shift();
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * 16;
      sparks.push({
        x: x + Math.cos(a) * d,
        y: y + Math.sin(a) * d,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.15,
        life: 1,
        decay: 0.018 + Math.random() * 0.018,
        size: Math.random() * 1.8 + 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function needsFrame() {
    return heroVisible && tabVisible && (sparks.length > 0 || tx >= 0);
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    if (tx >= 0) {
      mx += (tx - mx) * 0.14;
      my += (ty - my) * 0.14;
      const g = ctx.createRadialGradient(mx, my, 0, mx, my, 88);
      g.addColorStop(0, 'rgba(255,255,255,0.13)');
      g.addColorStop(0.45, 'rgba(255,107,58,0.07)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(mx, my, 88, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }

      const twinkle = 0.45 + Math.sin(t * 0.009 + s.phase) * 0.55;
      const a = s.life * twinkle;
      const r = s.size * s.life;

      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${(a * 0.9).toFixed(2)})`;
      ctx.fill();

      if (s.size > 1.6) {
        const len = 3.5 * s.life;
        ctx.strokeStyle = `rgba(255,107,58,${(a * 0.45).toFixed(2)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(s.x - len, s.y); ctx.lineTo(s.x + len, s.y);
        ctx.moveTo(s.x, s.y - len); ctx.lineTo(s.x, s.y + len);
        ctx.stroke();
      }
    }

    if (needsFrame()) {
      rafId = requestAnimationFrame(draw);
    } else {
      rafId = null;
    }
  }

  function startLoop() {
    if (rafId === null && needsFrame()) {
      rafId = requestAnimationFrame(draw);
    }
  }

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setCursor(x, y);
    const now = performance.now();
    if (now - lastSpawn > 28 && Math.hypot(x - lastX, y - lastY) > 3) {
      spawn(x, y);
      lastSpawn = now;
      lastX = x;
      lastY = y;
    }
    startLoop();
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    clearCursor();
    startLoop();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    tabVisible = !document.hidden;
    if (!tabVisible) {
      stopLoop();
      ctx.clearRect(0, 0, W, H);
    } else {
      startLoop();
    }
  });

  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    if (!heroVisible) {
      stopLoop();
      ctx.clearRect(0, 0, W, H);
      clearCursor();
      sparks.length = 0;
    } else {
      startLoop();
    }
  }, { threshold: 0.05 }).observe(hero);

  new ResizeObserver(resize).observe(hero);
  resize();
})();

// 아코디언 토글
document.querySelectorAll('.accordion-toggle, .timetable-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const bodyId = btn.getAttribute('aria-controls');
    const body = document.getElementById(bodyId);
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isOpen);
    body.classList.toggle('open', !isOpen);
  });
});

// 모바일 네비
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!nav || !toggle || !menu) return;

  function setNavOpen(open) {
    nav.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => setNavOpen(!nav.classList.contains('nav-open')));
  backdrop?.addEventListener('click', () => setNavOpen(false));
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) setNavOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNavOpen(false);
  });
})();

// 네비 스크롤 효과
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// reveal 애니메이션
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const delay = e.target.closest('.values-grid, .sched-grid, .prog-grid')
        ? Array.from(e.target.parentNode.children).indexOf(e.target) * 80 : 0;
      setTimeout(() => e.target.classList.add('visible'), delay);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 뉴럴 네트워크 캔버스
(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const mouse = { x: -9999, y: -9999 };
  const COUNT = 38;   // 앰비언트 파티클 (배경)
  const MAX_D = 95;
  const particles = [];
  let nodePositions = [];

  // 도메인별 스트림 색상 (HTML DOM 순서 일치: practice, education, community, research)
  const STREAM_COLORS = [
    [61, 184, 112],   // practice  — 초록
    [255, 122, 77],   // education — 오렌지
    [167, 139, 250],  // community — 보라
    [91, 143, 249],   // research  — 파랑
  ];
  const STREAM_N = 6; // 스트림당 파티클 수
  const streams = STREAM_COLORS.map((_, si) =>
    Array.from({ length: STREAM_N }, (__, j) => ({
      t: j / STREAM_N,
      speed: 0.0028 + Math.random() * 0.0018,
      size: Math.random() * 1.6 + 0.7,
      cpOff: (Math.random() - 0.5) * 65,
    }))
  );

  function bezier(t, p0, cp, p2) {
    const m = 1 - t;
    return {
      x: m * m * p0.x + 2 * m * t * cp.x + t * t * p2.x,
      y: m * m * p0.y + 2 * m * t * cp.y + t * t * p2.y,
    };
  }
  function ctrlPt(p0, p2, off) {
    const mx = (p0.x + p2.x) / 2, my = (p0.y + p2.y) / 2;
    const dx = p2.x - p0.x, dy = p2.y - p0.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: mx + (-dy / len) * off, y: my + (dx / len) * off };
  }

  function updateNodePositions() {
    const cr = canvas.getBoundingClientRect();
    if (!cr.width) return;
    nodePositions = Array.from(document.querySelectorAll('.dn-core')).map(n => {
      const r = n.getBoundingClientRect();
      return {
        x: (r.left + r.width / 2 - cr.left) * (W / cr.width),
        y: (r.top + r.height / 2 - cr.top) * (H / cr.height),
      };
    });
  }

  class Particle {
    constructor() { this.init(true); }
    init(random) {
      this.x = random ? Math.random() * W : (Math.random() > 0.5 ? -5 : W + 5);
      this.y = random ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
      this.r = Math.random() * 1.6 + 0.7;
      this.baseA = Math.random() * 0.4 + 0.15;
      this.phase = Math.random() * Math.PI * 2;
    }
    update(t) {
      // 마우스 반발
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 90 && d > 0) {
        const f = ((90 - d) / 90) * 2.8;
        this.x += (dx / d) * f;
        this.y += (dy / d) * f;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.init(false);
    }
    draw(t) {
      const a = this.baseA + Math.sin(t * 0.0009 + this.phase) * 0.13;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
      ctx.fill();
    }
  }

  function resize() {
    const p = canvas.parentElement;
    W = canvas.width = p.clientWidth || 460;
    H = canvas.height = p.clientHeight || 460;
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < MAX_D) {
          const a = ((1 - d / MAX_D) * 0.3).toFixed(2);
          // 중심 거리에 따라 오렌지↔블루 혼합
          const mx = (particles[i].x + particles[j].x) / 2;
          const my = (particles[i].y + particles[j].y) / 2;
          const ratio = Math.min(Math.hypot(mx - W / 2, my - H / 2) / (W * 0.5), 1);
          const r = Math.round(232 + (22 - 232) * ratio);
          const g = Math.round(80);
          const b = Math.round(31 + (200 - 31) * ratio);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
  }

  function drawCenter(t) {
    const cx = W / 2, cy = H / 2;
    const pulse = Math.sin(t * 0.0013) * 5;
    const radius = Math.min(W, H) * 0.27 + pulse;

    // 글로우
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.9);
    g.addColorStop(0, 'rgba(232,80,31,0.22)');
    g.addColorStop(0.45, 'rgba(92,46,153,0.1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.9, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    // 점선 링
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.13)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 9]);
    ctx.stroke();
    ctx.setLineDash([]);

    // AI 텍스트
    const fs = Math.round(radius * 0.72);
    ctx.font = `800 ${fs}px "Sora", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillText('AI', cx, cy);
  }

  function drawStreams() {
    if (!nodePositions.length) return;
    const src = { x: W / 2, y: H / 2 };
    streams.forEach((stream, si) => {
      const tgt = nodePositions[si];
      if (!tgt) return;
      const [r, g, b] = STREAM_COLORS[si];
      stream.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) {
          p.t -= 1;
          p.speed = 0.0028 + Math.random() * 0.0018;
          p.size  = Math.random() * 1.6 + 0.7;
          p.cpOff = (Math.random() - 0.5) * 65;
        }
        const cp  = ctrlPt(src, tgt, p.cpOff);
        const a0  = p.t < 0.14 ? p.t / 0.14 : p.t > 0.86 ? (1 - p.t) / 0.14 : 1;
        // 헤드 + 꼬리 3단
        for (let k = 0; k < 4; k++) {
          const tt = Math.max(0, p.t - k * 0.028);
          const pos = bezier(tt, src, cp, tgt);
          const a  = (a0 * (1 - k * 0.24)).toFixed(2);
          const sz = p.size * (1 - k * 0.22);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, sz, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
          ctx.fill();
        }
      });
    });
  }

  function animate(t) {
    ctx.clearRect(0, 0, W, H);
    drawCenter(t);
    drawStreams();
    drawLines();
    particles.forEach(p => { p.update(t); p.draw(t); });
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (W / rect.width);
    mouse.y = (e.clientY - rect.top) * (H / rect.height);
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

  new ResizeObserver(() => { resize(); setTimeout(updateNodePositions, 50); }).observe(canvas.parentElement);
  resize();
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  setTimeout(updateNodePositions, 100);
  requestAnimationFrame(animate);
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

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

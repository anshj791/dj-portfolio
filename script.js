// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

// Cursor scale on hover
document.querySelectorAll('a, button, .project-card, .service-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
    cursor.style.background = '#C9A96E';
    ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = '#B5714A';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

// Dynamic years of experience
const startYear = 2024;
const currentYear = new Date().getFullYear();
const yearsExp = currentYear - startYear;
const yearsExpEl = document.getElementById('yearsExp');
if (yearsExpEl) {
  yearsExpEl.textContent = yearsExp + '+';
}

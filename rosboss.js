// RosBoss: блик на хромированном заголовке следует за мышкой, как отражение на полированном диске.
// На телефоне и когда мышь не над первым экраном – блик пробегает сам каждые несколько секунд.
(() => {
  const el = document.querySelector('.s-hero h1 .chrome');
  const hero = document.querySelector('.s-hero');
  if (!el || !hero) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.classList.add('is-live');

  let x = -30, target = -30, follow = false, t0 = performance.now();
  const PERIOD = 6000, RUN = 2700; // цикл и сама пробежка, мс

  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      target = Math.max(-20, Math.min(120, ((e.clientX - r.left) / r.width) * 100));
      follow = true;
    });
    hero.addEventListener('pointerleave', () => { follow = false; t0 = performance.now(); });
  }

  const ease = (p) => (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
  const tick = (now) => {
    if (!follow) {
      const p = ((now - t0) % PERIOD) / RUN;
      target = p <= 1 ? -30 + 160 * ease(p) : 130;
    }
    x += (target - x) * (follow ? 0.12 : 0.35);
    el.style.setProperty('--glint', x.toFixed(1) + '%');
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

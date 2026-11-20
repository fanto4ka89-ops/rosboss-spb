// RosBoss: «литой диск» в заголовке и живые карточки отзывов.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // --- Заголовок: колесо медленно крутится, а под мышкой «прокатывается» вслед за ней ---
  const el = document.querySelector('.s-hero h1 .chrome');
  const hero = document.querySelector('.s-hero');
  if (el && hero && !reduce) {
    el.classList.add('is-live');
    let angle = 0, speed = 0.4, boost = 0, lastX = null; // градусы за кадр
    if (finePointer) {
      hero.addEventListener('pointermove', (e) => {
        if (lastX !== null) boost += (e.clientX - lastX) * 0.6; // движение мыши вправо – колесо катится вперёд
        lastX = e.clientX;
      });
      hero.addEventListener('pointerleave', () => { lastX = null; });
    }
    const tick = () => {
      boost *= 0.9; // инерция, как у раскрученного колеса
      angle = (angle + speed + boost * 0.1) % 360;
      el.style.setProperty('--spin', angle.toFixed(2) + 'deg');
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // --- Отзывы: наклон к курсору и блик под ним ---
  if (finePointer && !reduce) {
    document.querySelectorAll('.s-reviews li').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        card.style.setProperty('--ry', ((px - 0.5) * 6).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 5).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }
})();

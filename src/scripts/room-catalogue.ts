const filters = document.querySelector<HTMLElement>('[data-room-filters]');
const grid = document.querySelector<HTMLElement>('[data-catalogue-grid]');
if (filters && grid) {
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-room-card]'));
  const buttons = Array.from(filters.querySelectorAll<HTMLButtonElement>('button'));
  const count = filters.querySelector<HTMLElement>('[data-filter-count]');
  filters.hidden = false;
  buttons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filterValue;
    let visible = 0;
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach((card) => {
      card.hidden = filter !== undefined && card.dataset.roomFilter !== filter;
      if (!card.hidden) visible++;
    });
    if (count) count.textContent = `${visible} ${visible === 1 ? 'view' : 'views'}`;
    // Notify ScrollTrigger and ScrollSmoother after the document height changes.
    document.dispatchEvent(new Event('marlin:layout-change'));
  }));
}

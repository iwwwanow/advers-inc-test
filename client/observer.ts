import { Meteor } from 'meteor/meteor';

export function startObserver(): void {
  const container = document.querySelector('tbody');
  if (!container) return;

  const observer = new MutationObserver((mutations) => {
    const cells = new Set<HTMLElement>();

    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            node.querySelectorAll<HTMLElement>('td.__t').forEach((el) => cells.add(el));
          }
        });
      } else if (
        mutation.type === 'characterData' &&
        mutation.target.parentElement instanceof HTMLElement &&
        mutation.target.parentElement.classList.contains('__t')
      ) {
        cells.add(mutation.target.parentElement);
      }
    }

    cells.forEach((cell) => {
      if (cell.dataset['translated']) return;
      const token = cell.textContent?.trim();
      if (!token) return;

      cell.dataset['translated'] = '1';
      Meteor.call('translate', token, (err: Error | null, result: string) => {
        if (!err) cell.textContent = result;
      });
    });
  });

  observer.observe(container, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

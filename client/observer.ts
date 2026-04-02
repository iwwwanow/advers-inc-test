import { Meteor } from 'meteor/meteor';

// token → translation (or same token if not found)
const cache = new Map<string, string>();
// tokens currently being fetched from server
const fetching = new Set<string>();

function applyToCell(cell: HTMLElement): void {
  const token = cell.textContent?.trim();
  if (!token) return;

  if (cache.has(token)) {
    const translation = cache.get(token)!;
    if (translation !== token) {
      cell.textContent = translation;
    }
    return;
  }

  if (fetching.has(token)) return;

  fetching.add(token);
  Meteor.call('translate', token, (err: Error | null, result: string) => {
    fetching.delete(token);
    if (!err) {
      cache.set(token, result);
      if (result !== token) {
        // Re-query DOM at callback time — old React elements may have been replaced
        document.querySelectorAll<HTMLElement>('td.__t').forEach((c) => {
          if (c.textContent?.trim() === token) {
            c.textContent = result;
          }
        });
      }
    }
  });
}

export function startObserver(): void {
  const container = document.querySelector('tbody');
  if (!container) return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            node.querySelectorAll<HTMLElement>('td.__t').forEach(applyToCell);
          }
        });
      } else if (
        mutation.type === 'characterData' &&
        mutation.target.parentElement instanceof HTMLElement &&
        mutation.target.parentElement.classList.contains('__t')
      ) {
        applyToCell(mutation.target.parentElement);
      }
    }
  });

  observer.observe(container, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

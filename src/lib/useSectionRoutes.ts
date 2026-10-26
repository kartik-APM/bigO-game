import { useEffect } from 'react';
import { pathForSection, pathFromLegacyHash, sectionIdFromPath } from './routes';

const sectionEl = (id: string) =>
  document.querySelector<HTMLElement>(`section.cmd#${CSS.escape(id)}`);

function focusWithoutScroll(el: HTMLElement | null) {
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/** Scrolls to the section for `pathname`. Returns false if there is no such section. */
function show(pathname: string, focus: boolean): boolean {
  const id = sectionIdFromPath(pathname);
  if (id === '') {
    window.scrollTo(0, 0);
    if (focus) focusWithoutScroll(document.getElementById('title'));
    return true;
  }
  const section = id ? sectionEl(id) : null;
  if (!section) return false;
  section.scrollIntoView({ block: 'start' });
  if (focus) focusWithoutScroll(section.querySelector('h2'));
  return true;
}

/**
 * Same-page navigation with real paths: links to "/<section>" update the
 * address bar without reloading, back/forward scroll between sections, and a
 * pasted link like /leaderboard opens at that section.
 */
export function useSectionRoutes() {
  useEffect(() => {
    const { search, hash } = window.location;

    // section scrolling is handled here; stop the browser restoring an older position on back/forward
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    // old "#section" links become "/section"
    const legacy = pathFromLegacyHash(hash, (id) => sectionEl(id) !== null);
    if (legacy) window.history.replaceState(window.history.state, '', legacy + search);

    // unknown paths fall back to the top of the page
    if (!show(window.location.pathname, false)) {
      window.history.replaceState(window.history.state, '', '/' + search);
      window.scrollTo(0, 0);
    }

    // web fonts can shift the layout after the first scroll; settle it once
    const target = window.location.pathname;
    const settledY = window.scrollY;
    void document.fonts?.ready.then(() => {
      if (window.location.pathname === target && window.scrollY === settledY) show(target, false);
    });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a') : null;
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash) return;
      const id = sectionIdFromPath(url.pathname);
      if (id === null || (id !== '' && !sectionEl(id))) return;
      e.preventDefault();
      const path = pathForSection(id);
      if (path !== window.location.pathname) window.history.pushState(null, '', path);
      show(path, true);
    };

    const onPop = () => {
      show(window.location.pathname, true);
    };

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);
}

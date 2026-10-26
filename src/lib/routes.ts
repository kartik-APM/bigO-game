/**
 * Clean section URLs for the single-page layout: /play, /leaderboard, … each
 * scroll to the section with that id. "/" is the top of the page.
 */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "" for the top of the page, a section id for "/<id>", or null if the path isn't a section route. */
export function sectionIdFromPath(pathname: string): string | null {
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');
  if (trimmed === '') return '';
  return SLUG.test(trimmed) ? trimmed : null;
}

export function pathForSection(id: string): string {
  return id === '' ? '/' : `/${id}`;
}

/** Old "#leaderboard"-style links map to "/leaderboard" when that section exists. */
export function pathFromLegacyHash(hash: string, sectionExists: (id: string) => boolean): string | null {
  const id = hash.replace(/^#/, '');
  return id && SLUG.test(id) && sectionExists(id) ? pathForSection(id) : null;
}

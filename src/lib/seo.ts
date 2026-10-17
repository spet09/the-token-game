/**
 * Shared SEO constants for The Token Game.
 * All pages import from here so the base URL and OG image are consistent.
 */

export const SITE = 'https://thetokengame.xyz';

/**
 * Static OG image served from public/og-image.svg.
 * Use this for every page's og:image and twitter:image — the dynamic
 * /api/og endpoint is not a real static asset and fails social validators.
 */
export const OG_IMAGE = `${SITE}/og-image.svg`;

/** Build an absolute canonical/og:url for a given route path. */
export function pageUrl(path: string): string {
  return `${SITE}${path}`;
}

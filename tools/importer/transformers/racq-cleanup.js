/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: RACQ cleanup. Selectors from captured DOM of racq.com.au.
 * Removes non-authorable content (header, footer, nav, breadcrumbs, cookie banners,
 * scrollspy tab navigation bar, and other site chrome).
 * Selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent overlays and chat widgets (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '[class*="consent"]',
    ]);

    // Remove scrollspy tab navigation bar (non-authorable navigation chrome)
    // Found in captured DOM: <div class="scrollspy-tabs__tab-buttons-wrapper">
    WebImporter.DOMUtils.remove(element, [
      '.scrollspy-tabs__tab-buttons-wrapper',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.component.header',
      '.component.footer',
      '.component.breadcrumb',
      'nav',
      'iframe',
      'link',
      'noscript',
    ]);

    // Clean up tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-analytics');
    });
  }
}

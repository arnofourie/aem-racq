/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-travel variant.
 * Base block: hero
 * Source: https://www.racq.com.au/travel/travel-insurance
 * Selector: .component.banner.banner-internal
 *
 * Source DOM structure:
 *   .banner-internal > .component-content > .banner-internal__container.row
 *     > .banner-internal__content-wrapper
 *       > .banner-internal__content
 *         > h1.field-title
 *         > .banner-internal__description.field-description
 *           > p (subtitle text)
 *           > p > a.button-primary (CTA)
 *     > .banner-internal__image-wrapper.field-image
 *       > img.banner-internal__image
 *
 * Target block structure (from hero library example):
 *   Row 1 (optional): background image
 *   Row 2: heading, description, CTA links (combined in one cell)
 */
export default function parse(element, { document }) {
  // Extract hero image
  const heroImage = element.querySelector('.banner-internal__image-wrapper img, .field-image img');

  // Extract heading
  const heading = element.querySelector('h1.field-title, h1, h2');

  // Extract description paragraphs (exclude CTA paragraph)
  const descriptionContainer = element.querySelector('.banner-internal__description, .field-description');
  const descriptionParagraphs = descriptionContainer
    ? Array.from(descriptionContainer.querySelectorAll(':scope > p')).filter(
        (p) => !p.querySelector('a.button-primary, a.button-secondary'),
      )
    : [];

  // Extract CTA links
  const ctaLinks = Array.from(
    element.querySelectorAll(
      '.banner-internal__description a.button-primary, .banner-internal__description a.button-secondary, .field-description a.button-primary',
    ),
  );

  const cells = [];

  // Row 1: background image (optional)
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 2: content cell with heading, description, CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  descriptionParagraphs.forEach((p) => contentCell.push(p));
  ctaLinks.forEach((link) => contentCell.push(link));
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-travel',
    cells,
  });
  element.replaceWith(block);
}

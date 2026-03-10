/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-travel variant.
 * Base block: cards
 * Source: https://www.racq.com.au/travel/travel-insurance
 * Selectors:
 *   - .component.promo.key-product-card (Product comparison cards with image, heading, feature list, CTAs)
 *   - .callout-list.callout-list--keyline (Feature items with icon, title, description)
 *   - .container--featured-tiles (Icon tiles with linked captions)
 *   - .component.promo.product-card.product-card--image (Product cards with image, heading, description, link)
 *
 * Target block structure (from cards library example):
 *   Each card = 1 row with 2 columns: [image | content (heading, description, links)]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: key-product-card - product comparison cards
  if (element.classList.contains('key-product-card')) {
    const image = element.querySelector('.key-product-card--image img, .field-promoicon img');
    const heading = element.querySelector('.field-promotext h3, .field-promotext h2');

    // Build content from callout list items
    const contentCell = [];
    if (heading) contentCell.push(heading);

    // Feature list items
    const features = Array.from(element.querySelectorAll('.callout-list__primary-item'));
    if (features.length > 0) {
      const ul = document.createElement('ul');
      features.forEach((item) => {
        const text = item.querySelector('.field-text');
        if (text) {
          const li = document.createElement('li');
          li.textContent = text.textContent.trim();
          ul.appendChild(li);
        }
      });
      if (ul.children.length > 0) contentCell.push(ul);
    }

    // CTA links
    const links = Array.from(element.querySelectorAll('.link__container a, .field-link a'));
    links.forEach((link) => contentCell.push(link));

    cells.push([image ? [image] : '', contentCell]);
  }

  // Pattern 2: callout-list--keyline - feature items with icons
  else if (element.classList.contains('callout-list--keyline')) {
    const items = Array.from(element.querySelectorAll('.callout-list__primary-item'));
    items.forEach((item) => {
      const icon = item.querySelector('.callout-list__image img, .field-icon img');
      const title = item.querySelector('.callout-list__title, .field-title');
      const text = item.querySelector('.callout-list__text, .field-text');

      const contentCell = [];
      if (title) contentCell.push(title);
      if (text) contentCell.push(text);

      cells.push([icon ? [icon] : '', contentCell.length > 0 ? contentCell : '']);
    });
  }

  // Pattern 3: container--featured-tiles - icon tiles with linked captions
  else if (element.classList.contains('container--featured-tiles')) {
    const tiles = Array.from(element.querySelectorAll('.image--featured-tile'));
    tiles.forEach((tile) => {
      const link = tile.querySelector('a');
      const icon = tile.querySelector('img');
      const caption = tile.querySelector('.image__caption, .field-imagecaption');

      const contentCell = [];
      if (caption && link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = caption.textContent.trim();
        contentCell.push(a);
      } else if (caption) {
        contentCell.push(caption);
      }

      cells.push([icon ? [icon] : '', contentCell.length > 0 ? contentCell : '']);
    });
  }

  // Pattern 4: product-card--image - product cards with image, heading, description, link
  else if (element.classList.contains('product-card') || element.classList.contains('product-card--image')) {
    // Multiple product cards may be siblings; handle single card
    const image = element.querySelector('.field-promoicon img, .product-card__image img, img');
    const heading = element.querySelector('.field-promotext h3, .field-promotext h2, h3, h2');
    const description = element.querySelector('.field-promotext p, .product-card__description, p');
    const link = element.querySelector('.field-link a, a.button-primary, a.button-secondary');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description && description !== heading) contentCell.push(description);
    if (link) contentCell.push(link);

    cells.push([image ? [image] : '', contentCell.length > 0 ? contentCell : '']);
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'cards-travel',
      cells,
    });
    element.replaceWith(block);
  }
}

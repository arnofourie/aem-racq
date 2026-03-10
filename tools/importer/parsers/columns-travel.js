/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-travel variant.
 * Base block: columns
 * Source: https://www.racq.com.au/travel/travel-insurance
 * Selectors:
 *   - .column-splitter (Overview benefits: text+list | badge images)
 *   - .component.banner.banner-half-width (Get Quote CTA: image | heading+text+CTA)
 *   - .callout-list.callout-list--links (Contact Us: heading+text | linked items with icons)
 *
 * Target block structure (from columns library example):
 *   Each row has N columns (typically 2)
 *   Each column cell contains its content elements
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: column-splitter - direct child divs are columns
  if (element.classList.contains('column-splitter')) {
    const columns = Array.from(element.querySelectorAll(':scope > div[class*="col-"]'));
    if (columns.length >= 2) {
      const row = columns.map((col) => {
        const content = [];
        // Gather all meaningful content from the column
        const richText = col.querySelector('.component-content, .rich-text .component-content');
        if (richText) {
          Array.from(richText.children).forEach((child) => content.push(child));
        } else {
          Array.from(col.querySelectorAll('h1, h2, h3, h4, p, ul, ol, img, a')).forEach((el) => content.push(el));
        }
        return content.length > 0 ? content : [col];
      });
      cells.push(row);
    }
  }

  // Pattern 2: banner-half-width - image on one side, content on other
  else if (element.classList.contains('banner-half-width')) {
    const image = element.querySelector('.banner-half-width__image-wrapper img, .field-image img');
    const title = element.querySelector('.field-title, .h2, h2');
    const description = element.querySelector('.banner-half-width__description, .field-description');
    const ctaLink = element.querySelector('a.button-primary, a.button-secondary');

    const imageCell = image ? [image] : [];
    const contentCell = [];
    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    if (ctaLink) contentCell.push(ctaLink);

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', contentCell.length > 0 ? contentCell : '']);
    }
  }

  // Pattern 3: callout-list--links - heading+text on left, linked items on right
  else if (element.classList.contains('callout-list--links') || element.closest('.callout-list--links')) {
    // This block is inside a container with heading on left and links on right
    const parentRow = element.closest('.row') || element.parentElement;
    const richTextEl = parentRow ? parentRow.querySelector('.rich-text .component-content') : null;
    const leftCell = [];
    if (richTextEl) {
      Array.from(richTextEl.children).forEach((child) => leftCell.push(child));
    }

    // Build right cell from callout list items
    const rightCell = [];
    const items = Array.from(element.querySelectorAll('.callout-list__primary-item'));
    items.forEach((item) => {
      const link = item.querySelector('a');
      const icon = item.querySelector('.field-icon img');
      const title = item.querySelector('.field-title');
      const text = item.querySelector('.field-text');

      if (icon) rightCell.push(icon);
      if (title) rightCell.push(title);
      if (text) rightCell.push(text);
      if (link && !title) rightCell.push(link);
    });

    if (leftCell.length > 0 || rightCell.length > 0) {
      cells.push([leftCell.length > 0 ? leftCell : '', rightCell.length > 0 ? rightCell : '']);
    }
  }

  // Fallback: treat element children as columns
  else {
    const columns = Array.from(element.querySelectorAll(':scope > div'));
    if (columns.length >= 2) {
      cells.push(columns);
    }
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'columns-travel',
      cells,
    });
    element.replaceWith(block);
  }
}

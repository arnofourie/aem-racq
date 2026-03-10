/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-travel variant.
 * Base block: accordion
 * Source: https://www.racq.com.au/travel/travel-insurance
 * Selector: .component.search-results.faqs
 *
 * Source DOM structure:
 *   .search-results.faqs > ul.search-result-list > li (multiple)
 *     > .faqs__container.rich-text
 *       > button.faqs__button
 *         > .faqs__title.field-title (question text)
 *       > .faqs__accordion-section
 *         > .faqs__answer-section
 *           > .faqs__content.field-content (answer paragraphs)
 *           > a.faqs__link (optional "read more" link)
 *
 * Target block structure (from accordion library example):
 *   Each FAQ = 1 row with 2 columns: [question title | answer content]
 */
export default function parse(element, { document }) {
  const cells = [];

  const faqItems = Array.from(element.querySelectorAll('.search-result-list > li, ul > li'));

  faqItems.forEach((item) => {
    // Extract question title
    const titleEl = item.querySelector('.faqs__title, .field-title');
    const questionText = titleEl ? titleEl.textContent.trim() : '';

    // Extract answer content
    const answerContainer = item.querySelector('.faqs__content, .field-content');
    const answerLink = item.querySelector('a.faqs__link');

    const answerCell = [];
    if (answerContainer) {
      // Get all child elements of the answer (paragraphs, lists, etc.)
      Array.from(answerContainer.children).forEach((child) => {
        answerCell.push(child);
      });
    }
    if (answerLink) {
      answerCell.push(answerLink);
    }

    if (questionText && answerCell.length > 0) {
      cells.push([questionText, answerCell]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'accordion-travel',
      cells,
    });
    element.replaceWith(block);
  }
}

/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroTravelParser from './parsers/hero-travel.js';
import columnsTravelParser from './parsers/columns-travel.js';
import cardsTravelParser from './parsers/cards-travel.js';
import accordionTravelParser from './parsers/accordion-travel.js';

// TRANSFORMER IMPORTS
import racqCleanupTransformer from './transformers/racq-cleanup.js';
import racqSectionsTransformer from './transformers/racq-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-travel': heroTravelParser,
  'columns-travel': columnsTravelParser,
  'cards-travel': cardsTravelParser,
  'accordion-travel': accordionTravelParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'travel-insurance',
  urls: [
    'https://www.racq.com.au/travel/travel-insurance',
  ],
  description: 'Travel insurance product page with coverage options and call-to-action sections',
  blocks: [
    {
      name: 'hero-travel',
      instances: ['.component.banner.banner-internal'],
    },
    {
      name: 'columns-travel',
      instances: ['.column-splitter', '.component.banner.banner-half-width', '.callout-list.callout-list--links'],
    },
    {
      name: 'cards-travel',
      instances: ['.component.promo.key-product-card', '.callout-list.callout-list--keyline', '.container--featured-tiles', '.component.promo.product-card.product-card--image'],
    },
    {
      name: 'accordion-travel',
      instances: ['.component.search-results.faqs'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.fluid-container--blue-gradient',
      style: 'blue-gradient',
      blocks: ['hero-travel'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Notification Banner',
      selector: '.notification-banner.notification-banner--advice',
      style: null,
      blocks: [],
      defaultContent: ['.notification-banner__theme-container'],
    },
    {
      id: 'section-3',
      name: 'Overview Benefits',
      selector: '.scrollspy-tabs__tab-content:first-child .column-splitter',
      style: null,
      blocks: ['columns-travel'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Policy Options Header',
      selector: ['.scrollspy-tabs__tab-content:nth-child(2) .rich-text:first-child'],
      style: null,
      blocks: [],
      defaultContent: ['.rich-text h2', '.rich-text p'],
    },
    {
      id: 'section-5',
      name: 'Policy Options Cards',
      selector: '.fluid-container--pale-blue:has(.key-product-card)',
      style: 'pale-blue',
      blocks: ['cards-travel'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Why Choose RACQ',
      selector: '.callout-list--keyline',
      style: null,
      blocks: ['cards-travel'],
      defaultContent: ['.callout-list--keyline h2'],
    },
    {
      id: 'section-7',
      name: 'Get Your Quote CTA',
      selector: '.banner-half-width',
      style: null,
      blocks: ['columns-travel'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Manage Your Insurance',
      selector: '.container--featured-tiles',
      style: null,
      blocks: ['cards-travel'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Contact Us',
      selector: '.fluid-container--pale-blue:has(.callout-list--links)',
      style: 'pale-blue',
      blocks: ['columns-travel'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Travel Insurance FAQs',
      selector: '.search-results.faqs',
      style: null,
      blocks: ['accordion-travel'],
      defaultContent: ['.faqs h2'],
    },
    {
      id: 'section-11',
      name: 'Explore More',
      selector: '.product-card.product-card--image',
      style: null,
      blocks: ['cards-travel'],
      defaultContent: ['h2#explore-more'],
    },
    {
      id: 'section-12',
      name: 'Disclaimers',
      selector: '.fluid-container--pale-blue:has(#ThingsToNote)',
      style: 'pale-blue',
      blocks: [],
      defaultContent: ['h3#ThingsToNote', '.rich-text p'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  racqCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [racqSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

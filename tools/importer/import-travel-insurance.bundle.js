var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-travel-insurance.js
  var import_travel_insurance_exports = {};
  __export(import_travel_insurance_exports, {
    default: () => import_travel_insurance_default
  });

  // tools/importer/parsers/hero-travel.js
  function parse(element, { document: document2 }) {
    const heroImage = element.querySelector(".banner-internal__image-wrapper img, .field-image img");
    const heading = element.querySelector("h1.field-title, h1, h2");
    const descriptionContainer = element.querySelector(".banner-internal__description, .field-description");
    const descriptionParagraphs = descriptionContainer ? Array.from(descriptionContainer.querySelectorAll(":scope > p")).filter(
      (p) => !p.querySelector("a.button-primary, a.button-secondary")
    ) : [];
    const ctaLinks = Array.from(
      element.querySelectorAll(
        ".banner-internal__description a.button-primary, .banner-internal__description a.button-secondary, .field-description a.button-primary"
      )
    );
    const cells = [];
    if (heroImage) {
      cells.push([heroImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    descriptionParagraphs.forEach((p) => contentCell.push(p));
    ctaLinks.forEach((link) => contentCell.push(link));
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "hero-travel",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-travel.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    if (element.classList.contains("column-splitter")) {
      const columns = Array.from(element.querySelectorAll(':scope > div[class*="col-"]'));
      if (columns.length >= 2) {
        const row = columns.map((col) => {
          const content = [];
          const richText = col.querySelector(".component-content, .rich-text .component-content");
          if (richText) {
            Array.from(richText.children).forEach((child) => content.push(child));
          } else {
            Array.from(col.querySelectorAll("h1, h2, h3, h4, p, ul, ol, img, a")).forEach((el) => content.push(el));
          }
          return content.length > 0 ? content : [col];
        });
        cells.push(row);
      }
    } else if (element.classList.contains("banner-half-width")) {
      const image = element.querySelector(".banner-half-width__image-wrapper img, .field-image img");
      const title = element.querySelector(".field-title, .h2, h2");
      const description = element.querySelector(".banner-half-width__description, .field-description");
      const ctaLink = element.querySelector("a.button-primary, a.button-secondary");
      const imageCell = image ? [image] : [];
      const contentCell = [];
      if (title) contentCell.push(title);
      if (description) contentCell.push(description);
      if (ctaLink) contentCell.push(ctaLink);
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", contentCell.length > 0 ? contentCell : ""]);
      }
    } else if (element.classList.contains("callout-list--links") || element.closest(".callout-list--links")) {
      const parentRow = element.closest(".row") || element.parentElement;
      const richTextEl = parentRow ? parentRow.querySelector(".rich-text .component-content") : null;
      const leftCell = [];
      if (richTextEl) {
        Array.from(richTextEl.children).forEach((child) => leftCell.push(child));
      }
      const rightCell = [];
      const items = Array.from(element.querySelectorAll(".callout-list__primary-item"));
      items.forEach((item) => {
        const link = item.querySelector("a");
        const icon = item.querySelector(".field-icon img");
        const title = item.querySelector(".field-title");
        const text = item.querySelector(".field-text");
        if (icon) rightCell.push(icon);
        if (title) rightCell.push(title);
        if (text) rightCell.push(text);
        if (link && !title) rightCell.push(link);
      });
      if (leftCell.length > 0 || rightCell.length > 0) {
        cells.push([leftCell.length > 0 ? leftCell : "", rightCell.length > 0 ? rightCell : ""]);
      }
    } else {
      const columns = Array.from(element.querySelectorAll(":scope > div"));
      if (columns.length >= 2) {
        cells.push(columns);
      }
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document2, {
        name: "columns-travel",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-travel.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    if (element.classList.contains("key-product-card")) {
      const image = element.querySelector(".key-product-card--image img, .field-promoicon img");
      const heading = element.querySelector(".field-promotext h3, .field-promotext h2");
      const contentCell = [];
      if (heading) contentCell.push(heading);
      const features = Array.from(element.querySelectorAll(".callout-list__primary-item"));
      if (features.length > 0) {
        const ul = document2.createElement("ul");
        features.forEach((item) => {
          const text = item.querySelector(".field-text");
          if (text) {
            const li = document2.createElement("li");
            li.textContent = text.textContent.trim();
            ul.appendChild(li);
          }
        });
        if (ul.children.length > 0) contentCell.push(ul);
      }
      const links = Array.from(element.querySelectorAll(".link__container a, .field-link a"));
      links.forEach((link) => contentCell.push(link));
      cells.push([image ? [image] : "", contentCell]);
    } else if (element.classList.contains("callout-list--keyline")) {
      const items = Array.from(element.querySelectorAll(".callout-list__primary-item"));
      items.forEach((item) => {
        const icon = item.querySelector(".callout-list__image img, .field-icon img");
        const title = item.querySelector(".callout-list__title, .field-title");
        const text = item.querySelector(".callout-list__text, .field-text");
        const contentCell = [];
        if (title) contentCell.push(title);
        if (text) contentCell.push(text);
        cells.push([icon ? [icon] : "", contentCell.length > 0 ? contentCell : ""]);
      });
    } else if (element.classList.contains("container--featured-tiles")) {
      const tiles = Array.from(element.querySelectorAll(".image--featured-tile"));
      tiles.forEach((tile) => {
        const link = tile.querySelector("a");
        const icon = tile.querySelector("img");
        const caption = tile.querySelector(".image__caption, .field-imagecaption");
        const contentCell = [];
        if (caption && link) {
          const a = document2.createElement("a");
          a.href = link.href;
          a.textContent = caption.textContent.trim();
          contentCell.push(a);
        } else if (caption) {
          contentCell.push(caption);
        }
        cells.push([icon ? [icon] : "", contentCell.length > 0 ? contentCell : ""]);
      });
    } else if (element.classList.contains("product-card") || element.classList.contains("product-card--image")) {
      const image = element.querySelector(".field-promoicon img, .product-card__image img, img");
      const heading = element.querySelector(".field-promotext h3, .field-promotext h2, h3, h2");
      const description = element.querySelector(".field-promotext p, .product-card__description, p");
      const link = element.querySelector(".field-link a, a.button-primary, a.button-secondary");
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description && description !== heading) contentCell.push(description);
      if (link) contentCell.push(link);
      cells.push([image ? [image] : "", contentCell.length > 0 ? contentCell : ""]);
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document2, {
        name: "cards-travel",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/accordion-travel.js
  function parse4(element, { document: document2 }) {
    const cells = [];
    const faqItems = Array.from(element.querySelectorAll(".search-result-list > li, ul > li"));
    faqItems.forEach((item) => {
      const titleEl = item.querySelector(".faqs__title, .field-title");
      const questionText = titleEl ? titleEl.textContent.trim() : "";
      const answerContainer = item.querySelector(".faqs__content, .field-content");
      const answerLink = item.querySelector("a.faqs__link");
      const answerCell = [];
      if (answerContainer) {
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
      const block = WebImporter.Blocks.createBlock(document2, {
        name: "accordion-travel",
        cells
      });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/racq-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        '[class*="consent"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".scrollspy-tabs__tab-buttons-wrapper"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".component.header",
        ".component.footer",
        ".component.breadcrumb",
        "nav",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/transformers/racq-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-travel-insurance.js
  var parsers = {
    "hero-travel": parse,
    "columns-travel": parse2,
    "cards-travel": parse3,
    "accordion-travel": parse4
  };
  var PAGE_TEMPLATE = {
    name: "travel-insurance",
    urls: [
      "https://www.racq.com.au/travel/travel-insurance"
    ],
    description: "Travel insurance product page with coverage options and call-to-action sections",
    blocks: [
      {
        name: "hero-travel",
        instances: [".component.banner.banner-internal"]
      },
      {
        name: "columns-travel",
        instances: [".column-splitter", ".component.banner.banner-half-width", ".callout-list.callout-list--links"]
      },
      {
        name: "cards-travel",
        instances: [".component.promo.key-product-card", ".callout-list.callout-list--keyline", ".container--featured-tiles", ".component.promo.product-card.product-card--image"]
      },
      {
        name: "accordion-travel",
        instances: [".component.search-results.faqs"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: ".fluid-container--blue-gradient",
        style: "blue-gradient",
        blocks: ["hero-travel"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Notification Banner",
        selector: ".notification-banner.notification-banner--advice",
        style: null,
        blocks: [],
        defaultContent: [".notification-banner__theme-container"]
      },
      {
        id: "section-3",
        name: "Overview Benefits",
        selector: ".scrollspy-tabs__tab-content:first-child .column-splitter",
        style: null,
        blocks: ["columns-travel"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Policy Options Header",
        selector: [".scrollspy-tabs__tab-content:nth-child(2) .rich-text:first-child"],
        style: null,
        blocks: [],
        defaultContent: [".rich-text h2", ".rich-text p"]
      },
      {
        id: "section-5",
        name: "Policy Options Cards",
        selector: ".fluid-container--pale-blue:has(.key-product-card)",
        style: "pale-blue",
        blocks: ["cards-travel"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Why Choose RACQ",
        selector: ".callout-list--keyline",
        style: null,
        blocks: ["cards-travel"],
        defaultContent: [".callout-list--keyline h2"]
      },
      {
        id: "section-7",
        name: "Get Your Quote CTA",
        selector: ".banner-half-width",
        style: null,
        blocks: ["columns-travel"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Manage Your Insurance",
        selector: ".container--featured-tiles",
        style: null,
        blocks: ["cards-travel"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Contact Us",
        selector: ".fluid-container--pale-blue:has(.callout-list--links)",
        style: "pale-blue",
        blocks: ["columns-travel"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Travel Insurance FAQs",
        selector: ".search-results.faqs",
        style: null,
        blocks: ["accordion-travel"],
        defaultContent: [".faqs h2"]
      },
      {
        id: "section-11",
        name: "Explore More",
        selector: ".product-card.product-card--image",
        style: null,
        blocks: ["cards-travel"],
        defaultContent: ["h2#explore-more"]
      },
      {
        id: "section-12",
        name: "Disclaimers",
        selector: ".fluid-container--pale-blue:has(#ThingsToNote)",
        style: "pale-blue",
        blocks: [],
        defaultContent: ["h3#ThingsToNote", ".rich-text p"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_travel_insurance_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_travel_insurance_exports);
})();

(() => {
  const listings = [
    {
      grid: "#projectResults .row.clsprojects",
      card: ".clsprojebox",
      input: "#projectSearch",
      more: ".loadMoreBtn",
    },
    {
      grid: ".row.clsmedia",
      card: ".clsnewscol",
      input: "#mediaSearch",
      more: "#loadMoreMedia",
      category: ".ctags, [data-listing-category]",
      categoryRoute: "/media-category/",
    },
    {
      grid: ".row.clsawards",
      card: ".clsnewscol",
      more: "#loadMoreAward",
    },
    {
      grid: "#blog-list",
      card: ".clsblogcol",
      input: "#blogSearch",
      more: "#load-more-blogs",
      category: ".blog-cat, [data-listing-category]",
      categoryRoute: "/thought-leadership-category/",
    },
    {
      grid: "#clientResults .row.clsclientrow",
      card: ".clsclientbox",
      input: "#clientSearch",
    },
  ];

  function normalized(value) {
    return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/['’]/g, "").trim();
  }

  function cardRecord(element, categorySelector, onPage) {
    const descriptions = Array.from(element.querySelectorAll("img[alt]"), (image) => image.alt);
    const categories = categorySelector
      ? Array.from(element.querySelectorAll(categorySelector), (label) =>
          normalized(label.dataset.listingCategory || label.textContent),
        )
      : [];
    return {
      element,
      live: onPage ? element : null,
      text: normalized([element.textContent, ...descriptions].join(" ")),
      categories,
    };
  }

  function setupListing(options) {
    const grid = document.querySelector(options.grid);
    if (!grid) return;

    const listing = grid.closest("section") || document;
    const input = options.input && listing.querySelector(options.input);
    const more = options.more && listing.querySelector(options.more);
    const moreContainer = more?.closest(".btnbox") || more;
    const originalCards = Array.from(grid.children).filter((element) => element.matches(options.card));
    const extra = grid.querySelector(":scope > template[data-listing-extra]");
    const available = originalCards.map((card) => cardRecord(card, options.category, true));
    if (extra) {
      for (const child of extra.content.children) {
        if (child.matches(options.card)) available.push(cardRecord(child, options.category, false));
      }
    }
    const pageSize = Number(more?.dataset.listingPageSize) || originalCards.length || 15;
    const anchor = moreContainer?.parentElement === grid ? moreContainer : null;
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "col-12 text-center";
    emptyMessage.hidden = true;
    emptyMessage.setAttribute("role", "status");
    grid.insertBefore(emptyMessage, anchor);
    let limit = more ? pageSize : available.length;
    let selectedCategory = "";
    let finished = false;

    function render() {
      const terms = normalized(input?.value || "").split(/\s+/).filter(Boolean);
      const filtered = terms.length > 0 || Boolean(selectedCategory);
      const matches = available.filter(({ text, categories }) =>
        terms.every((term) => text.includes(term)) && (!selectedCategory || categories.includes(selectedCategory)),
      );
      const visible = new Set(matches.slice(0, limit));
      let nextCard = emptyMessage;
      for (let index = available.length - 1; index >= 0; index--) {
        const entry = available[index];
        if (!entry.live && visible.has(entry)) {
          entry.live = entry.element.cloneNode(true);
          entry.live.classList.remove("scroll-animate");
          for (const image of entry.live.querySelectorAll("img")) image.loading = "lazy";
          grid.insertBefore(entry.live, nextCard);
        }
        if (entry.live) {
          entry.live.hidden = !visible.has(entry);
          nextCard = entry.live;
        }
      }
      emptyMessage.hidden = matches.length !== 0 && !finished;
      emptyMessage.textContent = finished ? "No more results available in this copy." : "No results found.";
      if (moreContainer) {
        moreContainer.hidden = finished || (matches.length <= limit && (filtered || Boolean(extra)));
      }
    }

    if (input) {
      if (!input.getAttribute("aria-label")) input.setAttribute("aria-label", input.placeholder.trim());
      input.addEventListener("input", () => {
        limit = more ? pageSize : available.length;
        finished = false;
        render();
      });
      input.form?.addEventListener("submit", (event) => event.preventDefault());
    }

    if (more) {
      if (!more.hasAttribute("href")) {
        more.setAttribute("role", "button");
        more.tabIndex = 0;
      }
      more.addEventListener("click", (event) => {
        event.preventDefault();
        limit += pageSize;
        finished = available.length <= limit - pageSize;
        more.dataset.page = String(Math.ceil(limit / pageSize));
        render();
      });
      more.addEventListener("keydown", (event) => {
        if (event.key === " " || (event.key === "Enter" && !more.hasAttribute("href"))) {
          event.preventDefault();
          more.click();
        }
      });
    }

    if (options.categoryRoute) {
      for (const link of listing.querySelectorAll(".clsformrow .dropdown-item[href]")) {
        const destination = new URL(link.href, window.location.href);
        const label = normalized(link.textContent);
        const localFallback = destination.hostname === "www.morphogenesis.org"
          && destination.pathname.startsWith(options.categoryRoute)
          && available.some(({ categories }) => categories.includes(label));
        if (!localFallback && !link.hasAttribute("data-listing-filter")) continue;
        link.addEventListener("click", (event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          selectedCategory = label === "all" ? "" : label;
          limit = more ? pageSize : available.length;
          finished = false;
          const control = link.closest(".dropdown")?.querySelector("button");
          if (control) control.textContent = link.textContent.trim();
          render();
        });
      }
    }

    grid.addEventListener("click", navigateCategory);
    grid.addEventListener("keydown", (event) => {
      if (event.key === "Enter") navigateCategory(event);
    });
    for (const { element } of available) {
      for (const label of element.querySelectorAll(".blog-cat[data-link]")) {
        if (label.tagName !== "A") {
          label.setAttribute("role", "link");
          label.tabIndex = 0;
        }
      }
    }
  }

  function navigateCategory(event) {
    const label = event.target.closest(".blog-cat[data-link]");
    if (!label || label.tagName === "A") return;
    const destination = new URL(label.dataset.link, window.location.href);
    if (destination.protocol !== "https:" && destination.protocol !== "http:") return;
    event.preventDefault();
    window.location.assign(destination.href);
  }

  function initialize() {
    for (const listing of listings) setupListing(listing);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();

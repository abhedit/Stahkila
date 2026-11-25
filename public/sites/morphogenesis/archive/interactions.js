(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopMenu = window.matchMedia("(min-width: 1200px) and (hover: hover)");
  const all = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const directChild = (element, selector) => element.children.length
    ? Array.from(element.children).find((child) => child.matches(selector))
    : undefined;
  const visible = (element) => element.getClientRects().length > 0;
  const scrollBehavior = () => reducedMotion.matches ? "instant" : "smooth";

  function makeButton(element, label) {
    if (!element.matches("button, input, a[href]")) {
      element.tabIndex = 0;
      element.setAttribute("role", "button");
    }
    if (label) element.setAttribute("aria-label", label);
    if (element.matches("button, input")) return;
    element.addEventListener("keydown", (event) => {
      const enterOnNonLink = event.key === "Enter" && !element.matches("a[href]");
      if (event.target === element && (enterOnNonLink || event.key === " ")) {
        event.preventDefault();
        element.click();
      }
    });
  }

  function initializeMenu() {
    const panel = document.querySelector(".clsmegamenus");
    if (!panel) return;

    const desktopToggle = document.querySelector(".clsmenubtn");
    const mobileToggle = document.querySelector("#mobilemenu");
    const closeButton = panel.querySelector(".closebtn");
    const menuImage = panel.querySelector("#clsmenuimg");
    const defaultImage = menuImage?.getAttribute("src");
    const menuItems = all(".clsmenuitem", panel);
    const submenus = menuItems.flatMap((item, index) => {
      const row = directChild(item, ".clsmainmenu");
      const submenu = directChild(item, ".clssubmenu");
      if (!row || !submenu) return [];
      const toggle = row.querySelector("a") ?? row;
      submenu.id ||= `archive-submenu-${index + 1}`;
      makeButton(toggle);
      if (toggle.matches("a[href='#']")) toggle.setAttribute("role", "button");
      toggle.setAttribute("aria-controls", submenu.id);
      return [{ item, row, submenu, toggle }];
    });

    let menuOpener;
    let activeSubmenu;
    panel.id ||= "archive-mega-menu";
    panel.setAttribute("aria-hidden", "true");

    function selectSubmenu(active) {
      activeSubmenu = active;
      for (const entry of submenus) {
        const selected = entry === active;
        entry.item.classList.toggle("activemenu", selected);
        entry.toggle.setAttribute("aria-expanded", String(selected));
        entry.submenu.hidden = !selected;
        entry.submenu.style.display = selected ? "flex" : "none";
      }
    }

    function setOpen(open) {
      document.body.classList.toggle("megamenuopen", open);
      panel.setAttribute("aria-hidden", String(!open));
      desktopToggle?.setAttribute("aria-expanded", String(open));
      mobileToggle?.setAttribute("aria-expanded", String(open));
      if (open) {
        selectSubmenu(undefined);
        if (menuImage && defaultImage) menuImage.src = defaultImage;
        if (closeButton && visible(closeButton)) closeButton.focus();
      } else {
        menuOpener?.focus();
      }
    }

    for (const opener of [desktopToggle, mobileToggle].filter(Boolean)) {
      makeButton(opener, "Menu");
      opener.setAttribute("aria-controls", panel.id);
      opener.setAttribute("aria-expanded", "false");
      opener.addEventListener("click", (event) => {
        event.preventDefault();
        menuOpener = opener;
        setOpen(!document.body.classList.contains("megamenuopen"));
      });
    }

    closeButton?.addEventListener("click", (event) => {
      event.preventDefault();
      setOpen(false);
    });

    selectSubmenu(undefined);
    for (const { item, row, toggle } of submenus) {
      row.addEventListener("click", (event) => {
        event.preventDefault();
        const clicked = submenus.find((entry) => entry.item === item);
        selectSubmenu(activeSubmenu === clicked ? undefined : clicked);
      });
      toggle.addEventListener("focus", () => {
        if (menuImage && item.dataset.image) menuImage.src = item.dataset.image;
      });
    }

    for (const item of menuItems) {
      item.addEventListener("mouseenter", () => {
        if (!desktopMenu.matches) return;
        if (menuImage && item.dataset.image) menuImage.src = item.dataset.image;
      });
    }

    document.addEventListener("keydown", (event) => {
      if (!document.body.classList.contains("megamenuopen")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key === "Tab") {
        const focusable = [mobileToggle, ...all('a[href], button, [tabindex="0"]', panel)]
          .filter((node) => node && visible(node));
        const first = focusable[0];
        const last = focusable.at(-1);
        if (!first) return;
        const outside = !focusable.includes(document.activeElement);
        if (outside || (event.shiftKey && document.activeElement === first) ||
          (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    });
  }

  function initializeDisclosures() {
    for (const [index, trigger] of all(".clsfaqs .clsfaqbtn, .clstoc .clsfaqbtn").entries()) {
      const header = trigger.parentElement;
      const target = header.nextElementSibling;
      if (!target?.matches(".accordion, #toc-list")) continue;

      target.id ||= `archive-disclosure-${index + 1}`;
      const heading = header.querySelector("h2, h3, h4");
      makeButton(trigger, heading?.textContent.trim());
      trigger.setAttribute("aria-controls", target.id);
      const open = visible(target) && !header.closest(".clsfaqs");
      header.classList.toggle("showfaqs", open);
      trigger.setAttribute("aria-expanded", String(open));
      target.hidden = !open;
      target.style.display = open ? "block" : "none";

      trigger.addEventListener("click", () => {
        const expanded = trigger.getAttribute("aria-expanded") === "false";
        trigger.setAttribute("aria-expanded", String(expanded));
        header.classList.toggle("showfaqs", expanded);
        target.hidden = !expanded;
        target.style.display = expanded ? "block" : "none";
      });
    }

    for (const trigger of all(".clsclickarrow")) {
      const group = trigger.parentElement?.parentElement;
      if (!group) continue;
      makeButton(trigger, "S.O.U.L. details");
      trigger.setAttribute("aria-expanded", String(group.classList.contains("showtexts")));
      trigger.addEventListener("click", () => {
        trigger.setAttribute("aria-expanded", String(group.classList.toggle("showtexts")));
      });
    }

    for (const trigger of all(".careersec2 .clsaccord")) {
      const section = trigger.closest(".careersec2");
      const current = trigger.closest(".nav-link");
      if (!current || !section) continue;
      makeButton(trigger);
      trigger.setAttribute("aria-expanded", String(current.classList.contains("activeaccord")));
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const open = !current.classList.contains("activeaccord");
        for (const row of all(".nav-link", section)) {
          const expanded = row === current && open;
          row.classList.toggle("active", expanded);
          row.classList.toggle("activeaccord", expanded);
          row.setAttribute("aria-selected", String(expanded));
          row.querySelector(".clsaccord")?.setAttribute("aria-expanded", String(expanded));
        }
      });
    }

    for (const trigger of all("[data-bs-toggle='collapse'], [data-bs-toggle='modal']")) {
      const target = trigger.getAttribute("data-bs-target");
      if (trigger.dataset.bsToggle === "modal" && target?.startsWith("#partner") &&
          !document.getElementById(target.slice(1)) &&
          document.getElementById("membermodal" + target.slice(1))) {
        trigger.dataset.bsTarget = "#membermodal" + target.slice(1);
      }
      const ancestor = trigger.parentElement?.closest("[data-bs-toggle='modal']");
      if (ancestor) {
        if (ancestor.dataset.bsTarget === trigger.dataset.bsTarget) {
          trigger.removeAttribute("data-bs-toggle");
          trigger.removeAttribute("data-bs-target");
          trigger.setAttribute("aria-hidden", "true");
          continue;
        }
      }
      const label = trigger.dataset.bsToggle === "modal"
        ? trigger.querySelector("img")?.alt || trigger.closest(".clsstmitem")?.querySelector("h3, h4")?.textContent.trim()
        : undefined;
      makeButton(trigger, label);
    }

    for (const navigation of all(".clshovertabs #v-pills-tab")) {
      const container = navigation.closest(".clshovertabs");
      const content = container?.querySelector(".tab-content");
      const showOnHover = window.matchMedia("(hover: hover)");
      if (!content || !window.bootstrap?.Tab) continue;
      for (const tab of all(".nav-link[data-bs-toggle]", navigation)) {
        const show = () => {
          window.bootstrap.Tab.getOrCreateInstance(tab).show();
          content.classList.add("hover-active");
        };
        tab.addEventListener("mouseenter", () => {
          if (showOnHover.matches) show();
        });
        tab.addEventListener("shown.bs.tab", () => content.classList.add("hover-active"));
      }
      navigation.addEventListener("mouseleave", () => {
        if (!showOnHover.matches) return;
        for (const tab of all(".nav-link.active", navigation)) {
          tab.classList.remove("active");
          tab.setAttribute("aria-selected", "false");
        }
        for (const pane of all(".tab-pane.active", content)) pane.classList.remove("active", "show");
        content.classList.remove("hover-active");
      });
    }
  }

  function initializeSliders() {
    const $ = window.jQuery;
    if (typeof $?.fn?.slick !== "function") return;
    const logoWidths = [
      { breakpoint: 1599, settings: { slidesToShow: 6, speed: 7000 } },
      { breakpoint: 1199, settings: { slidesToShow: 4, speed: 7000 } },
      { breakpoint: 768, settings: { slidesToShow: 3, speed: 7000 } },
      { breakpoint: 575, settings: { slidesToShow: 2, speed: 6000 } },
    ];
    const logoOptions = {
      arrows: false, autoplay: true, autoplaySpeed: 0, cssEase: "linear", speed: 8500,
      pauseOnHover: false, pauseOnFocus: false, draggable: false, swipe: false,
      slidesToShow: 8, responsive: logoWidths,
    };
    const settings = [
      [".clsmainslider", { fade: true, speed: 600, arrows: false, autoplay: true, autoplaySpeed: 2500 }],
      [".clsglobslider", logoOptions],
      [".clsglobslider2", { ...logoOptions, speed: 4000 }],
      [".clienttestimonialslider", { fade: true, autoplay: true }],
      [".clsprojectslider", { fade: true, arrows: false, autoplay: true }],
      [".clsprojslider", { slidesToShow: 2, responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }] }],
      [".clstestimonials", { fade: true }],
      [".clsmilestoneslider", { slidesToShow: 3, responsive: [
        { breakpoint: 1599, settings: { slidesToShow: 2 } },
        { breakpoint: 1199, settings: { slidesToShow: 3 } },
        { breakpoint: 575, settings: { slidesToShow: 4 } },
      ] }],
      [".clsprojimob", { fade: true, autoplay: true }],
      [".clsnewslistslider", {}],
      [".clsbenefits", { dots: true }],
      [".clsnewslistslider_desk", { slidesToShow: 4, arrows: false, autoplay: true }],
      [".clsprojimgslider", { fade: true, dots: true }],
    ];

    for (const [selector, options] of settings) {
      for (const element of all(selector)) {
        if (element.children.length < 2 || element.classList.contains("slick-initialized")) continue;
        $(element).slick({
          autoplaySpeed: 2000, pauseOnHover: false, ...options,
          ...(reducedMotion.matches && { autoplay: false, speed: 0 }),
        });
      }
    }

    for (const trigger of all("[data-bs-toggle='tab'], [data-bs-toggle='pill']")) {
      makeButton(trigger);
      trigger.addEventListener("shown.bs.tab", () => {
        const id = trigger.getAttribute("data-bs-target") || trigger.getAttribute("href");
        const panel = id?.startsWith("#") && document.getElementById(id.slice(1));
        if (panel) $(".slick-initialized", panel).slick("setPosition");
      });
    }

    for (const wrapper of all(".clsglobalsay")) {
      const $slider = $(".clstestimonials.slick-initialized", wrapper);
      if (!$slider.length) continue;
      for (const [selector, action] of [[".slickprev", "slickPrev"], [".slicknext", "slickNext"]]) {
        wrapper.querySelector(selector)?.addEventListener("click", () => $slider.slick(action));
      }
    }
  }

  function initializeScroll() {
    for (const button of all(".clsbacktotop")) {
      makeButton(button, "Back to top");
      const update = () => button.classList.toggle("is-visible", window.scrollY >= 350);
      window.addEventListener("scroll", update, { passive: true });
      update();
      button.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
      });
    }

    for (const prompt of all(".clsscrollwrap")) {
      const next = prompt.closest("section")?.nextElementSibling;
      if (!next) continue;
      makeButton(prompt, "Scroll down");
      prompt.addEventListener("click", () => {
        const header = document.querySelector(".headersticky")?.getBoundingClientRect().height ?? 0;
        window.scrollTo({ top: window.scrollY + next.getBoundingClientRect().top - header, behavior: scrollBehavior() });
      });
      window.addEventListener("scroll", () => { prompt.style.display = "none"; }, { once: true, passive: true });
    }

    const elements = all(".scroll-animate");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      for (const element of elements) element.style.opacity = "1";
      return;
    }

    const observer = new IntersectionObserver((entries, observerInstance) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        const name = target.dataset.anim;
        const delay = Number(target.dataset.delay);
        if (name && /^animate__[\w-]+$/.test(name)) {
          target.style.animationDelay = `${Math.max(0, delay || 0)}ms`;
          target.classList.add("animate__animated", name);
        }
        target.style.opacity = "1";
        observerInstance.unobserve(target);
      }
    }, { threshold: 0.1 });

    for (const element of elements) observer.observe(element);
  }

  function initializeCounters() {
    const counters = all(".clscount1[data-count]");
    if (!counters.length) return;

    function display(counter, value) {
      counter.textContent = String(value);
    }

    function animate(counter) {
      const value = Number(counter.dataset.count);
      if (!Number.isFinite(value)) return;
      if (reducedMotion.matches || window.innerWidth <= 576) {
        display(counter, value);
        return;
      }
      const start = performance.now();
      function frame(now) {
        const fraction = Math.min(1, (now - start) / 2500);
        display(counter, Math.floor(value * (1 - (1 - fraction) ** 2)));
        if (fraction < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }
    const observer = new IntersectionObserver((entries, observerInstance) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observerInstance.unobserve(target);
        animate(target);
      }
    }, { threshold: 0.25 });
    counters.forEach((counter) => observer.observe(counter));
  }

  function initializeContents() {
    const list = document.getElementById("toc-list");
    if (!list || list.children.length) return;
    const headings = all(".blog-content h2");
    const faq = document.getElementById("faq-section");
    const faqHeading = faq?.querySelector("h3");
    const links = headings.map((heading, index) => {
      heading.id ||= `heading-${index}`;
      return [heading.id, heading.textContent.trim(), "toc-h2"];
    });
    if (faqHeading) {
      links.push([faq.id, faqHeading.textContent.trim(), "toc-faq-title"]);
      for (const row of all(".accordion-header[id]", faq)) {
        links.push([row.id, row.textContent.trim(), "toc-faq-item"]);
      }
    }
    for (const [id, label, className] of links) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      item.className = className;
      link.href = `#${id}`;
      link.textContent = label;
      item.append(link);
      list.append(item);
    }
  }

  function initializeMedia() {
    for (const modal of all(".clsvideomodal")) {
      modal.addEventListener("hidden.bs.modal", () => {
        for (const video of all("video", modal)) video.pause();
      });
    }
    for (const button of all(".playbtn:not([data-bs-toggle]), .pausebtn")) {
      const video = button.closest(".clsprojvideo")?.querySelector("video");
      if (!video) continue;
      makeButton(button, video.paused ? "Play video" : "Pause video");
      button.addEventListener("click", (event) => {
        event.preventDefault();
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      });
      function update() {
        button.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
      }
      video.addEventListener("play", update);
      video.addEventListener("pause", update);
    }
  }

  function initializeForms() {
    for (const form of all("form.wpcf7-form")) {
      const fields = all("input:not([type='hidden'], [type='submit']), select, textarea", form);
      const output = form.querySelector(".wpcf7-response-output") ?? document.createElement("div");
      if (!output.isConnected) form.append(output);
      output.classList.add("wpcf7-response-output");
      output.setAttribute("role", "status");
      for (const field of fields) {
        if (field.getAttribute("aria-required") === "true") field.required = true;
        if (!field.labels?.length && field.placeholder && !field.getAttribute("aria-label")) {
          field.setAttribute("aria-label", field.placeholder);
        }
        field.addEventListener("input", () => field.setAttribute("aria-invalid", "false"));
      }
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        for (const field of fields) field.setAttribute("aria-invalid", String(!field.validity.valid));
        output.setAttribute("aria-hidden", "false");
        output.style.display = "block";
        form.classList.remove("init");
        if (!form.reportValidity()) {
          output.textContent = "Check the highlighted fields and try again.";
          return;
        }
        const live = document.createElement("a");
        const newsletter = fields.some((field) => field.name === "email-811");
        live.href = newsletter ? "https://www.morphogenesis.org/#wpcf7-f520-o1" : "https://www.morphogenesis.org/contact-us/";
        live.textContent = newsletter ? "Subscribe on Morphogenesis.org" : "Open the Morphogenesis contact form";
        output.replaceChildren("This preview does not send submissions. ", live);
      });
    }
  }

  function initializeJobs() {
    const jobs = document.getElementById("rec_job_listing_div");
    if (!jobs || jobs.children.length) return;
    const link = document.createElement("a");
    link.className = "cbtn";
    link.href = "https://careers.morphogenesis.org/";
    link.textContent = "View current openings";
    jobs.append(link);
  }

  function initialize() {
    initializeMenu();
    initializeContents();
    initializeDisclosures();
    initializeSliders();
    initializeScroll();
    initializeCounters();
    initializeMedia();
    initializeForms();
    initializeJobs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();

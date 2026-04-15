(function () {
  const site = window.SITE_CONTENT || {};
  const business = site.business || {};
  const about = site.about || {};
  const links = site.links || {};
  const page = document.body.dataset.page || "";

  /* ── Helpers ─────────────────────────────────────────── */
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
      }[char];
    });
  }

  function isConfigured(value) {
    if (!value) return false;
    const text = String(value);
    return !(text.includes("[") || text.includes("]") || text.includes("<") ||
             text.includes("example.com") || text.includes("your-form-id"));
  }

  function brandMark() {
    if (isConfigured(business.shortName)) return business.shortName;
    if (isConfigured(business.name)) {
      return business.name.split(/\s+/).slice(0, 2)
        .map(w => w.charAt(0)).join("").toUpperCase();
    }
    return "FV";
  }

  function phoneHref(v)    { return `tel:${String(v).replace(/[^\d+]/g, "")}`; }
  function whatsappHref(v) { return `https://wa.me/${String(v).replace(/[^\d]/g, "")}`; }
  function emailHref(v)    { return `mailto:${v}`; }

  /* ── Scroll: header shrink ──────────────────────────── */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const handler = () => {
      header.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
  }

  /* ── Scroll reveal (IntersectionObserver) ───────────── */
  function initReveal() {
    const els = document.querySelectorAll(".reveal, .reveal-scale, .reveal-stagger");
    if (!els.length) return;

    const io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach(el => io.observe(el));
  }

  /* ── Header ─────────────────────────────────────────── */
  function renderHeader() {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;

    header.innerHTML = `
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="Go to home page">
          <img src="assets/images/logo.png" alt="Fun Villa Logo" class="brand-logo">
          <span class="brand-copy">
            <strong>${escapeHtml(business.name || "[Business Name]")}</strong>
            <small>${escapeHtml(business.tagline || "Pure Veg · Dalli Rajhara")}</small>
          </span>
        </a>

        <div class="nav-cluster">
          <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
            <a href="index.html"     data-nav="home">Home</a>
            <a href="about.html"    data-nav="about">About</a>
            <a href="services.html" data-nav="services">Menu</a>
            <a href="contact.html"  data-nav="contact">Contact</a>
            <a class="nav-reserve-mobile" href="contact.html">Reserve a Table</a>
          </nav>

          <a class="nav-reserve" href="contact.html">Reserve a Table</a>

          <button class="nav-toggle" type="button" aria-expanded="false"
            aria-controls="site-nav" aria-label="Toggle navigation" data-nav-toggle>
            <span class="nav-toggle-bar"></span>
            <span class="nav-toggle-bar"></span>
            <span class="nav-toggle-bar"></span>
          </button>
        </div>
      </div>
    `;

    const activeLink = header.querySelector(`[data-nav="${page}"]`);
    if (activeLink) activeLink.classList.add("active");

    const toggle = header.querySelector("[data-nav-toggle]");
    const nav    = header.querySelector(".site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
      // Close on outside click or Escape key
      document.addEventListener("click", function (e) {
        if (!header.contains(e.target)) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("open")) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      });
    }
  }

  /* ── Footer ─────────────────────────────────────────── */
  function renderFooter() {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return;

    const phoneText = isConfigured(business.phone)    ? business.phone    : "Call for details";
    const emailText = isConfigured(business.email)    ? business.email    : "Not listed publicly";
    const mapHref   = isConfigured(links.mapUrl)      ? links.mapUrl      : "#";

    footer.innerHTML = `
      <div class="container">
        <div class="footer-inner">
          <div>
            <p class="eyebrow">Neighbourhood dining</p>
            <div class="brand" style="margin-bottom: 0.8rem;">
              <img src="assets/images/logo.png" alt="Fun Villa Logo" class="brand-logo">
              <span class="brand-copy">
                <strong style="font-size: 1.1rem; color: #fff; font-family: var(--font-serif); white-space: normal; line-height: 1.3;">${escapeHtml(business.name || "[Business Name]")}</strong>
              </span>
            </div>
            <p>${escapeHtml(business.intro || "")}</p>
          </div>
          <div>
            <div class="footer-links">
              <a href="index.html">Home</a>
              <a href="about.html">About</a>
              <a href="services.html">Menu</a>
              <a href="contact.html">Contact</a>
            </div>
            <div class="footer-contact">
              ${isConfigured(business.phone) ? `<a href="${escapeHtml(phoneHref(business.phone))}">${escapeHtml(business.phone)}</a>` : ""}
              ${isConfigured(business.whatsapp) ? `<a href="${escapeHtml(whatsappHref(business.whatsapp))}">WhatsApp Message</a>` : ""}
              <a href="${escapeHtml(mapHref)}" target="_blank" rel="noreferrer">Map&nbsp;/ Location</a>
            </div>
            <p style="font-size:0.78rem;color:var(--text-dim);margin-top:1.5rem;">
              &copy; ${new Date().getFullYear()} ${escapeHtml(business.name || "")}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  /* ── Data binding ────────────────────────────────────── */
  function getPathValue(path) {
    return path.split(".").reduce(function (cur, key) {
      return cur && cur[key] !== undefined ? cur[key] : "";
    }, site);
  }

  function bindFields() {
    document.querySelectorAll("[data-field]").forEach(function (el) {
      const value = getPathValue(el.dataset.field);
      if (value) el.textContent = value;
    });
  }

  function setLink(el, text, href, enabled) {
    el.textContent = text;
    if (enabled) {
      el.href = href;
      el.removeAttribute("aria-disabled");
    } else {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
    }
  }

  function bindLinks() {
    document.querySelectorAll('[data-link="phone"]').forEach(function (el) {
      setLink(el, business.phone || "[Phone Number]",
        phoneHref(business.phone || ""), isConfigured(business.phone));
    });
    document.querySelectorAll('[data-link="whatsapp"]').forEach(function (el) {
      setLink(el, business.whatsapp ? "WhatsApp: " + business.whatsapp : "[WhatsApp]",
        whatsappHref(business.whatsapp || ""), isConfigured(business.whatsapp));
    });
    document.querySelectorAll('[data-link="map"]').forEach(function (el) {
      setLink(el, "Open location", links.mapUrl || "#", isConfigured(links.mapUrl));
      el.target = "_blank"; el.rel = "noreferrer";
    });
  }

  /* ── List renderers ─────────────────────────────────── */
  function renderTextList(selector, items) {
    const container = document.querySelector(selector);
    if (!container || !Array.isArray(items)) return;
    container.innerHTML = items
      .map(item => `<div class="stack-item reveal">${escapeHtml(item)}</div>`)
      .join("");
  }

  function renderChips(selector, items) {
    const container = document.querySelector(selector);
    if (!container || !Array.isArray(items)) return;
    container.innerHTML = items
      .map(item => `<span class="chip reveal">${escapeHtml(item)}</span>`)
      .join("");
  }

  function renderCards(selector, items, renderer) {
    const container = document.querySelector(selector);
    if (!container || !Array.isArray(items)) return;
    container.innerHTML = items.map(renderer).join("");
  }

  /* ── Card renderers ─────────────────────────────────── */
  function renderHomeServices() {
    renderCards('[data-cards="service-preview"]', (site.services || []).slice(0, 3), function (s) {
      return `
        <article class="service-card reveal">
          <div class="service-meta">
            <span>${escapeHtml(s.levels)}</span>
            <span>${escapeHtml(s.format)}</span>
          </div>
          <h3>${escapeHtml(s.title)}</h3>
          <p>${escapeHtml(s.description)}</p>
        </article>
      `;
    });
  }

  function renderServicePageCards() {
    // Use the richer menu-category-card layout on the full menu page
    const container = document.querySelector('[data-cards="services"]');
    if (!container) return;
    const categories = site.menuCategories || site.services || [];
    if (!categories.length) return;

    container.innerHTML = categories.map(function (cat) {
      // Support both rich menuCategories (with items[]) and legacy services (description string)
      const items = Array.isArray(cat.items) ? cat.items : null;
      const bodyHtml = items
        ? `<ul class="menu-item-list">${items.map(function (it) {
            const priceHtml = it.price ? `<span class="item-price">${escapeHtml(it.price)}</span>` : "";
            return `<li>
              <div class="item-info">
                <span class="item-name">${escapeHtml(it.name)}</span>
                <span class="item-note">${escapeHtml(it.note || "")}</span>
              </div>
              ${priceHtml}
            </li>`;
          }).join("")}</ul>`
        : `<p style="color:var(--text-muted);font-size:0.9rem;margin:0">${escapeHtml(cat.description || "")}</p>`;

      return `
        <article class="menu-category-card reveal">
          <div class="menu-category-head">
            <p class="eyebrow">${escapeHtml(cat.levels || cat.category || "")}</p>
            <h3>${escapeHtml(cat.title)}</h3>
          </div>
          <div class="menu-category-body">${bodyHtml}</div>
        </article>
      `;
    }).join("");
  }

  function renderHighlights() {
    renderCards('[data-cards="highlights"]', site.highlights || [], function (item, i) {
      return `
        <article class="info-card reveal" data-index="${String(i + 1).padStart(2, "0")}">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `;
    });
  }

  function renderApproach() {
    renderCards('[data-cards="approach"]', about.approach || [], function (item, i) {
      return `
        <article class="approach-card reveal">
          <p class="eyebrow">Step&nbsp;${i + 1}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `;
    });
  }

  function renderSchedule() {
    renderCards('[data-cards="schedule"]', site.schedule || [], function (item) {
      return `
        <article class="schedule-card reveal">
          <p class="eyebrow" style="margin-bottom:0.4rem">${escapeHtml(item.days)}</p>
          <h3>${escapeHtml(item.program)}</h3>
          <p class="card-note">${escapeHtml(item.time)}</p>
        </article>
      `;
    });
  }

  function renderFaqs() {
    renderCards('[data-cards="faqs"]', site.faqs || [], function (item) {
      return `
        <details class="faq-item reveal">
          <summary>${escapeHtml(item.question)}</summary>
          <p>${escapeHtml(item.answer)}</p>
        </details>
      `;
    });
  }

  function renderTestimonials() {
    renderCards('[data-cards="testimonials"]', site.testimonials || [], function (item) {
      return `
        <article class="testimonial-card reveal">
          <blockquote>${escapeHtml(item.quote)}</blockquote>
          <cite>— ${escapeHtml(item.author)}</cite>
        </article>
      `;
    });
  }

  /* Enhanced media cards with AI-generated image backgrounds */
  const MEDIA_IMAGE_MAP = ["interior", "garden", "paneer"];

  function renderMedia() {
    const container = document.querySelector('[data-cards="media"]');
    if (!container) return;
    const items = site.media || [];
    container.innerHTML = items.map(function (item, i) {
      return `
        <article class="media-card reveal" data-media="${i}">
          <div class="media-card-content">
            <p class="eyebrow">Inside the space</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.note)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderContactCards() {
    const cards = [
      { title: "Call", body: business.phone || "[Phone Number]",
        href: isConfigured(business.phone) ? phoneHref(business.phone) : "#" },
      { title: "WhatsApp", body: business.whatsapp || "[WhatsApp Number]",
        href: isConfigured(business.whatsapp) ? whatsappHref(business.whatsapp) : "#" },
      { title: "Address", body: business.address || "[Full Address]",
        href: isConfigured(links.mapUrl) ? links.mapUrl : "#" }
    ];

    renderCards('[data-cards="contact"]', cards, function (item) {
      const linkStart = item.href !== "#"
        ? `<a href="${escapeHtml(item.href)}" target="_blank" rel="noreferrer"`
        : `<a aria-disabled="true"`;
      return `
        <article class="contact-card reveal">
          <p class="eyebrow">${escapeHtml(item.title)}</p>
          <h3>${escapeHtml(item.body)}</h3>
          ${linkStart} class="button button-secondary inline-button">Use this contact</a>
        </article>
      `;
    });
  }

  function populateSubjectSelect() {
    const select = document.querySelector("[data-subject-select]");
    if (!select) return;
    (site.enquiryTypes || site.subjects || []).forEach(function (subject) {
      const option = document.createElement("option");
      option.value = subject;
      option.textContent = subject;
      select.appendChild(option);
    });
  }

  function configureForm() {
    const form = document.querySelector("[data-contact-form]");
    const helper = document.querySelector("[data-form-helper]");
    const submitButton = document.querySelector("[data-submit-button]");
    if (!form || !helper || !submitButton) return;

    if (isConfigured(links.formspreeEndpoint)) {
      form.action = links.formspreeEndpoint;
      form.method = "POST";
      helper.textContent = "Send your request here and the restaurant will get back to you.";
      return;
    }

    if (isConfigured(business.email)) {
      helper.textContent = "This form opens your email app with the reservation details filled in.";
    } else if (isConfigured(business.whatsapp)) {
      helper.textContent = "This form opens WhatsApp with the reservation details filled in.";
    } else {
      submitButton.disabled = true;
      helper.textContent = "Please use the phone contact option above.";
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const fd = new FormData(form);
      const name          = fd.get("name")           || "";
      const phone         = fd.get("phone")          || "";
      const preferredTime = fd.get("preferred_time") || "";
      const enquiryType   = fd.get("enquiry_type")   || "";
      const guestCount    = fd.get("guest_count")    || "";
      const message       = fd.get("message")        || "";

      const subjectLine = encodeURIComponent(`Reservation enquiry from ${name || "guest"}`);
      const body = encodeURIComponent([
        `Name: ${name}`, `Phone: ${phone}`,
        `Preferred date and time: ${preferredTime}`, `Enquiry type: ${enquiryType}`,
        `Guests: ${guestCount}`, "", "Message:", message
      ].join("\n"));

      if (isConfigured(business.email)) {
        window.location.href = `mailto:${business.email}?subject=${subjectLine}&body=${body}`;
        return;
      }

      const whatsappMessage = encodeURIComponent([
        "Hello Fun Villa Restaurant - Pure Veg,", "",
        `Name: ${name}`, `Phone: ${phone}`,
        `Preferred date and time: ${preferredTime}`, `Enquiry type: ${enquiryType}`,
        `Guests: ${guestCount}`, "", "Message:", message
      ].join("\n"));

      window.location.href = `${whatsappHref(business.whatsapp)}?text=${whatsappMessage}`;
    });
  }

  /* ── Render all data ────────────────────────────────── */
  function renderPageData() {
    renderChips('[data-list="subjects"]', site.subjects || []);
    renderTextList('[data-list="goals"]', site.goals || []);
    renderTextList('[data-list="audience"]', site.audience || []);
    renderTextList('[data-list="formats"]', about.formats || []);
    renderTextList('[data-list="values"]', about.values || []);
    renderHomeServices();
    renderServicePageCards();
    renderHighlights();
    renderApproach();
    renderSchedule();
    renderFaqs();
    renderTestimonials();
    renderMedia();
    renderContactCards();
    populateSubjectSelect();
    configureForm();
  }

  /* ── Add reveal classes to static sections ──────────── */
  function addRevealClasses() {
    // All section headings
    document.querySelectorAll(".section-heading").forEach(el => {
      el.classList.add("reveal");
    });
    // All panels
    document.querySelectorAll(".panel:not(.hero-copy)").forEach(el => {
      el.classList.add("reveal-scale");
    });
    // Fact grid
    const factGrid = document.querySelector(".fact-grid");
    if (factGrid) factGrid.classList.add("reveal-stagger");
    // Page hero inner
    const phi = document.querySelector(".page-hero-inner");
    if (phi) phi.classList.add("reveal");
    // CTA band
    document.querySelectorAll(".cta-band").forEach(el => el.classList.add("reveal-scale"));
    // Menu category cards (already have reveal on them from the renderer,
    // but ensure the grid container itself staggers)
    const menuGrid = document.querySelector(".menu-grid");
    if (menuGrid) menuGrid.classList.add("reveal-stagger");
  }

  /* ══ INIT ═══════════════════════════════════════════════ */
  renderHeader();
  renderFooter();
  bindFields();
  bindLinks();
  renderPageData();

  // After DOM is fully populated:
  addRevealClasses();
  initHeaderScroll();
  initReveal();

})();

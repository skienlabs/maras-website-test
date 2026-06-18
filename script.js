// =====================================================
// MARAS SOLUTIONS — shared site behavior
// Language is persisted across pages via a ?lang= query
// string (with localStorage as a fallback), so the chosen
// language is retained when navigating between pages.
// =====================================================

(function () {
  var html = document.documentElement;
  var STORAGE_KEY = "maras-lang";

  // Resolve the active language: URL query first, then storage, else Arabic.
  function resolveLang() {
    var m = window.location.search.match(/[?&]lang=(en|ar)/i);
    if (m) return m[1].toLowerCase();
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "ar") return stored;
    } catch (e) {}
    return "ar";
  }

  function setLang(lang) {
    if (lang === "en") {
      html.classList.remove("lang-ar");
      html.classList.add("lang-en");
      html.setAttribute("lang", "en");
      html.setAttribute("dir", "ltr");
    } else {
      html.classList.remove("lang-en");
      html.classList.add("lang-ar");
      html.setAttribute("lang", "ar");
      html.setAttribute("dir", "rtl");
    }
    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.textContent = lang === "en" ? "العربية" : "English";
      btn.setAttribute("aria-label", lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية");
    });
    // Swap placeholders for inputs/textareas that define per-language placeholders.
    document.querySelectorAll("[data-en-placeholder],[data-ar-placeholder]").forEach(function (el) {
      var ph = el.getAttribute(lang === "en" ? "data-en-placeholder" : "data-ar-placeholder");
      if (ph !== null) el.setAttribute("placeholder", ph);
    });
    // Keep <select> values in the active language: the closed box always shows the
    // selected <option>, even when it is display:none, so re-point selection to its
    // matching-language counterpart. EN/AR options are authored as adjacent pairs
    // (data-ar then data-en), so the counterpart is the neighbouring option.
    var wrongAttr = lang === "en" ? "data-ar" : "data-en";
    var rightAttr = lang === "en" ? "data-en" : "data-ar";
    var step = lang === "en" ? 1 : -1;
    document.querySelectorAll("select").forEach(function (sel) {
      var i = sel.selectedIndex;
      var current = sel.options[i];
      if (!current || !current.hasAttribute(wrongAttr)) return;
      var pair = sel.options[i + step];
      if (pair && pair.hasAttribute(rightAttr)) {
        sel.selectedIndex = i + step;
        return;
      }
      for (var j = 0; j < sel.options.length; j++) {
        if (sel.options[j].hasAttribute(rightAttr)) {
          sel.selectedIndex = j;
          break;
        }
      }
    });
    updateInternalLinks(lang);
  }

  // Add ?lang= to every internal page link so the choice carries across navigation.
  function updateInternalLinks(lang) {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#|\/\/)/i.test(href)) return;
      if (href.indexOf(".html") === -1) return;
      var hash = "";
      var hi = href.indexOf("#");
      if (hi >= 0) {
        hash = href.slice(hi);
        href = href.slice(0, hi);
      }
      var base = href.split("?")[0];
      a.setAttribute("href", base + "?lang=" + lang + hash);
    });
  }

  function persistLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState(null, "", url.toString());
    } catch (e) {}
  }

  // Apply the persisted language on load.
  setLang(resolveLang());

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".lang-toggle");
    if (!btn) return;
    var next = html.classList.contains("lang-ar") ? "en" : "ar";
    setLang(next);
    persistLang(next);
  });

  // ---- Mobile nav ----
  var navLinks = document.querySelector(".nav-links");

  // Build a backdrop overlay
  var overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  document.body.appendChild(overlay);

  // Clone the header CTA into the mobile menu (so it stays reachable on small screens)
  if (navLinks) {
    var headerCta = document.querySelector(".nav-actions .btn");
    if (headerCta) {
      var li = document.createElement("li");
      var ctaClone = headerCta.cloneNode(true);
      ctaClone.classList.add("btn", "btn-primary", "menu-cta");
      li.appendChild(ctaClone);
      navLinks.appendChild(li);
    }
  }

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    overlay.classList.remove("show");
    document.body.classList.remove("nav-open");
  }

  function openMenu() {
    if (!navLinks) return;
    navLinks.classList.add("open");
    overlay.classList.add("show");
    document.body.classList.add("nav-open");
  }

  document.addEventListener("click", function (e) {
    var burger = e.target.closest(".nav-burger");
    if (burger) {
      if (navLinks && navLinks.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
      return;
    }

    // Submenu accordion on mobile
    var subToggle = e.target.closest(".has-sub > a");
    if (subToggle && window.innerWidth <= 860) {
      e.preventDefault();
      subToggle.parentElement.classList.toggle("open");
      return;
    }

    // Close menu when a real navigation link (not a parent toggle) is tapped
    var link = e.target.closest(".nav-links a");
    if (link && !link.parentElement.classList.contains("has-sub")) {
      closeMenu();
    }
  });

  // Close on overlay tap
  overlay.addEventListener("click", closeMenu);

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // Reset menu state when resizing up to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) closeMenu();
  });


  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }
})();

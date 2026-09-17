(function () {
  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var iconMenu = document.getElementById("icon-menu");
  var iconClose = document.getElementById("icon-close");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("booking-form");
  var successEl = document.getElementById("form-success");

  // ─── Booking slot cap ────────────────────────────────────────────────────
  var slotConfig    = document.querySelector("[data-booking-slots]");
  var slotsBadge    = document.getElementById("slots-badge");
  var fullyBooked   = document.getElementById("fully-booked");
  var calendlyEmbed = document.getElementById("cal-embed");

  if (slotConfig && slotsBadge) {
    var slots = parseInt(slotConfig.getAttribute("data-booking-slots"), 10);

    if (slots <= 0) {
      // Hide Calendly, show fully booked message
      if (calendlyEmbed) calendlyEmbed.classList.add("hidden");
      if (fullyBooked) fullyBooked.classList.remove("hidden");
    } else {
      // Show badge: urgent styling when only 1–2 left
      var urgent = slots <= 2;
      slotsBadge.innerHTML =
        '<span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ' +
        (urgent
          ? 'bg-amber-50 text-amber-800 ring-amber-300'
          : 'bg-moss-100 text-moss-800 ring-moss-300/60') +
        '">' +
        '<span class="h-1.5 w-1.5 rounded-full ' + (urgent ? 'bg-amber-500' : 'bg-moss-600') + '"></span>' +
        slots + (slots === 1 ? ' spot' : ' spots') + ' available this month' +
        '</span>';
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setMenuOpen(open) {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      mobileNav.classList.remove("hidden");
    } else {
      mobileNav.classList.add("hidden");
    }
    if (iconMenu && iconClose) {
      iconMenu.classList.toggle("hidden", open);
      iconClose.classList.toggle("hidden", !open);
    }
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.contains("hidden");
      setMenuOpen(open);
    });

    document.querySelectorAll(".nav-mobile-link").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setMenuOpen(false);
      }
    });
  }

  var revealSelector = "[data-reveal]";
  var revealEls = document.querySelectorAll(revealSelector);
  if (revealEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.remove("opacity-0", "translate-y-8");
          el.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(el);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.remove("opacity-0", "translate-y-8");
      el.classList.add("opacity-100", "translate-y-0");
    });
  }

  // ─── Testimonial carousel ────────────────────────────────────────────────
  (function () {
    var track = document.getElementById("testimonial-track");
    var wrapper = document.getElementById("testimonial-track-wrapper");
    var prevBtn = document.getElementById("t-prev");
    var nextBtn = document.getElementById("t-next");
    var dotsEl = document.getElementById("t-dots");
    if (!track || !wrapper) return;

    var slides = track.querySelectorAll(".testimonial-slide");
    var total = slides.length;
    var perPage = window.matchMedia("(min-width: 768px)").matches ? 3 : 1;
    var current = 0;

    function getPerPage() {
      return window.matchMedia("(min-width: 768px)").matches ? 3 : 1;
    }

    function maxIndex() {
      return Math.max(0, total - getPerPage());
    }

    function goTo(idx) {
      perPage = getPerPage();
      current = Math.max(0, Math.min(idx, maxIndex()));
      var pct = (100 / perPage) * current;
      track.style.transform = "translateX(-" + pct + "%)";
      updateDots();
    }

    // Build dots
    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = "";
      var pages = Math.ceil(total / getPerPage());
      for (var i = 0; i < pages; i++) {
        var d = document.createElement("button");
        d.setAttribute("aria-label", "Go to page " + (i + 1));
        d.className = "h-2 w-2 rounded-full transition-all duration-300 " +
          (i === 0 ? "bg-moss-600 w-4" : "bg-stone-300");
        (function (idx) {
          d.addEventListener("click", function () { goTo(idx * getPerPage()); });
        })(i);
        dotsEl.appendChild(d);
      }
    }

    function updateDots() {
      if (!dotsEl) return;
      var pp = getPerPage();
      var activePage = Math.floor(current / pp);
      Array.from(dotsEl.children).forEach(function (d, i) {
        d.className = "h-2 rounded-full transition-all duration-300 " +
          (i === activePage ? "bg-moss-600 w-4" : "bg-stone-300 w-2");
      });
    }

    buildDots();

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - getPerPage()); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + getPerPage()); });

    // Touch / swipe support
    var touchStartX = 0;
    wrapper.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    wrapper.addEventListener("touchend", function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    }, { passive: true });

    window.addEventListener("resize", function () {
      buildDots();
      goTo(0);
    });
  })();
  // ─────────────────────────────────────────────────────────────────────────

  // ─── Review form (Netlify Forms) ─────────────────────────────────────────
  (function () {
    var form = document.getElementById("review-form");
    var successEl = document.getElementById("review-success");
    var errorEl = document.getElementById("review-error");
    var submitBtn = document.getElementById("review-submit");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorEl) errorEl.classList.add("hidden");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      var fd = new FormData(form);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(fd).toString(),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("fail");
          form.reset();
          form.classList.add("hidden");
          if (successEl) successEl.classList.remove("hidden");
        })
        .catch(function () {
          if (errorEl) errorEl.classList.remove("hidden");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit review";
          }
        });
    });
  })();
  // ─────────────────────────────────────────────────────────────────────────

})()
// ---------- header scroll state ----------
const header = document.querySelector(".site-header");
function onScroll() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- mobile nav toggle ----------
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

// ---------- scroll reveal ----------
// Content is visible by default in CSS. Only when IntersectionObserver
// is available do we opt elements into the hidden "about to animate"
// state, so a slow/blocked script never leaves the page blank.
function initReveal(el) {
  if (!("IntersectionObserver" in window)) return;
  el.classList.add("reveal-init");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-init");
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );
  observer.observe(el);
}
document.querySelectorAll(".reveal").forEach(initReveal);

// ---------- project card renderer ----------
function projectCardHTML(project) {
  let thumbHTML;
  // Photo wins for the card look; video is kept for the lightbox.
  if (project.image) {
    thumbHTML = `<img class="thumb" src="${project.image}" alt="${project.title}" loading="lazy" decoding="async">`;
  } else if (project.video) {
    const posterAttr = project.poster ? ` poster="${project.poster}"` : "";
    const autoplayAttr = project.autoplay ? " autoplay" : "";
    const preload = project.autoplay ? "auto" : "metadata";
    thumbHTML = `<video class="thumb" src="${project.video}"${posterAttr} muted loop playsinline preload="${preload}"${autoplayAttr}></video>`;
  } else {
    thumbHTML = `<div class="thumb" style="background:${project.color};"></div>`;
  }
  const videoAttr = project.video ? ` data-video="${project.video}" data-video-title="${project.title}"` : "";
  const playBadge = project.video && project.image
    ? `<span class="play-badge" aria-hidden="true">Play</span>`
    : "";
  const clickable = project.video ? " is-video" : "";
  return `
    <article class="project-card reveal${clickable}" data-category="${project.category}"${videoAttr}>
      ${thumbHTML}
      <span class="badge">${project.tag}</span>
      ${playBadge}
      <div class="overlay">
        <span class="tag">${project.category} &middot; ${project.year}</span>
        <h3>${project.title}</h3>
        <p class="meta">${project.client}</p>
      </div>
    </article>
  `;
}

// video cards preview on hover (desktop) since browsers block full autoplay.
// Videos marked autoplay play continuously and are left alone.
document.addEventListener("mouseover", (e) => {
  const card = e.target.closest(".project-card");
  const video = card && card.querySelector("video.thumb");
  if (video && video.paused) video.play().catch(() => {});
});
document.addEventListener("mouseout", (e) => {
  const card = e.target.closest(".project-card");
  const video = card && card.querySelector("video.thumb");
  if (video && !video.autoplay && !card.contains(e.relatedTarget)) {
    video.pause();
    video.currentTime = 0;
  }
});


// ---------- film lightbox (photo cards that still have a video) ----------
function ensureFilmLightbox() {
  let box = document.getElementById("film-lightbox");
  if (box) return box;
  box = document.createElement("div");
  box.id = "film-lightbox";
  box.className = "film-lightbox";
  box.hidden = true;
  box.innerHTML = `
    <div class="film-lightbox__backdrop" data-close-film></div>
    <div class="film-lightbox__panel" role="dialog" aria-modal="true" aria-label="Film player">
      <button type="button" class="film-lightbox__close" data-close-film aria-label="Close">&times;</button>
      <p class="film-lightbox__title"></p>
      <video class="film-lightbox__video" controls playsinline></video>
    </div>
  `;
  document.body.appendChild(box);
  const close = () => {
    const video = box.querySelector("video");
    video.pause();
    video.removeAttribute("src");
    video.load();
    box.hidden = true;
    document.body.classList.remove("film-open");
  };
  box.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-film]")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !box.hidden) close();
  });
  box._close = close;
  return box;
}

function openFilmLightbox(src, title) {
  const box = ensureFilmLightbox();
  box.querySelector(".film-lightbox__title").textContent = title || "";
  const video = box.querySelector("video");
  video.src = src;
  box.hidden = false;
  document.body.classList.add("film-open");
  video.play().catch(() => {});
}

document.addEventListener("click", (e) => {
  const card = e.target.closest(".project-card.is-video");
  if (!card) return;
  const src = card.getAttribute("data-video");
  if (!src) return;
  e.preventDefault();
  openFilmLightbox(src, card.getAttribute("data-video-title") || "");
});


// ---------- featured work (home page) ----------
const featuredGrid = document.querySelector("[data-featured-grid]");
if (featuredGrid && typeof PROJECTS !== "undefined") {
  const featured = PROJECTS.filter((p) => p.featured);
  featuredGrid.innerHTML = featured.map(projectCardHTML).join("");
}

// ---------- full portfolio grid + filters (work page) ----------
const fullGrid = document.querySelector("[data-project-grid]");
if (fullGrid && typeof PROJECTS !== "undefined") {
  fullGrid.innerHTML = PROJECTS.map(projectCardHTML).join("");

  const filterButtons = document.querySelectorAll("[data-filter]");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const value = btn.getAttribute("data-filter");
      fullGrid.querySelectorAll(".project-card").forEach((card) => {
        const match = value === "All" || card.getAttribute("data-category") === value;
        card.style.display = match ? "" : "none";
      });
    });
  });
}

// project cards are injected into the DOM after the initial querySelectorAll
// above ran, so wire up their reveal behavior separately here
document.querySelectorAll(".project-card.reveal").forEach(initReveal);

// ---------- contact form ----------
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const status = contactForm.querySelector(".form-status");
  contactForm.addEventListener("submit", (e) => {
    const name = contactForm.querySelector("#name");
    const email = contactForm.querySelector("#email");
    const message = contactForm.querySelector("#message");

    let valid = true;
    [name, email, message].forEach((field) => {
      if (field && !field.value.trim()) valid = false;
    });
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email.value.trim())) valid = false;

    if (!valid) {
      e.preventDefault();
      if (status) {
        status.textContent = "Please fill out your name, a valid email, and a short message.";
        status.classList.remove("success");
        status.classList.add("visible", "error");
      }
    }
    // If valid, the form submits normally to whatever backend is
    // configured in contact.html (see the comment near the <form> tag).
  });
}

// ---------- footer year ----------
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ---------- Interactive "Build Your Shoot" Scope Builder & Contact Prefill ----------
const SCOPE_CATALOG = {
  "hero-film": {
    id: "hero-film",
    title: "Hero Brand Film (16:9 Flagship)",
    projectType: "Brand Film",
    weight: 1.0,
    format: "4K 24fps Cinema",
    deliverables: [
      "Flagship 16:9 hero brand film (2–3 min graded master)",
      "Pre-shoot creative treatment & shot list planning"
    ]
  },
  "social-cutdowns": {
    id: "social-cutdowns",
    title: "Vertical Social Cutdowns (Reels / TikTok Pack)",
    projectType: "Commercial & Advertising",
    weight: 0.5,
    format: "9:16 Social Pack",
    deliverables: [
      "3–5 vertical 9:16 social edits (7–30s) cut to the beat",
      "Hook variations formatted for Reels, TikTok & Shorts"
    ]
  },
  "photography": {
    id: "photography",
    title: "Lifestyle & Brand Photography Set",
    projectType: "Photography",
    weight: 0.5,
    format: "High-Res Stills",
    deliverables: [
      "25–40+ color-graded high-resolution stills (print & web)",
      "Hospitality atmosphere, plated dishes, cocktails & candid lifestyle frames"
    ]
  },
  "event-recap": {
    id: "event-recap",
    title: "Nightlife / Event Recap Reel (Next-Day Option)",
    projectType: "Commercial & Advertising",
    weight: 0.5,
    format: "Next-Day Event Recap",
    deliverables: [
      "High-energy 30–60s hero recap reel + crowd cutdowns",
      "Fast-turnaround delivery (next-day / 48-hr option available)"
    ]
  },
  "aerial-drone": {
    id: "aerial-drone",
    title: "FAA-Aware Aerial & Drone Cinema",
    projectType: "Aerial / Drone",
    weight: 0.5,
    format: "4K Hospitality Aerials",
    deliverables: [
      "FAA-aware 4K aerial sequences for hospitality, resorts & waterfront venues",
      "Coastal, on-the-water charter, outdoor dining & live event perspectives"
    ]
  },
  "post-production": {
    id: "post-production",
    title: "Full Post-Production, Color & Sound Mix",
    projectType: "Brand Film",
    weight: 0.25,
    format: "35mm Color + Sound Mix",
    deliverables: [
      "35mm-inspired cinema color grade, sound design & audio mix",
      "Multi-platform delivery masters with full commercial rights"
    ]
  }
};

function computeSlateSummary(selectedIds) {
  const items = selectedIds.map((id) => SCOPE_CATALOG[id]).filter(Boolean);
  const count = items.length;
  if (count === 0) {
    return {
      countLabel: "0 DELIVERABLES SELECTED",
      footprint: "Select 1+ items to size shoot",
      format: "Custom Scope",
      bullets: ["Toggle one or more deliverables on the left to build your production slate."],
      projectType: "Brand Film",
      href: "contact.html"
    };
  }

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let footprint;
  if (count === 1 && items[0].id === "post-production") {
    footprint = "Remote Editorial & Finishing";
  } else if (totalWeight <= 0.5) {
    footprint = "Half-Day Location Shoot · Charleston, SC";
  } else if (totalWeight <= 1.5) {
    footprint = "1-Day Location Shoot · Charleston, SC";
  } else if (totalWeight <= 2.5) {
    footprint = "1–2 Day Multi-Asset Shoot · Lowcountry";
  } else {
    footprint = "Multi-Day Full Production Package";
  }

  const formats = items.map((i) => i.format);
  const formatSummary = formats.length <= 2
    ? formats.join(" + ")
    : `${formats[0]} + ${formats[1]} (+${formats.length - 2} more)`;

  const bullets = [];
  items.forEach((item) => {
    item.deliverables.forEach((d) => bullets.push(d));
  });

  // Determine primary project type priority
  let projectType = items[0].projectType;
  if (selectedIds.includes("hero-film")) {
    projectType = "Brand Film";
  } else if (selectedIds.includes("social-cutdowns") || selectedIds.includes("event-recap")) {
    projectType = "Commercial & Advertising";
  } else if (selectedIds.includes("photography")) {
    projectType = "Photography";
  } else if (selectedIds.includes("aerial-drone")) {
    projectType = "Aerial / Drone";
  }

  const scopeParam = encodeURIComponent(selectedIds.join(","));
  return {
    countLabel: `${count} ${count === 1 ? "DELIVERABLE" : "DELIVERABLES"} SELECTED`,
    footprint,
    format: formatSummary,
    bullets,
    projectType,
    href: `contact.html?scope=${scopeParam}`
  };
}

const shootBuilder = document.querySelector("[data-shoot-builder]");
if (shootBuilder) {
  const optionButtons = Array.from(shootBuilder.querySelectorAll(".scope-option"));
  const countEl = shootBuilder.querySelector("[data-slate-count]");
  const footprintEl = shootBuilder.querySelector("[data-slate-footprint]");
  const formatEl = shootBuilder.querySelector("[data-slate-format]");
  const listEl = shootBuilder.querySelector("[data-slate-list]");
  const ctaEl = shootBuilder.querySelector("[data-slate-cta]");

  function syncBuilderUI() {
    const selectedIds = [];
    optionButtons.forEach((btn) => {
      const isSelected = btn.classList.contains("is-selected");
      btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
      const checkEl = btn.querySelector(".scope-option__check");
      if (checkEl) {
        checkEl.textContent = isSelected ? "[ \u2713 ]" : "[ + ]";
      }
      if (isSelected) {
        selectedIds.push(btn.getAttribute("data-scope-id"));
      }
    });

    const summary = computeSlateSummary(selectedIds);
    if (countEl) countEl.textContent = summary.countLabel;
    if (footprintEl) footprintEl.textContent = summary.footprint;
    if (formatEl) formatEl.textContent = summary.format;
    if (listEl) {
      listEl.innerHTML = summary.bullets.map((b) => `<li>${b}</li>`).join("");
    }
    if (ctaEl) {
      ctaEl.setAttribute("href", summary.href);
    }
  }

  optionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-selected");
      syncBuilderUI();
    });
  });

  shootBuilder.querySelectorAll("[data-slate-action]").forEach((presetBtn) => {
    presetBtn.addEventListener("click", () => {
      const action = presetBtn.getAttribute("data-slate-action");
      optionButtons.forEach((btn) => {
        if (action === "full") {
          btn.classList.add("is-selected");
        } else {
          btn.classList.remove("is-selected");
        }
      });
      syncBuilderUI();
    });
  });

  syncBuilderUI();
}

// Prefill contact.html when ?scope=... is present in the URL
if (contactForm && window.location.search) {
  const params = new URLSearchParams(window.location.search);
  const rawScope = params.get("scope");
  if (rawScope) {
    const rawParts = rawScope.split(",").map((s) => s.trim()).filter(Boolean);
    const matchedIds = rawParts.filter((id) => Boolean(SCOPE_CATALOG[id]));
    const projectTypeSelect = contactForm.querySelector("#project-type");
    const messageInput = contactForm.querySelector("#message");
    const prefillBanner = document.getElementById("slate-prefill-banner");
    const prefillSummary = document.querySelector("[data-prefill-summary]");

    if (matchedIds.length > 0) {
      const summary = computeSlateSummary(matchedIds);
      const selectedTitles = matchedIds.map((id) => SCOPE_CATALOG[id].title);

      if (projectTypeSelect) {
        Array.from(projectTypeSelect.options).forEach((opt) => {
          if (opt.textContent.trim() === summary.projectType) {
            projectTypeSelect.value = opt.value;
          }
        });
      }

      if (messageInput && !messageInput.value.trim()) {
        const lines = [
          "Production Slate (via Scope Builder):",
          ...selectedTitles.map((t) => `• ${t}`),
          "",
          `Estimated Shoot Footprint: ${summary.footprint}`,
          `Primary Format: ${summary.format}`,
          "",
          "Project goals, location & target timeline:",
          ""
        ];
        messageInput.value = lines.join("\n");
      }

      if (prefillBanner) {
        prefillBanner.hidden = false;
        if (prefillSummary) {
          prefillSummary.textContent = `${matchedIds.length} ${matchedIds.length === 1 ? "deliverable" : "deliverables"} loaded into your inquiry (${selectedTitles.join(" · ")}). Add your target dates or notes below.`;
        }
      }
    } else if (rawParts.length > 0 && messageInput && !messageInput.value.trim()) {
      messageInput.value = `Requested Scope: ${rawParts.join(", ")}\n\nProject details & target timeline:\n`;
      if (prefillBanner) {
        prefillBanner.hidden = false;
      }
    }
  }
}

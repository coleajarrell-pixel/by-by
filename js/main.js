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

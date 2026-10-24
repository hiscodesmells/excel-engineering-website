/*
 * Applies the wording from content.js to the page.
 *
 * Elements opt in with attributes:
 *   data-copy="home.hero.title"                 -> sets the element's content
 *   data-copy-attr="alt:work.photos.items.0.0"  -> sets attributes (separate several with ";")
 * Paths are property names and list positions joined by dots.
 */
const copy = window.EXCEL_CONTENT || {};
const pageName = document.body.dataset.page;

const one = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];

const lookup = path => path.split(".").reduce((value, key) => (value == null ? undefined : value[key]), copy);
const plain = value => String(value).replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "");

function applyCopy() {
  all("[data-copy]").forEach(element => {
    const value = lookup(element.dataset.copy);
    if (typeof value === "string") element.innerHTML = value;
  });
  all("[data-copy-attr]").forEach(element => {
    element.dataset.copyAttr.split(";").forEach(pair => {
      const [attribute, path] = pair.split(":").map(part => part.trim());
      const value = lookup(path);
      if (attribute && typeof value === "string") element.setAttribute(attribute, plain(value));
    });
  });

  const page = copy[pageName];
  if (page && copy.common) {
    document.title = `${plain(page.pageTitle)} — ${copy.common.siteTitle}`;
    const description = one('meta[name="description"]');
    if (description && page.metaDescription) description.content = page.metaDescription;
  }
  all("[data-year]").forEach(element => { element.textContent = new Date().getFullYear(); });
}

applyCopy();

/* Mobile menu */
const menuButton = one(".menu-button");
const mobileNav = one(".mobile-nav");
menuButton?.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

/* Reveal on scroll */
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  all(".reveal").forEach(element => observer.observe(element));
} else {
  all(".reveal").forEach(element => element.classList.add("visible"));
}

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty("--scroll", `${max > 0 ? scrollY / max * 100 : 0}%`);
}, { passive: true });

/* Gallery videos */
all(".work-media").forEach(media => {
  const video = media.querySelector("video");
  const button = media.querySelector(".video-toggle");
  const labelElement = button?.querySelector("span");
  button?.addEventListener("click", () => {
    all(".work-media video").forEach(other => {
      if (other !== video && !other.paused) {
        other.pause();
        const otherLabel = other.closest(".work-media").querySelector(".video-toggle span");
        if (otherLabel) otherLabel.textContent = copy.work?.play || "Play";
      }
    });
    if (video.paused) {
      video.play();
      if (labelElement) labelElement.textContent = copy.work?.pause || "Pause";
    } else {
      video.pause();
      if (labelElement) labelElement.textContent = copy.work?.play || "Play";
    }
  });
});

/* Photo lightbox */
const lightbox = one(".lightbox");
if (lightbox && typeof lightbox.showModal === "function") {
  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("figcaption");
  all("[data-lightbox]").forEach(trigger => {
    trigger.addEventListener("click", event => {
      event.preventDefault();
      const figure = trigger.closest("figure");
      image.src = trigger.getAttribute("href");
      image.alt = trigger.querySelector("img")?.alt || "";
      caption.innerHTML = figure?.querySelector("figcaption")?.innerHTML || "";
      lightbox.showModal();
    });
  });
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox || event.target.closest(".lightbox-close")) lightbox.close();
  });
  lightbox.addEventListener("close", () => image.removeAttribute("src"));
}

/* Contact form: compose an email to the sales inbox */
const form = one("[data-mail-form]");
form?.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const formCopy = copy.contact?.form || {};
  const lines = [
    [formCopy.name || "Name", data.get("name")],
    [formCopy.company || "Company", data.get("company")],
    [formCopy.email || "Email", data.get("email")],
    [formCopy.phone || "Phone", data.get("phone")],
    [formCopy.requirement || "Requirement", data.get("type")]
  ].map(([key, value]) => `${key}: ${value || "-"}`);
  const body = `${lines.join("\n")}\n\n${data.get("details") || ""}`;
  const subject = `${formCopy.emailSubject || "Enquiry"} — ${data.get("company") || data.get("name")}`;
  const to = form.dataset.mailForm;
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  form.querySelector(".form-success")?.classList.add("show");
});

/* Cursor accent (pointer devices only) */
const dot = one(".cursor-dot");
if (dot && matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", event => {
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
  });
}

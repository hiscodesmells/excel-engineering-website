const copy = window.EXCEL_CONTENT;
const pageName = document.body.dataset.page;
const pageCopy = copy?.[pageName];

const one = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];
const text = (target, value) => {
  const element = typeof target === "string" ? one(target) : target;
  if (element && value !== undefined) element.textContent = value;
};
const html = (target, value) => {
  const element = typeof target === "string" ? one(target) : target;
  if (element && value !== undefined) element.innerHTML = value;
};
const label = (target, value) => {
  const element = typeof target === "string" ? one(target) : target;
  if (!element || value === undefined) return;
  let node = [...element.childNodes].find(child => child.nodeType === Node.TEXT_NODE);
  if (!node) {
    node = document.createTextNode("");
    element.prepend(node);
  }
  node.textContent = `${value} `;
};
const fillList = (selector, values) => {
  all(selector).forEach((element, index) => text(element, values?.[index]));
};

function applyCommonCopy() {
  if (!copy?.common) return;
  const common = copy.common;
  text(".skip-link", common.skipLink);
  all(".desktop-nav, .mobile-nav").forEach(nav => {
    [...nav.querySelectorAll("a")].forEach((link, index) => text(link, common.navigation[index]));
  });
  label(".header-cta", common.discussButton);

  text(".footer-lead .eyebrow", common.footer.eyebrow);
  html(".footer-lead h2", common.footer.title);
  label(".footer-lead .text-link", common.footer.link);
  text(".footer-meta > p:not(.copyright)", common.footer.description);
  const footerMeta = all(".footer-meta > div span");
  text(footerMeta[0], common.footer.location);
  text(footerMeta[1], common.footer.support);
  const year = new Date().getFullYear();
  one(".copyright").innerHTML = `© <span>${year}</span> ${common.footer.copyright}`;
}

function applyHomeCopy() {
  const content = pageCopy;
  text(".hero-copy .eyebrow", content.hero.eyebrow);
  html(".hero-copy h1", content.hero.title);
  text(".hero-copy .hero-intro", content.hero.introduction);
  html(".circle-link span", content.hero.link);
  label(".live-label", content.hero.mediaLiveLabel);
  text(".redline-image figcaption b", content.hero.mediaTitle);
  text(".redline-image figcaption span", content.hero.mediaNote);

  text(".manifesto > .section-kicker", content.manifesto.eyebrow);
  html(".manifesto h2", content.manifesto.title);
  text(".manifesto-copy > p", content.manifesto.text);

  text(".service-band .section-head .section-kicker", content.services.eyebrow);
  label(".service-band .section-head .text-link", content.services.link);
  all(".service-card").forEach((card, index) => {
    const item = content.services.items[index];
    text(card.querySelector("h3"), item.title);
    text(card.querySelector("p"), item.text);
    label(card.querySelector("a"), item.link);
  });

  text(".image-tag", content.standard.mediaLabel);
  text(".feature-copy .section-kicker", content.standard.eyebrow);
  html(".feature-copy h2", content.standard.title);
  all(".feature-copy li").forEach((item, index) => label(item, content.standard.points[index]));
  label(".feature-copy .button", content.standard.link);

  text(".process .section-kicker", content.process.eyebrow);
  text(".process .section-head h2", content.process.title);
  text(".process .section-head > p", content.process.introduction);
  all(".process-list li").forEach((step, index) => {
    text(step.querySelector("h3"), content.process.steps[index][0]);
    text(step.querySelector("p"), content.process.steps[index][1]);
  });
  applyCta(content.cta);
}

function applyCapabilitiesCopy() {
  const content = pageCopy;
  text(".page-hero-copy .eyebrow", content.hero.eyebrow);
  html(".page-hero-copy h1", content.hero.title);
  text(".page-hero-copy > p:last-child", content.hero.text);
  text(".capability-hero-media figcaption", content.hero.mediaLabel);

  all(".cap-row").forEach((row, index) => {
    const item = content.items[index];
    text(row.querySelector("h2"), item.title);
    text(row.querySelector("div p"), item.text);
    fillList.call(null, `.cap-row:nth-child(${index + 1}) li`, item.points);
  });

  text(".materials .section-kicker", content.applications.eyebrow);
  text(".materials h2", content.applications.title);
  text(".materials .section-head > p", content.applications.text);
  fillList(".pill-grid span", content.applications.items);

  text(".quality-block .section-kicker", content.priorities.eyebrow);
  text(".quality-block > div > h2", content.priorities.title);
  all(".quality-grid article").forEach((item, index) => {
    text(item.querySelector("h3"), content.priorities.items[index][0]);
    text(item.querySelector("p"), content.priorities.items[index][1]);
  });
  applyCta(content.cta);
}

function applyWorkCopy() {
  const content = pageCopy;
  text(".work-hero .eyebrow", content.hero.eyebrow);
  html(".work-hero h1", content.hero.title);
  text(".work-hero > p:last-child", content.hero.text);
  const intro = all(".gallery-intro p");
  text(intro[0], content.introduction.label);
  text(intro[1], content.introduction.text);
  all(".work-card").forEach((card, index) => {
    text(card.querySelector("h2"), content.items[index][0]);
    text(card.querySelector(".work-caption p"), content.items[index][1]);
    text(card.querySelector(".video-toggle span"), content.play);
    text(card.querySelector(".work-caption i"), content.mediaCode);
  });
  fillList(".principle-strip span", content.principles);
  applyCta(content.cta);
}

function applyContactCopy() {
  const content = pageCopy;
  text(".contact-hero .eyebrow", content.hero.eyebrow);
  html(".contact-hero h1", content.hero.title);
  text(".contact-hero > div > p:last-child", content.hero.text);
  text(".contact-hero aside > span", content.hero.inputsLabel);
  fillList(".contact-hero li", content.hero.inputs);

  const labels = all(".project-form label");
  label(labels[0], content.form.name);
  labels[0].querySelector("input").placeholder = content.form.namePlaceholder;
  label(labels[1], content.form.company);
  labels[1].querySelector("input").placeholder = content.form.companyPlaceholder;
  label(labels[2], content.form.email);
  labels[2].querySelector("input").placeholder = content.form.emailPlaceholder;
  label(labels[3], content.form.phone);
  labels[3].querySelector("input").placeholder = content.form.phonePlaceholder;
  label(labels[4], content.form.requirement);
  fillList(".project-form option", content.form.requirementOptions);
  label(labels[5], content.form.details);
  labels[5].querySelector("textarea").placeholder = content.form.detailsPlaceholder;
  text(".form-foot p", content.form.note);
  label(".form-foot button", content.form.submit);
  text(".form-success", content.form.success);

  text(".contact-card .section-kicker", content.context.eyebrow);
  text(".contact-card h2", content.context.title);
  text(".contact-card > p:not(.section-kicker)", content.context.text);
  all(".contact-card > div").forEach((detail, index) => {
    text(detail.querySelector("span"), content.context.details[index][0]);
    text(detail.querySelector("b"), content.context.details[index][1]);
  });
}

function applyCta(content) {
  text(".cta-panel .eyebrow", content.eyebrow);
  text(".cta-panel h2", content.title);
  label(".cta-panel .button", content.link);
}

applyCommonCopy();
if (pageCopy) {
  document.title = `${pageCopy.pageTitle} — ${copy.common.siteTitle}`;
  ({ home: applyHomeCopy, capabilities: applyCapabilitiesCopy, work: applyWorkCopy, contact: applyContactCopy })[pageName]?.();
}

const menuButton = one(".menu-button");
const mobileNav = one(".mobile-nav");
menuButton?.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
all(".reveal").forEach(element => observer.observe(element));

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty("--scroll", `${max > 0 ? scrollY / max * 100 : 0}%`);
}, { passive: true });

all(".work-media").forEach(media => {
  const video = media.querySelector("video");
  const button = media.querySelector(".video-toggle");
  button?.addEventListener("click", () => {
    all(".work-media video").forEach(other => {
      if (other !== video) other.pause();
    });
    if (video.paused) {
      video.play();
      text(button.querySelector("span"), copy.work.pause);
    } else {
      video.pause();
      text(button.querySelector("span"), copy.work.play);
    }
  });
});

const form = one("[data-demo-form]");
form?.addEventListener("submit", event => {
  event.preventDefault();
  form.querySelector(".form-success").classList.add("show");
});

const dot = one(".cursor-dot");
if (dot) {
  window.addEventListener("pointermove", event => {
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
  });
}

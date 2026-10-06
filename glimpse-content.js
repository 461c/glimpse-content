// GlimpseContent: a quiet article outline with hover labels and scroll tracking.
(() => {
  const data = document.currentScript?.dataset || {};
  const number = (key, fallback) => {
    const value = Number(data[key] ?? fallback);
    return Number.isFinite(value) && value >= 0 ? value : fallback;
  };
  const contentSelector = data.content || "article, #body, main";
  const headerSelector = data.header;
  const minWidth = number("minWidth", 800);
  const minHeadings = number("minHeadings", 4);
  const offset = number("offset", 24);

  function init() {
    const article = document.querySelector(contentSelector);
    if (!article || document.querySelector(".glimpse-content")) return;

    const headings = Array.from(article.querySelectorAll("h2, h3"));
    const total = article.querySelectorAll("h1, h2, h3, h4, h5, h6").length;
    if (!headings.length || total < minHeadings) return;

    const media = window.matchMedia(`(min-width: ${minWidth + 1}px)`);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const headerHeight = () => headerSelector
      ? document.querySelector(headerSelector)?.getBoundingClientRect().height || 0
      : 0;
    let toc;
    let active = -1;
    let frame;

    function updateActive() {
      if (!toc) return;

      const threshold = headerHeight() + offset + 1;
      let current = -1;
      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= threshold) current = index;
      });
      if (window.scrollY > 0 &&
          window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = headings.length - 1;
      }
      if (current === active) return;

      active = current;
      Array.from(toc.children).forEach((link, index) => {
        link.classList.toggle("is-active", index === current);
        if (index === current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    function updateToc() {
      if (!media.matches) {
        toc?.remove();
        toc = null;
        return;
      }
      if (toc) return;

      toc = document.createElement("aside");
      toc.className = "glimpse-content";
      toc.setAttribute("role", "navigation");
      toc.setAttribute("aria-label", data.label || "Contents");

      headings.forEach((heading, index) => {
        if (!heading.id) {
          let id = `glimpse-heading-${index + 1}`;
          while (document.getElementById(id)) id += "-";
          heading.id = id;
        }

        const link = document.createElement("a");
        link.href = `#${encodeURIComponent(heading.id)}`;
        link.className = heading.tagName === "H2" ? "glimpse-h2" : "glimpse-h3";
        const label = document.createElement("span");
        label.textContent = heading.textContent.trim();
        link.append(label);
        link.addEventListener("click", event => {
          event.preventDefault();
          window.scrollTo({
            top: heading.getBoundingClientRect().top + window.scrollY - headerHeight() - offset,
            behavior: reducedMotion.matches ? "auto" : "smooth"
          });
        });
        toc.append(link);
      });

      document.body.append(toc);
      active = -1;
      updateActive();
    }

    function scheduleUpdate() {
      if (!toc || frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        updateActive();
      });
    }

    updateToc();
    media.addEventListener("change", updateToc);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
  }

  if (document.readyState === "complete") init();
  else window.addEventListener("load", init, { once: true });
})();

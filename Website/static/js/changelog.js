function initChangelog() {
  const container = document.getElementById("changelog");
  if (!container) return;

  const entries = container.querySelectorAll(".timeline-entry");
  if (!entries.length) return;

  const observer = new IntersectionObserver(
    (items, obs) => {
      items.forEach(item => {
        if (item.isIntersecting) {
          item.target.classList.add("visible");
          obs.unobserve(item.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  entries.forEach((entry, idx) => {
    entry.classList.remove("visible");
    // stagger: slightly slower than last tweak
    entry.style.transitionDelay = `${idx * 120}ms`;
    observer.observe(entry);
  });
}

// CORECTURĂ IMPORTANTĂ: Expunem functia la nivel global (window)
// pentru ca navigation.js sa o poata apela atunci cand utilizatorul schimba pagina.
window.initChangelog = initChangelog;
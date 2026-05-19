// Prevent initial flash by hiding pages until we set the correct one
document.documentElement.classList.add('nav-prep');

function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(p => p.classList.remove('active'));

  const page = document.getElementById(pageId);
  if (!page) return;

  page.classList.add('active');

  if (pageId === 'projects') {
    setupProjectReadMore();
  }

  window.scrollTo(0, 0);
  if (pageId === 'changelog' && typeof window.initChangelog === 'function') {
    window.initChangelog();
  }
}

// Activate page based on URL hash (e.g., #projects)
function activatePageFromHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    showPage(hash);
  } else {
    showPage('home'); // Pagina implicita daca nu exista hash
  }
  document.documentElement.classList.remove('nav-prep');
  document.documentElement.classList.add('nav-ready');
}

window.addEventListener('hashchange', activatePageFromHash);
document.addEventListener('DOMContentLoaded', activatePageFromHash);

// Enable footer links that declare a target page via data-page
document.addEventListener('DOMContentLoaded', function() {
  const footerLinks = document.querySelectorAll('[data-page]');
  footerLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      const targetPage = link.getAttribute('data-page');
      if (!targetPage || typeof showPage !== 'function') return;

      event.preventDefault();
      showPage(targetPage);
    });
  });
});

// Collapse long project descriptions with a localized read-more toggle
function setupProjectReadMore() {
  const lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
  const labels = {
    more: lang === 'ro' ? '… Citește mai mult' : '… Read more',
    less: lang === 'ro' ? '… Mai puțin' : '… Show less'
  };

  const cards = document.querySelectorAll('#projects .project-card');
  cards.forEach(function(card) {
    if (card.dataset.readmoreInitialized === 'true') return;

    // If a manual cut marker exists, split content there for a precise truncation
    const cutMarker = card.querySelector('.readmore-cut');
    if (cutMarker) {
      const extraContainer = document.createElement('div');
      extraContainer.className = 'readmore-extra';

      // Move remaining nodes in the marker's parent after the marker
      const parent = cutMarker.parentNode;
      while (cutMarker.nextSibling) {
        extraContainer.appendChild(cutMarker.nextSibling);
      }

      // Move all following siblings of the parent into the extra container
      let sibling = parent.nextSibling;
      while (sibling) {
        const next = sibling.nextSibling;
        extraContainer.appendChild(sibling);
        sibling = next;
      }

      parent.parentNode.insertBefore(extraContainer, parent.nextSibling);

      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'read-more-btn';
      toggleBtn.textContent = labels.more;

      const placeholder = document.createElement('span');
      placeholder.className = 'readmore-placeholder';
      cutMarker.replaceWith(placeholder);
      placeholder.after(toggleBtn);

      card.classList.add('collapsible', 'collapsed', 'manual-readmore');

      toggleBtn.addEventListener('click', function() {
        const isCollapsed = card.classList.toggle('collapsed');
        toggleBtn.textContent = isCollapsed ? labels.more : labels.less;
        if (isCollapsed) {
          placeholder.after(toggleBtn);
        } else {
          extraContainer.appendChild(toggleBtn);
        }
      });

      card.dataset.readmoreInitialized = 'true';
      return;
    }

    // Wrap existing contents so we can clamp only the text section
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'project-content';
    while (card.firstChild) {
      contentWrapper.appendChild(card.firstChild);
    }
    card.appendChild(contentWrapper);

    // Only add toggle if content is long enough
    const needsCollapse = contentWrapper.scrollHeight > 420;
    if (!needsCollapse) {
      card.dataset.readmoreInitialized = 'true';
      return;
    }

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'read-more-btn';
    toggleBtn.textContent = labels.more;

    card.classList.add('collapsible', 'collapsed');
    card.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', function() {
      const isCollapsed = card.classList.toggle('collapsed');
      toggleBtn.textContent = isCollapsed ? labels.more : labels.less;
    });

    card.dataset.readmoreInitialized = 'true';
  });
}

// Adaptare pentru comutatorul de limba in backend-ul local
document.addEventListener('DOMContentLoaded', function() {
  const langLinks = document.querySelectorAll('.lang-switch');
  langLinks.forEach(function(link) {
    link.addEventListener('click', function(evt) {
      // Daca nu ai configurat inca ruta de limba romana in Python,
      // prevenim eroarea 404 si mentinem utilizatorul pe pagina curenta.
      evt.preventDefault();
      const activePage = document.querySelector('.page.active');
      const pageId = activePage ? activePage.id : 'home';
      console.log("Language switch clicked for page: #" + pageId);

      // Nota: Cand adaugi versiunea in romana in Flask, ruta se va schimba aici.
      // Pentru moment pastram hash-ul paginii intact.
      window.location.hash = '#' + pageId;
    });
  });
});
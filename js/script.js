let activePage = null;

// ── Panel Navigation ──────────────────────────────────────
function openPanel(page) {
  const panel = document.getElementById('panel-' + page);
  if (!panel) return;

  closeAllPanels();

  activePage = page;
  panel.classList.add('active');
  
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) siteHeader.classList.add('visible');
  
  document.body.style.overflow = 'hidden';

  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-link[data-page="${page}"], .mobile-nav-link[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');
}

function closeAllPanels() {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => l.classList.remove('active'));
  
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) siteHeader.classList.remove('visible');
  
  closeMobileMenu();
  document.body.style.overflow = '';
  activePage = null;
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileToggle = document.getElementById('mobile-toggle');
  
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (mobileToggle) mobileToggle.classList.remove('active');
}

function initNav() {
  // Home screen buttons ("Me", "Contact")
  document.querySelectorAll('.home-word').forEach(btn => {
    btn.addEventListener('click', () => {
      openPanel(btn.dataset.page);
    });
  });

  // Desktop navigation links
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      if (activePage === btn.dataset.page) {
        closeAllPanels();
      } else {
        openPanel(btn.dataset.page);
      }
    });
  });

  // Mobile navigation links
  document.querySelectorAll('.mobile-nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      closeMobileMenu();
      if (activePage === btn.dataset.page) {
        closeAllPanels();
      } else {
        openPanel(btn.dataset.page);
      }
    });
  });

  // Mobile toggle button
  const mobileToggle = document.getElementById('mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const menu = document.getElementById('mobile-menu');
      mobileToggle.classList.toggle('active');
      if (menu) menu.classList.toggle('open');
    });
  }

  // Site name / logo link to return home
  const siteName = document.getElementById('site-name');
  if (siteName) {
    siteName.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllPanels();
    });
  }

  // Close panels on 'Escape' key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activePage) {
      closeAllPanels();
    }
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
});

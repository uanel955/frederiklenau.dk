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
}

function closeAllPanels() {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) siteHeader.classList.remove('visible');
  
  document.body.style.overflow = '';
  activePage = null;
}

function initNav() {
  // Home screen buttons ("Me", "Contact")
  document.querySelectorAll('.home-word').forEach(btn => {
    btn.addEventListener('click', () => {
      openPanel(btn.dataset.page);
    });
  });

  // Site name / logo link returns home
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

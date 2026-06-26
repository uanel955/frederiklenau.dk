const PIECES = [
  {
    id: 'is-it-that-season-of-the-year',
    title: 'is it that season of the year?',
    media: 'oil and acryl on canvas',
    dimensions: '100 x 150 cm',
    year: 2025,
    status: 'available',
    images: ['images/is_it_that_season_of_the_year.jpg']
  },
  {
    id: 'is-it-normal-to-interrupt-so-much',
    title: 'is it normal to interrupt so much?',
    media: 'acryl on canvas',
    dimensions: '100 x 150 cm',
    year: 2025,
    status: 'available',
    images: ['images/is_it_normal_to_interrupt_so_much.jpg']
  },
  {
    id: 'if-you-could-move-the-same-way',
    title: 'if you could move the same way',
    media: 'oil and acryl on canvas',
    dimensions: '100 x 150 cm',
    year: 2025,
    status: 'sold',
    images: ['images/if_you_could_move_the_same_way.jpg']
  },
  {
    id: 'can-you-decide',
    title: 'can you decide?',
    media: 'acryl on canvas',
    dimensions: '100 x 150 cm',
    year: 2025,
    status: 'sold',
    images: ['images/can_you_decide.jpg']
  },
  {
    id: 'this-place-seems-familiar',
    title: 'this place seems familiar',
    media: 'acryl on canvas',
    dimensions: '30 x 50 cm',
    year: 2025,
    status: 'available',
    images: ['images/IMG_7600.jpg']
  }
];

const ARCHITECTURE = [
  {
    id: 'angle-a',
    title: 'angle a',
    images: ['images/IMG_7912.jpg']
  },
  {
    id: 'angle-b',
    title: 'angle b',
    images: ['images/IMG_7913.jpg']
  },
  {
    id: 'angle-c',
    title: 'angle c',
    images: ['images/IMG_7914.jpg']
  },
  {
    id: 'above-plan',
    title: 'floor plan',
    images: ['images/IMG_7915.jpg']
  }
];

let currentLightboxIndex = 0;
let filteredPieces = PIECES;
let crossfadeTimer = null;
let activePage = null;
let activeCollection = PIECES;

// ── Panel navigation ──────────────────────────────────────
function openPanel(page) {
  const panel = document.getElementById('panel-' + page);
  if (!panel) return;

  closeAllPanels();

  activePage = page;
  panel.classList.add('active');
  document.getElementById('site-header').classList.add('visible');
  document.body.style.overflow = 'hidden';

  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-link[data-page="${page}"], .mobile-nav-link[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');

  if (page === 'work') {
    activeCollection = PIECES;
    filteredPieces = PIECES;
    openLightbox(0);
  } else if (page === 'architecture') {
    activeCollection = ARCHITECTURE;
    filteredPieces = ARCHITECTURE;
    openLightbox(0);
  }
}

function closeAllPanels() {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('site-header').classList.remove('visible');
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('mobile-toggle').classList.remove('active');
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
  activePage = null;
}

function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('mobile-toggle').classList.remove('active');
}

function initNav() {
  document.querySelectorAll('.home-word').forEach(btn => {
    btn.addEventListener('click', () => {
      openPanel(btn.dataset.page);
    });
  });

  document.querySelectorAll('.about-link').forEach(btn => {
    btn.addEventListener('click', () => {
      openPanel(btn.dataset.page);
    });
  });

  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      if (activePage === btn.dataset.page) {
        closeAllPanels();
      } else {
        openPanel(btn.dataset.page);
      }
    });
  });

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

  document.getElementById('mobile-toggle').addEventListener('click', () => {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });

  document.getElementById('site-name').addEventListener('click', (e) => {
    e.preventDefault();
    closeAllPanels();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('lightbox');
      if (lightbox.classList.contains('active')) {
        closeLightbox();
      } else if (activePage) {
        closeAllPanels();
      }
    }
  });
}

// ── Lightbox ──────────────────────────────────────────────
function openLightbox(index) {
  currentLightboxIndex = index;
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  document.getElementById('site-header').classList.add('visible');
  document.body.style.overflow = 'hidden';
  updateLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  if (!activePage) {
    document.getElementById('site-header').classList.remove('visible');
    document.body.style.overflow = '';
  }
}

function updateLightbox() {
  const piece = activeCollection[currentLightboxIndex];
  const img = document.getElementById('lightbox-img');
  const imgBack = document.getElementById('lightbox-img-back');
  const meta = document.getElementById('lightbox-meta');
  const counter = document.getElementById('lightbox-counter');
  const spinner = document.getElementById('lightbox-spinner');

  if (crossfadeTimer) {
    clearTimeout(crossfadeTimer);
    crossfadeTimer = null;
  }

  spinner.classList.add('active');

  if (piece.images.length > 0) {
    const newImg = new Image();
    newImg.onload = () => {
      imgBack.src = piece.images[0];
      imgBack.alt = piece.title;
      imgBack.style.opacity = '1';
      img.style.opacity = '0';
      spinner.classList.remove('active');

      crossfadeTimer = setTimeout(() => {
        img.src = imgBack.src;
        img.alt = imgBack.alt;
        img.style.opacity = '1';
        imgBack.style.opacity = '0';
        crossfadeTimer = null;
      }, 500);
    };
    newImg.onerror = () => {
      spinner.classList.remove('active');
    };
    newImg.src = piece.images[0];
  }

  counter.textContent = `${currentLightboxIndex + 1} / ${activeCollection.length}`;

  const statusText = piece.status === 'sold' ? ' — sold' : '';
  const mediaText = piece.media ? ` · ${piece.media}` : '';
  const dimText = piece.dimensions ? `${piece.dimensions}` : '';
  const yearText = piece.year ? ` · ${piece.year}` : '';
  const enquireText = piece.status === 'available'
    ? ` · <a href="mailto:frederik@lenau.dk?subject=Inquiry: ${encodeURIComponent(piece.title)}" class="meta-enquire">inquire</a>`
    : '';
  meta.innerHTML = `
    <div class="meta-title">${piece.title}</div>
    <div class="meta-separator"></div>
    <div class="meta-details">${dimText}${mediaText}${yearText}${statusText}${enquireText}</div>
  `;

  document.getElementById('lightbox-prev').style.display = currentLightboxIndex > 0 ? 'block' : 'none';
  document.getElementById('lightbox-next').style.display = currentLightboxIndex < activeCollection.length - 1 ? 'block' : 'none';
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);

  document.getElementById('lightbox-prev').addEventListener('click', () => {
    if (currentLightboxIndex > 0) {
      currentLightboxIndex--;
      updateLightbox();
    }
  });

  document.getElementById('lightbox-next').addEventListener('click', () => {
    if (currentLightboxIndex < activeCollection.length - 1) {
      currentLightboxIndex++;
      updateLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft' && currentLightboxIndex > 0) {
      currentLightboxIndex--;
      updateLightbox();
    }
    if (e.key === 'ArrowRight' && currentLightboxIndex < activeCollection.length - 1) {
      currentLightboxIndex++;
      updateLightbox();
    }
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const line = document.createElement('div');
  line.className = 'continuum-line';
  document.body.appendChild(line);

  initNav();
  initLightbox();
  preloadImages();
});

function preloadImages() {
  PIECES.forEach(p => {
    if (p.images.length > 0) {
      const img = new Image();
      img.src = p.images[0];
    }
  });
}

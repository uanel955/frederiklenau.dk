const PIECES = [
  {
    id: 'is-it-that-season-of-the-year',
    title: 'is it that season of the year?',
    media: 'acryl on canvas',
    dimensions: '100 x 150 cm',
    year: 2025,
    status: 'available',
    images: ['images/is_it_that_season_of_the_year.png']
  },
  {
    id: 'is-it-normal-to-interrupt-so-much',
    title: 'is it normal to interrupt so much?',
    media: 'acryl on canvas',
    dimensions: '100 x 150 cm',
    year: 2025,
    status: 'available',
    images: ['images/is_it_normal_to_interrupt_so_much.png']
  },
  {
    id: 'if-you-could-move-the-same-way',
    title: 'if you could move the same way',
    media: 'acryl on canvas',
    dimensions: '100 x 150 cm',
    year: 2025,
    status: 'sold',
    images: ['images/if_you_could_move_the_same_way.png']
  },
  {
    id: 'can-you-decide',
    title: 'can you decide?',
    media: 'acryl on canvas',
    dimensions: '100 x 150 cm',
    year: 2025,
    status: 'sold',
    images: ['images/can_you_decide.png']
  }
];

let currentLightboxIndex = 0;
let filteredPieces = [];
let galleryRendered = false;
let touchStartX = 0;
let touchEndX = 0;
let crossfadeTimer = null;
let activePage = null;

// ── Panel navigation ──────────────────────────────────────
function openPanel(page) {
  const panel = document.getElementById('panel-' + page);
  if (!panel) return;

  closeAllPanels();

  activePage = page;
  panel.classList.add('active');
  document.getElementById('site-header').classList.add('visible');
  document.body.style.overflow = 'hidden';

  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');

  if (page === 'work' && !galleryRendered) {
    renderGallery();
    galleryRendered = true;
  }
}

function closeAllPanels() {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('site-header').classList.remove('visible');
  document.body.style.overflow = '';
  activePage = null;
}

function initNav() {
  document.querySelectorAll('.home-word').forEach(btn => {
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

// ── Gallery ───────────────────────────────────────────────
function renderGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  filteredPieces = PIECES;

  gallery.innerHTML = filteredPieces.map((p, i) => {
    if (p.images.length > 0) {
      return `<div class="gallery-item" data-index="${i}" style="--i: ${i}">
        <img src="${p.images[0]}" alt="${p.title}" loading="lazy"/>
        <div class="gallery-item-title"><span>${p.title}</span></div>
      </div>`;
    }
    return '';
  }).join('');

  gallery.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(parseInt(item.dataset.index));
    });
  });
}

// ── Lightbox ──────────────────────────────────────────────
function openLightbox(index) {
  currentLightboxIndex = index;
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  updateLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

function updateLightbox() {
  const piece = filteredPieces[currentLightboxIndex];
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

  counter.textContent = `${currentLightboxIndex + 1} / ${filteredPieces.length}`;

  const statusText = piece.status === 'sold' ? ' — sold' : '';
  meta.innerHTML = `
    <div class="meta-title">${piece.title}</div>
    ${piece.dimensions} · ${piece.media} · ${piece.year}${statusText}
  `;

  document.getElementById('lightbox-prev').style.display = currentLightboxIndex > 0 ? 'block' : 'none';
  document.getElementById('lightbox-next').style.display = currentLightboxIndex < filteredPieces.length - 1 ? 'block' : 'none';
}

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) < 50) return;
  if (diff > 0 && currentLightboxIndex < filteredPieces.length - 1) {
    currentLightboxIndex++;
    updateLightbox();
  } else if (diff < 0 && currentLightboxIndex > 0) {
    currentLightboxIndex--;
    updateLightbox();
  }
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
    if (currentLightboxIndex < filteredPieces.length - 1) {
      currentLightboxIndex++;
      updateLightbox();
    }
  });

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft' && currentLightboxIndex > 0) {
      currentLightboxIndex--;
      updateLightbox();
    }
    if (e.key === 'ArrowRight' && currentLightboxIndex < filteredPieces.length - 1) {
      currentLightboxIndex++;
      updateLightbox();
    }
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initLightbox();
});

const HERO_IMAGES = [
  'images/a_lake_and_a_sea.jpg',
  'images/is_it_that_season_of_the_year.jpg',
  'images/differences_interupt.jpg',
  'images/could_you_move_the_same_way.jpeg',
  'images/can_you_decide.jpeg',
  'images/can_you_see_through.jpg',
  'images/gone_1.jpg',
  'images/is_it_that_season_of_the_year.png',
  'images/is_it_normal_to_interrupt_so_much.png',
  'images/if_you_could_move_the_same_way.png',
  'images/can_you_decide.png'
];

let currentHeroIndex = 0;
let heroInterval = null;

function initHeroCarousel() {
  const carousel = document.getElementById('hero-carousel');
  if (!carousel) return;

  carousel.innerHTML = HERO_IMAGES.map((src, i) =>
    `<div class="hero-slide${i === 0 ? ' active' : ''}"><img src="${src}" alt=""/></div>`
  ).join('');

  heroInterval = setInterval(() => {
    const slides = carousel.querySelectorAll('.hero-slide');
    slides[currentHeroIndex].classList.remove('active');
    currentHeroIndex = (currentHeroIndex + 1) % slides.length;
    slides[currentHeroIndex].classList.add('active');
  }, 4000);
}

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

function getPageFromHash() {
  const hash = location.hash.replace('#', '');
  if (!hash || hash === 'home') return 'home';
  if (hash === 'work') return 'work';
  if (hash === 'about') return 'about';
  if (hash === 'contact') return 'contact';
  return 'home';
}

function navigate() {
  const page = getPageFromHash();

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const target = document.getElementById(page);
  if (target) {
    target.classList.add('active');
  }

  const navLink = document.querySelector(`.nav-link[href="#${page}"]`);
  if (navLink) {
    navLink.classList.add('active');
  }

  if (page === 'work') {
    renderGallery();
  }

  window.scrollTo(0, 0);
}

function renderGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  filteredPieces = PIECES;

  gallery.innerHTML = filteredPieces.map((p, i) => {
    if (p.images.length > 0) {
      return `<div class="gallery-item" data-index="${i}">
        <img src="${p.images[0]}" alt="${p.title}" loading="lazy"/>
      </div>`;
    } else {
      return `<div class="gallery-item" data-index="${i}">
        <div class="gallery-item-placeholder">
          <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="60" fill="#ccc"/></svg>
        </div>
      </div>`;
    }
  }).join('');

  gallery.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(parseInt(item.dataset.index));
    });
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  updateLightbox();
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const piece = filteredPieces[currentLightboxIndex];
  const img = document.getElementById('lightbox-img');
  const meta = document.getElementById('lightbox-meta');

  if (piece.images.length > 0) {
    img.src = piece.images[0];
    img.alt = piece.title;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }

  const statusText = piece.status === 'gone' ? ' — gone' : piece.status === 'sold' ? ' — sold' : '';
  meta.innerHTML = `
    <div class="meta-title">${piece.title}</div>
    ${piece.dimensions} · ${piece.media} · ${piece.year}${statusText}
  `;

  document.getElementById('lightbox-prev').style.display = currentLightboxIndex > 0 ? 'block' : 'none';
  document.getElementById('lightbox-next').style.display = currentLightboxIndex < filteredPieces.length - 1 ? 'block' : 'none';
}

function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const sidebar = document.getElementById('sidebar');

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initMobileMenu();
  navigate();

  window.addEventListener('hashchange', navigate);

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

  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentLightboxIndex > 0) {
      currentLightboxIndex--;
      updateLightbox();
    }
    if (e.key === 'ArrowRight' && currentLightboxIndex < filteredPieces.length - 1) {
      currentLightboxIndex++;
      updateLightbox();
    }
  });
});

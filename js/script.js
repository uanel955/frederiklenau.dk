const PIECES = [
  {
    id: 'this-place-seems-familiar-right',
    title: 'this place seems familiar right?',
    media: 'acryl on canvas',
    dimensions: '00 x 00 cm',
    year: 2026,
    status: 'available',
    images: []
  },
  {
    id: 'a-lake-and-a-sea',
    title: 'a lake and a sea',
    media: 'acryl on canvas',
    dimensions: '00 x 00 cm',
    year: 2026,
    status: 'available',
    images: ['images/a_lake_and_a_sea.jpg']
  },
  {
    id: 'stone-in-the-water',
    title: 'stone in the water',
    media: 'acryl and oil stick on canvas',
    dimensions: '00 x 00 cm',
    year: 2026,
    status: 'available',
    images: []
  },
  {
    id: 'is-it-that-season-of-the-year',
    title: 'is it that season of the year?',
    media: 'acryl on canvas',
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
    images: ['images/differences_interupt.jpg']
  },
  {
    id: 'sitting-by',
    title: 'sitting by',
    media: 'acryl and oil stick on canvas',
    dimensions: '100 x 100 cm',
    year: 2025,
    status: 'available',
    images: []
  },
  {
    id: 'why-run',
    title: 'why run',
    media: 'acryl and oil stick on canvas',
    dimensions: '60 x 80 cm',
    year: 2025,
    status: 'gone',
    images: ['images/gone_1.jpg']
  },
  {
    id: 'if-you-could-move-the-same-way',
    title: 'if you could move the same way',
    media: 'acryl on canvas',
    dimensions: '100 x 150 cm',
    year: 2025,
    status: 'sold',
    images: ['images/could_you_move_the_same_way.jpeg']
  },
  {
    id: 'can-you-decide',
    title: 'can you decide?',
    media: 'acryl on canvas',
    dimensions: '100 x 150 cm',
    year: 2025,
    status: 'sold',
    images: ['images/can_you_decide.jpeg']
  },
  {
    id: 'can-you-see-through',
    title: 'can you see through?',
    media: 'acryl on canvas',
    dimensions: '100 x 70 cm',
    year: 2025,
    status: 'sold',
    images: ['images/can_you_see_through.jpg']
  }
];

const piecesIndex = {};
PIECES.forEach((p, i) => { piecesIndex[p.id] = { ...p, index: i }; });

function getSlugFromHash() {
  const h = location.hash.replace('#', '');
  if (!h || h === 'home') return null;
  return h;
}

function renderHome() {
  const list = document.getElementById('pieces-list');
  if (!list) return;
  list.innerHTML = PIECES.map(p => {
    let label = `<a href="#${p.id}">${p.title}</a>`;
    if (p.status === 'gone') label += ` <span class="status-tag">gone</span>`;
    if (p.status === 'sold') label += ` <span class="status-tag">sold</span>`;
    return `<li>${label}</li>`;
  }).join('');
}

function renderPiece(slug) {
  const container = document.getElementById('piece-container');
  const p = piecesIndex[slug];
  if (!p) return;

  const statusText = p.status === 'gone' ? ' — gone' : p.status === 'sold' ? ' — sold' : '';
  const hasInquire = p.status === 'available';
  const meta = `${p.media}, ${p.dimensions}, ${p.year}${statusText}`;
  const prevPiece = PIECES[p.index - 1] || null;
  const nextPiece = PIECES[p.index + 1] || null;

  let imageHtml;
  if (p.images.length > 0) {
    imageHtml = `<img class="piece-image" src="${p.images[0]}" alt="${p.title}" onerror="this.onerror=null;this.style.display='none';document.getElementById('ph-${p.id}').style.display='flex'" />`;
    imageHtml += `<div id="ph-${p.id}" class="teal-placeholder" style="display:none">`;
    imageHtml += tealSvg();
    imageHtml += `</div>`;
  } else {
    imageHtml = `<div class="teal-placeholder">${tealSvg()}</div>`;
  }

  let navHtml = '';
  if (prevPiece) {
    navHtml += `<a href="#${prevPiece.id}">&larr;</a>`;
  } else {
    navHtml += `<span style="color:#ddd">&larr;</span>`;
  }
  navHtml += `<a href="#home" class="nav-front">front</a>`;
  if (nextPiece) {
    navHtml += `<a href="#${nextPiece.id}">&rarr;</a>`;
  } else {
    navHtml += `<span style="color:#ddd">&rarr;</span>`;
  }
  if (hasInquire) {
    navHtml += `<a class="nav-inquire" href="mailto:frederik@lenau.dk?subject=Inquiry%3A%20${encodeURIComponent(p.title)}">inquire</a>`;
  }

  container.innerHTML = `
    <div class="piece-title">${p.title}</div>
    <div class="piece-meta">${meta}</div>
    <div class="piece-image-wrap" id="iw-${p.id}">
      ${imageHtml}
    </div>
    <div class="piece-nav">${navHtml}</div>
  `;
}

function tealSvg() {
  return `<svg viewBox="0 0 200 200" width="200" height="200" style="display:block;margin:0 auto"><circle cx="100" cy="100" r="60" fill="#d4d0ca"/></svg>`;
}

function navigate() {
  const slug = getSlugFromHash();

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  if (!slug) {
    document.getElementById('home-section').classList.add('active');
    window.scrollTo(0, 0);
    return;
  }

  const piece = piecesIndex[slug];
  if (!piece) {
    document.getElementById('home-section').classList.add('active');
    window.scrollTo(0, 0);
    return;
  }

  document.getElementById('piece-section').classList.add('active');
  renderPiece(slug);
  window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  navigate();

  window.addEventListener('hashchange', navigate);
});

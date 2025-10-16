/* filtered-temples.js
   - Build temple cards from the temples array
   - Implement filters: home, old (<1900), new (>2000), large (>90000), small (<10000)
   - Use native lazy loading for images
   - Update footer year and last modified
   - Uses template literals exclusively when building HTML strings for output
*/

document.addEventListener('DOMContentLoaded', () => {
  /* === Temple data array (includes the provided items + 3 additional entries) === */
  const temples = [
    {
      templeName: "Aba Nigeria",
      location: "Aba, Nigeria",
      dedicated: "2005, August, 7",
      area: 11500,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
    },
    {
      templeName: "Manti Utah",
      location: "Manti, Utah, United States",
      dedicated: "1888, May, 21",
      area: 74792,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
    },
    {
      templeName: "Payson Utah",
      location: "Payson, Utah, United States",
      dedicated: "2015, June, 7",
      area: 96630,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
    },
    {
      templeName: "Yigo Guam",
      location: "Yigo, Guam",
      dedicated: "2020, May, 2",
      area: 6861,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
    },
    {
      templeName: "Washington D.C.",
      location: "Kensington, Maryland, United States",
      dedicated: "1974, November, 19",
      area: 156558,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },
    {
      templeName: "Lima Perú",
      location: "Lima, Perú",
      dedicated: "1986, January, 10",
      area: 9600,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
    },
    {
      templeName: "Mexico City Mexico",
      location: "Mexico City, Mexico",
      dedicated: "1983, December, 2",
      area: 116642,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
    },
    /* --- Additional entries (3+) --- */
    {
      templeName: "Salt Lake (Assembly Hall nearby) - Salt Lake City",
      location: "Salt Lake City, Utah, United States",
      dedicated: "1893, April, 6",
      area: 253000,
      imageUrl:
        "images/temple.jpg"
    },
    {
      templeName: "Tokyo Japan",
      location: "Tokyo, Japan",
      dedicated: "1980, October, 27",
      area: 17650,
      imageUrl:
        "images/temple.jpg"
    },
    {
      templeName: "Accra Ghana",
      location: "Accra, Ghana",
      dedicated: "2004, July, 9",
      area: 10200,
      imageUrl:
        "images/temple.jpg"
    }
  ];

  /* === Utility functions === */

  // get year from dedicated string (assumes a 4-digit year exists)
  function getYearFromDedicated(dedicatedStr) {
    const m = dedicatedStr.match(/\b(18|19|20)\d{2}\b/);
    return m ? Number(m[0]) : NaN;
  }

  // render a list of temple objects to the gallery
  function renderTemples(list) {
    const gallery = document.getElementById('gallery');
    const sectionTitle = document.getElementById('section-title');
    if (!gallery) return;

    // clear
    gallery.innerHTML = '';

    if (!list.length) {
      gallery.innerHTML = `<p class="no-results">No temples match this filter.</p>`;
      return;
    }

    // build HTML for each temple using template literals exclusively
    const html = list.map(t => {
      // ensure alt text is the temple name
      const alt = `${t.templeName} — ${t.location}`;
      // include year extracted
      const year = getYearFromDedicated(t.dedicated) || '';
      return `
        <figure>
          <img src="${t.imageUrl}" alt="${escapeHtml(alt)}" loading="lazy" width="400" height="250">
          <figcaption>
            <div class="temple-info">
              <div class="temple-name">${escapeHtml(t.templeName)}</div>
              <div class="temple-meta">${escapeHtml(t.location)} • Dedic.: ${escapeHtml(t.dedicated)}</div>
            </div>
            <div>
              <div class="temple-area">${t.area.toLocaleString()} sq ft</div>
              <div class="temple-year muted" aria-hidden="true">${year}</div>
            </div>
          </figcaption>
        </figure>
      `;
    }).join('');

    gallery.innerHTML = html;
  }

  // small helper to escape HTML characters when inserting text into template literals
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* === Filter logic === */
  function filterAll() {
    renderTemples(temples);
    updateSectionTitle('All Temples');
  }

  function filterOld() {
    const filtered = temples.filter(t => {
      const y = getYearFromDedicated(t.dedicated);
      return !Number.isNaN(y) && y < 1900;
    });
    renderTemples(filtered);
    updateSectionTitle('Old Temples (built before 1900)');
  }

  function filterNew() {
    const filtered = temples.filter(t => {
      const y = getYearFromDedicated(t.dedicated);
      return !Number.isNaN(y) && y > 2000;
    });
    renderTemples(filtered);
    updateSectionTitle('New Temples (built after 2000)');
  }

  function filterLarge() {
    const filtered = temples.filter(t => Number(t.area) > 90000);
    renderTemples(filtered);
    updateSectionTitle('Large Temples (> 90,000 sq ft)');
  }

  function filterSmall() {
    const filtered = temples.filter(t => Number(t.area) < 10000);
    renderTemples(filtered);
    updateSectionTitle('Small Temples (< 10,000 sq ft)');
  }

  function updateSectionTitle(text) {
    const el = document.getElementById('section-title');
    if (el) el.textContent = text;
  }

  /* === Navigation behavior === */
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.nav-btn');
      if (!btn) return;
      // mark aria-pressed properly
      nav.querySelectorAll('.nav-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;
      switch (filter) {
        case 'old': filterOld(); break;
        case 'new': filterNew(); break;
        case 'large': filterLarge(); break;
        case 'small': filterSmall(); break;
        default: filterAll(); break;
      }
    });
  }

  /* === Footer dates === */
  const yearSpan = document.getElementById('currentyear');
  if (yearSpan) yearSpan.textContent = `${new Date().getFullYear()}`;

  const lastEl = document.getElementById('lastModified');
  if (lastEl) lastEl.textContent = `Last Modified: ${document.lastModified}`;

  /* === Initial render (Home: all) === */
  renderTemples(temples);
});

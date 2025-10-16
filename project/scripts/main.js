/* main.js
   - All dynamic functionality for Home, Tips, Contact pages.
   - Uses template literals exclusively for building output strings.
*/

// -- Data: tips array with objects (shows use of objects & arrays) --
const tips = [
  { id: 1, text: "Do 10 push-ups", difficulty: "beginner", favorite: false },
  { id: 2, text: "Walk briskly for 20 minutes", difficulty: "beginner", favorite: false },
  { id: 3, text: "Do 3 sets of squats (12 reps)", difficulty: "intermediate", favorite: false },
  { id: 4, text: "Stretch for 5 minutes after waking", difficulty: "beginner", favorite: false },
  { id: 5, text: "Try a short HIIT: 15s on / 15s off x 8", difficulty: "intermediate", favorite: false }
];

// -- Utility: localStorage keys --
const STORAGE_KEYS = {
  user: 'fm_user',
  favorites: 'fm_favorites'
};

// -- Function: calculateWindChill (single-line return) --
// Uses metric formula (°C, km/h)
function calculateWindChill(tempC, windKmh) {
  return 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * tempC * Math.pow(windKmh, 0.16);
}

// -- Function: formatWindChill (applies conditions) --
function formatWindChill(tempC, windKmh) {
  // Conditions: temp <= 10°C and wind > 4.8 km/h
  if (tempC <= 10 && windKmh > 4.8) {
    const wc = calculateWindChill(tempC, windKmh);
    return `${wc.toFixed(1)} °C`;
  } else {
    return `N/A`;
  }
}

// -- Function: randomTip (returns a tip object) --
function randomTip() {
  const idx = Math.floor(Math.random() * tips.length);
  return tips[idx];
}

// -- Function: renderRandomTipTo(element) --
function renderRandomTipTo(element) {
  const tip = randomTip();
  if (element) {
    element.textContent = `${tip.text} (${tip.difficulty})`;
  }
}

// -- Function: renderTipsList (uses array methods and template literals) --
function renderTipsList(container, filter = 'all') {
  if (!container) return;
  // load favorites from storage
  const savedFavs = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');

  // filter
  const list = filter === 'all' ? tips : tips.filter(t => t.difficulty === filter);

  // Use map to build HTML for each tip (template literals exclusively)
  container.innerHTML = list.map(t => {
    const isFav = savedFavs.includes(t.id);
    return `<div class="tip" data-id="${t.id}">
      <div>
        <div class="text">${t.text}</div>
        <div class="meta">${t.difficulty}</div>
      </div>
      <div>
        <button class="fav-btn" aria-pressed="${isFav}">${isFav ? '★' : '☆'}</button>
      </div>
    </div>`;
  }).join('');
}

// -- Function: toggleFavorite(id) --
function toggleFavorite(id) {
  const savedFavs = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
  const exists = savedFavs.includes(id);
  const updated = exists ? savedFavs.filter(n => n !== id) : [...savedFavs, id];
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(updated));
  return updated;
}

// -- Function: saveUser (from form) --
function saveUser(name, pref) {
  const user = { name: name, pref: pref, savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  return user;
}

// -- Function: loadUser --
function loadUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

// -- Init functions executed when DOM ready --
function initCommon() {
  // set year(s)
  const yearEls = [
    document.getElementById('year'),
    document.getElementById('year-2'),
    document.getElementById('year-3')
  ];
  yearEls.forEach(el => { if (el) el.textContent = `${new Date().getFullYear()}`; });

  // Home: greeting if user saved
  const greeting = document.getElementById('greeting');
  const user = loadUser();
  if (greeting) {
    greeting.textContent = user ? `Welcome back, ${user.name}!` : 'Not signed in';
  }

  // Home: random tip button
  const btn = document.getElementById('randomTipBtn');
  const out = document.getElementById('randomTip');
  if (btn && out) {
    btn.addEventListener('click', () => renderRandomTipTo(out));
  }

  // Home: wind chill calculation
  const tempEl = document.getElementById('temp');
  const windEl = document.getElementById('wind');
  const wcEl = document.getElementById('windchill');
  if (tempEl && windEl && wcEl) {
    const temp = Number(tempEl.textContent);
    const wind = Number(windEl.textContent);
    wcEl.textContent = formatWindChill(temp, wind);
  }
}

function initTipsPage() {
  const container = document.getElementById('tipsList');
  const difficulty = document.getElementById('difficulty');
  const showAllBtn = document.getElementById('showAllBtn');
  const showFavsBtn = document.getElementById('showFavoritesBtn');

  if (!container) return;

  // initial render
  renderTipsList(container, 'all');

  // filter change
  if (difficulty) {
    difficulty.addEventListener('change', (e) => renderTipsList(container, e.target.value));
  }

  // show all
  if (showAllBtn) showAllBtn.addEventListener('click', () => { renderTipsList(container, 'all'); });

  // show favorites
  if (showFavsBtn) {
    showFavsBtn.addEventListener('click', () => {
      // read favorites and render those
      const favs = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
      const favTips = tips.filter(t => favs.includes(t.id));
      // map -> HTML
      container.innerHTML = favTips.length ? favTips.map(t => {
        return `<div class="tip" data-id="${t.id}">
          <div>
            <div class="text">${t.text}</div>
            <div class="meta">${t.difficulty}</div>
          </div>
          <div><button class="fav-btn" aria-pressed="true">★</button></div>
        </div>`;
      }).join('') : `<p class="muted">No favorites saved yet.</p>`;
    });
  }

  // delegate click for favorite buttons
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;
    const tipEl = btn.closest('.tip');
    const id = Number(tipEl.dataset.id);
    const updated = toggleFavorite(id);
    // re-render current view depending on filter select
    const currentFilter = difficulty ? difficulty.value : 'all';
    renderTipsList(container, currentFilter);
  });
}

function initContactPage() {
  const form = document.getElementById('joinForm');
  const formMessage = document.getElementById('formMessage');
  const clearBtn = document.getElementById('clearBtn');

  if (!form) return;

  // show saved name if exists
  const existing = loadUser();
  if (existing && formMessage) formMessage.textContent = `Loaded saved name: ${existing.name}`;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const pref = document.getElementById('pref').value;
    if (!name || !pref) {
      if (formMessage) formMessage.textContent = `Please provide both name and preference.`;
      return; // conditional branching used
    }
    const saved = saveUser(name, pref);
    if (formMessage) formMessage.textContent = `Saved: ${saved.name} (pref: ${saved.pref})`;
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem(STORAGE_KEYS.favorites);
      if (formMessage) formMessage.textContent = `Cleared saved data.`;
    });
  }
}

// DOMContentLoaded equivalent: scripts are loaded with defer — safe to init now
document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  initTipsPage();
  initContactPage();
});

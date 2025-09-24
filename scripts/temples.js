// temples.js (deferred)
document.addEventListener('DOMContentLoaded', () => {
    // Copyright year
    const yearSpan = document.getElementById('currentyear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  
    // Last modified
    const lastEl = document.getElementById('lastModified');
    if (lastEl) lastEl.textContent = `Last Modified: ${document.lastModified}`;
  
    // Hamburger toggle (accessible)
    const hambtn = document.getElementById('hambtn');
    const nav = document.getElementById('main-nav');
  
    if (hambtn && nav) {
      hambtn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        hambtn.setAttribute('aria-expanded', String(isOpen));
        // Change icon to "X" when open
        hambtn.textContent = isOpen ? '✕' : '☰';
        hambtn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      });
  
      // Optional: close nav when a link is clicked (mobile)
      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            hambtn.textContent = '☰';
            hambtn.setAttribute('aria-expanded', 'false');
            hambtn.setAttribute('aria-label', 'Open navigation');
          }
        });
      });
    }
  });
  
/* review.js
   - Parse GET parameters to show submitted data
   - Increment localStorage review counter only when request includes product parameter
   - Show the number of reviews previously submitted by this client
*/

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const confirmationEl = document.getElementById('confirmation');

  // Footer dates
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const lastEl = document.getElementById('lastModified');
  if (lastEl) lastEl.textContent = `Last Modification: ${document.lastModified}`;

  // If no product param, assume user opened page directly; show message and do not increment.
  if (!params.has('product')) {
    confirmationEl.innerHTML = `<h2>Page loaded without form submission</h2>
      <p class="muted">If you submitted the form, please ensure your browser used GET and redirected to this page.</p>`;
    return;
  }

  // Read form fields
  const productId = params.get('product') || '';
  const rating = params.get('rating') || '';
  const installDate = params.get('installDate') || '';
  const features = params.getAll('features'); // multiple values possible
  const reviewText = params.get('review') || '';
  const username = params.get('username') || '';

  // Build friendly product name lookup (must match ids used in form.js)
  const productLookup = {
    "prd-001": "MaxiFit Oversized Tee - Classic",
    "prd-002": "MaxiFit Oversized Tee - Performance",
    "prd-003": "MaxiFit Hoodie - Lightweight",
    "prd-004": "MaxiFit Tank - Breathable",
    "prd-005": "MaxiFit Compression Shorts"
  };
  const productName = productLookup[productId] || productId;

  // Update localStorage review count (key)
  const KEY = 'reviewCount';
  const prev = Number(localStorage.getItem(KEY) || 0);
  const now = prev + 1;
  localStorage.setItem(KEY, String(now));

  // Build output HTML using template literals
  const featuresHtml = features.length ? `<ul>${features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>` : '<p class="muted">None selected</p>';

  confirmationEl.innerHTML = `
    <h2>Thank you${username ? `, ${escapeHtml(username)}` : ''}!</h2>
    <p>Your review for <strong>${escapeHtml(productName)}</strong> has been received.</p>

    <div class="card-detail">
      <div class="confirm-row"><div class="label">Product</div><div class="value">${escapeHtml(productName)}</div></div>
      <div class="confirm-row"><div class="label">Rating</div><div class="value">${escapeHtml(rating)} / 5</div></div>
      <div class="confirm-row"><div class="label">Installed</div><div class="value">${escapeHtml(installDate)}</div></div>
      <div class="confirm-row"><div class="label">Features</div><div class="value">${featuresHtml}</div></div>
      <div class="confirm-row"><div class="label">Review</div><div class="value">${reviewText ? `<p>${escapeHtml(reviewText)}</p>` : '<p class="muted">No written review</p>'}</div></div>
      <div class="confirm-row"><div class="label">Submission Count (you)</div><div class="value">${now}</div></div>
    </div>
  `;

  // helper to guard against XSS
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});

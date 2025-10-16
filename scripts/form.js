/* form.js
   - Populate product select from array
   - Footer: set year and last modified
*/

// Product array (id & name). JS will create options where value=id and text=name.
const products = [
  { id: "prd-001", name: "MaxiFit Oversized Tee - Classic" },
  { id: "prd-002", name: "MaxiFit Oversized Tee - Performance" },
  { id: "prd-003", name: "MaxiFit Hoodie - Lightweight" },
  { id: "prd-004", name: "MaxiFit Tank - Breathable" },
  { id: "prd-005", name: "MaxiFit Compression Shorts" }
];

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('productSelect');
  if (select) {
    // create option elements from products array
    products.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;           // value is product id
      opt.textContent = p.name;   // visible label is product name
      select.appendChild(opt);
    });
  }

  // footer year & last modified
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const lastEl = document.getElementById('lastModified');
  if (lastEl) lastEl.textContent = `Last Modification: ${document.lastModified}`;

  // Basic client-side form validation enhancement (optional):
  const form = document.getElementById('reviewForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      // rely on browser validation for required attributes.
      // But we can check rating radios manually to show friendly message if none selected.
      const rating = form.querySelector('input[name="rating"]:checked');
      if (!rating) {
        // prevent submission and focus first rating
        e.preventDefault();
        const firstRating = document.getElementById('rating1');
        if (firstRating) firstRating.focus();
        alert('Please select an overall rating (1-5).');
      }
    });
  }
});

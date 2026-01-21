// assets/js/includes.js
// Dynamically loads header and footer from partials/header.html and partials/footer.html

function getPartialsPath() {
  // Calculate the relative path to /partials/ from the current page
  const path = window.location.pathname;
  // Count how many folders deep we are from the root
  const depth = path.replace(/\\/g, '/').split('/').length - 2; // -2: one for leading slash, one for filename
  let rel = '';
  for (let i = 0; i < depth; i++) rel += '../';
  return rel + 'partials/';
}

function loadInclude(element, file) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(data => {
      element.innerHTML = data;
    })
    .catch(() => {
      element.innerHTML = '<!-- Failed to load include: ' + file + ' -->';
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const partialsPath = getPartialsPath();
  document.querySelectorAll('[data-include]').forEach(el => {
    const part = el.getAttribute('data-include');
    loadInclude(el, `${partialsPath}${part}.html`);
  });
});

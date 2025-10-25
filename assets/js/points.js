const c = el => document.createElement(el);

const pts = localStorage.getItem('pts');
if (!pts) {
  showToggleMenu();
}

function showToggleMenu() {
  const div = c('div');
  div.id = 'ptsToggle';
}

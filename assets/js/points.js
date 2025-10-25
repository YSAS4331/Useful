const c = el => document.createElement(el);

const pts = localStorage.getItem('pts');
if (!pts) {
  showToggleMenu();
}

function showToggleMenu() {
  const div = c('div');
  div.id = 'ptsToggle';
  div.innerHTML = '当ツールでは、ポイント機能を活用することで、ユーザー体験の向上を目指しております<br>詳細につきましては、<a href="https://ysas4331.github.io/Useful/terms#points" target="_blank">こちら</a>をご覧ください。<br><br>ポイント機能をご利用になりますか？';
  document.body.appendChild(div);
}

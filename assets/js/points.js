const c = el => document.createElement(el);

const pts = localStorage.getItem('pts');
if (!pts) showToggleMenu();

function showToggleMenu() {
  // === オーバーレイ作成 ===
  const overlay = c('div');
  overlay.id = 'overlay';
  document.body.appendChild(overlay);

  // === モーダル作成 ===
  const div = c('div');
  div.id = 'ptsToggle';
  div.innerHTML = `
    <p>
      当ツールでは、ポイント機能を活用することで、ユーザー体験の向上を目指しております。<br>
      詳細につきましては、<a href="https://ysas4331.github.io/Useful/terms#points" target="_blank">こちら</a>をご覧ください。
    </p>

    <label class="option">
      <input type="checkbox" id="usePoints">
      ポイント機能を利用します
    </label>

    <button id="confirmBtn">確定</button>
  `;
  document.body.appendChild(div);

  // === イベント設定 ===
  const btn = div.querySelector('#confirmBtn');
  const chk = div.querySelector('#usePoints');

  btn.addEventListener('click', () => {
    const value = chk.checked ? '0' : false;
    localStorage.setItem('pts', value);
    overlay.remove();
    div.remove();
  });
}

const c = el => document.createElement(el);

const pts = localStorage.getItem('pts');
if (!pts) { showToggleMenu(); }
else {
  const side = c('aside');
  document.body.appendChild(side);
  const ShowPts = c('p');
  animateCount(0, pts, ShowPts);
}

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
    window.location.reload();
  });
}

function animateCount(start, end, el) {
  let current = start;

  function update() {
    current += (end - current) / 5;

    el.textContent = Math.round(current);

    // ある程度近づいたら終了（無限ループ防止）
    if (Math.abs(end - current) > 0.01) {
      requestAnimationFrame(update);
    } else {
      el.textContent = Math.round(end); // 最終値を保証
    }
  }

  update();
}

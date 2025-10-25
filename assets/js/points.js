const c = el => document.createElement(el);

// localStorage.removeItem('pts'); // ← デバッグ用（毎回表示したい時に有効）

const pts = localStorage.getItem('pts');
if (!pts) showToggleMenu();

function showToggleMenu() {
  const div = c('div');
  div.id = 'ptsToggle';

  div.innerHTML = `
    <p>
      当ツールでは、ポイント機能を活用することで、ユーザー体験の向上を目指しております。<br>
      詳細につきましては、<a href="#">こちら</a>をご覧ください。
    </p>

    <label class="option">
      <input type="checkbox" id="usePoints">
      ポイント機能を利用します
    </label>

    <button id="confirmBtn">確定</button>
  `;

  document.body.appendChild(div);

  // --- ボタン動作 ---
  const btn = div.querySelector('#confirmBtn');
  const chk = div.querySelector('#usePoints');

  btn.addEventListener('click', () => {
    if (!chk.checked) {
      alert('ポイント機能を利用する場合はチェックを入れてください。');
      return;
    }

    localStorage.setItem('pts', 'enabled');
    div.remove(); // モーダルを閉じる
  });
}

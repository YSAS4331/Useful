const c = el => document.createElement(el);

class Transfer extends HTMLElement {
  connectedCallback()　{
    this.innerHTML = '<button id="transfer">データ移行</button>';
    const btn = this.querySelector('#transfer');

    btn.addEventListener('click', () => {
      showTransferMenu();
    });
  }
}

customElements.define('my-transfer', Transfer);

function showTransferMenu() {
  // === オーバーレイ作成 ===
  const overlay = c('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  // === モーダル作成 ===
  const div = c('div');
  div.className = 'overlayMenu';
  div.innerHTML = `
    <p>
      どちらの形式でデータ移行しますか？
    </p>

    <span class="overlayFlex">
      <button id="transferUrl">URLで移行</button>
      <button id="transferQr">QRで移行</button>
    </span>

    <span class="hint">QRコードは株式会社デンソーウェーブの登録商標です</span>
  `;
  document.body.appendChild(div);

  const url = div.querySelector('#transferUrl');
  const qr = div.querySelector('#transferQr');

  url.addEventListener('click', () => {
    removeOverLay();
  });
  qr.addEventListener('click', () => {
    removeOverLay();
  });

  function removeOverLay() {
    overlay.remove();
    div.remove();
  }
}

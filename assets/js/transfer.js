import {c, createPopup, $, $$} from './export.js';

class Transfer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<button id="transfer">データ移行</button>';
    const btn = this.querySelector('#transfer');

    btn.addEventListener('click', () => {
      const popup = createPopup();
      popup.div.innerHTML = `
      <p>
        どちらの形式でデータ移行しますか？
      </p>
  
      <span class="overlayFlex">
        <button id="transferUrl">URLで移行</button>
        <button id="transferQr">QRで移行</button>
      </span>
  
      <span class="hint">QRコードは株式会社デンソーウェーブの登録商標です</span>
      `;
      $$('button', popup.div).forEach(el => {
        el.addEventListener('click', () => {
          const popup2 = createPopup();
          popup2.div.innerHTML = `
          <p>
            一時パスワードを入力:
          </p>
          <label class="option"><input type="password"></label>
          
          <label class="option">
            <input type="checkbox" checked>
            パスワードを使用
          </label>
          <button>次へ</button>
          `;
          popup.removeOverLay();
          const UsePass = $('input[type="checkbox"]', popup2.div);
          UsePass.addEventListener('input', () => {
            $('input[type="password"]', popup2.div).disabled = !UsePass.checked
          });
        });
      });

    });
  }
}

customElements.define('my-transfer', Transfer);

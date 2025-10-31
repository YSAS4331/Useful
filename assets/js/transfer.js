import {c, createPopup, $} from './export.js';

class Transfer extends HTMLElement {
  connectedCallback()　{
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
          popup.removeOverLay();
        });
      });

    });
  }
}

customElements.define('my-transfer', Transfer);

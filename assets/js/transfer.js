import {c, createPopup, $, $$, cry} from './export.js';
import QRCode from "https://esm.sh/qrcode";

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
          const nextBtn = $('button', popup2.div);
          nextBtn.addEventListener('click', async () => {
            if (UsePass.checked && $('input[type="password"]', popup2.div).value==='') {
              alert('パスワードを入力してください');
              $('input[type="password"]', popup2.div).focus();
              return;
            }
            const popup3 = createPopup();
            const raw = JSON.stringify(window.state);
            const data = cry.compression(raw);
            const url = `https://ysas4331.github.io/Useful/Transfer?a=yt-playlist&d=${UsePass.checked?cry.encode(data, $('input[type="password"]', popup2.div).value):data}`
            if (el.id === 'transferUrl') {
              popup3.div.innerHTML = `
              <p>
                以下のボタンをクリックし､URLを移行先の端末で開いてください
              </p>
              <span class="overlayFlex">
                <button id="TransferUrlCopy">コピーする</button>
                <button id="TransferClose">閉じる</button>
              </span>
              `;
              $('#TransferClose', popup3.div).addEventListener('click', () => {
                popup3.removeOverLay();
              });
              $('#TransferUrlCopy', popup3.div).addEventListener('click', e => {
                navigator.clipboard.writeText(url);
                e.target.textContent = 'コピーしました';
                setTimeout(() => {
                  e.target.textContent = 'コピーする';
                }, 3000);
              });
            }
            if (el.id === 'transferQr') {
              try {
                const longUrl = "https://example.com/very/long/path?with=query&and=parameters";
              
                // URLを短縮する儀式
                const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`);
                if (!res.ok) throw new Error("URL短縮に失敗しました");
                const shortUrl = await res.text();
              
                // QRコード生成の儀式
                const QRDat = await QRCode.toDataURL(shortUrl);
              
                // popup3に神託を表示（リンクなし）
                popup3.div.innerHTML = `
                  <p>以下のQRコードを読み取ってください</p>
                  <img src="${QRDat}" style="aspect-ratio: 1/1; width: 80%; height: auto;">
                `;
              } catch (e) {
                popup3.div.innerHTML = `
                  <p>QRコード生成中にエラーが発生しました</p>
                  <p>${e}</p>
                `;
              }
            }
            popup2.removeOverLay();
          });
        });
      });

    });
  }
}

customElements.define('my-transfer', Transfer);

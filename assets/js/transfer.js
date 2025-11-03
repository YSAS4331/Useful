import {c, createPopup, $, $$, cry} from './export.js';
import QRCode from "https://esm.sh/qrcode";

class Transfer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<button id="transfer">データ移行</button>';
    const btn = this.querySelector('#transfer');

    btn.addEventListener('click', () => {
      const popup = createPopup();
      popup.div.innerHTML = `
      <p>どちらの形式でデータ移行しますか？</p>
      <span class="overlayFlex">
        <button id="transferUrl">URLで移行</button>
        <button id="transferQr">QRで移行</button>
      </span>
      <span class="hint">QRコードは株式会社デンソーウェーブの登録商標です</span>
      `;

      // ユーティリティ $$ がコンテキスト引数に対応している前提。
      // 万が一未対応なら popup.div.querySelectorAll('button') にフォールバック。
      const buttons = (typeof $$ === 'function')
        ? ($$('button', popup.div).length ? $$('button', popup.div) : popup.div.querySelectorAll('button'))
        : popup.div.querySelectorAll('button');

      buttons.forEach(el => {
        el.addEventListener('click', () => {
          const popup2 = createPopup();
          popup2.div.innerHTML = `
            <p>一時パスワードを入力:</p>
            <label class="option"><input type="password"></label>
            <label class="option">
              <input type="checkbox" checked>
              パスワードを使用
            </label>
            <button>次へ</button>
          `;
          // 元のpopupを閉じる（UI上の重なりを整理）
          if (popup && typeof popup.removeOverLay === 'function') popup.removeOverLay();

          const UsePass = $('input[type="checkbox"]', popup2.div);
          const passInput = $('input[type="password"]', popup2.div);
          if (UsePass && passInput) {
            // 初期状態に合わせて disabled をセット
            passInput.disabled = !UsePass.checked;
            UsePass.addEventListener('input', () => {
              passInput.disabled = !UsePass.checked;
            });
          }

          const nextBtn = $('button', popup2.div);
          if (!nextBtn) return;

          nextBtn.addEventListener('click', async () => {
            try {
              if (UsePass && UsePass.checked && (!passInput || passInput.value === '')) {
                alert('パスワードを入力してください');
                if (passInput) passInput.focus();
                return;
              }

              const popup3 = createPopup();

              // データ生成部分は例外を拾う
              const raw = JSON.stringify(window.state);
              let data;
              try {
                // cry.compression が Promise を返す可能性を考慮して await
                data = await cry.compression(raw);
              } catch (err) {
                // compression に失敗したらフォールバックで raw を使う（警告）
                console.warn('compression failed, using raw:', err);
                data = raw;
              }

              let finalPayload;
              if (UsePass && UsePass.checked) {
                try {
                  finalPayload = await cry.encode(data, passInput.value);
                } catch (err) {
                  console.warn('encode failed, using unencoded data:', err);
                  finalPayload = data;
                }
              } else {
                finalPayload = data;
              }

              // 必ずエンコードして URL に入れる
              const encoded = encodeURIComponent(finalPayload);
              const url = `https://ysas4331.github.io/Useful/Transfer?a=yt-playlist&d=${encoded}`;

              if (el.id === 'transferUrl') {
                popup3.div.innerHTML = `
                  <p>以下のボタンをクリックし､移行先の端末で開いてください</p>
                  <span class="overlayFlex">
                    <button id="TransferUrlCopy">コピーする</button>
                    <button id="TransferClose">閉じる</button>
                  </span>
                `;
                const copyBtn = $('#TransferUrlCopy', popup3.div);
                const closeBtn = $('#TransferClose', popup3.div);

                if (closeBtn) closeBtn.addEventListener('click', () => popup3.removeOverLay());

                if (copyBtn) {
                  copyBtn.addEventListener('click', async (e) => {
                    try {
                      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('clipboard API not available');
                      await navigator.clipboard.writeText(url);
                      e.target.textContent = 'コピーしました';
                      setTimeout(() => e.target.textContent = 'コピーする', 3000);
                    } catch (err) {
                      // フォールバック：テキストフィールドを作って select + execCommand
                      const ta = document.createElement('textarea');
                      ta.value = url;
                      document.body.appendChild(ta);
                      ta.select();
                      try {
                        document.execCommand('copy');
                        e.target.textContent = 'コピーしました（フォールバック）';
                        setTimeout(() => e.target.textContent = 'コピーする', 3000);
                      } catch (err2) {
                        alert('クリップボードにコピーできませんでした。手動でコピーしてください:\n' + url);
                      }
                      document.body.removeChild(ta);
                    }
                  });
                }
              }

              if (el.id === 'transferQr') {
                try {
                  // URL短縮（エンコード済みなので安全）
                  const shortRes = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
                  if (!shortRes.ok) throw new Error("URL短縮に失敗しました");
                  const shortUrl = await shortRes.text();

                  // QRコード生成
                  const QRDat = await QRCode.toDataURL(shortUrl);
                  popup3.div.innerHTML = `
                    <p>以下のQRコードを読み取ってください</p>
                    <img src="${QRDat}" style="aspect-ratio: 1/1; width: 80%; height: auto;">
                    <p style="word-break: break-all; font-size: 0.8em;">${shortUrl}</p>
                  `;
                } catch (err) {
                  popup3.div.innerHTML = `
                    <p>QRコード生成中にエラーが発生しました</p>
                    <p id="err-msg"></p>
                  `;
                  // エラーメッセージは textContent で安全に表示
                  const errEl = popup3.div.querySelector('#err-msg');
                  if (errEl) errEl.textContent = String(err);
                }
              }

              // popup2 を閉じる（popup3 は表示されたまま）
              if (popup2 && typeof popup2.removeOverLay === 'function') popup2.removeOverLay();

            } catch (outerErr) {
              console.error('transfer flow failed:', outerErr);
              alert('データ移行に失敗しました。コンソールを確認してください。');
            }
          }); // nextBtn click
        }); // initial choice button click
      }); // forEach buttons
    }); // transfer button click
  } // connectedCallback
}

customElements.define('my-transfer', Transfer);

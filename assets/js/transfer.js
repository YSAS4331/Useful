import { c, createPopup, $, $$, cry } from './export.js';
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

      const buttons = popup.div.querySelectorAll("button");

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

          popup.removeOverLay();

          const UsePass = popup2.div.querySelector('input[type="checkbox"]');
          const passInput = popup2.div.querySelector('input[type="password"]');

          passInput.disabled = !UsePass.checked;
          UsePass.addEventListener('input', () => {
            passInput.disabled = !UsePass.checked;
          });

          const nextBtn = popup2.div.querySelector("button");

          nextBtn.addEventListener('click', async () => {
            if (UsePass.checked && passInput.value === '') {
              alert("パスワードを入力してください");
              passInput.focus();
              return;
            }

            const popup3 = createPopup();

            // データ生成
            const raw = JSON.stringify(window.state);
            const compressed = await cry.compression(raw);

            const payload = UsePass.checked
              ? await cry.encode(compressed, passInput.value)
              : compressed;

            // 長いURLを作成
            const longUrl = `https://ysas4331.github.io/Useful/Transfer?a=yt-playlist&d=${encodeURIComponent(payload)}`;
            let shortUrl = longUrl; // デフォルト（失敗時フォールバック）

            // --- 短縮URL生成処理 ---
            try {
              // トークン取得
              const tokenRes = await fetch("https://xs116555.xsrv.jp/api/get_token.php", {
                method: "GET",
                mode: "cors",
              });
              const tokenData = await tokenRes.json();
              const token = tokenData.token;

              // 短縮URL生成リクエスト
              const shortenRes = await fetch("https://xs116555.xsrv.jp/api/shorten.php", {
                method: "POST",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  token,
                  url: longUrl
                })
              });

              const shortenData = await shortenRes.json();
              if (shortenData.short_url) {
                shortUrl = shortenData.short_url;
              } else {
                console.warn("短縮URL生成に失敗:", shortenData);
                alert(JSON.stringify(shortenData, null, 2));
              }
            } catch (err) {
              console.warn("短縮URL通信エラー:", err);
              alert(err);
            }

            // --- 表示部分 ---
            if (el.id === "transferUrl") {
              popup3.div.innerHTML = `
                <p>以下のボタンをクリックし､移行先の端末で開いてください</p>
                <span class="overlayFlex">
                  <button id="TransferUrlCopy">コピーする</button>
                  <button id="TransferClose">閉じる</button>
                </span>
              `;
              const copy = popup3.div.querySelector("#TransferUrlCopy");

              copy.addEventListener('click', async (e) => {
                await navigator.clipboard.writeText(shortUrl);
                e.target.textContent = "コピーしました";
                setTimeout(() => e.target.textContent = "コピーする", 3000);
              });
            }

            // QRで移行
            if (el.id === "transferQr") {
              try {
                const QRDat = await QRCode.toDataURL(shortUrl, {
                  errorCorrectionLevel: "L"
                });

                popup3.div.innerHTML = `
                  <p>以下のQRコードを読み取ってください</p>
                  <img src="${QRDat}" style="aspect-ratio:1/1; width:80%; height:auto;">
                  <button id="TransferClose">閉じる</button>
                `;
              } catch (e) {
                popup3.div.innerHTML = `
                  <p>QRコード生成中にエラーが発生しました</p>
                  <p>${String(e)}</p>
                `;
              }
            }

            const close = popup3.div.querySelector("#TransferClose");
            if (close) close.addEventListener('click', () => popup3.removeOverLay());
            popup2.removeOverLay();
          });
        });
      });
    });
  }
}

customElements.define('my-transfer', Transfer);

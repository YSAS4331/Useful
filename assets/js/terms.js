const $ = el => document.getElementById(el);

class Terms extends HTMLElement {
  connectedCallback() {
    const content = this.textContent.trim();
    this.innerHTML = `<button id="terms">${content}</button>`;
    const btn = this.querySelector('#terms');

    btn.addEventListener('click', () => {
      const Frame = $('terms-frame') || document.createElement('iframe');
      Frame.id = 'terms-frame';
      Frame.src = 'https://ysas4331.github.io/Useful/terms';
      Frame.style.cssText = `
        width: 100px;
        height: 161.8px;
        border: 2px solid black;
        border-radius: 7px;
        resize: both;
        overflow: auto;
        position: fixed;
        top: 50px;
        left: 50px;
        z-index: 9999;
        cursor: move;
      `;

      if (!$('terms-frame')) {
        document.body.appendChild(Frame);

        // --- ドラッグ処理 ---
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        let overlay;

        Frame.addEventListener('mousedown', e => {
          // 右下のリサイズ操作を邪魔しないように
          const rect = Frame.getBoundingClientRect();
          if (e.offsetX > rect.width - 16 && e.offsetY > rect.height - 16) return;

          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          startLeft = rect.left;
          startTop = rect.top;

          // --- オーバーレイ作成 ---
          overlay = document.createElement('div');
          overlay.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            z-index: 10000;
            cursor: move;
            background: rgba(0,0,0,0);
          `;
          document.body.appendChild(overlay);

          e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          Frame.style.left = `${startLeft + dx}px`;
          Frame.style.top = `${startTop + dy}px`;
          if (overlay) {
            overlay.style.left = `${startLeft + dx}px`;
            overlay.style.top = `${startTop + dy}px`;
          }
        });

        document.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            if (overlay) document.body.removeChild(overlay);
          }
        });
      }
    });
  }
}

customElements.define('my-terms', Terms);

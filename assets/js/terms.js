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
        cursor: move;
        position: fixed;
        top: 50px;
        left: 50px;
        z-index: 9999;
      `;

      if (!$('terms-frame')) {
        document.body.appendChild(Frame);

        // --- ドラッグ移動処理 ---
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        Frame.addEventListener('mousedown', e => {
          // 右下のリサイズ操作を邪魔しないように
          const rect = Frame.getBoundingClientRect();
          if (e.offsetX > rect.width - 16 && e.offsetY > rect.height - 16) return;

          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          startLeft = rect.left;
          startTop = rect.top;
          Frame.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', e => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          Frame.style.left = `${startLeft + dx}px`;
          Frame.style.top = `${startTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
          if (isDragging) Frame.style.cursor = 'move';
          isDragging = false;
        });
      }
    });
  }
}

customElements.define('my-terms', Terms);

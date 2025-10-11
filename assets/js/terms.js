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
      `;

      if (!$('terms-frame')) {
        document.body.appendChild(Frame);

        // --- ドラッグ用ヘッダーを追加 ---
        const header = document.createElement('div');
        header.style.cssText = `
          width: 100%;
          height: 20px;
          position: absolute;
          top: 0;
          left: 0;
          cursor: grab;
          z-index: 10000;
        `;
        Frame.parentElement.insertBefore(header, Frame);

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', e => {
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          const rect = Frame.getBoundingClientRect();
          startLeft = rect.left;
          startTop = rect.top;
          header.style.cursor = 'grabbing';
          e.preventDefault(); // iframeクリックで選択されないように
        });

        document.addEventListener('mousemove', e => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          Frame.style.left = `${startLeft + dx}px`;
          Frame.style.top = `${startTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
          if (isDragging) header.style.cursor = 'grab';
          isDragging = false;
        });
      }
    });
  }
}

customElements.define('my-terms', Terms);

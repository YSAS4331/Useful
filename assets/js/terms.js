const $ = el => document.getElementById(el);

class Terms extends HTMLElement {
  connectedCallback() {
    const content = this.textContent.trim();
    this.innerHTML = `<button id="terms">${content}</button>`;
    const btn = this.querySelector('#terms');

    btn.addEventListener('click', () => {
      if ($('terms-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.id = 'terms-wrapper';
      wrapper.style.cssText = `
        position: fixed;
        top: 50px;
        left: 50px;
        width: 100px;
        z-index: 9999;
      `;

      const header = document.createElement('div');
      header.style.cssText = `
        width: 100%;
        height: 20px;
        background: rgba(0,0,0,0.1);
        cursor: grab;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
      `;

      const Frame = document.createElement('iframe');
      Frame.id = 'terms-frame';
      Frame.src = 'https://ysas4331.github.io/Useful/terms';
      Frame.style.cssText = `
        width: 100%;
        height: 161.8px;
        border: 2px solid black;
        border-radius: 0 7px 7px 7px;
        resize: both;
        overflow: auto;
        display: block;
      `;

      wrapper.appendChild(header);
      wrapper.appendChild(Frame);
      document.body.appendChild(wrapper);

      let isDragging = false;
      let startX, startY, startLeft, startTop;

      header.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = wrapper.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        header.style.cursor = 'grabbing';
        // --- iframeをドラッグ中は無効化 ---
        Frame.style.pointerEvents = 'none';

        e.preventDefault();
      });

      document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        wrapper.style.left = `${startLeft + dx}px`;
        wrapper.style.top = `${startTop + dy}px`;
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) header.style.cursor = 'grab';
        isDragging = false;
        // --- iframeのマウスイベントを再有効化 ---
        Frame.style.pointerEvents = 'auto';
      });
    });
  }
}

customElements.define('my-terms', Terms);

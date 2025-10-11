const $ = el => document.getElementById(el);

class Terms extends HTMLElement {
  connectedCallback() {
    const content = this.textContent.trim();
    this.innerHTML = `<button id="terms">${content}</button>`;
    const btn = this.querySelector('#terms');

    btn.addEventListener('click', () => {
      if ($('terms-wrapper')) return; // 既にある場合は何もしない

      // --- ラッパー作成 ---
      const wrapper = document.createElement('div');
      wrapper.id = 'terms-wrapper';
      wrapper.style.cssText = `
        position: fixed;
        top: 50px;
        left: 50px;
        z-index: 9999;
        width: 100px;
      `;

      // --- iframe 作成 ---
      const Frame = document.createElement('iframe');
      Frame.id = 'terms-frame';
      Frame.src = 'https://ysas4331.github.io/Useful/terms';
      Frame.style.cssText = `
        width: 100%;
        height: 161.8px;
        border: 2px solid black;
        border-radius: 7px;
        resize: both;
        overflow: auto;
      `;

      // --- ドラッグ用ヘッダー作成 ---
      const header = document.createElement('div');
      header.style.cssText = `
        width: 100%;
        height: 20px;
        cursor: grab;
        background: rgba(0,0,0,0.1);
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
      `;

      wrapper.appendChild(header);
      wrapper.appendChild(Frame);
      document.body.appendChild(wrapper);

      // --- ドラッグ処理 ---
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
      });
    });
  }
}

customElements.define('my-terms', Terms);

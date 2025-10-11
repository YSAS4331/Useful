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
      `;
      if (!$('terms-frame')) document.body.appendChild(Frame);
    });
  }
}

customElements.define('my-terms', Terms);

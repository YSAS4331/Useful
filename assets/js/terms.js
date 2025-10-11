const $ = el => document.getElementById(el);

class Terms extends HTMLElement {
  connectedCallback() {
    const content = this.textContent.trim();
    this.innerHTML = `
      <button id="terms">${content}</button>
    `;
    this.addEventListener('click', () => {
      const Frame = $('terms-frame') || document.createElement('iframe');
      Frame.id = 'terms-frame';
      Frame.src = 'https://ysas4331.github.io/Useful/terms';
      Frame.style.width = '250px';
      Frame.style.height = '404.5px';
      Frame.style.border = '2px solid black';
      Frame.style.borderRadius = '7px';
      if (!$('terms-frame')) document.body.appendChild(Frame);
    })
  }
}

customElements.define('my-terms', Terms);

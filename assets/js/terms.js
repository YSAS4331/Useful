class Terms extends HTMLElement {
  connectedCallback() {
    const content = this.textContent.trim();
    this.innerHTML = `
      <button id="terms">${content}</button>
    `;
  }
}

customElements.define('my-terms', Terms);

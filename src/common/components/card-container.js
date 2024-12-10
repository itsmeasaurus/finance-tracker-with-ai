class CardContainer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const content = this.innerHTML;
    this.innerHTML = `
      <div class="bg-[#2D2B3F] shadow-md rounded-2xl px-8 pt-6 pb-8 mb-4">
        ${content}
      </div>
    `;
  }
}

customElements.define('card-container', CardContainer); 
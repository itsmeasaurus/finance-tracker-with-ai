class AlertPopup extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  show(message, type = 'success') {
    const alert = this.querySelector('#alert-popup');
    const icon = this.querySelector('#alert-icon');
    const messageEl = this.querySelector('#alert-message');
    
    if (type === 'success') {
      alert.className = 'fixed top-4 right-4 w-96 bg-green-50 border-l-4 border-green-500 p-4';
      icon.innerHTML = `
        <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      `;
    } else {
      alert.className = 'fixed top-4 right-4 w-96 bg-red-50 border-l-4 border-red-500 p-4';
      icon.innerHTML = `
        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      `;
    }

    messageEl.textContent = message;
    alert.classList.remove('hidden');

    setTimeout(() => {
      alert.classList.add('hidden');
    }, 3000);
  }

  render() {
    this.innerHTML = `
      <div id="alert-popup" class="hidden fixed top-4 right-4 w-96 p-4" role="alert">
        <div class="flex">
          <div class="flex-shrink-0" id="alert-icon">
          </div>
          <div class="ml-3">
            <p class="text-sm" id="alert-message"></p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('alert-popup', AlertPopup);

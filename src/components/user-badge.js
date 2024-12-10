class UserBadge extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <button class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="settings-trigger">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 12c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6Z"/>
        </svg>
      </button>
    `;

    this.querySelector('#settings-trigger').addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('toggle-settings'));
    });
  }
}

customElements.define('user-badge', UserBadge); 
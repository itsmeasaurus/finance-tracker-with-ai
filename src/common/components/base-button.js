import { inputStyles } from '../styles/form-styles.js';

class BaseButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'type', 'size'];
  }

  connectedCallback() {
    const variant = this.getAttribute('variant') || 'primary';
    const type = this.getAttribute('type') || 'button';
    const size = this.getAttribute('size') || 'md';
    const content = this.innerHTML;
    
    const variants = {
      primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg',
      secondary: 'bg-gray-800 hover:bg-gray-700 text-white shadow-lg',
      outline: 'bg-[#1D1B2F] hover:bg-[#2D2B3F] text-gray-300 shadow-lg'
    };

    const sizes = {
      sm: 'py-2 px-4 text-sm',
      md: 'py-3 px-6',
      lg: 'py-4 px-8 text-lg'
    };

    this.innerHTML = `
      <button 
        type="${type}"
        class="${variants[variant]} ${sizes[size]} font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
      >
        ${content}
      </button>
    `;
  }
}

customElements.define('base-button', BaseButton); 
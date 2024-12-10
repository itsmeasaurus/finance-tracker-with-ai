import { inputStyles } from '../styles/form-styles.js';

class BaseInput extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'placeholder', 'value', 'required', 'id', 'label', 'step', 'prefix'];
  }

  connectedCallback() {
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const value = this.getAttribute('value') || '';
    const required = this.hasAttribute('required');
    const id = this.getAttribute('id') || '';
    const label = this.getAttribute('label') || '';
    const step = this.getAttribute('step') || '';
    const prefix = this.getAttribute('prefix') || '';

    this.innerHTML = `
      <div class="${inputStyles.wrapper}">
        ${label ? `
          <label class="${inputStyles.label}" for="${id}">
            ${label}
          </label>
        ` : ''}
        <div class="relative">
          ${prefix ? `
            <div class="${inputStyles.iconWrapper}">
              <span class="${inputStyles.icon}">${prefix}</span>
            </div>
          ` : ''}
          <input 
            class="${inputStyles.base} ${prefix ? 'pl-10' : ''}"
            type="${type}"
            id="${id}"
            name="${id}"
            placeholder="${placeholder}"
            value="${value}"
            ${step ? `step="${step}"` : ''}
            ${required ? 'required' : ''}
          >
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.input = this.querySelector('input');
    this.input?.addEventListener('input', (e) => {
      this.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  get value() {
    return this.input?.value || '';
  }

  set value(val) {
    if (this.input) this.input.value = val;
  }
}

customElements.define('base-input', BaseInput); 
import { inputStyles } from '../styles/form-styles.js';

class BaseTextarea extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder', 'value', 'required', 'id', 'label', 'rows'];
  }

  connectedCallback() {
    const placeholder = this.getAttribute('placeholder') || '';
    const value = this.getAttribute('value') || '';
    const required = this.hasAttribute('required');
    const id = this.getAttribute('id') || '';
    const label = this.getAttribute('label') || '';
    const rows = this.getAttribute('rows') || '3';

    this.innerHTML = `
      <div class="${inputStyles.wrapper}">
        ${label ? `
          <label class="${inputStyles.label}" for="${id}">
            ${label}
          </label>
        ` : ''}
        <textarea 
          class="${inputStyles.base} resize-none"
          id="${id}"
          name="${id}"
          rows="${rows}"
          placeholder="${placeholder}"
          ${required ? 'required' : ''}
        >${value}</textarea>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.textarea = this.querySelector('textarea');
    this.textarea?.addEventListener('input', (e) => {
      this.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  get value() {
    return this.textarea?.value || '';
  }

  set value(val) {
    if (this.textarea) this.textarea.value = val;
  }
}

customElements.define('base-textarea', BaseTextarea); 
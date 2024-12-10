import { expenseService } from '../services/expense-service.js';
import { inputStyles } from '../common/styles/form-styles.js';

class SettingsPopup extends HTMLElement {
  constructor() {
    super();
    this.alert = document.querySelector('alert-popup');
    this.settings = JSON.parse(localStorage.getItem('settings')) || {
      maxAmount: 1000,
      currency: 'USD'
    };
    
    this.innerHTML = `
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity hidden" id="settings-backdrop"></div>
      <div class="fixed inset-0 z-10 overflow-y-auto hidden" id="settings-modal">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-3xl bg-[#2D2B3F] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="absolute right-0 top-0 pr-4 pt-4">
              <button type="button" class="rounded-md bg-[#2D2B3F] text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2" id="close-settings">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg font-semibold leading-6 text-white mb-4">Settings</h3>
                <form id="settings-form">
                  <base-input
                    type="number"
                    id="maxAmount"
                    label="Maximum Monthly Expense"
                    value="${this.settings.maxAmount}"
                    prefix="$"
                    required
                  ></base-input>
                  
                  <div class="${inputStyles.wrapper}">
                    <label class="${inputStyles.label}" for="currency">
                      Currency
                    </label>
                    <select 
                      id="currency" 
                      class="${inputStyles.base}"
                      required
                    >
                      <option value="USD" ${this.settings.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                      <option value="EUR" ${this.settings.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                      <option value="CAD" ${this.settings.currency === 'CAD' ? 'selected' : ''}>CAD (CA$)</option>
                    </select>
                  </div>
                  
                  <div class="flex justify-end gap-3">
                    <base-button type="button" variant="outline" id="cancel-settings">
                      Cancel
                    </base-button>
                    <base-button type="submit" variant="primary">
                      Save Changes
                    </base-button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  getTotalExpenses() {
    const expenses = expenseService.getAllExpenses();
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  }

  checkMaxAmount(newMaxAmount) {
    const totalExpenses = this.getTotalExpenses();
    if (totalExpenses > newMaxAmount) {
      return {
        type: 'error',
        message: `Warning: Your total expenses (${totalExpenses.toFixed(2)}) exceed the new maximum amount (${newMaxAmount.toFixed(2)})`
      };
    }
    return {
      type: 'success',
      message: 'Settings updated successfully'
    };
  }

  setupEventListeners() {
    const backdrop = this.querySelector('#settings-backdrop');
    const modal = this.querySelector('#settings-modal');
    const closeBtn = this.querySelector('#close-settings');
    const cancelBtn = this.querySelector('#cancel-settings');
    const form = this.querySelector('#settings-form');

    window.addEventListener('toggle-settings', () => {
      backdrop.classList.toggle('hidden');
      modal.classList.toggle('hidden');
    });

    [closeBtn, cancelBtn, backdrop].forEach(element => {
      element.addEventListener('click', () => {
        backdrop.classList.add('hidden');
        modal.classList.add('hidden');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newMaxAmount = parseFloat(form.maxAmount.value);
      const alert = this.checkMaxAmount(newMaxAmount);
      
      this.settings = {
        maxAmount: newMaxAmount,
        currency: form.currency.value
      };
      
      localStorage.setItem('settings', JSON.stringify(this.settings));
      window.dispatchEvent(new CustomEvent('settings-updated', { detail: this.settings }));
      this.alert.show(alert.message, alert.type);
      
      backdrop.classList.add('hidden');
      modal.classList.add('hidden');
    });
  }
}

customElements.define('settings-popup', SettingsPopup); 
import { expenseService } from '../services/expense-service.js';
import { currencyService } from '../services/currency-service.js';

class ExpenseTotal extends HTMLElement {
  constructor() {
    super();
    this.settings = JSON.parse(localStorage.getItem('settings')) || { 
      currency: 'USD',
      maxAmount: 1000
    };
    this.render();
    
    window.addEventListener('expenses-updated', () => this.render());
    window.addEventListener('settings-updated', (e) => {
      this.settings = e.detail;
      this.render();
    });
  }

  calculateTotal() {
    const expenses = expenseService.getAllExpenses();
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  }

  render() {
    const total = this.calculateTotal();
    const currencySymbol = currencyService.getCurrencySymbol(this.settings.currency);
    const isOverBudget = total > this.settings.maxAmount;
    
    this.innerHTML = `
      <div class="bg-[#2D2B3F] shadow-lg rounded-3xl px-6 py-4 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-sm font-semibold text-gray-300">Total Expenses</h2>
            <p class="text-2xl font-bold ${isOverBudget ? 'text-pink-500' : 'text-cyan-400'}">
              ${currencySymbol}${total.toFixed(2)}
            </p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <h2 class="text-sm font-semibold text-gray-300">Monthly Budget</h2>
            <p class="text-lg font-semibold text-white">
              ${currencySymbol}${this.settings.maxAmount.toFixed(2)}
            </p>
            <button 
              class="text-sm px-3 py-1 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500"
              id="summarize-btn"
            >
              Summarize
            </button>
          </div>
        </div>
        ${isOverBudget ? `
          <div class="mt-2 text-sm text-pink-500">
            <svg class="inline-block h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            Exceeds monthly budget by ${currencySymbol}${(total - this.settings.maxAmount).toFixed(2)}
          </div>
        ` : ''}
      </div>
    `;

    this.querySelector('#summarize-btn')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('show-summary'));
    });
  }
}

customElements.define('expense-total', ExpenseTotal); 
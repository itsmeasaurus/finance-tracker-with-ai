import { expenseService } from '../services/expense-service.js';
import { currencyService } from '../services/currency-service.js';

class ExpenseForm extends HTMLElement {
  constructor() {
    super();
    this.settings = JSON.parse(localStorage.getItem('settings')) || { currency: 'USD' };
    this.categories = [
      { id: 'housing', name: 'Mortgage/Rent', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
      { id: 'utilities', name: 'Utility Bill', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/><path d="M4 12h16"/></svg>` },
      { id: 'transport', name: 'Car Gas/Fuel', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2v-5h-2"/><path d="M4 17h2"/><path d="M6 8v9"/><path d="M18 8v9"/><path d="M8 6h8l4 4H4z"/></svg>` },
      { id: 'education', name: 'Education', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>` },
      { id: 'medical', name: 'Medical Expenses', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 3v12h-5c-.023-3.681.184-7.406 5-12zm0 12v6h-5v-6h5zm-12-2h4"/><path d="M8 7h4"/><path d="M10 13v-6"/><path d="M5 3v12h5V3H5zm0 12v6h5v-6H5z"/></svg>` },
      { id: 'insurance', name: 'Insurance', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>` }
    ];

    this.render();
    window.addEventListener('settings-updated', (e) => {
      this.settings = e.detail;
      this.render();
    });
  }

  connectedCallback() {
    setTimeout(() => {
      this.setupEventListeners();
    }, 0);
  }

  render() {
    const today = new Date().toISOString().split('T')[0];
    const currencySymbol = currencyService.getCurrencySymbol(this.settings.currency);

    this.innerHTML = `
      <div class="bg-[#2D2B3F] shadow-lg rounded-3xl px-8 pt-8 pb-8 mb-4">
        <form id="expense-form">
          <div class="mb-6">
            <label class="block text-white text-sm font-bold mb-4" for="amount">
              Amount
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="text-white text-lg font-bold">${currencySymbol}</span>
              </div>
              <input
                class="shadow-lg appearance-none border-0 rounded-2xl w-full py-3 px-10 text-white bg-[#1D1B2F] leading-tight focus:outline-none focus:ring-2 focus:ring-violet-500"
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                required
                placeholder="0.00"
              >
            </div>
          </div>
          
          <div class="mb-8">
            <label class="block text-white text-sm font-bold mb-4">
              Category
            </label>
            <div class="grid grid-cols-3 gap-6">
              ${this.categories.map(category => `
                <label class="category-item cursor-pointer">
                  <input type="radio" name="category" value="${category.id}" class="hidden" required>
                  <div class="flex flex-col items-center p-6 rounded-2xl border-2 border-transparent hover:border-violet-500 transition-all bg-[#1D1B2F] shadow-lg">
                    <div class="icon-wrapper text-white hover:text-violet-500 mb-3">
                      ${category.icon}
                    </div>
                    <span class="text-sm text-center text-white font-medium">${category.name}</span>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-white text-sm font-bold mb-4" for="date">
              Date
            </label>
            <input 
              class="shadow-lg appearance-none border-0 rounded-2xl w-full py-3 px-4 text-white bg-[#1D1B2F] leading-tight focus:outline-none focus:ring-2 focus:ring-violet-500"
              type="date"
              id="date"
              name="date"
              value="${today}"
              required
            >
          </div>

          <div class="mb-8">
            <label class="block text-white text-sm font-bold mb-4" for="description">
              Description
            </label>
            <textarea 
              class="shadow-lg appearance-none border-0 rounded-2xl w-full py-3 px-4 text-white bg-[#1D1B2F] leading-tight focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              id="description"
              name="description"
              rows="3"
              required
              placeholder="Enter expense description..."
            ></textarea>
          </div>

          <div class="flex items-center justify-between">
            <base-button type="submit" variant="primary">
              Add Expense
            </base-button>
          </div>
        </form>
      </div>
    `;
  }

  setupEventListeners() {
    this.form = this.querySelector('#expense-form');
    if (!this.form) return;

    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    const categoryItems = this.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
      item.addEventListener('click', () => {
        categoryItems.forEach(i => i.querySelector('div').classList.remove('border-violet-500', 'bg-[#2D2B3F]'));
        item.querySelector('div').classList.add('border-violet-500', 'bg-[#2D2B3F]');
      });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(this.form);
    const expense = {
      amount: this.form.amount.value,
      category: formData.get('category'),
      date: this.form.date.value,
      description: this.form.description.value,
      id: Date.now()
    };
    
    expenseService.addExpense(expense);
    this.form.reset();
    this.querySelectorAll('.category-item div').forEach(div => {
      div.classList.remove('border-violet-500', 'bg-[#2D2B3F]');
    });
  }
}

customElements.define('expense-form', ExpenseForm); 
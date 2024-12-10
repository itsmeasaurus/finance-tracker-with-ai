import { expenseService } from '../services/expense-service.js';
import { currencyService } from '../services/currency-service.js';

class ExpenseList extends HTMLElement {
  constructor() {
    super();
    this.sortConfig = {
      key: 'date',
      direction: 'desc'
    };
    this.categoryColors = {
      housing: 'bg-pink-500 bg-opacity-20 text-pink-500',
      utilities: 'bg-violet-500 bg-opacity-20 text-violet-500',
      transport: 'bg-cyan-400 bg-opacity-20 text-cyan-400',
      education: 'bg-yellow-400 bg-opacity-20 text-yellow-400',
      medical: 'bg-red-500 bg-opacity-20 text-red-500',
      insurance: 'bg-indigo-400 bg-opacity-20 text-indigo-400'
    };
    this.settings = JSON.parse(localStorage.getItem('settings')) || { currency: 'USD' };
    this.exchangeRates = null;
    this.render();
    window.addEventListener('expenses-updated', () => this.render());
    window.addEventListener('settings-updated', async (e) => {
      this.settings = e.detail;
      await this.updateExchangeRates();
      this.render();
    });
    this.updateExchangeRates();
  }

  async updateExchangeRates() {
    this.exchangeRates = await currencyService.getExchangeRates();
  }

  convertAmount(amount, fromCurrency = 'USD') {
    if (!this.exchangeRates || fromCurrency === this.settings.currency) {
      return amount;
    }
    
    const rate = this.exchangeRates[this.settings.currency].value;
    return amount * rate;
  }

  getCategoryTag(category) {
    const colors = this.categoryColors[category] || 'bg-gray-100 text-gray-800';
    const displayName = category.charAt(0).toUpperCase() + category.slice(1);
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}">
      ${displayName}
    </span>`;
  }

  sortExpenses(expenses) {
    return [...expenses].sort((a, b) => {
      let aValue = a[this.sortConfig.key];
      let bValue = b[this.sortConfig.key];
      
      // Convert to comparable values
      if (this.sortConfig.key === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (this.sortConfig.key === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Sort direction
      if (this.sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }

  handleSort(key) {
    if (this.sortConfig.key === key) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.key = key;
      this.sortConfig.direction = 'desc';
    }
    this.render();
  }

  getSortIcon(key) {
    if (this.sortConfig.key !== key) return '↕️';
    return this.sortConfig.direction === 'asc' ? '↑' : '↓';
  }

  render() {
    const expenses = this.sortExpenses(expenseService.getAllExpenses());
    const currencySymbol = currencyService.getCurrencySymbol(this.settings.currency);

    this.innerHTML = `
      <div class="bg-[#2D2B3F] shadow-md rounded-2xl px-8 pt-6 pb-8 mb-4">
        <h2 class="text-xl font-bold mb-4 text-white">Expense History</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="text-left py-2 text-gray-300">
                  <button class="flex items-center gap-1 hover:text-violet-500" data-sort="date">
                    Date ${this.getSortIcon('date')}
                  </button>
                </th>
                <th class="text-left py-2 text-gray-300">
                  <span class="ml-2">Category</span>
                </th>
                <th class="text-left py-2 text-gray-300">Description</th>
                <th class="text-right py-2 text-gray-300">
                  <button class="flex items-center gap-1 hover:text-violet-500 ml-auto" data-sort="amount">
                    Amount ${this.getSortIcon('amount')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map(expense => `
                <tr class="border-b border-gray-700 hover:bg-[#1D1B2F]">
                  <td class="py-2 text-gray-300">${new Date(expense.date).toLocaleDateString()}</td>
                  <td class="py-2">${this.getCategoryTag(expense.category)}</td>
                  <td class="py-2 text-gray-300">${expense.description}</td>
                  <td class="py-2 text-right text-gray-300">${currencySymbol}${parseFloat(this.convertAmount(expense.amount)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.querySelectorAll('[data-sort]').forEach(button => {
      button.addEventListener('click', () => {
        this.handleSort(button.dataset.sort);
      });
    });
  }
}

customElements.define('expense-list', ExpenseList); 
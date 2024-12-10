import { expenseService } from '../services/expense-service.js';
import { geminiService } from '../services/gemini-service.js';

class SummaryPopup extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity hidden" id="summary-backdrop"></div>
      <div class="fixed inset-0 z-10 overflow-y-auto hidden" id="summary-modal">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="absolute right-0 top-0 pr-4 pt-4">
              <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" id="close-summary">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  <span class="flex items-center gap-2">
                    Summarized by Google Gemini
                    <svg class="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </span>
                </h3>
                <div id="summary-content" class="prose max-w-none">
                  <div class="flex justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const backdrop = this.querySelector('#summary-backdrop');
    const modal = this.querySelector('#summary-modal');
    const closeBtn = this.querySelector('#close-summary');

    window.addEventListener('show-summary', async () => {
      backdrop.classList.remove('hidden');
      modal.classList.remove('hidden');
      
      const settings = JSON.parse(localStorage.getItem('settings')) || { maxAmount: 1000, currency: 'USD' };
      const expenses = expenseService.getAllExpenses();
      const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      const categories = [...new Set(expenses.map(exp => exp.category))];

      const summaryData = {
        total,
        maxAmount: settings.maxAmount,
        currency: settings.currency,
        expenses,
        categories
      };

      const summary = await geminiService.summarizeExpenses(summaryData);
      const contentDiv = this.querySelector('#summary-content');
      contentDiv.innerHTML = `<p class="text-gray-700">${summary}</p>`;
    });

    [closeBtn, backdrop].forEach(element => {
      element.addEventListener('click', () => {
        backdrop.classList.add('hidden');
        modal.classList.add('hidden');
      });
    });
  }
}

customElements.define('summary-popup', SummaryPopup); 
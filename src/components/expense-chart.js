import { expenseService } from '../services/expense-service.js';
import { currencyService } from '../services/currency-service.js';
import Chart from 'chart.js/auto';

class ExpenseChart extends HTMLElement {
  constructor() {
    super();
    this.chartColors = {
      housing: '#EC4899',     // pink-500
      utilities: '#8B5CF6',   // violet-500
      transport: '#22D3EE',   // cyan-400
      education: '#FACC15',   // yellow-400
      medical: '#EF4444',     // red-500
      insurance: '#818CF8'    // indigo-400
    };
    this.innerHTML = `
      <div class="bg-[#2D2B3F] shadow-md rounded-2xl px-8 pt-6 pb-8 mb-4">
        <h2 class="text-xl font-bold mb-4 text-white">Expenses by Category</h2>
        <canvas id="expenseChart"></canvas>
      </div>
    `;
    
    this.chart = null;
    this.initChart();
    window.addEventListener('expenses-updated', () => this.updateChart());
  }

  initChart() {
    const ctx = document.getElementById('expenseChart');
    const expensesByCategory = expenseService.getExpensesByCategory();
    
    Chart.defaults.color = '#9CA3AF';  // text-gray-400
    Chart.defaults.borderColor = '#374151';  // border-gray-700
    
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(expensesByCategory),
        datasets: [{
          data: Object.values(expensesByCategory),
          backgroundColor: Object.keys(expensesByCategory).map(category => this.chartColors[category] || '#6B7280'),
          borderColor: '#1D1B2F',  // Match background color
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              color: '#D1D5DB',  // text-gray-300
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(45, 43, 63, 0.9)',  // bg-[#2D2B3F] with opacity
            titleColor: '#FFFFFF',
            bodyColor: '#D1D5DB',
            padding: 12,
            borderColor: '#4B5563',
            borderWidth: 1,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const currency = currencyService.getCurrencySymbol('USD');
                return ` ${currency}${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }

  updateChart() {
    const expensesByCategory = expenseService.getExpensesByCategory();
    this.chart.data.labels = Object.keys(expensesByCategory);
    this.chart.data.datasets[0].data = Object.values(expensesByCategory);
    this.chart.data.datasets[0].backgroundColor = Object.keys(expensesByCategory)
      .map(category => this.chartColors[category] || '#6B7280');
    this.chart.update();
  }
}

customElements.define('expense-chart', ExpenseChart); 
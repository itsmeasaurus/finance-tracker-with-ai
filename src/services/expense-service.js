class ExpenseService {
  constructor() {
    this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  }

  addExpense(expense) {
    this.expenses.push(expense);
    this.saveToLocalStorage();
    this.dispatchExpenseUpdate();
  }

  getAllExpenses() {
    return this.expenses;
  }

  getExpensesByCategory() {
    return this.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
      return acc;
    }, {});
  }

  saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
  }

  dispatchExpenseUpdate() {
    window.dispatchEvent(new CustomEvent('expenses-updated'));
  }
}

export const expenseService = new ExpenseService(); 
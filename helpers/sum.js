import { formatTotalExpenseText } from './expenses.js';

export function formatTotalExpensesPerUserMessage(totalExpensesPerUser) {
  let message = '*Gastos totales*\n';
  for (const { username, totalExpenses } of Object.values(totalExpensesPerUser)) {
    message += formatTotalExpenseText(username, totalExpenses) + '\n';
  }
  return message;
}
import { formatTotalExpenseText } from './expenses.js';

export function formatTotalsMessage(totals) {
  let message = '*Gastos totales*\n';
  for (const [user, amount] of Object.entries(totals)) {
    message += formatTotalExpenseText(user, amount) + '\n';
  }
  return message;
}
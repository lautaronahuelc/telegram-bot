import { formatCurrency } from './currency.js';

export function formatExpenseText(amount, desc) {
  return `_${formatCurrency(amount)}_ - ${desc}`;
}
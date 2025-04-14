import UserCollection from '../queries/users.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { hasData } from '../helpers/array.js';
import { formatCurrency } from '../helpers/currency.js';
import { hasError } from '../helpers/error.js';

export async function useShowTotals() {
  const { data, error } = await UserCollection.findAllTotalExpenses();

  if (hasError(error)) {
    return { message: error.message };
  }

  if (!hasData(data)) {
    return { message: BOT_MESSAGES.USER.TOTAL_EXPENSES.FETCHING.EMPTY };
  }

  return { message: buildExpensesMessage(data) };
}

function buildExpensesMessage(data) {
  let message = '*Gastos totales*' + '\n';

  for (const { username, totalExpenses: amount } of data) {
    message += buildLineText(username, amount) + '\n';
  }
  
  return message;
}

function buildLineText(username, amount) {
  return `@${username} - ${formatCurrency(amount)}`;
}
import ExpenseCollection from '../api/expenses.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { hasError } from '../helpers/error.js';

export async function useAdd({ amount, desc, userId, username }) {
  if (!amount || !desc) {
    return { message: BOT_MESSAGES.UPS.INCORRECT_FORMAT};
  }

  const { error } = await ExpenseCollection.newExpense({
    amount,
    desc,
    userId,
    username
  });

  if (hasError(error)) {
    return { message: error.message };
  }

  return { message: BOT_MESSAGES.EXPENSES.ADDING.SUCCESS };
}



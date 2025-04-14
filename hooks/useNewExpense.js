import ExpenseCollection from '../queries/expenses.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { hasError } from '../helpers/error.js';

export async function useNewExpense({ amount, desc, userId, username }) {
  const { data, error } = await ExpenseCollection.newExpense({
    amount,
    desc,
    userId,
    username
  });

  return {
    data,
    message: hasError(error) ? error.message : BOT_MESSAGES.EXPENSES.ADDING.SUCCESS,
  };
}
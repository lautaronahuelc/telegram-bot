import { BOT_MESSAGES } from '../constants/messages.js';
import { hasError } from '../helpers/error.js';
import ExpenseCollection from '../queries/expenses.js';

export async function useDeleteExpense(id) {
  const { data, error } = await ExpenseCollection.deleteExpense(id);

  return {
    data,
    message: hasError(error) ? error.message : BOT_MESSAGES.EXPENSES.DELETING_ONE.SUCCESS,
  };
}
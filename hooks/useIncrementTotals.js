import UserCollection from '../queries/users.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { hasError } from '../helpers/error.js';

export async function useIncrementTotals({ userId, amount }) {
  const { data, error } = await UserCollection.incrementTotalExpenses({ userId, amount });

  return {
    data,
    message: hasError(error) ? error.message : BOT_MESSAGES.USER.TOTAL_EXPENSES.INCREMENTING.SUCCESS,
  };
}
import UserCollection from '../queries/users.js';
import { BOT_MESSAGES } from '../constants/messages.js';

export async function useIncrementTotals({ userId, amount }) {
  const { data, error } = await UserCollection.incrementTotalExpenses({ userId, amount });

  return {
    data,
    message: error.message ?? BOT_MESSAGES.USER.TOTAL_EXPENSES.INCREMENTING.SUCCESS,
  };
}
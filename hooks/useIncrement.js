import UserCollection from '../api/users.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { hasError } from '../helpers/error.js';

export async function useIncrement({ amount, userId }) {
  const { error } = await UserCollection.incrementUserTotalExpenses(userId, amount);

  if (hasError(error)) {
    return { message: error.message };
  }

  return { message: BOT_MESSAGES.USER.TOTAL_EXPENSES.INCREMENTING.SUCCESS };
}
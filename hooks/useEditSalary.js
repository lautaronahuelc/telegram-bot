import { BOT_MESSAGES } from '../constants/messages.js';
import UserCollection from '../queries/users.js';

export async function useEditSalary({ userId, salary }) {
  const { data, error } = await UserCollection.editSalary({ userId, salary });

  return {
    data,
    message: error.message ?? BOT_MESSAGES.USER.SALARY.EDITING.SUCCESS,
  }
}
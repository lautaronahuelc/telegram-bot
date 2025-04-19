/* import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';
import { sendMessage } from '../helpers/sendMessage.js';

export async function onDeleteAll(msg) {
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  const expenseResponse = await ExpenseCollection.deleteAllExpenses();

  if (expenseResponse.error) {
    await sendMessage(chatId, expenseResponse.errorMessage);
    return;
  }

  const userResult = await UserCollection.resetUsersTotalExpenses();

  if (userResult.error) {
    const message = `${expenseResponse.successMessage}\n${userResult.errorMessage}`;
    await sendMessage(chatId, message);
    return;
  }

  const message = `${expenseResponse.successMessage}\n${userResult.successMessage}`;
  await sendMessage(chatId, message); 
} */
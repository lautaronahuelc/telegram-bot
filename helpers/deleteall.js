import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { sendMessage } from '../helpers/sendMessage.js';

export async function onDeleteAll(msg) {
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  // Attempt to delete all expenses from the database
  const expenseResponse = await ExpenseCollection.deleteAllExpenses();

  // Handle errors when deleting all expenses
  if (expenseResponse.error) {
    await sendMessage(chatId, expenseResponse.errorMessage);
    return;
  }

  // Reset the total expenses for all users
  const userResult = await UserCollection.resetUsersTotalExpenses();

  // Handle errors when resetting user expenses
  if (userResult.error) {
    const message = `${expenseResponse.successMessage}\n${userResult.errorMessage}`;
    await sendMessage(chatId, message);
    return;
  }

  // Send a success message if both operations succeed
  const message = `${expenseResponse.successMessage}\n${userResult.successMessage}`;
  await sendMessage(chatId, message);
  
}
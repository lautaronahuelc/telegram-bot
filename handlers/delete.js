import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { buildInlineKeyboard } from '../helpers/expenses.js';
import { sendMessage } from '../helpers/sendMessage.js';

export async function onDelete(msg) {
  const chatId = msg.chat.id;
  const expenses = await ExpenseCollection.loadExpenses(chatId);
  if (expenses.length === 0) return;
  const inlineKeyboard = buildInlineKeyboard(expenses);
  await sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ONE.SELECT, {
    reply_markup: { inline_keyboard: inlineKeyboard },
  });
}

export async function deleteExpense(callbackQuery) {
  // Extract basic information from the callback query
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const userId = callbackQuery.from.id;

  // Handle cancellation
  if (data === 'delete_cancel') {
    await sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ONE.CANCEL);
    return;
  }

  // Extract the expense ID from the callback data
  const id = data.replace('delete_', '');

  // Attempt to delete the expense from the database
  const expenseResult = await ExpenseCollection.deleteExpense(id);

  // Handle errors when deleting the expense
  if (expenseResult.error) {
    await sendMessage(chatId, expenseResult.errorMessage);
    return;
  }

  console.log(expenseResult)

  // Update the user's total expenses by decrementing the deleted expense amount
  const userResult = await UserCollection.incrementTotalExpenses({
    userId,
    amount: -expenseResult.deletedExpense.amount
  });

  // Handle errors when updating the user's total expenses
  if (userResult.error) {
    const message = `${expenseResult.successMessage}\n${userResult.errorMessage}`;
    await sendMessage(chatId, message);
    return;
  }

  // Send a success message if both operations succeed
  const message = `${expenseResult.successMessage}\n${userResult.successMessage}`;
  await sendMessage(chatId, message);
}
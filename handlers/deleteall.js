import ExpenseCollection from '../api/expenses.js';
import UserCollection from '../api/users.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { buildDeleteAllKeyboard } from '../helpers/keyboard.js';
import { sendMessage } from '../helpers/sendMessage.js';

export async function onDeleteAll(msg) {
  const chatId = msg.chat.id;
  const expenses = await ExpenseCollection.loadExpenses(chatId);
  if (expenses.length === 0) return;
  const inlineKeyboard = buildDeleteAllKeyboard();
  await sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ALL.CONFIRM, {
    reply_markup: { inline_keyboard: inlineKeyboard },
  });
}

export async function deleteAllExpenses(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  if (data === 'deleteall_confirm') return await confirmDeleteAllExpenses(chatId);
  if (data === 'deleteall_cancel') return await cancelDeleteAllExpenses(chatId);
}

async function confirmDeleteAllExpenses(chatId) {
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

async function cancelDeleteAllExpenses(chatId) {
  await sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ALL.CANCEL);
}
import ExpenseCollection from '../api/expenses.js';
import { bot } from '../bot.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { buildInlineKeyboard } from '../helpers/expenses.js';

export async function onDelete(msg) {
  const chatId = msg.chat.id;
  const expenses = await ExpenseCollection.loadExpenses(chatId);
  if (expenses.length === 0) return;
  const inlineKeyboard = buildInlineKeyboard(expenses);
  await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ONE.SELECT, {
    reply_markup: { inline_keyboard: inlineKeyboard },
  });
}

export async function deleteExpense(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  if (data === 'delete_cancel') {
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ONE.CANCEL);
    return;
  }
  const id = data.replace('delete_', '');
  await ExpenseCollection.deleteExpense(chatId, id);
}
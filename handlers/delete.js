import MongoDB from '../api/expenses.js';
import { bot } from '../bot.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { buildInlineKeyboard, sendNoExpensesMessage } from '../helpers/expenses.js';

export async function onDelete(msg) {
  const chatId = msg.chat.id;
  const expenses = await MongoDB.loadExpenses(chatId);
  if (expenses.length === 0) {
    return await sendNoExpensesMessage(chatId);
  }
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
  await MongoDB.deleteExpense(chatId, id);
}
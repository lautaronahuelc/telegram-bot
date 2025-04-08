import MongoDB from '../api/expenses.js';
import { bot } from '../bot.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { sendNoExpensesMessage } from '../helpers/expenses.js';
import { buildDeleteAllKeyboard } from '../helpers/keyboard.js';

export async function onDeleteAll(msg) {
  const chatId = msg.chat.id;
  const expenses = await MongoDB.loadExpenses(chatId);
  if (expenses.length === 0) {
    return await sendNoExpensesMessage(chatId);
  }
  const inlineKeyboard = buildDeleteAllKeyboard();
  await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ALL.CONFIRM, {
    reply_markup: { inline_keyboard: inlineKeyboard },
  });
}

export async function deleteAllExpenses(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  if (data === 'deleteall_confirm') {
    await MongoDB.deleteAllExpenses(chatId);
  }
  if (data === 'deleteall_cancel') {
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ALL.CANCEL);
  }
}
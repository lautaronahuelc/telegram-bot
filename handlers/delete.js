import MongoDB from '../api/expenses.js';
import { bot } from '../bot.js';
import { buildInlineKeyboard, sendNoExpensesMessage } from '../helpers/expenses.js';

export async function onDelete(msg) {
  const chatId = msg.chat.id;
  const expenses = await MongoDB.loadExpenses(chatId);
  if (expenses.length === 0) {
    return await sendNoExpensesMessage(chatId);
  }
  const inlineKeyboard = buildInlineKeyboard(expenses);
  await bot.sendMessage(chatId, 'Selecciona el gasto a eliminar:', {
    reply_markup: { inline_keyboard: inlineKeyboard },
  });
}

export async function deleteExpense(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const id = callbackQuery.data.replace('delete_', '');
  await MongoDB.deleteExpense(chatId, id);
}
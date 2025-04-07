import MongoDB from '../api/expenses.js';
import { bot } from '../bot.js';
import { sendNoExpensesMessage } from '../helpers/expenses.js';
import { buildDeleteAllKeyboard } from '../helpers/keyboard.js';

export async function onDeleteAll(msg) {
  const chatId = msg.chat.id;
  const expenses = await MongoDB.loadExpenses(chatId);
  if (expenses.length === 0) {
    return await sendNoExpensesMessage(chatId);
  }
  const inlineKeyboard = buildDeleteAllKeyboard();
  await bot.sendMessage(chatId, '¿Está seguro que desea elimnar todos los gastos? 👀', {
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
    await bot.sendMessage(chatId, 'Cancelando... 🕓');
    await bot.sendMessage(chatId, '✅ Eliminación cancelada. No se han eliminado gastos.');
  }
}
import { bot } from '../bot.js';
import { deleteExpense } from './delete.js';
import { deleteAllExpenses } from './deleteall.js';

export async function onCallbackQuery(callbackQuery) {
  const data = callbackQuery.data;
  if (data.startsWith('delete_')) {
    await deleteExpense(callbackQuery);
  } else if (data.startsWith('deleteall_')) {
    await deleteAllExpenses(callbackQuery);
  } else {
    console.warn(`Unknown callback data: ${data}`);
  }
  // Importante: responder al callback para evitar spinner infinito
  await bot.answerCallbackQuery(callbackQuery.id);
}
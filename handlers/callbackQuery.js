import { bot } from '../bot.js';
import { deleteExpense } from './delete.js';
import { deleteAllExpenses } from './deleteAll.js';

export async function onCallbackQuery(callbackQuery) {
  const data = callbackQuery.data;
  
  if (data.startsWith('deleteall_')) await deleteAllExpenses(callbackQuery);
  if (data.startsWith('delete_')) await deleteExpense(callbackQuery);

  // Importante: responder al callback para evitar spinner infinito
  await bot.answerCallbackQuery(callbackQuery.id);
}
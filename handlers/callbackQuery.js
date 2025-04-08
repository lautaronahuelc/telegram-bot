import { bot } from '../bot.js';
import { deleteExpense } from './delete.js';
import { deleteAllExpenses } from './deleteall.js';

export async function onCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;
  if (data.startsWith('delete_')) await deleteExpense(callbackQuery);
  if (data.startsWith('deleteall_')) await deleteAllExpenses(callbackQuery);
  await bot.editMessageReplyMarkup(
    { inline_keyboard: [] },
    { chat_id: chatId, message_id: messageId }
  );
  // Importante: responder al callback para evitar spinner infinito
  await bot.answerCallbackQuery(callbackQuery.id);
}
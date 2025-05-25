import { bot } from '../bot.js';
import { reactToMessage } from '../helpers/reactToMessage.js';
import { deleteExpense, messageToDeleteId } from './delete.js';

export async function onCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;
  
  if (data.startsWith('delete_')) await deleteExpense(callbackQuery);

  await bot.editMessageReplyMarkup(
    { inline_keyboard: [] },
    { chat_id: chatId, message_id: messageId }
  );

  bot.deleteMessage(chatId, messageId);
  await reactToMessage(chatId, messageToDeleteId, '👍');

  setTimeout(() => {
    bot.deleteMessage(chatId, messageToDeleteId);
  }, 3000);


  // Importante: responder al callback para evitar spinner infinito
  await bot.answerCallbackQuery(callbackQuery.id);
}
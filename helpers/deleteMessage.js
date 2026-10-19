import { bot } from '../bot.js';

export async function deleteMessage(chatId, messageId) {
  try {
    await bot.api.deleteMessage({ chat_id: chatId, message_id: messageId });
  } catch (error) {
    console.error('❌ Error deleting message:', error);
  }
}

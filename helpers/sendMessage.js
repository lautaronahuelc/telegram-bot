import { bot } from '../bot.js';

export async function sendMessage(chatId, message, options = {}) {
  try {
    await bot.api.sendMessage({ chat_id: chatId, text: message, ...options });
  } catch (error) {
    console.error('❌ Error sending message to user:', error);
  }
}

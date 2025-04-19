import { bot } from '../bot.js';

export async function sendMessage(chatId, message, options = {}) {
  try {
    await bot.sendMessage(chatId, message, options);
  } catch (error) {
    console.error('❌ Error sending message to user:', error);
  }
}
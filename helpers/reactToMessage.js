import { bot } from '../bot.js';

export async function reactToMessage(chatId, messageId, emoji) {
  try {
    await bot.setMessageReaction(chatId, messageId, {
      reaction: [{ type: 'emoji', emoji }],
    });
  } catch (error) {
    console.error('❌ Error sending reaction:', error);
  }
}

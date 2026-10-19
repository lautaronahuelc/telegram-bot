import { bot } from '../bot.js';

export async function reactToMessage(chatId, messageId, emoji) {
  try {
    await bot.api.setMessageReaction({
      chat_id: chatId,
      message_id: messageId,
      reaction: [{ type: 'emoji', emoji }],
    });
  } catch (error) {
    console.error('❌ Error sending reaction:', error);
  }
}

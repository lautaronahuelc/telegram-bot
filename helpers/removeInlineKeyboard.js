import { bot } from '../bot.js';

export async function removeInlineKeyboard(chatId, messageId) {
  try {
    await bot.api.editMessageReplyMarkup({
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] },
    });
  } catch (error) {
    console.error('❌ Error removing inline keyboard:', error);
  }
}

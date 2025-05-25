import { envConfig } from '../config/env.js';

envConfig

export async function reactToMessage(chatId, messageId, emoji) {
  const url = `https://api.telegram.org/bot${envConfig.BOT_TOKEN}/setMessageReaction`;

  const body = {
    chat_id: chatId,
    message_id: messageId,
    reaction: [
      {
        type: 'emoji',
        emoji,
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!data.ok) {
      console.error('❌ Failed to react to message:', data);
    }

    return data;
  } catch (err) {
    console.error('❌ Error sending reaction:', err);
    return null;
  }
}
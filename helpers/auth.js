import { bot } from '../bot.js';
import { BOT_MESSAGES } from '../constants/messages.js';

function isAuthorized(id) {
  const allowedUsers = JSON.parse(process.env.AUTHORIZED_USERS);
  return allowedUsers.includes(id.toString());
}

export function withAuth(handler) {
  return async (msg, match) => {
    if (!isAuthorized(msg.from.id)) {
      return await bot.sendMessage(msg.chat.id, BOT_MESSAGES.AUTH.ERROR);
    }
    return handler(msg, match);
  };
}
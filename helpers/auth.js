import { bot } from '../bot.js';
import { envConfig } from '../config/env.js';
import { BOT_MESSAGES } from '../constants/messages.js';

function isAuthorized(id) {
  const allowedUsers = JSON.parse(envConfig.AUTHORIZED_USERS);
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
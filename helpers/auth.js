import { bot } from '../bot.js';
import { envConfig } from '../config/env.js';

function isAuthorized(id) {
  const allowedUsers = JSON.parse(envConfig.AUTHORIZED_USERS);
  return allowedUsers.includes(id.toString());
}

export function withAuth(handler) {
  return async (msg, match) => {
    if (!isAuthorized(msg.from.id)) {
      return await bot.sendMessage(msg.chat.id, '¡Lo siento! No estás autorizado para usar este bot.');
    }
    return handler(msg, match);
  };
}
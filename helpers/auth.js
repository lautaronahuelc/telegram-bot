import { envConfig } from '../config/env.js';
import { sendMessage } from './sendMessage.js';

function isAuthorized(id) {
  const allowedUsers = JSON.parse(envConfig.AUTHORIZED_USERS);
  return id !== undefined && allowedUsers.includes(id.toString());
}

export async function auth(ctx, next) {
  if (isAuthorized(ctx.from?.id)) return next();

  if (ctx.callbackQuery) await ctx.answerCallbackQuery();
  if (ctx.chatId) {
    await sendMessage(ctx.chatId, '¡Lo siento! No estás autorizado para usar este bot.');
  }
}

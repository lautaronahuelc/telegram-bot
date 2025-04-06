import { bot } from "../bot.js";

function isAuthorized(id) {
  const allowedUsers = JSON.parse(process.env.AUTHORIZED_USERS);
  return allowedUsers.includes(id.toString());
}

export function withAuth(handler) {
  return (msg, match) => {
    if (!isAuthorized(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "¡Lo siento! No estás autorizado para usar este bot 😔");
    }
    return handler(msg, match);
  };
}
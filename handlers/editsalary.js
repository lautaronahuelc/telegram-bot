import UserCollection from '../api/users.js';
import { bot, waitingForResponse } from '../bot.js';
import { COMMAND } from '../constants/commands.js';
import { BOT_MESSAGES } from '../constants/messages.js';

export async function onEditSalary(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  waitingForResponse.set(userId, COMMAND.EDITSALARY);  
  await bot.sendMessage(chatId, BOT_MESSAGES.USER.SALARY.EDIT);
}

export async function editSalary(msg) {
  const chatId = msg.chat.id;
  const text = parseInt(msg.text);
  const userId = msg.from.id.toString();
  await UserCollection.editSalary(chatId, userId, text);
}
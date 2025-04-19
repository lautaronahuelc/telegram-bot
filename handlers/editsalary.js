import { bot, waitingForResponse } from '../bot.js';
import { COMMAND } from '../constants/commands.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { hasError } from '../helpers/error.js';
import { sendMessage } from '../helpers/sendMessage.js';
import { useEditSalary } from '../hooks/useEditSalary.js';
import { useUpdatePercentages } from '../hooks/useUpdatePercentages.js';

export async function onEditSalary(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  waitingForResponse.set(userId, COMMAND.EDITSALARY);  
  
  await bot.sendMessage(chatId, BOT_MESSAGES.USER.SALARY.EDITING.INSERT_NEW);
}

export async function editSalary(msg) {
  const chatId = msg.chat.id;
  const text = parseInt(msg.text);
  const userId = msg.from.id.toString();
  
  const editSalary = await useEditSalary({ userId, salary: text });
  const updatePercentage = await useUpdatePercentages();
  
  const error = hasError(editSalary, updatePercentage);

  if (error) {
    await sendMessage(chatId, error.message);
    return;
  }

  await sendMessage(chatId, editSalary.message);
}
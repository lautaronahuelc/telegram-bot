import { waitingForResponse } from '../bot.js';
import { COMMAND } from '../constants/commands.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { sendMessage } from '../helpers/sendMessage.js';
import { useAdd } from '../hooks/useAdd.js';
import { useIncrement } from '../hooks/useIncrement.js';

export async function onAdd(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  waitingForResponse.set(userId, COMMAND.ADD);  
  await sendMessage(chatId, BOT_MESSAGES.EXPENSES.ADDING.INSERT_NEW);
}

export async function addExpense(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;
  const { amount , desc } = getAmountAndDesc(msg.text);

  const { message: addMessage } = await useAdd({ amount, desc, userId, username });
  const { message: incrementMessage } = await useIncrement({ amount, userId });

  const message = addMessage + '\n' + incrementMessage;
  await sendMessage(chatId, message);
}

function getAmountAndDesc(text) {
  const match = text.match(/^(\d+)\s+(.+)/);

  if (!match) {
    return { amount: null, desc: null };
  }
  
  const amount = parseInt(match[1]);
  const desc = match[2];
  
  return { amount, desc };
}
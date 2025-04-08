import MongoDB from '../api/expenses.js';
import { bot, waitingForResponse } from '../bot.js';
import { COMMAND } from '../constants/commands.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { parseExpenseData } from '../helpers/message.js';

export async function onAdd(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  waitingForResponse.set(userId, COMMAND.ADD);  
  await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.ADDING.INSERT_NEW);
}

export async function addExpense(msg) {
  const chatId = msg.chat.id;
  const { amount , desc, user } = parseExpenseData(msg);
  await MongoDB.insertExpense(chatId, amount, desc, user);
}
import MongoDB from '../api/expenses.js';
import { bot, waitingForResponse } from '../bot.js';
import { COMMAND } from '../constants/commands.js';
import { parseExpenseData } from '../helpers/message.js';

export async function onAdd(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  waitingForResponse.set(userId, COMMAND.ADD);  
  await bot.sendMessage(chatId, 'Ingrese el nuevo gasto 😌');
}

export async function addExpense(msg) {
  const chatId = msg.chat.id;
  const { amount , desc, user } = parseExpenseData(msg);
  await MongoDB.insertExpense(chatId, amount, desc, user);
}
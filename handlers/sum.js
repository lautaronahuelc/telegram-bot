import MongoDB from '../api/expenses.js';
import { bot } from '../bot.js';
import { calculateTotals, sendNoExpensesMessage } from '../helpers/expenses.js';
import { formatTotalsMessage } from '../helpers/sum.js';

export async function onSum(msg) {
  const chatId = msg.chat.id;
  const expenses = await MongoDB.loadExpenses(chatId);
  if (expenses.length === 0) {
    return await sendNoExpensesMessage(chatId);
  }
  const totals = calculateTotals(expenses);
  const response = formatTotalsMessage(totals);
  await bot.sendMessage(chatId, response);
}
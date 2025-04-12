import ExpenseCollection from '../api/expenses.js';
import { bot } from '../bot.js';
import { calculateTotals } from '../helpers/expenses.js';
import { formatTotalsMessage } from '../helpers/sum.js';

export async function onSum(msg) {
  const chatId = msg.chat.id;
  const expenses = await ExpenseCollection.loadExpenses(chatId);
  if (expenses.length === 0) return;
  const totals = calculateTotals(expenses);
  const message = formatTotalsMessage(totals);
  await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
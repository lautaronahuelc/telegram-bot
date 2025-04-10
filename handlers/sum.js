import ExpenseCollection from '../api/expenses.js';
import { bot } from '../bot.js';
import { calculateTotals, sendNoExpensesMessage } from '../helpers/expenses.js';
import { formatTotalsMessage } from '../helpers/sum.js';

export async function onSum(msg) {
  const chatId = msg.chat.id;
  const expenses = await ExpenseCollection.loadExpenses(chatId);
  if (expenses.length === 0) {
    return await sendNoExpensesMessage(chatId);
  }
  const totals = calculateTotals(expenses);
  const message = formatTotalsMessage(totals);
  await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
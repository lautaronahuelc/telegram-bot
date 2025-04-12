import ExpenseCollection from '../api/expenses.js';
import UserCollection from '../api/users.js';
import { bot } from '../bot.js';
import { calculateTotalExpensesPerUser } from '../helpers/expenses.js';
import { formatTotalExpensesPerUserMessage } from '../helpers/sum.js';

export async function onSum(msg) {
  const chatId = msg.chat.id;
  const expenses = await ExpenseCollection.loadExpenses(chatId);
  if (expenses.length === 0) return;
  const totalExpensesPerUser = calculateTotalExpensesPerUser(expenses);
  await UserCollection.updateUsersTotalExpenses(totalExpensesPerUser);
  const message = formatTotalExpensesPerUserMessage(totalExpensesPerUser);
  await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
import MongoDB from '../api/expenses.js';
import { bot } from '../bot.js';
import {
  groupExpensesByUser,
  sendGroupedExpenses,
  sendNoExpensesMessage
} from '../helpers/expenses.js';

export async function onList(msg) {
  const chatId = msg.chat.id;
  const expenses = await MongoDB.loadExpenses(chatId);
  if (expenses.length === 0) {
    return await sendNoExpensesMessage(chatId);
  }
  await bot.sendMessage(chatId, 'Listando gastos... 🕓');
  const groupedExpenses = groupExpensesByUser(expenses);
  await sendGroupedExpenses(chatId, groupedExpenses);
}
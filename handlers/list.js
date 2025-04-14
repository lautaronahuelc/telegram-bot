import ExpenseCollection from '../queries/expenses.js';
import {
  groupExpensesByUser,
  sendGroupedExpenses,
} from '../helpers/expenses.js';

export async function onList(msg) {
  const chatId = msg.chat.id;
  const expenses = await ExpenseCollection.loadExpenses(chatId);
  if (expenses.length === 0) return;
  const groupedExpenses = groupExpensesByUser(expenses);
  await sendGroupedExpenses(chatId, groupedExpenses);
}
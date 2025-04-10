import ExpenseCollection from '../api/expenses.js';
import {
  groupExpensesByUser,
  sendGroupedExpenses,
  sendNoExpensesMessage
} from '../helpers/expenses.js';

export async function onList(msg) {
  const chatId = msg.chat.id;
  const expenses = await ExpenseCollection.loadExpenses(chatId);
  if (expenses.length === 0) {
    return await sendNoExpensesMessage(chatId);
  }
  const groupedExpenses = groupExpensesByUser(expenses);
  await sendGroupedExpenses(chatId, groupedExpenses);
}
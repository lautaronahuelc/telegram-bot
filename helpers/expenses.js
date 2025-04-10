import { bot } from '../bot.js';
import { BOT_MESSAGES } from '../constants/messages.js';

export function buildInlineKeyboard(expenses) {
  const sortedExpenses = expenses.sort((a, b) => a.date - b.date);
  const expensesKeyboard = sortedExpenses.map(({ amount, desc, id }) => {
    return [
      {
        text: formatExpenseText(amount, desc).replaceAll('_', ''),
        callback_data: `delete_${id}`,
      },
    ];
  });
  expensesKeyboard.push([
    {
      text: 'Cancelar',
      callback_data: 'delete_cancel',
    },
  ]);
  return expensesKeyboard;
}

export function calculateTotals(expenses) {
  return expenses.reduce((totals, { user, amount }) => {
    if (!totals[user]) totals[user] = 0;
    totals[user] += amount;
    return totals;
  }, {});
}

export function formatExpenseText(amount, desc) {
  amount = Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount).trim();
  return `_${amount}_ - ${desc}`;
}

export function formatTotalExpenseText(user, amount) {
  amount = Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount).trim();
  return `@${user} - ${amount}`;
}

export function groupExpensesByUser(expenses) {
  const sortedExpenses = expenses.sort((a, b) => a.date - b.date);
  return sortedExpenses.reduce((grouped, { user, amount, desc }) => {
    if (!grouped[user]) grouped[user] = [];
    grouped[user].push(formatExpenseText(amount, desc));
    return grouped;
  }, {});
}

export async function sendNoExpensesMessage(chatId) {
  await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.FETCHING.NOT_FOUND);
}

export async function sendGroupedExpenses(chatId, groupedExpenses) {
  for (const user in groupedExpenses) {
    const message = `*Gastos de @${user}*\n${groupedExpenses[user].join('\n')}`;
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}
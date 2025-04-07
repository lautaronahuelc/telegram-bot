import { bot } from '../bot.js';

export function buildInlineKeyboard(expenses) {
  return expenses.map(({ amount, desc, id }) => {
    return [
      {
        text: formatExpenseText(amount, desc),
        callback_data: `delete_${id}`,
      },
    ];
  });
}

export function calculateTotals(expenses) {
  return expenses.reduce((totals, { user, amount }) => {
    if (!totals[user]) totals[user] = 0;
    totals[user] += amount;
    return totals;
  }, {});
}

export function formatExpenseText(amount, desc) {
  return `💵 $${amount} "${desc}"`;
}

export function groupExpensesByUser(expenses) {
  return expenses.reduce((grouped, { user, amount, desc }) => {
    if (!grouped[user]) grouped[user] = [];
    grouped[user].push(formatExpenseText(amount, desc));
    return grouped;
  }, {});
}

export async function sendNoExpensesMessage(chatId) {
  await bot.sendMessage(chatId, '¡Ups! Aún no tienes gastos registrados...');
  await bot.sendMessage(chatId, 'Usá /add para comenzar.');
}

export async function sendGroupedExpenses(chatId, groupedExpenses) {
  for (const user in groupedExpenses) {
    const message = `😎 Gastos de @${user}:\n${groupedExpenses[user].join('\n')}`;
    await bot.sendMessage(chatId, message);
  }
}
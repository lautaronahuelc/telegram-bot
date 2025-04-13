import { bot } from '../bot.js';
import { formatCurrency } from './currency.js';

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

export function formatExpenseText(amount, desc) {
  return `_${formatCurrency(amount)}_ - ${desc}`;
}

export function groupExpensesByUser(expenses) {
  const sortedExpenses = expenses.sort((a, b) => a.date - b.date);
  return sortedExpenses.reduce((grouped, { username, amount, desc }) => {
    if (!grouped[username]) grouped[username] = [];
    grouped[username].push(formatExpenseText(amount, desc));
    return grouped;
  }, {});
}

export async function sendGroupedExpenses(chatId, groupedExpenses) {
  for (const user in groupedExpenses) {
    const message = `*Gastos de @${user}*\n${groupedExpenses[user].join('\n')}`;
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}
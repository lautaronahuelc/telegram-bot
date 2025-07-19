import ExpenseCollection from '../queries/expenses.js';
import { sendMessage } from '../helpers/sendMessage.js';
import { formatExpenseText } from '../helpers/expenses.js';

export async function onList(msg) {
  const chatId = msg.chat.id;

  const { data, error } = await ExpenseCollection.getAll();

  if (!data.length) {
    await sendMessage(chatId, '❌ No se encontraron gastos.');
    return;
  }

  if (error) {
    await sendMessage(chatId, '❌ Ocurrió un error al obtener los gastos.');
    return;
  }
  
  const message = buildMessage(data);
  await sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

function buildMessage(data) {
  const sortedExpenses = data.sort((a, b) => a.date - b.date);
  
  const groupedExpenses = sortedExpenses.reduce((grouped, { username, amount, desc }) => {
    if (!grouped[username]) grouped[username] = [];
    grouped[username].push(formatExpenseText(amount, desc));
    return grouped;
  }, {});

  let message = '';

  for (const user in groupedExpenses) {
    message += `*Gastos de ${user}*\n${groupedExpenses[user].join('\n')}\n\n`;
  }

  return message;
}
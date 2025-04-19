import { formatCurrency } from '../helpers/currency.js';
import { sendMessage } from '../helpers/sendMessage.js';
import UserCollection from '../queries/users.js';

export async function onShowTotals(msg) {
  const { data, error } = await UserCollection.findAllTotalExpenses();

  if (error || !data.length) {
    await sendMessage(chatId, '❌ Ocurrió un error al obtener los gastos totales.');
    return;
  }

  const message = buildMessage(data);
  await sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
}

function buildMessage(data) {
  let message = '*Gastos totales*' + '\n';

  for (const { username, totalExpenses: amount } of data) {
    message += buildLineText(username, amount) + '\n';
  }
  
  return message;
}

function buildLineText(username, amount) {
  return `@${username} - ${formatCurrency(amount)}`;
}
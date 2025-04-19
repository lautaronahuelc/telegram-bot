import { formatCurrency } from '../helpers/currency.js';
import { hasError } from '../helpers/error.js';
import { sendMessage } from '../helpers/sendMessage.js';
import UserCollection from '../queries/users.js';

export async function onShowTotals(msg) {
  const result = await UserCollection.findAllTotalExpenses();
  const error = hasError(result);

  if (error) {
    await sendMessage(chatId, error.message);
    return;
  }

  const message = buildMessage(result.data);
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
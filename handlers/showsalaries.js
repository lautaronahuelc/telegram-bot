import UserCollection from '../queries/users.js';
import { formatCurrency } from '../helpers/currency.js';
import { sendMessage } from '../helpers/sendMessage.js';

export async function onShowSalaries(msg) {
  const chatId = msg.chat.id;

  const { data, error } = await UserCollection.getSalaries();

  if (error || !data.length) {
    return '❌ Error al obtener salarios.'
  }

  let message = '*Salarios ingresados*\n';

  for (const { username, salary } of data) {
    message += `@${username}: ${formatCurrency(salary)}\n`;
  }

  await sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
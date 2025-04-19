import UserCollection from '../queries/users.js';
import { formatCurrency } from '../helpers/currency.js';
import { hasError } from '../helpers/error.js';
import { sendMessage } from '../helpers/sendMessage.js';

export async function onShowSalaries(msg) {
  const chatId = msg.chat.id;

  const salaries = await UserCollection.getSalaries(chatId);
  const error = hasError(salaries);

  if (error) {
    await sendMessage(chatId, error.message);
    return;
  }

  let message = '*Salarios ingresados*\n';

  for (const { username, salary } of salaries.data) {
    message += `@${username}: ${formatCurrency(salary)}\n`;
  }

  await sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
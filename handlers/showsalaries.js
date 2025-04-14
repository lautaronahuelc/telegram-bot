import UserCollection from '../queries/users.js';
import { bot } from '../bot.js';
import { formatCurrency } from '../helpers/currency.js';

async function updateUsername(msg) {
  const userId = msg.from.id;
  const username = msg.from.username;
  await UserCollection.updateUsername(userId, username);
}

export async function onShowSalaries(msg) {
  updateUsername(msg);
  const chatId = msg.chat.id;
  const salaries = await UserCollection.getSalaries(chatId);
  let message = '*Salarios ingresados*\n';
  for (const { username, salary } of salaries) {
    message += `@${username}: ${formatCurrency(salary)}\n`;
  }
  await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
import { bot } from '../bot.js';
import { COMMANDLIST } from '../constants/commands.js';

export async function onHelp(msg) {
  const chatId = msg.chat.id;
  let message = '*Comandos disponibles*\n';
  for (const command of COMMANDLIST) {
    message += `/${command.name} - ${command.desc.toLowerCase()}\n`;
  }
  await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
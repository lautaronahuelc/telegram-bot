import { COMMANDLIST } from '../constants/commands.js';
import { sendMessage } from '../helpers/sendMessage.js';

export async function onHelp(msg) {
  const chatId = msg.chat.id;
  let message = '*Comandos disponibles*\n';
  for (const command of COMMANDLIST) {
    message += `/${command.name} - ${command.desc.toLowerCase()}\n`;
  }
  await sendMessage(chatId, message, { parse_mode: 'Markdown' });
}
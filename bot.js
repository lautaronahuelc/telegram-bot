import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

import {
  onAdd,
  onCallbackQuery,
  onDelete,
  onDeleteAll,
  onHelp,
  onList,
  onMessage,
  onSum,
} from './helpers/handlers.js';
import dbConnect from './config/db.js';
import { commandRegex } from './helpers/utils.js';

await dbConnect();

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.setMyCommands([
  { command: 'add', description: 'Agregar gasto' },
  { command: 'deleteall', description: 'Eliminar todos los gastos' },
  { command: 'delete', description: 'Eliminar un gasto' },
  { command: 'help', description: 'Mostrar el menú de ayuda' },
  { command: 'list', description: 'Listar gastos' },
  { command: 'sum', description: 'Sumar gastos' },
]);

bot.onText(commandRegex('add'), onAdd);
bot.onText(commandRegex('deleteall'), onDeleteAll);
bot.onText(commandRegex('delete'), onDelete)
bot.onText(commandRegex('help'), onHelp);
bot.onText(commandRegex('list'), onList);
bot.onText(commandRegex('sum'), onSum);

bot.on('message', onMessage);
bot.on('callback_query', onCallbackQuery);
import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

import dbConnect from './config/db.js';
import { withAuth } from './helpers/auth.js';
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

bot.onText(commandRegex('add'), withAuth(onAdd));
bot.onText(commandRegex('deleteall'), withAuth(onDeleteAll));
bot.onText(commandRegex('delete'), withAuth(onDelete));
bot.onText(commandRegex('help'), withAuth(onHelp));
bot.onText(commandRegex('list'), withAuth(onList));
bot.onText(commandRegex('sum'), withAuth(onSum));

bot.on('message', withAuth(onMessage));
bot.on('callback_query', withAuth(onCallbackQuery));
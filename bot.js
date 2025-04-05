import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

import { onAdd, onList, onDeleteAll, onSum, onHelp } from './commandHandlers.js';
import dbConnect from './config/db.js';

await dbConnect();

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.setMyCommands([
  { command: 'add', description: 'Agregar gasto' },
  { command: 'list', description: 'Listar gastos' },
  { command: 'sum', description: 'Sumar gastos' },
  { command: 'deleteall', description: 'Eliminar todos los gastos' },
  { command: 'help', description: 'Mostrar el menú de ayuda' },
]);

bot.onText(/\/add (\d+) (.+)/, onAdd);
bot.onText(/\/list/, onList);
bot.onText(/\/reset/, onDeleteAll);
bot.onText(/\/total/, onSum);
bot.onText(/\/help/, onHelp);
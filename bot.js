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
} from './commandHandlers.js';
import dbConnect from './config/db.js';

await dbConnect();

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.setMyCommands([
  { command: 'add', description: 'Agregar gasto' },
  { command: 'list', description: 'Listar gastos' },
  { command: 'sum', description: 'Sumar gastos' },
  { command: 'delete', description: 'Eliminar un gasto' },
  { command: 'deleteall', description: 'Eliminar todos los gastos' },
  { command: 'help', description: 'Mostrar el menú de ayuda' },
]);

bot.onText(/^\/add$/, onAdd);
bot.onText(/^\/list$/, onList);
bot.onText(/^\/delete$/, onDelete)
bot.onText(/^\/deleteall$/, onDeleteAll);
bot.onText(/^\/total$/, onSum);
bot.onText(/^\/help$/, onHelp);

bot.on('message', onMessage);
bot.on('callback_query', onCallbackQuery);
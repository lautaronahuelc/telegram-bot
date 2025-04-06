import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

import dbConnect from './config/db.js';
import { COMMANDS } from './constants/commands.js';
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

bot.setMyCommands(COMMANDS.map(({ name, desc }) => ({
  command: name,
  description: desc,
})));

bot.onText(commandRegex('add'), withAuth(onAdd));
bot.onText(commandRegex('deleteall'), withAuth(onDeleteAll));
bot.onText(commandRegex('delete'), withAuth(onDelete));
bot.onText(commandRegex('help'), withAuth(onHelp));
bot.onText(commandRegex('list'), withAuth(onList));
bot.onText(commandRegex('sum'), withAuth(onSum));

bot.on('message', withAuth(onMessage));
bot.on('callback_query', withAuth(onCallbackQuery));
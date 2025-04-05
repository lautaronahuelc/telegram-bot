import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

import { onAdd, onList, onReset, onTotal, onHelp } from './commandHandlers.js';
import dbConnect from './config/db.js';

await dbConnect();

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/add (\d+) (.+)/, onAdd);
bot.onText(/\/list/, onList);
bot.onText(/\/reset/, onReset);
bot.onText(/\/total/, onTotal);
bot.onText(/\/help/, onHelp);
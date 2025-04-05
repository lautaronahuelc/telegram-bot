import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import { onAdd, onTotal, onReset, onList, onHelp } from './handlers.js';

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/add (\d+) (.+)/, onAdd);
bot.onText(/\/total/, onTotal);
bot.onText(/\/reset/, onReset);
bot.onText(/\/list/, onList);
bot.onText(/\/help/, onHelp);
import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';

import dbConnect from './config/db.js';
import { envConfig } from './config/env.js';
import { COMMAND, COMMANDLIST } from './constants/commands.js';
import { withAuth } from './helpers/auth.js';
import {
  onAdd,
  onCallbackQuery,
  onDelete,
  onEditSalary,
  onHelp,
  onList,
  onMessage,
  onShowSalaries,
  onShowTotals,
} from './handlers/index.js';
import { commandRegex } from './helpers/regex.js';

await dbConnect();

export const waitingForResponse = new Map();

export const bot = new TelegramBot(envConfig.BOT_TOKEN, { polling: true });

bot.setMyCommands(COMMANDLIST.map(({ name, desc }) => ({
  command: name,
  description: desc,
})));

bot.onText(commandRegex(COMMAND.ADD), withAuth(onAdd));
bot.onText(commandRegex(COMMAND.LIST), withAuth(onList));
bot.onText(commandRegex(COMMAND.DELETE), withAuth(onDelete));
bot.onText(commandRegex(COMMAND.SHOWTOTALS), withAuth(onShowTotals));
bot.onText(commandRegex(COMMAND.EDITSALARY), withAuth(onEditSalary));
bot.onText(commandRegex(COMMAND.SHOWSALARIES), withAuth(onShowSalaries));
bot.onText(commandRegex(COMMAND.HELP), withAuth(onHelp));

bot.on('message', withAuth(onMessage));
bot.on('callback_query', withAuth(onCallbackQuery));

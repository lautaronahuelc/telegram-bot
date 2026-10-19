import { Bot } from 'node-telegram-bot-api';
import 'dotenv/config';

import dbConnect from './config/db.js';
import { envConfig } from './config/env.js';
import { COMMAND, COMMANDLIST } from './constants/commands.js';
import { auth } from './helpers/auth.js';
import {
  onAdd,
  onCalculate,
  onCallbackQuery,
  onDelete,
  onDeleteAll,
  onEditSalary,
  onHelp,
  onList,
  onMessage,
  onShowUserDetails,
} from './handlers/index.js';
import { commandRegex } from './helpers/regex.js';

await dbConnect();

export const waitingForResponse = new Map();

// Los updates se procesan de a uno: una llamada colgada frena al resto, por eso
// se baja el timeout por defecto (5 min). getUpdates usa su propio timeout.
export const bot = new Bot(envConfig.BOT_TOKEN, { timeoutMs: 30_000 });

bot.catch((error, ctx) => {
  console.error(`❌ Error processing update ${ctx.update.update_id}:`, error);
});

const withMessage = (handler) => (ctx) => handler(ctx.message);

// El orden importa: auth primero; un hears que matchea no llama a next(), así que
// on('message') sólo recibe lo que no es un comando (las respuestas de dos pasos).
bot.use(auth);

bot.hears(commandRegex(COMMAND.ADD), withMessage(onAdd));
bot.hears(commandRegex(COMMAND.LIST), withMessage(onList));
bot.hears(commandRegex(COMMAND.DELETE), withMessage(onDelete));
bot.hears(commandRegex(COMMAND.DELETEALL), withMessage(onDeleteAll));
bot.hears(commandRegex(COMMAND.EDITSALARY), withMessage(onEditSalary));
bot.hears(commandRegex(COMMAND.SHOWUSERDETAILS), withMessage(onShowUserDetails));
bot.hears(commandRegex(COMMAND.CALCULATE), withMessage(onCalculate));
bot.hears(commandRegex(COMMAND.HELP), withMessage(onHelp));

bot.on('message', withMessage(onMessage));
bot.on('callback_query', (ctx) => onCallbackQuery(ctx.callbackQuery));

try {
  await bot.api.setMyCommands({
    commands: COMMANDLIST.map(({ name, desc }) => ({
      command: name,
      description: desc,
    })),
  });
} catch (error) {
  console.error('❌ Error setting bot commands:', error);
}

// Los errores de red, 5xx y 429 se reintentan solos. Uno fatal (409 por otra
// instancia con el mismo token, token inválido) corta el polling: se sale.
bot
  .startPolling(undefined, {
    onError: (error) => console.error('❌ Polling error, retrying:', error),
  })
  .catch((error) => {
    console.error('❌ Polling stopped:', error);
    process.exit(1);
  });

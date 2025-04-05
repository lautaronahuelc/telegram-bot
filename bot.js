require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, function onStart(msg, match) {
  console.log({msg, match});
  bot.sendMessage(msg.chat.id, 'Welcome to the bot!');
});
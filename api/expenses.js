import { bot } from '../bot.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import Expenses from '../models/expenses.js';

async function loadExpenses(chatId) {
  try {
    return await Expenses.find({}).sort({ date: -1 });
  } catch (err) {
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.FETCHING.ERROR);
  }
}

async function insertExpense(chatId, amount, desc, user) {
  if (!amount || !desc || !user) {
    await bot.sendMessage(chatId, BOT_MESSAGES.UPS.INCORRECT_FORMAT);
    return;
  }
  try {
    await new Expenses({
      amount,
      desc,
      user,
    }).save();
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.ADDING.SUCCESS);
  } catch (err) {
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.ADDING.ERROR);
  }
}

async function deleteExpense(chatId, id) {
  try {
    await Expenses.findByIdAndDelete(id);
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ONE.SUCCESS);
  } catch (err) {
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ONE.ERROR);
  }
}

async function deleteAllExpenses(chatId) {
  try {
    await Expenses.deleteMany({});
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ALL.SUCCESS);
  } catch (err) {
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ALL.ERROR);
  }
}

const MongoDB = {
  deleteExpense,
  deleteAllExpenses,
  insertExpense,
  loadExpenses,
};

export default MongoDB;
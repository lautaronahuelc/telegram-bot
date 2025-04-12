import { bot } from '../bot.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import Expense from '../models/expenses.js';

async function loadExpenses(chatId) {
  try {
    const expenses = await Expense.find({}).sort({ date: -1 });
    if (expenses.length === 0) {
      await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.FETCHING.NOT_FOUND);
      return [];
    }
    return expenses;
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
    await new Expense({
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
    await Expense.findByIdAndDelete(id);
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ONE.SUCCESS);
  } catch (err) {
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ONE.ERROR);
  }
}

async function deleteAllExpenses(chatId) {
  try {
    await Expense.deleteMany({});
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ALL.SUCCESS);
  } catch (err) {
    await bot.sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ALL.ERROR);
  }
}

const ExpenseCollection = {
  deleteExpense,
  deleteAllExpenses,
  insertExpense,
  loadExpenses,
};

export default ExpenseCollection;
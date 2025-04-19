import { BOT_MESSAGES } from '../constants/messages.js';
import Expense from '../models/expenses.js';

async function deleteExpense(id) {
  try {
    const data = await Expense.findByIdAndDelete(id);
    return {
      data,
      error: { message: null },
    };
  } catch (err) {
    console.error('❌ Error deleting selected expense:', err);
    return {
      data: null,
      error: { message: BOT_MESSAGES.EXPENSES.DELETING_ONE.ERROR },
    };
  }
}

async function deleteAllExpenses() {
  try {
    await Expense.deleteMany({});
    return {
      success: true,
      successMessage: BOT_MESSAGES.EXPENSES.DELETING_ALL.SUCCESS,
      error: false,
      errorMessage: null,
    };
  } catch (err) {
    return {
      success: false,
      successMessage: null,
      error: true,
      errorMessage: BOT_MESSAGES.EXPENSES.DELETING_ALL.ERROR,
    };
  }
}

async function loadExpenses(userId) {
  try {
    const data = await Expense.find(userId ? { userId } : {}).sort({ date: -1 });
    if (!data.length) {
      return {
        data: null,
        error: { message: BOT_MESSAGES.EXPENSES.FETCHING.NOT_FOUND },
      };
    }
    return {
      data,
      error: { message: null },
    };
  } catch (err) {
    console.error('❌ Error loading expenses:', err);
    return {
      data: null,
      error: { message: BOT_MESSAGES.EXPENSES.FETCHING.ERROR },
    };
  }
}

async function newExpense({
  amount,
  desc,
  userId,
  username,
}) {
  if (!amount || !desc) {
    return {
      data: null,
      error: { message: BOT_MESSAGES.UPS.INCORRECT_FORMAT },
    };
  }
  try {
    const data = await new Expense({
      amount,
      desc,
      userId,
      username,
    }).save();
    return {
      data,
      error: { message: null },
    };
  } catch (err) {
    console.error('❌ Error adding new expense:', err);
    return {
      data: null,
      error: { message: BOT_MESSAGES.EXPENSES.ADDING.ERROR },
    };
  }
}

const ExpenseCollection = {
  deleteExpense,
  deleteAllExpenses,
  loadExpenses,
  newExpense,
};

export default ExpenseCollection;
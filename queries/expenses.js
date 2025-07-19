import Expense from '../models/expenses.js';

async function remove(id) {
  try {
    const data = await Expense.findByIdAndDelete(id);
    return {
      data,
      error: false,
    };
  } catch (err) {
    console.error('❌ Error deleting selected expense:', err);
    return {
      data: null,
      error: true,
    };
  }
}

async function removeAll(userId) {
  try {
    await Expense.deleteMany(userId ? { userId } : {});
    return {
      data: {},
      error: false,
    };
  } catch (err) {
    console.error('❌ Error deleting all expenses:', err);
    return {
      data: null,
      error: true,
    };
  }
}

async function getAll(userId) {
  try {
    const data = await Expense.find(userId ? { userId } : {}).sort({ date: -1 });
    return {
      data,
      error: false,
    };
  } catch (err) {
    console.error('❌ Error loading expenses:', err);
    return {
      data: null,
      error: true,
    };
  }
}

async function create({
  amount,
  desc,
  userId,
  username,
}) {
  try {
    await new Expense({
      amount,
      desc,
      userId,
      username,
    }).save();
    return { error: false };
  } catch (err) {
    console.error('❌ Error adding new expense:', err);
    return { error: true };
  }
}

const ExpenseCollection = {
  create,
  remove,
  removeAll,
  getAll,
};

export default ExpenseCollection;
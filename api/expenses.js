import Expenses from '../models/expenses.js';

async function loadExpenses() {
  return await Expenses.find({}).sort({ date: -1 });
}

async function insertExpense(user, amount, desc) {
  const newExpense = new Expenses({
    user,
    amount,
    desc
  });

  await newExpense.save();
}

async function deleteAllExpenses() {
  await Expenses.deleteMany({});
}

const MongoDB = {
  deleteAllExpenses,
  insertExpense,
  loadExpenses,
};

export default MongoDB;
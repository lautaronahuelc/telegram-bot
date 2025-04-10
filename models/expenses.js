import { Schema, model } from 'mongoose';

const expenseSchema = new Schema({
  user: { type: String, required: true },
  amount: { type: Number, required: true },
  desc: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Expense = model('Expense', expenseSchema);

export default Expense;
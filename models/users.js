import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  _id: { type: String, required: true },
  salary: { type: Number, required: true },
  percent: { type: Number, required: true },
  expenses: { type: Number, required: true },
  receives: { type: Number, required: true },
});

const User = model('User', userSchema);

export default User;
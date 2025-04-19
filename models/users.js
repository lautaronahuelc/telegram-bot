import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  salary: { type: Number, required: true },
  contributionPercentage: { type: Number, required: true },
  totalExpenses: { type: Number, required: true },
  amountDueToUser: { type: Number, required: true },
});

const User = model('User', userSchema);

export default User;
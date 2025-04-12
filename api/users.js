import { bot } from '../bot.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import User from '../models/users.js';

async function editSalary(chatId, userId, salary) {
  try {
    await User.findByIdAndUpdate(userId, { salary });
    await bot.sendMessage(chatId, BOT_MESSAGES.USER.SALARY.EDITING.SUCCESS);
  } catch (err) {
    await bot.sendMessage(chatId, BOT_MESSAGES.USER.SALARY.EDITING.ERROR);
  }
}

async function getSalaries(chatId) {
  try {
    return await User.find({}, { salary: 1, username: 1, _id: 0 });
  } catch (err) {
    await bot.sendMessage(chatId, BOT_MESSAGES.USER.SALARY.FETCHING.ERROR);
  }
}

async function updateUsername(userId, username) {
  try {
    await User.findByIdAndUpdate(userId, { username });
  } catch (err) {
    console.warn(`❌ Error updating username for user ${username}:`, err);
  }
}

async function updateUsersTotalExpenses(totalExpensesPerUser) {
  try {
    for (const userId in totalExpensesPerUser) {
      await User.updateOne(
        { userId },
        { $set: { totalExpenses: totalExpensesPerUser[userId].totalExpenses } }
      );
    }
  } catch (err) {
    console.warn('❌ Error updating total expenses:', err);
  }
}

const UserCollection = {
  editSalary,
  getSalaries,
  updateUsername,
  updateUsersTotalExpenses,
};

export default UserCollection;
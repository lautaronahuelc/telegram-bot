import { BOT_MESSAGES } from '../constants/messages.js';
import User from '../models/users.js';

async function editSalary(chatId, userId, salary) {
  try {
    await User.findByIdAndUpdate(userId, { salary });
    await sendMessage(chatId, BOT_MESSAGES.USER.SALARY.EDITING.SUCCESS);
  } catch (err) {
    await sendMessage(chatId, BOT_MESSAGES.USER.SALARY.EDITING.ERROR);
  }
}

async function findAllTotalExpenses() {
  try {
    const data = await User.find({}, { totalExpenses: 1, username: 1, _id: 0 });
    return {
      data,
      error: {
        message: null,
      },
    }
  } catch (err) {
    console.error('❌ Error fetching total expenses:', err);
    return {
      data: [],
      error: {
        message: BOT_MESSAGES.USER.TOTAL_EXPENSES.FETCHING.ERROR,
      },
    };
  }
}

async function getSalaries(chatId) {
  try {
    return await User.find({}, { salary: 1, username: 1, _id: 0 });
  } catch (err) {
    await sendMessage(chatId, BOT_MESSAGES.USER.SALARY.FETCHING.ERROR);
  }
}

async function incrementUserTotalExpenses(userId, amount) {
  try {
    const data = await User.updateOne(
      { userId },
      { $inc: { totalExpenses: amount } }
    );
    return {
      data,
      error: { message: null },
    };
  } catch (err) {
    console.error('❌ Error incrementing totalExpenses:', err);
    return {
      data: {},
      error: { message: BOT_MESSAGES.USER.TOTAL_EXPENSES.INCREMENTING.ERROR },
    };
  }
}

async function resetUsersTotalExpenses() {
  try {
    await User.updateMany({}, { totalExpenses: 0 });
    return {
      error: false,
      errorMessage: null,
      success: true,
      successMessage: BOT_MESSAGES.USER.TOTAL_EXPENSES.RESET.SUCCESS,
    };
  } catch (err) {
    console.error('❌ Error resetting totalExpenses:', err);
    return {
      error: true,
      errorMessage: BOT_MESSAGES.USER.TOTAL_EXPENSES.RESET.ERROR,
      success: false,
      successMessage: null,
    };
  }
}

async function updateUsername(userId, username) {
  try {
    await User.findByIdAndUpdate(userId, { username });
  } catch (err) {
    console.error(`❌ Error updating username for user ${username}:`, err);
  }
}

const UserCollection = {
  editSalary,
  findAllTotalExpenses,
  getSalaries,
  incrementUserTotalExpenses,
  resetUsersTotalExpenses,
  updateUsername,
};

export default UserCollection;
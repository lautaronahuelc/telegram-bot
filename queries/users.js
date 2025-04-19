import { BOT_MESSAGES } from '../constants/messages.js';
import User from '../models/users.js';

async function editSalary({ userId, salary }) {
  try {
    const data = await User.findOneAndUpdate({ userId }, { salary }, { new: true });
    if (!data) {
      return {
        data: null,
        error: { message: BOT_MESSAGES.USER.SALARY.EDITING.USER_NOT_FOUND },
      };
    }
    return {
      data,
      error: { message: null },
    };
  } catch (err) {
    console.error('❌ Error editing salary:', err);
    return {
      data: null,
      error: { message: BOT_MESSAGES.USER.SALARY.EDITING.ERROR },
    };
  }
}

async function findAllTotalExpenses() {
  try {
    const data = await User.find({}, { totalExpenses: 1, username: 1, _id: 0 });
    return {
      data,
      error: { message: null },
    }
  } catch (err) {
    console.error('❌ Error fetching total expenses:', err);
    return {
      data: null,
      error: { message: BOT_MESSAGES.USER.TOTAL_EXPENSES.FETCHING.ERROR },
    };
  }
}

async function getSalaries() {
  try {
    const data = await User.find({}, {
      salary: 1,
      username: 1,
      userId: 1,
      _id: 0,
    });
    if (!data.length) {
      return {
        data: null,
        error: { message: BOT_MESSAGES.USER.SALARY.FETCHING.USER_NOT_FOUND },
      }
    }
    return {
      data,
      error: { message: null },
    }
  } catch (err) {
    console.error('❌ Error fetching salaries:', err);
    return {
      data: null,
      error: { message: BOT_MESSAGES.USER.SALARY.FETCHING.ERROR },
    }
  }
}

async function incrementTotalExpenses({ userId, amount }) {
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
      data: null,
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

async function updateContributionPercentage({ userId, newPercentage }) {
  try {
    const data = await User.findOneAndUpdate({ userId }, { contributionPercentage: newPercentage }, { new: true })
    if (!data) {
      return {
        data: null,
        error: { message: BOT_MESSAGES.USER.CONTRIBUTION_PERCENTAGE.EDITING.USER_NOT_FOUND },
      };
    }
    return {
      data,
      error: { message: null },
    }
  } catch (err) {
    console.error('❌ Error editing contributionPercentage:', err);
    return {
      data: null,
      error: { message: BOT_MESSAGES.USER.CONTRIBUTION_PERCENTAGE.EDITING.ERROR },
    };
  }
}

const UserCollection = {
  editSalary,
  findAllTotalExpenses,
  getSalaries,
  incrementTotalExpenses,
  resetUsersTotalExpenses,
  updateContributionPercentage,
};

export default UserCollection;
import User from '../models/users.js';

async function editSalary(userId, salary) {
  try {
    const data = await User.findOneAndUpdate({ userId }, { salary }, { new: true });
    return {
      data,
      error: false,
    };
  } catch (err) {
    console.error('❌ Error editing salary:', err);
    return {
      data: null,
      error: true,
    };
  }
}

async function findAllTotalExpenses() {
  try {
    const data = await User.find({}, { totalExpenses: 1, username: 1, _id: 0 });
    return {
      data,
      error: false,
    }
  } catch (err) {
    console.error('❌ Error fetching total expenses:', err);
    return {
      data: null,
      error: true,
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
    return {
      data,
      error: false,
    }
  } catch (err) {
    console.error('❌ Error fetching salaries:', err);
    return {
      data: null,
      error: true,
    }
  }
}

async function incrementTotalExpenses(userId, amount) {
  try {
    const data = await User.updateOne(
      { userId },
      { $inc: { totalExpenses: amount } }
    );

    if (data.modifiedCount === 0) return { error: true };
    
    return { error: false };
  } catch (err) {
    console.error('❌ Error incrementing totalExpenses:', err);
    return { error: true };
  }
}

/* async function resetUsersTotalExpenses() {
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
} */

async function updateContributionPercentage(userId, newPercentage) {
  try {
    const data = await User.findOneAndUpdate({ userId }, { contributionPercentage: newPercentage }, { new: true })
    return {
      data,
      error: false,
    }
  } catch (err) {
    console.error('❌ Error editing contributionPercentage:', err);
    return {
      data: null,
      error: true,
    };
  }
}

const UserCollection = {
  editSalary,
  findAllTotalExpenses,
  getSalaries,
  incrementTotalExpenses,
  /* resetUsersTotalExpenses, */
  updateContributionPercentage,
};

export default UserCollection;
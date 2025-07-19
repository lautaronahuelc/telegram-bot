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

async function getAll() {
  try {
    const data = await User.find({}, { _id: 0, userId: 0 });
    return {
      data,
      error: false,
    }
  } catch (err) {
    console.error('❌ Error fetching user information:', err);
    return {
      data: null,
      error: true,
    }
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

async function resetUsersTotalExpenses(userId) {
  try {
    await User.updateOne({ userId }, { $set: { totalExpenses: 0 } });
    return {
      data: {},
      error: false,
    };
  } catch (err) {
    console.error('❌ Error resetting totalExpenses:', err);
    return {
      data: null,
      error: true,
    };
  }
}

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
  getAll,
  getSalaries,
  incrementTotalExpenses,
  resetUsersTotalExpenses,
  updateContributionPercentage,
};

export default UserCollection;
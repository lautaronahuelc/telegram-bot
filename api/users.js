import { bot } from '../bot.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import User from '../models/users.js';

async function editSalary(chatId, userId, salary) {
  try {
    await User.findByIdAndUpdate(userId, { salary });
    await bot.sendMessage(chatId, BOT_MESSAGES.USER.SALARY.SUCCESS);
  } catch (err) {
    await bot.sendMessage(chatId, BOT_MESSAGES.USER.SALARY.ERROR);
  }
}

const UserCollection = {
  editSalary,
};

export default UserCollection;
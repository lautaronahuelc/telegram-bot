import { waitingForResponse } from '../bot.js';
import { COMMAND } from '../constants/commands.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { hasError } from '../helpers/error.js';
import { sendMessage } from '../helpers/sendMessage.js';
import { useIncrementTotals } from '../hooks/useIncrementTotals.js';
import { useNewExpense } from '../hooks/useNewExpense.js';

export async function onAdd(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  waitingForResponse.set(userId, COMMAND.ADD);

  await sendMessage(chatId, BOT_MESSAGES.EXPENSES.ADDING.INSERT_NEW);
}

export async function addExpense(msg) {
  const chatId = msg.chat.id;

  const userId = msg.from.id;
  const username = msg.from.username;
  const { amount , desc } = getAmountAndDesc(msg.text);

  const [newExpense, incrementTotals] = await Promise.all([
    useNewExpense({ amount, desc, userId, username }),
    useIncrementTotals({ userId, amount }),
  ]);

  const error = hasError(newExpense, incrementTotals);
  
  if (error) {
    await sendMessage(chatId, error.message);
    return;
  }

  await sendMessage(chatId, newExpense.message);
}

function getAmountAndDesc(text) {
  const match = text.match(/^(\d+)\s+(.+)/);

  if (!match) {
    return { amount: null, desc: null };
  }
  
  const amount = parseInt(match[1]);
  const desc = match[2];
  
  return { amount, desc };
}

import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';
import { BOT_MESSAGES } from '../constants/messages.js';
import { sendMessage } from '../helpers/sendMessage.js';
import { hasError } from '../helpers/error.js';
import { formatExpenseText } from '../helpers/expenses.js';
import { useDeleteExpense } from '../hooks/useDeleteExpense.js';
import { useIncrementTotals } from '../hooks/useIncrementTotals.js';

export async function onDelete(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const { data, error } = await ExpenseCollection.loadExpenses(userId);
  
  if (hasError(error)) {
    await sendMessage(chatId, error.message);
    return;
  }

  const inlineKeyboard = buildInlineKeyboard(data);
  await sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ONE.SELECT, {
    reply_markup: { inline_keyboard: inlineKeyboard },
  });
}

function buildInlineKeyboard(data) {
  const sortedExpenses = data.sort((a, b) => a.date - b.date);
  const expensesKeyboard = sortedExpenses.map(({ amount, desc, id }) => {
    return [
      {
        text: formatExpenseText(amount, desc).replaceAll('_', ''),
        callback_data: `delete_${id}`,
      },
    ];
  });
  expensesKeyboard.push([
    {
      text: 'Cancelar',
      callback_data: 'delete_cancel',
    },
  ]);
  return expensesKeyboard;
}

export async function deleteExpense(callbackQuery) {
  switch (callbackQuery.data) {
    case 'delete_cancel':
      await handleDeleteCancel(callbackQuery);
      break;
    default:
      await handleDeleteConfirm(callbackQuery); 
  }
}

async function handleDeleteCancel(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  await sendMessage(chatId, BOT_MESSAGES.EXPENSES.DELETING_ONE.CANCEL);
}

async function handleDeleteConfirm(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const id = callbackQuery.data.replace('delete_', '');

  const deleteExpense = await useDeleteExpense(id);
  const incrementTotals = await useIncrementTotals({ userId, amount: -deleteExpense.data?.amount || 0 });

  const error = hasError(deleteExpense, incrementTotals);

  if (error) {
    await sendMessage(chatId, error.message);
    return;
  }

  await sendMessage(chatId, deleteExpense.message);
}


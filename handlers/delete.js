import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';
import { sendMessage } from '../helpers/sendMessage.js';
import { formatExpenseText } from '../helpers/expenses.js';
import { reactToMessage } from '../helpers/reactToMessage.js';
import { bot } from '../bot.js';

let messageToDeleteId;

export async function onDelete(msg) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const userId = msg.from.id;

  messageToDeleteId = messageId;

  const { data, error } = await ExpenseCollection.getAll(userId);

  if (!data.length) {
    await reactToMessage(chatId, messageId, '🤔');
    return;
  }

  if (error) {
    await sendMessage(chatId, '❌ Ocurrió un error al obtener los gastos.');
    return;
  }

  const inlineKeyboard = buildInlineKeyboard(data);
  await sendMessage(chatId, 'Seleccione el gasto a eliminar.', {
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
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;

  switch (callbackQuery.data) {
    case 'delete_cancel':
      // Cancelar: sólo se quita el teclado.
      break;
    default:
      await handleDeleteConfirm(callbackQuery); 
  }

  await bot.editMessageReplyMarkup(
    { inline_keyboard: [] },
    { chat_id: chatId, message_id: messageId }
  );

  bot.deleteMessage(chatId, messageId);
  await reactToMessage(chatId, messageToDeleteId, '👍');

  setTimeout(() => {
    bot.deleteMessage(chatId, messageToDeleteId);
  }, 3000);
}

async function handleDeleteConfirm(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const id = callbackQuery.data.replace('delete_', '');

  const { data: rData, error: rError } = await ExpenseCollection.remove(id);

  if (rError) {
    await sendMessage(chatId, '❌ Ocurrió un error al eliminar el gasto.');
    return;
  }

  const { amount, desc } = rData;

  const { error: iteError } = await UserCollection.incrementTotalExpenses(userId, -amount);

  if (iteError) {
    await sendMessage(
      chatId,
      `❌ Ocurrió un error al actualizar los gastos totales. Agregar el gasto eliminado para evitar errores de cálculo.\n\n*Gasto elminado*\n${formatExpenseText(amount, desc)}`,
      { parse_mode: 'Markdown' }
    );
    return;
  }

  // await reactToMessage(chatId, messageId, '👍');
}


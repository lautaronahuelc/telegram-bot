import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';
import { sendMessage } from '../helpers/sendMessage.js';
import { reactToMessage } from '../helpers/reactToMessage.js';
import { bot } from '../bot.js';

let messageToDeleteId;

export async function onDeleteAll(msg) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  messageToDeleteId = messageId;

  await sendMessage(chatId, '¿Seguro que desea eliminar todos los gastos?', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Sí, estoy seguro',
            callback_data: `deleteall_confirm`,
          },
          {
            text: 'No, cancelar',
            callback_data: 'deleteall_cancel',
          },
        ],
      ],
    },
  });
}

export async function deleteAllExpenses(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;

  switch (callbackQuery.data) {
    case 'deleteall_cancel':
      await handleDeleteCancel(callbackQuery);
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

async function handleDeleteCancel(callbackQuery) {
  return;
}

async function handleDeleteConfirm(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;

  const { data: rData, error: rError } = await ExpenseCollection.removeAll(userId);

  if (rError) {
    await sendMessage(chatId, '❌ Ocurrió un error al eliminar los gastos.');
    return;
  }

  const { error: iteError } = await UserCollection.resetUsersTotalExpenses(userId, 0);

  if (iteError) {
    await sendMessage(
      chatId,
      `❌ Ocurrió un error al actualizar los gastos totales`,
      { parse_mode: 'Markdown' }
    );
    return;
  }

  // await reactToMessage(chatId, messageId, '👍');
}


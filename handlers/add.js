import { bot, waitingForResponse } from '../bot.js';
import { COMMAND } from '../constants/commands.js';
import { reactToMessage } from '../helpers/reactToMessage.js';
import { sendMessage } from '../helpers/sendMessage.js';
import ExpenseCollection from '../queries/expenses.js';
import UserCollection from '../queries/users.js';

let messageToDeleteId;

export async function onAdd(msg) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const userId = msg.from.id;

  messageToDeleteId = messageId;

  waitingForResponse.set(userId, COMMAND.ADD);

  await reactToMessage(chatId, messageId, '👀');
}

export async function addExpense(msg) {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const userId = msg.from.id;
  const username = msg.from.username;

  const { amount , desc } = getAmountAndDesc(msg.text); 

  if (!amount || !desc) {
    await reactToMessage(chatId, messageId, '🤬');

    setTimeout(() => {
      bot.deleteMessage(chatId, messageId);
      bot.deleteMessage(chatId, messageToDeleteId);
    }, 3000);
    
    return;
  }

  const { error: neError } = await ExpenseCollection.create({
    amount,
    desc,
    userId,
    username
  });

  if (neError) {
    await sendMessage(chatId, '❌ Ocurrió un error al agregar el gasto.');
    return;
  }

  const { error: iteError } = await UserCollection.incrementTotalExpenses(userId, amount);

  if (iteError) {
    await sendMessage(chatId, '❌ Ocurrió un error al actualizar los gastos totales. Eliminar el último gasto ingresado para evitar errores de cálculo.');
    return;
  }

  await reactToMessage(chatId, messageId, '👍');

  setTimeout(() => {
    bot.deleteMessage(chatId, messageId);
    bot.deleteMessage(chatId, messageToDeleteId);
  }, 3000);
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

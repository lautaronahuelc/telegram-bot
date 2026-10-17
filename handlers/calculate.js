import { formatCurrency } from '../helpers/currency.js';
import { calculateSettlement } from '../lib/settlement.js';
import { sendMessage } from '../helpers/sendMessage.js';
import UserCollection from '../queries/users.js';

export async function onCalculate(msg) {
  const chatId = msg.chat.id;

  const { data, error } = await UserCollection.getAll();

  if (error || !data.length) {
    await sendMessage(chatId, '❌ Error al obtener información de los usuarios.');
    return;
  }

  const message = buildMessage(calculateSettlement(data));

  await sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

function buildMessage({ highest, lowest, shareForHighest, shareForLowest, receiver, amount }) {
  const calculationDetailsForHighest = `_${lowest.contributionPercentage} x ${formatCurrency(highest.totalExpenses)} = ${formatCurrency(shareForHighest)}_`;
  const calculationDetailsForLowest = `_${highest.contributionPercentage} x ${formatCurrency(lowest.totalExpenses)} = ${formatCurrency(shareForLowest)}_`;

  let message = '*Cálculo de diferencias y cierre*\n\n';

  message += '*Gastos totales*\n';
  message += `*${highest.username}* gastó _${formatCurrency(highest.totalExpenses)}_\n`;
  message += `*${lowest.username}* gastó _${formatCurrency(lowest.totalExpenses)}_\n\n`;
  
  message += '*Balance*\n';
  message += 'Por sus gastos, cada usuario recibiría:\n';
  message += `*${highest.username}* ⬅ ${calculationDetailsForHighest}\n`;
  message += `*${lowest.username}* ⬅ ${calculationDetailsForLowest}\n\n`;
  
  message += '*Diferencia*\n';
  message += `*${receiver.username}* recibe _${formatCurrency(amount)}_`;

  return message;
}

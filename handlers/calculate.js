import { formatCurrency } from '../helpers/currency.js';
import { sendMessage } from '../helpers/sendMessage.js';
import UserCollection from '../queries/users.js';

export async function onCalculate(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const { data, error } = await UserCollection.getAll();

  if (error || !data.length) {
    await sendMessage(chatId, '❌ Error al obtener información de los usuarios.');
    return;
  }

  const highest = calculateHighest(data);
  const lowest = calculateLowest(data);

  const message = buildMessage(highest, lowest);

  await sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

function calculateHighest(data) {
  return data.reduce((highest, current) => {
    return current.totalExpenses > (highest.totalExpenses || 0) ? current : highest;
  }, {});
}

function calculateLowest(data) {
  return data.reduce((lowest, current) => {
    return (lowest.totalExpenses === undefined || current.totalExpenses < lowest.totalExpenses) 
      ? current 
      : lowest;
  }, {});
}

function calculateExpenseShare(contributionPercentage, totalExpenses) {
  return contributionPercentage * totalExpenses;
}

function buildMessage(highest, lowest) {
  const shareForHighest = calculateExpenseShare(lowest.contributionPercentage, highest.totalExpenses);
  const shareForLowest = calculateExpenseShare(highest.contributionPercentage, lowest.totalExpenses);

  const max = Math.max(shareForHighest, shareForLowest);
  const min = Math.min(shareForHighest, shareForLowest);

  let personaquerecibe = max === shareForHighest ? highest.username : lowest.username;

  const totalarecibir = max - min;

  const calculationDetailsForHighest = `${lowest.contributionPercentage} x ${highest.totalExpenses}`;
  const calculationDetailsForLowest = `${highest.contributionPercentage} x ${lowest.totalExpenses}`;

  let message = '*Cálculo de diferencias y cierre*\n\n';

  message += '*Gastos totales*\n';
  message += `@${highest.username} gastó *${formatCurrency(highest.totalExpenses)}*.\n`;
  message += `@${lowest.username} gastó *${formatCurrency(lowest.totalExpenses)}*.\n\n`;
  
  message += '*Balance*\n';
  message += 'Por sus gastos, cada usuario recibiría:\n';
  message += `@${highest.username} *${formatCurrency(shareForHighest)}*. (${calculationDetailsForHighest})\n`;
  message += `@${lowest.username} *${formatCurrency(shareForLowest)}*. (${calculationDetailsForLowest})\n\n`;
  
  message += '*Diferencia*\n';
  message += `@${personaquerecibe} recibe *${formatCurrency(totalarecibir)}*`;

  return message;
}

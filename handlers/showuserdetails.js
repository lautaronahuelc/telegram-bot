import { formatCurrency } from '../helpers/currency.js';
import { sendMessage } from '../helpers/sendMessage.js';
import UserCollection from '../queries/users.js';

export async function onShowUserDetails(msg) {
  const chatId = msg.chat.id;

  const { data, error } = await UserCollection.getAll();

  if (error || !data.length) {
    await sendMessage(chatId, '❌ Error al obtener información de los usuarios.');
    return;
  }

  const message = buildMessage(data);
  await sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

function buildMessage(data) {
  let message = '*Detalles de los usuarios*\n\n';

  for (const user of data) {
    for (const key of Object.keys(user._doc)) {
      message += `${formatKey[key]}: ${formatValue[key](user[key])}\n`;
    }
    message += '\n';
  }

  return message;
}

const formatKey = {
  'username': 'Usuario',
  'salary': 'Ingresos',
  'totalExpenses': 'Gasto total',
  'contributionPercentage': 'Contribución',
  'amountDueToUser': 'Le deben',
};

const formatValue = {
  'username': (value) => `@${value}`,
  'salary': (value) => formatCurrency(value),
  'totalExpenses': (value) => formatCurrency(value),
  'contributionPercentage': (value) => formatPercentage(value),
  'amountDueToUser': (value) => formatCurrency(value),
};

function formatPercentage(value) {
  return value.toLocaleString("es-AR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
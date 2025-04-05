import { bot } from "./bot.js";
import { loadExpenses, saveExpenses } from "./helpers.js";

export function onAdd(msg, match) {
  const chatId = msg.chat.id;
  const amount = parseInt(match[1]);
  const description = match[2]?.trim();
  const user = msg.from.username;

  const expenses = loadExpenses();
  expenses.push({
    user,
    amount,
    description,
    date: new Date(),
  });
  saveExpenses(expenses);

  bot.sendMessage(chatId, `💸 @${user} agregó un gasto de $${amount} por "${description}"`);
}

export function onTotal(msg) {
  const chatId = msg.chat.id;
  const expenses = loadExpenses();

  if (expenses.length === 0) {
    bot.sendMessage(chatId, '📭 Ups! Todavía no hay gastos registrados.');
    return;
  }

  const totals = {};

  expenses.forEach(({ user, amount }) => {
    if (!totals[user]) totals[user] = 0;
    totals[user] += amount;
  });

  let response = '📈 Gastos totales:\n\n';
  for (const [user, amount] of Object.entries(totals)) {
    response += `@${user}: $${amount}\n`;
  }

  bot.sendMessage(chatId, response);
}

export function onReset(msg) {
  const chatId = msg.chat.id;
  const user = msg.from.username;

  saveExpenses([]);

  bot.sendMessage(chatId, `🧹 @${user} limpió todos los gastos. ¡Arrancamos de cero!`);
}

export function onList(msg) {
  const chatId = msg.chat.id;
  const expenses = loadExpenses();

  if (expenses.length === 0) {
    bot.sendMessage(chatId, '👀 Parece que todavía no se ingresaron gastos...');
    return;
  }

  const grouped = {};

  expenses.forEach((item) => {
    if (!grouped[item.user]) {
      grouped[item.user] = [];
    }
    const formattedDate = new Date(item.date).toLocaleDateString('es-AR');
    grouped[item.user].push(`- 💵 $${item.amount} 📝 ${item.description} 🗓️ ${formattedDate}`);
  });

  let response = '📋 Gastos registrados:\n\n';
  for (const user in grouped) {
    response += `@${user}:\n${grouped[user].join('\n')}\n\n`;
  }

  bot.sendMessage(chatId, response);
}

export function onHelp(msg) {
  const chatId = msg.chat.id;

  const response = `
Usá estos comandos para llevar el control:

\/add\: _Registra un gasto._
Ejemplo: "\/add 1000 verdulería"

\/list\: _Muestra los gastos ingresados por cada persona._

\/total\: _Muestra cuánto gastó cada uno en total._

\/reset\: _Limpia el registro completo._

\/help\: _Ver esta ayuda_
  `;
  
  bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
}
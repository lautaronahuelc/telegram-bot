import MongoDB from "./api/expenses.js";
import { bot } from "./bot.js";

const waitingForExpense = new Map();

export async function onAdd(msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  waitingForExpense.set(userId, true);

  bot.sendMessage(chatId, 'Ingresa monto y descripción del gasto.\nEjemplo: "100 supermercado"');
}

export async function onMessage(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const user = msg.from.username;

 if (!waitingForExpense.get(userId)) return;

 const regex = /^(\d+)\s+(.+)/;
 const match = msg.text.match(regex);

 if (!match) {
   bot.sendMessage(chatId, 'Formato inválido. No olvides ingresar monto y descripción.');
   return;
 }

 const amount = parseInt(match[1]);
 const desc = match[2];

 try {
  await MongoDB.insertExpense(user, amount, desc);
  bot.sendMessage(chatId, `@${user} agregó $${amount} por "${desc}"`);
  } catch (err) {
    console.error('❌ An error occurred while adding expense:', err);
    bot.sendMessage(chatId, 'Ocurrió un error al agregar el gasto. Por favor, intente nuevamente.');
  }

 waitingForExpense.delete(userId);
}

export async function onList(msg) {
  const chatId = msg.chat.id;

  try {
    const expenses = await MongoDB.loadExpenses();

    if (expenses.length === 0) {
      bot.sendMessage(chatId, '¡Todavía no hay ningún gasto registrado! Usá /add para empezar.');
      return;
    }

    const grouped = {};

    expenses.forEach(({ user, amount, desc, date }) => {
      if (!grouped[user]) grouped[user] = [];

      const formattedDate = new Date(date).toLocaleDateString('es-AR');
      grouped[user].push(`💵 $${amount} 📝 ${desc} 🗓️ ${formattedDate}`);
    });
  
    let response = 'Gastos registrados:\n\n';
    for (const user in grouped) {
      response += `@${user}:\n${grouped[user].join('\n')}\n\n`;
    }
  
    bot.sendMessage(chatId, response);
  } catch (err) {
    console.error('❌ An error occurred while fetching expenses:', err);
    bot.sendMessage(chatId, 'Ocurrió un error al obtener los gastos. Por favor, intente nuevamente.');
  }
}

export async function onDeleteAll(msg) {
  const chatId = msg.chat.id;
  const user = msg.from.username;

  try {
    await MongoDB.deleteAllExpenses();
    bot.sendMessage(chatId, `@${user} limpió todos los gastos. ¡Arrancamos de cero!`);
  } catch (err) {
    console.error('❌ An error occurred while resetting expenses:', err);
    bot.sendMessage(chatId, 'Ocurrió un error al limpiar los gastos. Por favor, intente nuevamente.');
  }
}

export async function onSum(msg) {
  const chatId = msg.chat.id;
  
  try {
    const expenses = await MongoDB.loadExpenses();

    if (expenses.length === 0) {
      bot.sendMessage(chatId, '¡Todavía no hay ningún gasto registrado! Usá /add para empezar.');
      return;
    }

    const totals = {};

    expenses.forEach(({ user, amount }) => {
      if (!totals[user]) totals[user] = 0;
      totals[user] += amount;
    });

    let response = 'Gastos totales:\n\n';
    for (const [user, amount] of Object.entries(totals)) {
      response += `@${user}: $${amount}\n`;
    }

    bot.sendMessage(chatId, response);
  } catch (err) {
    console.error('❌ An error occurred while calculating totals:', err);
    bot.sendMessage(chatId, 'Ocurrió un error al calcular los totales. Por favor, intente nuevamente.');
  }
}

export function onHelp(msg) {
  const chatId = msg.chat.id;

  const response = `
Usá estos comandos para llevar el control:

\/add\: _Registra un gasto._
Ejemplo: "\/add 1000 verdulería"

\/list\: _Muestra los gastos ingresados por usuario._

\/sum\: _Muestra el gasto total por usuario._

\/deleteall\: _Limpia el registro completo._

\/help\: _Ver esta ayuda_
  `;
  
  bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
}
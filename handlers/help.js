import { bot } from '../bot.js';

export async function onHelp(msg) {
  const chatId = msg.chat.id;
  const response = `
➡ \/add\: _Registra un gasto._

➡ \/list\: _Muestra los gastos ingresados por usuario._

➡ \/sum\: _Muestra el gasto total por usuario._

➡ \/delete\: _Elimina un gasto._

➡ \/deleteall\: _Elimina todos los gastos._

➡ \/help\: _Ver esta ayuda_
  `;
  
  await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
}
import { bot } from '../bot.js';
import Expenses from '../models/expenses.js';

async function loadExpenses(chatId) {
  try {
    return await Expenses.find({}).sort({ date: -1 });
  } catch (err) {
    console.error('❌ An error occurred while fetching expenses:', err);
    await bot.sendMessage(chatId, '❌ Ocurrió un error al obtener los gastos. Por favor, intente nuevamente.');
  }
}

async function insertExpense(chatId, amount, desc, user) {
  if (!amount || !desc || !user) {
    await bot.sendMessage(chatId, '¡Ups! El formato es incorrecto.');
    await bot.sendMessage(chatId, 'Ingrese /add para intentarlo de nuevo.');
    return;
  }
  try {
    await bot.sendMessage(chatId, 'Agregando gasto... 🕓');
    await new Expenses({
      amount,
      desc,
      user,
    }).save();
    await bot.sendMessage(chatId, '✅ Nuevo gasto agregado con éxito.');
    await bot.sendMessage(chatId, 'Ingrese /add para agregar otro gasto.');
  } catch (err) {
    console.error('❌ An error occurred while adding expense:', err);
    await bot.sendMessage(chatId, '❌ Ocurrió un error al agregar el gasto. Por favor, intente nuevamente más tarde.');
  }
}

async function deleteExpense(chatId, id) {
  try {
    await bot.sendMessage(chatId, 'Eliminando gasto... 🕓');
    await Expenses.findByIdAndDelete(id);
    await bot.sendMessage(chatId, `✅ Gasto eliminado con éxito.`);
  } catch (err) {
    console.error('❌ An error occurred while deleting expense:', err);
    await bot.sendMessage(chatId, '❌ Ocurrió un error al eliminar el gasto.');
  }
}

async function deleteAllExpenses(chatId) {
  try {
    await bot.sendMessage(chatId, 'Eliminando todos los gastos... 🕓');
    await Expenses.deleteMany({});
    await bot.sendMessage(chatId, '✅ Todos los gastos han sido eliminados con éxito.');
  } catch (err) {
    console.error('❌ An error occurred while deleting all expenses:', err);
    await bot.sendMessage(chatId, '❌ Ocurrió un error al eliminar el gasto.');
  }
}

const MongoDB = {
  deleteExpense,
  deleteAllExpenses,
  insertExpense,
  loadExpenses,
};

export default MongoDB;
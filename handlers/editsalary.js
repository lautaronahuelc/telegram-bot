import { waitingForResponse } from '../bot.js';
import { COMMAND } from '../constants/commands.js';
import { anyError } from '../helpers/error.js';
import { sendMessage } from '../helpers/sendMessage.js';
import UserCollection from '../queries/users.js';

export async function onEditSalary(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  waitingForResponse.set(userId, COMMAND.EDITSALARY);  
  
  await sendMessage(chatId, 'Ingrese su nuevo salario ✏');
}

export async function editSalary(msg) {
  const chatId = msg.chat.id;
  const newSalary = parseInt(msg.text);
  const userId = msg.from.id.toString();
  
  const { data, error } = await UserCollection.editSalary(userId, newSalary);

  if (error || !data) {
    await sendMessage(chatId, '❌ Ocurrió un error al actualizar su salario.');
    return;
  }

  const upError = await updatePercentages();

  if (upError) {
    await sendMessage(chatId, upError);
    return; 
  }

  await sendMessage(chatId, '✅ Su salario ha sido actualizado con éxito.');
}

async function updatePercentages() {
  const { data, error } = await UserCollection.getSalaries();

  if (error || !data.length) {
    return '❌ Error al actualizar porcentaje de los usuarios. Intente nuevamente más tarde.'
  }

  const totalIncome = data.reduce((acc, { salary }) => {
    return acc + salary;
  }, 0);

  const promises = data.map(({ salary, userId }) => {
    const newPercentage = (salary / totalIncome).toFixed(4);
    return UserCollection.updateContributionPercentage(userId, parseFloat(newPercentage));
  });
  
  const updatingPercentages = await Promise.all(promises);
  
  if (anyError(...updatingPercentages)) {
    return '❌ Error al actualizar porcentaje de los usuarios. Intente nuevamente más tarde.';
  }
}
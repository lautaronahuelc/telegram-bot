import { BOT_MESSAGES } from '../constants/messages.js';
import { hasError } from '../helpers/error.js';
import UserCollection from '../queries/users.js';

export async function useUpdatePercentages() {
  const salaries = await UserCollection.getSalaries();
  const salariesError = hasError(salaries);
  
  if (salariesError) {
    return { data: null, message: salariesError.message };
  }

  const totalIncome = salaries.data.reduce((acc, { salary }) => {
    return acc + salary;
  }, 0);

  const promises = salaries.data.map(({ salary, userId }) => {
    const rawPercentage = (salary / totalIncome) * 100;
    const newPercentage = rawPercentage.toFixed(2);
    return UserCollection.updateContributionPercentage({
      userId,
      newPercentage: parseFloat(newPercentage),
    });
  })
  
  const updatedPercentages = await Promise.all(promises);
  
  const updateError = hasError(...updatedPercentages);
  
  if (updateError) {
    return { data: null, message: updateError.message };
  }

  return {
    data: updatedPercentages.map(({ data }) => ({
      contributionPercentage: data.contributionPercentage,
      username: data.username,
    })),
    message: BOT_MESSAGES.USER.SALARY.EDITING.SUCCESS,
  }
}
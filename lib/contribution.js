// Calcula el porcentaje de contribución de cada usuario: salario propio / suma de salarios,
// redondeado a 4 decimales.
export function calculateContributionPercentages(users) {
  const totalIncome = users.reduce((acc, { salary }) => acc + salary, 0);

  return users.map(({ userId, salary }) => ({
    userId,
    contributionPercentage: parseFloat((salary / totalIncome).toFixed(4)),
  }));
}

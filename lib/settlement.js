// Lógica del /cierre. Pensada para dos usuarios: toma el de mayor y el de menor totalExpenses.
export function pickHighestAndLowest(users) {
  const sorted = [...users].sort((a, b) => b.totalExpenses - a.totalExpenses);

  return {
    highest: sorted[0],
    lowest: sorted[sorted.length - 1],
  };
}

export function calculateExpenseShare(contributionPercentage, totalExpenses) {
  return contributionPercentage * totalExpenses;
}

// Cada uno "recibe" el porcentaje del otro sobre sus propios gastos;
// el que tiene el valor mayor recibe la diferencia.
export function calculateSettlement(users) {
  const { highest, lowest } = pickHighestAndLowest(users);

  const shareForHighest = calculateExpenseShare(
    lowest.contributionPercentage,
    highest.totalExpenses,
  );
  const shareForLowest = calculateExpenseShare(
    highest.contributionPercentage,
    lowest.totalExpenses,
  );

  const max = Math.max(shareForHighest, shareForLowest);
  const min = Math.min(shareForHighest, shareForLowest);

  const receiver = max === shareForHighest ? highest : lowest;

  return {
    highest,
    lowest,
    shareForHighest,
    shareForLowest,
    receiver,
    amount: max - min,
  };
}

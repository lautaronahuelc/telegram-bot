export function formatTotalsMessage(totals) {
  let response = '📊 Gastos totales:\n\n';
  for (const [user, amount] of Object.entries(totals)) {
    response += `@${user}: $${amount}\n`;
  }
  return response;
}
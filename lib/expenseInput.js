// Parsea el mensaje de /nuevogasto: "<monto> <descripción>", ej. "5000 supermercado".
// Devuelve { amount: null, desc: null } si el texto no tiene ese formato.
export function parseExpenseInput(text) {
  const match = typeof text === 'string' ? text.match(/^(\d+)\s+(.+)/) : null;

  if (!match) {
    return { amount: null, desc: null };
  }

  const amount = parseInt(match[1]);
  const desc = match[2];

  return { amount, desc };
}

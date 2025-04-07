export function parseExpenseData(msg) {
  const user = msg.from.username;
  const regex = /^(\d+)\s+(.+)/;
  const match = msg.text.match(regex);
  if (!match) {
    return { amount: null, desc: null, user };
  }
  const amount = parseInt(match[1]);
  const desc = match[2];
  return { amount, desc, user };
}
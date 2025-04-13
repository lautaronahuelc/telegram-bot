import { sendMessage } from '../helpers/sendMessage.js';
import { useShowTotals } from '../hooks/useShowTotals.js';

export async function onShowTotals(msg) {
  const { message } =  await useShowTotals();
  await sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
}
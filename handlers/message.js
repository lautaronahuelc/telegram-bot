import { waitingForResponse } from '../bot.js';
import { COMMAND } from '../constants/commands.js';
import { isCommand } from '../helpers/commands.js';
import { addExpense } from './add.js';

export async function onMessage(msg) {
  const userId = msg.from.id;
  const text = msg.text;
  if (isCommand(text)) return;
  const command = waitingForResponse.get(userId);
  if (!command) return;
  handleCommand(command, msg);
  waitingForResponse.delete(userId);
}

async function handleCommand(command, msg) {
  switch (command) {
    case COMMAND.ADD:
      await addExpense(msg);
      break;
    default:
      console.warn(`Unknown command: ${command}`);
  }
}
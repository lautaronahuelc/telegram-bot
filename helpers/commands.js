import { envConfig } from '../config/env.js';
import { COMMANDLIST } from '../constants/commands.js';

export function isCommand(text) {
  return COMMANDLIST.some(
    (command) => text === `/${command.name}` || text === `/${command.name}@${envConfig.BOT_USERNAME}`
  );
}
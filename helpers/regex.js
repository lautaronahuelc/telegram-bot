import { envConfig } from '../config/env.js';

export function commandRegex(command) {
  return new RegExp(`^\\/${command}(@${envConfig.BOT_USERNAME})?$`);
}
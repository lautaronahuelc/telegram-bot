export function commandRegex(command) {
  return new RegExp(`^\\/${command}(@${process.env.BOT_USERNAME})?$`);
}
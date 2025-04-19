export function anyError(...responses) {
  return responses.some((fetch) => fetch.error || fetch.data === null);
}
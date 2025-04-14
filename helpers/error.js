import { isEmpty } from './object.js';

export function hasError(...responses) {
  return responses.find(response => !isEmpty(response) && response.data === null);
}
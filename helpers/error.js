import { isEmpty } from './object.js';

export function hasError(error) {
  return !isEmpty(error) && error.message !== null;
}
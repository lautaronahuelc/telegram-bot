import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseExpenseInput } from '../lib/expenseInput.js';

const INVALID = { amount: null, desc: null };

test('parsea monto y descripción', () => {
  assert.deepEqual(parseExpenseInput('5000 supermercado'), { amount: 5000, desc: 'supermercado' });
});

test('la descripción puede tener varias palabras', () => {
  assert.deepEqual(parseExpenseInput('1200 cena con amigos'), { amount: 1200, desc: 'cena con amigos' });
});

test('acepta varios espacios entre monto y descripción', () => {
  assert.deepEqual(parseExpenseInput('300   pan'), { amount: 300, desc: 'pan' });
});

test('rechaza montos con decimales', () => {
  assert.deepEqual(parseExpenseInput('10.5 café'), INVALID);
});

test('rechaza texto sin descripción', () => {
  assert.deepEqual(parseExpenseInput('5000'), INVALID);
  assert.deepEqual(parseExpenseInput('5000 '), INVALID);
});

test('rechaza texto que no empieza con un número', () => {
  assert.deepEqual(parseExpenseInput('supermercado 5000'), INVALID);
  assert.deepEqual(parseExpenseInput(' 5000 supermercado'), INVALID);
  assert.deepEqual(parseExpenseInput('-5000 supermercado'), INVALID);
});

test('monto 0 se parsea como 0 (el handler lo rechaza por falsy)', () => {
  assert.deepEqual(parseExpenseInput('0 nada'), { amount: 0, desc: 'nada' });
});

test('mensajes sin texto (fotos, stickers) son inválidos', () => {
  assert.deepEqual(parseExpenseInput(undefined), INVALID);
  assert.deepEqual(parseExpenseInput(null), INVALID);
  assert.deepEqual(parseExpenseInput(''), INVALID);
});

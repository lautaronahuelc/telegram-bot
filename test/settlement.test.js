import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSettlement, pickHighestAndLowest } from '../lib/settlement.js';

const user = (username, contributionPercentage, totalExpenses) => ({ username, contributionPercentage, totalExpenses });

test('ejemplo de CLAUDE.md: A (60%) gastó 100.000, B (40%) gastó 50.000 → A recibe 10.000', () => {
  const a = user('A', 0.6, 100000);
  const b = user('B', 0.4, 50000);

  const result = calculateSettlement([a, b]);

  assert.equal(result.highest, a);
  assert.equal(result.lowest, b);
  assert.equal(result.shareForHighest, 40000);
  assert.equal(result.shareForLowest, 30000);
  assert.equal(result.receiver, a);
  assert.equal(result.amount, 10000);
});

test('el orden de entrada no cambia el resultado', () => {
  const a = user('A', 0.6, 100000);
  const b = user('B', 0.4, 50000);

  const result = calculateSettlement([b, a]);

  assert.equal(result.receiver, a);
  assert.equal(result.amount, 10000);
});

test('quien gastó más puede terminar pagando si su porcentaje es alto', () => {
  // A gana 80% y gastó 60.000; B gana 20% y gastó 40.000.
  // A recibe 0,2 × 60.000 = 12.000; B recibe 0,8 × 40.000 = 32.000 → B recibe 20.000.
  const a = user('A', 0.8, 60000);
  const b = user('B', 0.2, 40000);

  const result = calculateSettlement([a, b]);

  assert.equal(result.receiver, b);
  assert.equal(result.amount, 20000);
});

test('cada uno termina pagando su porcentaje del gasto total', () => {
  const a = user('A', 0.65, 123456);
  const b = user('B', 0.35, 78901);

  const { receiver, amount } = calculateSettlement([a, b]);

  const total = a.totalExpenses + b.totalExpenses;
  const aPaysNet = receiver === a ? a.totalExpenses - amount : a.totalExpenses + amount;

  assert.ok(Math.abs(aPaysNet - total * a.contributionPercentage) < 1e-6);
});

test('sin gastos → nadie recibe nada', () => {
  const result = calculateSettlement([user('A', 0.5, 0), user('B', 0.5, 0)]);

  assert.equal(result.amount, 0);
});

test('con gastos iguales highest y lowest son usuarios distintos', () => {
  const a = user('A', 0.5, 1000);
  const b = user('B', 0.5, 1000);

  const { highest, lowest } = pickHighestAndLowest([a, b]);

  assert.equal(highest, a);
  assert.equal(lowest, b);
});

test('no muta el array recibido', () => {
  const users = [user('B', 0.4, 50000), user('A', 0.6, 100000)];
  const copy = [...users];

  calculateSettlement(users);

  assert.deepEqual(users, copy);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateContributionPercentages } from '../lib/contribution.js';

test('cada usuario aporta salario / suma de salarios', () => {
  const result = calculateContributionPercentages([
    { userId: 'a', salary: 600000 },
    { userId: 'b', salary: 400000 },
  ]);

  assert.deepEqual(result, [
    { userId: 'a', contributionPercentage: 0.6 },
    { userId: 'b', contributionPercentage: 0.4 },
  ]);
});

test('redondea a 4 decimales', () => {
  const result = calculateContributionPercentages([
    { userId: 'a', salary: 1 },
    { userId: 'b', salary: 2 },
  ]);

  assert.deepEqual(result, [
    { userId: 'a', contributionPercentage: 0.3333 },
    { userId: 'b', contributionPercentage: 0.6667 },
  ]);
});

test('salarios iguales → 50% cada uno', () => {
  const result = calculateContributionPercentages([
    { userId: 'a', salary: 500 },
    { userId: 'b', salary: 500 },
  ]);

  assert.deepEqual(result.map((u) => u.contributionPercentage), [0.5, 0.5]);
});

test('un único usuario aporta el 100%', () => {
  assert.deepEqual(
    calculateContributionPercentages([{ userId: 'a', salary: 1000 }]),
    [{ userId: 'a', contributionPercentage: 1 }],
  );
});

test('lista vacía → lista vacía', () => {
  assert.deepEqual(calculateContributionPercentages([]), []);
});

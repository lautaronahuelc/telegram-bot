import fs from 'fs';

const DATA_FILE = './data.json';

export function loadExpenses() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('No se pudo leer el archivo:', error);
    return [];
  }
}

export function saveExpenses(expenses) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}
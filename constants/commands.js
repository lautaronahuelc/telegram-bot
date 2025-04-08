export const COMMAND = {
  ADD: 'add',
  DELETE: 'delete',
  DELETEALL: 'deleteall',
  HELP: 'help',
  LIST: 'list',
  SUM: 'sum',
};

export const COMMANDLIST = [
  { name: COMMAND.ADD, desc: 'Agregar un gasto' },
  { name: COMMAND.DELETE, desc: 'Eliminar un gasto' },
  { name: COMMAND.DELETEALL, desc: 'Eliminar todos los gastos' },
  { name: COMMAND.HELP, desc: 'Mostrar el menú de ayuda' },
  { name: COMMAND.LIST, desc: 'Listar todos los gastos' },
  { name: COMMAND.SUM, desc: 'Sumar todos los gastos' },
];
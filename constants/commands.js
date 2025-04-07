export const COMMAND = {
  ADD: 'add',
  DELETEALL: 'deleteall',
  DELETE: 'delete',
  HELP: 'help',
  LIST: 'list',
  SUM: 'sum',
};

export const COMMANDLIST = [
  { name: COMMAND.ADD, desc: 'Agregar gasto' },
  { name: COMMAND.DELETEALL, desc: 'Eliminar todos los gastos' },
  { name: COMMAND.DELETE, desc: 'Eliminar un gasto' },
  { name: COMMAND.HELP, desc: 'Mostrar el menú de ayuda' },
  { name: COMMAND.LIST, desc: 'Listar gastos' },
  { name: COMMAND.SUM, desc: 'Sumar gastos' },
];
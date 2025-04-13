export const COMMAND = {
  ADD: 'add',
  LIST: 'list',
  DELETE: 'delete',
  DELETEALL: 'deleteall',
  SHOWTOTALS: 'showtotals',
  EDITSALARY: 'editsalary',
  SHOWSALARIES: 'showsalaries',
  HELP: 'help',
};

export const COMMANDLIST = [
  { name: COMMAND.ADD, desc: 'Agregar un gasto' },
  { name: COMMAND.LIST, desc: 'Listar todos los gastos' },
  { name: COMMAND.DELETE, desc: 'Eliminar un gasto' },
  { name: COMMAND.DELETEALL, desc: 'Eliminar todos los gastos' },
  { name: COMMAND.SHOWTOTALS, desc: 'Mostrar el total de gastos por usuario' },
  { name: COMMAND.EDITSALARY, desc: 'Editar tu salario' },
  { name: COMMAND.SHOWSALARIES, desc: 'Mostrar los salarios' },
  { name: COMMAND.HELP, desc: 'Mostrar el menú de ayuda' },
];
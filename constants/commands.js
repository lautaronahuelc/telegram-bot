export const COMMAND = {
  ADD: 'add',
  LIST: 'list',
  DELETE: 'delete',
  EDITSALARY: 'editsalary',
  SHOWUSERDETAILS: 'showuserdetails',
  CALCULATE: 'calculate',
  HELP: 'help',
};

export const COMMANDLIST = [
  { name: COMMAND.ADD, desc: 'Agregar un gasto' },
  { name: COMMAND.LIST, desc: 'Listar todos los gastos' },
  { name: COMMAND.DELETE, desc: 'Eliminar un gasto' },
  { name: COMMAND.EDITSALARY, desc: 'Editar tu salario' },
  { name: COMMAND.SHOWUSERDETAILS, desc: 'Ver detalles de los usarios' },
  { name: COMMAND.CALCULATE, desc: 'Calcular diferencias y cierre' },
  { name: COMMAND.HELP, desc: 'Ver el menú de ayuda' },
];
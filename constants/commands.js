export const COMMAND = {
  ADD: 'nuevogasto',
  LIST: 'vergastos',
  DELETE: 'eliminaruno',
  EDITSALARY: 'editarsalario',
  SHOWUSERDETAILS: 'verusuarios',
  CALCULATE: 'cierre',
  HELP: 'ayuda',
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
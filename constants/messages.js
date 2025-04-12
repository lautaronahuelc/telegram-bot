export const BOT_MESSAGES = {
  AUTH: {
    ERROR: '¡Lo siento! No estás autorizado para usar este bot.',
  },
  EXPENSES: {
    FETCHING: {
      ERROR: '❌ Ocurrió un error al obtener los gastos.',
      NOT_FOUND: 'Aún no tienes gastos registrados.',
    },
    ADDING: {
      ERROR: '❌ Ocurrió un error al agregar el gasto.',
      INSERT_NEW: 'Ingrese el nuevo gasto.',
      SUCCESS: '✅ Nuevo gasto agregado con éxito.',
    },
    DELETING_ONE: {
      CANCEL: '✅ Eliminación cancelada. No se ha eliminado ningún gasto.',
      ERROR: '❌ Ocurrió un error al eliminar el gasto.',
      SELECT: 'Seleccione el gasto a eliminar.',
      SUCCESS: '✅ Gasto eliminado con éxito.',
    },
    DELETING_ALL: {
      CANCEL: '✅ Eliminación cancelada. No se han eliminado gastos.',
      CONFIRM: '¿Está seguro que desea eliminar todos los gastos? 👀',
      ERROR: '❌ Ocurrió un error al eliminar los gastos.',
      SUCCESS: '✅ Todos los gastos han sido eliminados con éxito.',
    },
  },
  UPS: {
    INCORRECT_FORMAT: '¡Ups! El formato es incorrecto.',
  },
  USER: {
    SALARY: {
      EDITING: {
        ERROR: '❌ Ocurrió un error al actualizar su salario.',
        INSERT_NEW: 'Ingrese su nuevo salario.',
        SUCCESS: '✅ Su salario ha sido actualizado con éxito.',
      },
      FETCHING: {
        ERROR: '❌ Ocurrió un error al obtener su salario.',
      },
    },
    USERNAME: {
      EDITING: {
        ERROR: '❌ Ocurrió un error al actualizar su nombre de usuario.',
      },
    },
  },
};
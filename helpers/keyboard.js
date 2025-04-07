export function buildDeleteAllKeyboard() {
  return [
    [
      {
        text: 'Sí, eliminar todos los gastos',
        callback_data: 'deleteall_confirm'
      },
    ],
    [
      {
        text: 'No, cancelar',
        callback_data: 'deleteall_cancel'
      },
    ],
  ];
}
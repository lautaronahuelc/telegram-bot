export function formatCurrency(currency) {
  return Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(currency).trim();
}

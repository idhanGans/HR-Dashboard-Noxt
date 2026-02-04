const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const formatIDR = (value: number): string =>
  idrFormatter.format(value || 0);

// Alias for currency formatting (used by payroll components)
export const formatCurrency = (value: number): string => formatIDR(value);

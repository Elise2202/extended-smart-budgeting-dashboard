// src/utils/format.js

export function formatCurrency(
  value,
  currency = "USD",
  locale // can be undefined
) {
  if (value == null || isNaN(value)) return "-";

  return value.toLocaleString(locale || undefined, {
    style: "currency",
    currency,
  });
}

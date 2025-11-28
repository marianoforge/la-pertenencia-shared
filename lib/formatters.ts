export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace("ARS", "$");
}

export function formatNumber(value: number): string {
  return value.toLocaleString("es-AR");
}

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(dateObj);
}


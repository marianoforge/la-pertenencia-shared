export function calculateWineProfit(
  price: number,
  cost: number,
  iva: number = 0
) {
  const priceWithTax = price + (price * iva) / 100;
  const profit = price - cost;
  const profitPercentage = cost > 0 ? (profit / cost) * 100 : 0;

  return {
    profit,
    profitPercentage,
    priceWithTax,
  };
}

export function cleanOptionalFields<T extends Record<string, any>>(
  data: T,
  optionalFields: (keyof T)[]
): T {
  const cleaned = { ...data };

  optionalFields.forEach((field) => {
    const value = cleaned[field];
    if (typeof value === "string" && !value.trim()) {
      delete cleaned[field];
    }
  });

  return cleaned;
}

export function validateImage(
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "El archivo debe ser una imagen" };
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `El archivo debe ser menor a ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

export function generateTempId(prefix: string = "temp"): string {
  return `${prefix}-${Date.now()}`;
}

export function numberToInputString(value: number | undefined): string {
  return value?.toString() || "";
}

export function extractNumbers(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

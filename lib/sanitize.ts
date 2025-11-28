/**
 * Sanitización de datos para prevenir XSS y otros ataques
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitiza HTML permitiendo solo tags seguros
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6"],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitiza texto plano removiendo caracteres peligrosos
 */
export function sanitizeText(text: string): string {
  if (typeof text !== "string") {
    return "";
  }
  
  // Remover caracteres de control y scripts
  return text
    .replace(/[\x00-\x1F\x7F]/g, "") // Remover caracteres de control
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remover scripts
    .trim();
}

/**
 * Sanitiza un objeto recursivamente
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    if (Object.prototype.hasOwnProperty.call(sanitized, key)) {
      const value = sanitized[key];
      
      if (typeof value === "string") {
        // Si parece HTML, sanitizar como HTML, sino como texto
        if (value.includes("<") && value.includes(">")) {
          sanitized[key] = sanitizeHtml(value) as T[Extract<keyof T, string>];
        } else {
          sanitized[key] = sanitizeText(value) as T[Extract<keyof T, string>];
        }
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value as Record<string, unknown>) as T[Extract<keyof T, string>];
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) => {
          if (typeof item === "string") {
            return item.includes("<") && item.includes(">") 
              ? sanitizeHtml(item) 
              : sanitizeText(item);
          }
          if (typeof item === "object" && item !== null) {
            return sanitizeObject(item as Record<string, unknown>);
          }
          return item;
        }) as T[Extract<keyof T, string>];
      }
    }
  }
  
  return sanitized;
}

/**
 * Valida y sanitiza email
 */
export function sanitizeEmail(email: string): string {
  return sanitizeText(email)
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, "");
}

/**
 * Valida y sanitiza URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const sanitized = sanitizeText(url);
    const urlObj = new URL(sanitized);
    // Solo permitir http y https
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      return "";
    }
    return urlObj.toString();
  } catch {
    return "";
  }
}


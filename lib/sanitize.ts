

import DOMPurify from "isomorphic-dompurify";


export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6"],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  });
}


export function sanitizeText(text: string): string {
  if (typeof text !== "string") {
    return "";
  }
  
  
  return text
    .replace(/[\x00-\x1F\x7F]/g, "") 
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") 
    .trim();
}


export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    if (Object.prototype.hasOwnProperty.call(sanitized, key)) {
      const value = sanitized[key];
      
      if (typeof value === "string") {
        
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


export function sanitizeEmail(email: string): string {
  return sanitizeText(email)
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, "");
}


export function sanitizeUrl(url: string): string {
  try {
    const sanitized = sanitizeText(url);
    const urlObj = new URL(sanitized);
    
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      return "";
    }
    return urlObj.toString();
  } catch {
    return "";
  }
}


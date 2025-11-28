/**
 * Rate limiting para API routes
 * Implementación simple en memoria (para producción, usar Redis o similar)
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs?: number; // Ventana de tiempo en milisegundos
  max?: number; // Máximo de requests por ventana
  message?: string; // Mensaje de error
  skipOnError?: boolean; // Si true, no cuenta errores
}

const DEFAULT_OPTIONS: Required<RateLimitOptions> = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests
  message: "Too many requests, please try again later",
  skipOnError: false,
};

/**
 * Limpia entradas expiradas del store
 */
function cleanExpiredEntries() {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}

/**
 * Obtiene la IP del request
 */
function getIdentifier(req: { headers?: { [key: string]: string | string[] | undefined } }): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  const ip = Array.isArray(forwarded) 
    ? forwarded[0] 
    : typeof forwarded === "string" 
    ? forwarded.split(",")[0].trim() 
    : req.headers?.["x-real-ip"] as string | undefined;
  
  return ip || "unknown";
}

/**
 * Middleware de rate limiting
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return (req: { headers?: { [key: string]: string | string[] | undefined } }) => {
    // Limpiar entradas expiradas periódicamente
    if (Math.random() < 0.1) {
      cleanExpiredEntries();
    }
    
    const identifier = getIdentifier(req);
    const now = Date.now();
    const key = identifier;
    
    // Obtener o crear entrada
    let entry = store[key];
    
    if (!entry || entry.resetTime < now) {
      // Nueva ventana de tiempo
      entry = {
        count: 1,
        resetTime: now + opts.windowMs,
      };
      store[key] = entry;
      return { success: true, remaining: opts.max - 1 };
    }
    
    // Incrementar contador
    entry.count++;
    
    if (entry.count > opts.max) {
      return {
        success: false,
        message: opts.message,
        resetTime: entry.resetTime,
      };
    }
    
    return {
      success: true,
      remaining: opts.max - entry.count,
      resetTime: entry.resetTime,
    };
  };
}

/**
 * Rate limiter específico para APIs públicas
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests
  message: "Too many requests from this IP, please try again later",
});

/**
 * Rate limiter más estricto para endpoints sensibles
 */
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 requests
  message: "Too many requests, please try again later",
});

/**
 * Rate limiter para autenticación
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: "Too many login attempts, please try again later",
});


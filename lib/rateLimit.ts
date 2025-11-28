

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs?: number; 
  max?: number; 
  message?: string; 
  skipOnError?: boolean; 
}

const DEFAULT_OPTIONS: Required<RateLimitOptions> = {
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests, please try again later",
  skipOnError: false,
};


function cleanExpiredEntries() {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}


function getIdentifier(req: { headers?: { [key: string]: string | string[] | undefined } }): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  const ip = Array.isArray(forwarded) 
    ? forwarded[0] 
    : typeof forwarded === "string" 
    ? forwarded.split(",")[0].trim() 
    : req.headers?.["x-real-ip"] as string | undefined;
  
  return ip || "unknown";
}


export function rateLimit(options: RateLimitOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return (req: { headers?: { [key: string]: string | string[] | undefined } }) => {
    
    if (Math.random() < 0.1) {
      cleanExpiredEntries();
    }
    
    const identifier = getIdentifier(req);
    const now = Date.now();
    const key = identifier;
    
    
    let entry = store[key];
    
    if (!entry || entry.resetTime < now) {
      
      entry = {
        count: 1,
        resetTime: now + opts.windowMs,
      };
      store[key] = entry;
      return { success: true, remaining: opts.max - 1 };
    }
    
    
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


export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later",
});


export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: "Too many requests, please try again later",
});


export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: "Too many login attempts, please try again later",
});


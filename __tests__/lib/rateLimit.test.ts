import { rateLimit, apiRateLimit } from '@/lib/rateLimit';

describe('rateLimit', () => {
  const mockReq = {
    headers: {
      'x-forwarded-for': '192.168.1.1',
    },
  };

  beforeEach(() => {
    // Limpiar el store antes de cada test
    jest.clearAllMocks();
  });

  it('should allow requests within limit', () => {
    const limiter = rateLimit({ windowMs: 1000, max: 5 });
    
    for (let i = 0; i < 5; i++) {
      const result = limiter(mockReq);
      expect(result.success).toBe(true);
    }
  });

  it('should block requests exceeding limit', () => {
    const limiter = rateLimit({ windowMs: 1000, max: 2 });
    
    limiter(mockReq);
    limiter(mockReq);
    const result = limiter(mockReq);
    
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });

  it('should reset after window expires', async () => {
    const limiter = rateLimit({ windowMs: 100, max: 2 });
    
    limiter(mockReq);
    limiter(mockReq);
    
    // Esperar que expire la ventana
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const result = limiter(mockReq);
    expect(result.success).toBe(true);
  });

  it('apiRateLimit should have default settings', () => {
    const result = apiRateLimit(mockReq);
    expect(result.success).toBe(true);
  });
});


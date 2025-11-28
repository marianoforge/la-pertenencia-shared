# 💡 Ejemplos de Código Mejorado

Este documento contiene ejemplos concretos de cómo implementar las mejoras recomendadas.

## 📋 Índice

1. [Logger Centralizado](#logger-centralizado)
2. [Validación con Zod](#validación-con-zod)
3. [Manejo de Errores](#manejo-de-errores)
4. [Separación de Firestore](#separación-de-firestore)
5. [Validación de Variables de Entorno](#validación-de-variables-de-entorno)
6. [Error Boundary](#error-boundary)
7. [API Helper para Respuestas](#api-helper-para-respuestas)

---

## 1. Logger Centralizado

### ❌ Antes
```typescript
// hooks/useWines.ts
console.log("Wine created successfully:", newWine.marca);
console.error("Error creating wine:", error);
```

### ✅ Después
```typescript
// lib/logger.ts
const isDevelopment = process.env.NODE_ENV === 'development';

type LogLevel = 'log' | 'error' | 'warn' | 'info';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    // En producción, enviar a servicio de logging (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Enviar a servicio de logging
      if (level === 'error') {
        console.error(entry);
      }
      return;
    }

    // En desarrollo, mostrar en consola
    const consoleMethod = console[level] || console.log;
    consoleMethod(`[${level.toUpperCase()}]`, message, data || '');
  }

  log(message: string, data?: unknown) {
    this.log('log', message, data);
  }

  error(message: string, error?: unknown) {
    this.log('error', message, error);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }
}

export const logger = new Logger();
```

### Uso
```typescript
// hooks/useWines.ts
import { logger } from '@/lib/logger';

logger.info("Wine created successfully:", newWine.marca);
logger.error("Error creating wine:", error);
```

---

## 2. Validación con Zod

### ❌ Antes
```typescript
// components/admin/WineAdminPanel.tsx
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};
  
  if (!wineForm.marca?.trim()) newErrors.marca = "La marca es requerida";
  if (!wineForm.bodega?.trim()) newErrors.bodega = "La bodega es requerida";
  if ((wineForm.price || 0) <= 0) newErrors.price = "El precio debe ser mayor a 0";
  // ... más validaciones manuales
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### ✅ Después
```typescript
// lib/validators/wine.ts
import { z } from 'zod';

export const wineTypeSchema = z.enum([
  "Tinto",
  "Blanco",
  "Rosado",
  "Espumante",
  "Naranjo",
  "Combo",
]);

export const createWineSchema = z.object({
  marca: z.string().min(1, "La marca es requerida").trim(),
  bodega: z.string().min(1, "La bodega es requerida").trim(),
  tipo: wineTypeSchema,
  varietal: z.string().min(1, "El varietal es requerido").trim(),
  maridaje: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser mayor a 0"),
  cost: z.number().positive("El costo debe ser mayor a 0"),
  iva: z.number().min(0).max(50, "El IVA debe estar entre 0% y 50%"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  region: z.string().min(1, "La región es requerida").trim(),
  vintage: z.number()
    .int()
    .min(1900, "El año debe ser válido")
    .max(new Date().getFullYear() + 1, "El año no puede ser futuro"),
  alcohol: z.number()
    .positive("El alcohol debe ser mayor a 0")
    .max(20, "El alcohol debe estar entre 0 y 20%"),
  image: z.string().url("La imagen debe ser una URL válida"),
  featured: z.boolean(),
  winery: z.string().min(1, "La bodega es requerida").trim(),
  boxSize: z.number().int().positive().optional(),
});

export const updateWineSchema = createWineSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateWineInput = z.infer<typeof createWineSchema>;
export type UpdateWineInput = z.infer<typeof updateWineSchema>;
```

### Uso en Componente
```typescript
// components/admin/WineAdminPanel.tsx
import { createWineSchema } from '@/lib/validators/wine';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function WineAdminPanel() {
  const form = useForm<CreateWineInput>({
    resolver: zodResolver(createWineSchema),
    defaultValues: DEFAULT_WINE_VALUES,
  });

  const handleSubmit = async (data: CreateWineInput) => {
    // data ya está validado
    await createWine(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* ... */}
    </form>
  );
}
```

### Uso en API Route
```typescript
// pages/api/wines/index.ts
import { createWineSchema } from '@/lib/validators/wine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const validatedData = createWineSchema.parse(req.body);
      // Procesar con datos validados
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }
      throw error;
    }
  }
}
```

---

## 3. Manejo de Errores

### ❌ Antes
```typescript
// lib/firestore.ts
export const getAllWines = async (): Promise<Wine[]> => {
  try {
    const winesCollection = collection(db, COLLECTIONS.WINES);
    const snapshot: QuerySnapshot = await getDocs(winesCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Wine[];
  } catch (error) {
    console.error("Error fetching wines:", error);
    return [];
  }
};
```

### ✅ Después
```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class WineNotFoundError extends AppError {
  constructor(id: string) {
    super(`Wine with ID ${id} not found`, 'WINE_NOT_FOUND', 404);
  }
}

export class FirestoreError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(
      `Firestore error: ${message}`,
      'FIRESTORE_ERROR',
      500,
      originalError
    );
  }
}

// lib/firestore/wines.ts
import { FirestoreError, WineNotFoundError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export const getAllWines = async (): Promise<Wine[]> => {
  try {
    const winesCollection = collection(db, COLLECTIONS.WINES);
    const snapshot: QuerySnapshot = await getDocs(winesCollection);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Wine[];
  } catch (error) {
    logger.error('Error fetching wines from Firestore', error);
    throw new FirestoreError('Failed to fetch wines', error);
  }
};

export const getWineById = async (id: string): Promise<Wine> => {
  try {
    if (!id || id === 'undefined') {
      throw new WineNotFoundError(id);
    }

    const wineDoc = doc(db, COLLECTIONS.WINES, id);
    const snapshot: DocumentSnapshot = await getDoc(wineDoc);

    if (!snapshot.exists()) {
      throw new WineNotFoundError(id);
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Wine;
  } catch (error) {
    if (error instanceof WineNotFoundError) {
      throw error;
    }
    logger.error('Error fetching wine by ID', error);
    throw new FirestoreError('Failed to fetch wine', error);
  }
};
```

---

## 4. Separación de Firestore

### ❌ Antes
```typescript
// lib/firestore.ts (591 líneas, todo mezclado)
export const getAllWines = async () => { /* ... */ };
export const createOrder = async () => { /* ... */ };
export const addNewsletterSubscription = async () => { /* ... */ };
export const getSiteSettings = async () => { /* ... */ };
```

### ✅ Después
```typescript
// lib/firestore/wines.ts
import { collection, getDocs, /* ... */ } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Wine } from '@/types/wine';

const COLLECTION = 'wines';

export const getAllWines = async (): Promise<Wine[]> => {
  // Implementación específica de vinos
};

export const getWineById = async (id: string): Promise<Wine | null> => {
  // Implementación específica
};

// ... solo funciones relacionadas con vinos

// lib/firestore/orders.ts
import { collection, /* ... */ } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types/order';

const COLLECTION = 'orders';

export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
  // Implementación específica de órdenes
};

// ... solo funciones relacionadas con órdenes

// lib/firestore/index.ts (barrel export)
export * from './wines';
export * from './orders';
export * from './newsletter';
export * from './settings';
```

---

## 5. Validación de Variables de Entorno

### ❌ Antes
```typescript
// lib/firebase.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... puede ser undefined
};
```

### ✅ Después
```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Firebase
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),

  // MercadoPago
  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY: z.string().optional(),
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADOPAGO_ACCESS_TOKEN_TEST: z.string().optional(),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
});

function getEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
      MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
      MERCADOPAGO_ACCESS_TOKEN_TEST: process.env.MERCADOPAGO_ACCESS_TOKEN_TEST,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map(e => e.path.join('.')).join(', ');
      throw new Error(
        `❌ Missing or invalid environment variables: ${missing}\n` +
        `Please check your .env.local file.`
      );
    }
    throw error;
  }
}

export const env = getEnv();

// lib/firebase.ts
import { env } from '@/config/env';

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
```

---

## 6. Error Boundary

### ✅ Implementación
```typescript
// components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Algo salió mal
      </h2>
      <p className="text-gray-700 mb-4">
        {error.message || 'Ocurrió un error inesperado'}
      </p>
      <button
        onClick={resetError}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Intentar de nuevo
      </button>
    </div>
  </div>
);

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by ErrorBoundary', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}
```

### Uso
```typescript
// pages/_app.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
```

---

## 7. API Helper para Respuestas

### ✅ Implementación
```typescript
// lib/apiHelpers.ts
import { NextApiResponse } from 'next';
import { AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: unknown;
}

export function sendSuccess<T>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T,
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendError(
  res: NextApiResponse<ApiResponse>,
  error: unknown,
  defaultMessage: string = 'Internal server error'
) {
  if (error instanceof AppError) {
    logger.error('API Error:', error.message, error.details);
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.details,
    });
  }

  logger.error('Unexpected API Error:', error);
  return res.status(500).json({
    success: false,
    error: defaultMessage,
    code: 'INTERNAL_ERROR',
  });
}

export function handleApiRequest<T>(
  handler: () => Promise<T>
): (res: NextApiResponse<ApiResponse<T>>) => Promise<void> {
  return async (res: NextApiResponse<ApiResponse<T>>) => {
    try {
      const data = await handler();
      sendSuccess(res, data);
    } catch (error) {
      sendError(res, error);
    }
  };
}
```

### Uso
```typescript
// pages/api/wines/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sendSuccess, sendError, ApiResponse } from '@/lib/apiHelpers';
import { getAllWines } from '@/lib/firestore/wines';
import { Wine } from '@/types/wine';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Wine[]>>
) {
  if (req.method !== 'GET') {
    return sendError(res, new Error('Method not allowed'), 'Method not allowed');
  }

  try {
    const wines = await getAllWines();
    return sendSuccess(res, wines);
  } catch (error) {
    return sendError(res, error, 'Failed to fetch wines');
  }
}
```

---

## 📝 Notas

- Estos ejemplos son templates que deben adaptarse a las necesidades específicas del proyecto
- Considerar migración gradual, no todo de una vez
- Agregar tests para cada nueva funcionalidad
- Documentar cambios en CHANGELOG.md


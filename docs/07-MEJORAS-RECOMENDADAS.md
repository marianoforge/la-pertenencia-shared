# 🔧 Mejoras Recomendadas - La Pertenencia

Este documento contiene un análisis completo del proyecto con recomendaciones de mejoras en estructura, código, arquitectura y mejores prácticas.

## 📋 Índice

1. [Estructura y Organización](#estructura-y-organización)
2. [Código y Patrones](#código-y-patrones)
3. [TypeScript y Tipos](#typescript-y-tipos)
4. [Manejo de Errores](#manejo-de-errores)
5. [Performance y Optimización](#performance-y-optimización)
6. [Seguridad](#seguridad)
7. [Testing](#testing)
8. [Configuración y DevOps](#configuración-y-devops)
9. [Accesibilidad](#accesibilidad)

---

## 🏗️ Estructura y Organización

### 1.1 Separación de Responsabilidades

**Problema Actual:**
- `lib/firestore.ts` tiene 591 líneas y mezcla múltiples responsabilidades (wines, orders, newsletter, settings)
- Lógica de negocio mezclada con acceso a datos

**Recomendación:**
```
lib/
├── firestore/
│   ├── wines.ts          # Solo funciones de vinos
│   ├── orders.ts         # Solo funciones de órdenes
│   ├── newsletter.ts     # Solo funciones de newsletter
│   └── settings.ts       # Solo funciones de configuración
├── services/             # Lógica de negocio
│   ├── wineService.ts
│   ├── orderService.ts
│   └── cartService.ts
└── repositories/        # Abstracción de acceso a datos
    ├── wineRepository.ts
    └── orderRepository.ts
```

### 1.2 Organización de Componentes

**Problema Actual:**
- Componentes grandes (ej: `WineAdminPanel.tsx` con 323+ líneas)
- Lógica de UI mezclada con lógica de negocio

**Recomendación:**
```
components/
├── admin/
│   ├── wines/
│   │   ├── WineAdminPanel.tsx      # Componente principal
│   │   ├── WineForm.tsx            # Formulario separado
│   │   ├── WineList.tsx            # Lista separada
│   │   └── hooks/
│   │       └── useWineAdmin.ts     # Lógica de negocio
│   └── shared/                     # Componentes compartidos
```

### 1.3 Constantes y Configuración

**Problema Actual:**
- Constantes dispersas en diferentes archivos
- Configuración hardcodeada en algunos lugares

**Recomendación:**
```
config/
├── constants.ts          # Todas las constantes
├── env.ts                # Validación de variables de entorno
└── firebase.ts           # Configuración de Firebase
```

---

## 💻 Código y Patrones

### 2.1 Eliminar console.log en Producción

**Problema Actual:**
- 24 archivos con `console.log/error/warn` sin control
- ESLint tiene `"no-console": "off"`

**Recomendación:**
```typescript
// lib/logger.ts
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) console.log(...args);
  },
  error: (...args: unknown[]) => {
    console.error(...args); // Siempre loggear errores
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) console.warn(...args);
  },
};
```

### 2.2 Manejo de Errores Consistente

**Problema Actual:**
- Algunas funciones retornan `null`, otras `false`, otras lanzan errores
- Mensajes de error inconsistentes

**Recomendación:**
```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class WineNotFoundError extends AppError {
  constructor(id: string) {
    super(`Wine with ID ${id} not found`, 'WINE_NOT_FOUND', 404);
  }
}
```

### 2.3 Validación de Datos

**Problema Actual:**
- Validación manual repetida en múltiples lugares
- No hay validación centralizada con Zod/Pydantic

**Recomendación:**
```typescript
// lib/validators/wine.ts
import { z } from 'zod';

export const wineSchema = z.object({
  marca: z.string().min(1, 'La marca es requerida'),
  bodega: z.string().min(1, 'La bodega es requerida'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  // ...
});

export type WineInput = z.infer<typeof wineSchema>;
```

### 2.4 Custom Hooks Mejorados

**Problema Actual:**
- `useWines.ts` tiene lógica de filtrado mezclada con fetching
- No hay manejo de errores consistente

**Recomendación:**
```typescript
// hooks/useWines.ts
export function useWines(filters?: WineFilters) {
  return useQuery({
    queryKey: ["wines", filters],
    queryFn: () => fetchWines(filters),
    staleTime: QUERY_CONFIG.STALE_TIME.MEDIUM,
    retry: QUERY_CONFIG.RETRY.DEFAULT,
    retryDelay: QUERY_CONFIG.RETRY_DELAY,
    // Agregar manejo de errores
    onError: (error) => {
      logger.error('Error fetching wines:', error);
      // Opcional: mostrar toast/notificación al usuario
    },
  });
}
```

---

## 📘 TypeScript y Tipos

### 3.1 Tipos Más Estrictos

**Problema Actual:**
- Uso de `any` en algunos lugares (ej: `applyFilters` en `useWines.ts`)
- Tipos opcionales sin validación

**Recomendación:**
```typescript
// types/wine.ts
// Eliminar tipos duplicados como "Red" y "Blend" que parecen ser errores
export type WineType = 
  | "Tinto"
  | "Blanco"
  | "Rosado"
  | "Espumante"
  | "Naranjo"
  | "Combo";

// Usar tipos más específicos
export interface Wine {
  id: string;
  marca: string;
  bodega: string;
  tipo: WineType; // En lugar de union type largo
  // ...
}
```

### 3.2 Tipos para API Responses

**Problema Actual:**
- Tipos de respuesta de API no están bien definidos
- Uso de `any` en handlers de API

**Recomendación:**
```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
}
```

### 3.3 Validación de Variables de Entorno

**Problema Actual:**
- Variables de entorno no validadas al inicio
- Puede fallar en runtime si faltan

**Recomendación:**
```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  MERCADOPAGO_ACCESS_TOKEN: z.string().min(1).optional(),
  // ...
});

export const env = envSchema.parse({
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // ...
});
```

---

## ⚠️ Manejo de Errores

### 4.1 Error Boundaries

**Problema Actual:**
- No hay Error Boundaries en la aplicación
- Errores no manejados pueden romper toda la UI

**Recomendación:**
```typescript
// components/ErrorBoundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

export class ErrorBoundary extends React.Component<Props> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error!} />;
    }
    return this.props.children;
  }
}
```

### 4.2 Manejo de Errores en API Routes

**Problema Actual:**
- Algunos handlers no manejan todos los casos de error
- Respuestas inconsistentes

**Recomendación:**
```typescript
// lib/apiHelpers.ts
export function handleApiError(
  error: unknown,
  res: NextApiResponse
) {
  logger.error('API Error:', error);
  
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }
  
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}
```

---

## ⚡ Performance y Optimización

### 5.1 Lazy Loading de Componentes

**Problema Actual:**
- Todos los componentes se cargan de inmediato
- Bundle inicial grande

**Recomendación:**
```typescript
// pages/admin/index.tsx
import dynamic from 'next/dynamic';

const WineAdminPanel = dynamic(() => import('@/components/admin/WineAdminPanel'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Si no necesita SSR
});
```

### 5.2 Optimización de Imágenes

**Problema Actual:**
- Uso de `next/image` pero sin optimización de tamaños
- No hay placeholders o blur

**Recomendación:**
```typescript
<Image
  src={wine.image}
  alt={wine.marca}
  width={400}
  height={600}
  placeholder="blur"
  blurDataURL="/images/placeholder.png"
  loading="lazy"
/>
```

### 5.3 Memoización de Componentes Pesados

**Problema Actual:**
- Componentes que se re-renderizan innecesariamente
- Filtros y cálculos repetidos

**Recomendación:**
```typescript
// components/WineList.tsx
import { memo, useMemo } from 'react';

export const WineList = memo(({ wines, filters }: Props) => {
  const filteredWines = useMemo(() => {
    return applyFilters(wines, filters);
  }, [wines, filters]);

  return (
    // ...
  );
});
```

### 5.4 Paginación en Firestore

**Problema Actual:**
- `getAllWines()` carga todos los vinos de una vez
- Puede ser lento con muchos documentos

**Recomendación:**
```typescript
// lib/firestore/wines.ts
export const getWinesPaginated = async (
  pageSize: number = 20,
  lastDoc?: DocumentSnapshot
): Promise<{ wines: Wine[]; lastDoc: DocumentSnapshot | null }> => {
  let q = query(
    collection(db, COLLECTIONS.WINES),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const last = snapshot.docs[snapshot.docs.length - 1] || null;

  return {
    wines: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Wine)),
    lastDoc: last,
  };
};
```

---

## 🔒 Seguridad

### 6.1 Validación de Inputs en API Routes

**Problema Actual:**
- Validación básica pero no exhaustiva
- No hay sanitización de inputs

**Recomendación:**
```typescript
// pages/api/wines/index.ts
import { wineSchema } from '@/lib/validators/wine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const validatedData = wineSchema.parse(req.body);
      // Procesar...
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

### 6.2 Rate Limiting

**Problema Actual:**
- No hay rate limiting en API routes
- Vulnerable a ataques de fuerza bruta

**Recomendación:**
```typescript
// lib/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: 'Too many requests from this IP',
});
```

### 6.3 Sanitización de Datos

**Problema Actual:**
- Datos del usuario se guardan sin sanitizar
- Riesgo de XSS en descripciones/comentarios

**Recomendación:**
```typescript
// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: [],
  });
}
```

---

## 🧪 Testing

### 7.1 Cobertura de Tests

**Problema Actual:**
- Tests básicos pero no exhaustivos
- No hay tests de integración para flujos críticos

**Recomendación:**
```typescript
// __tests__/integration/cart.test.tsx
describe('Cart Flow', () => {
  it('should add item to cart and proceed to checkout', async () => {
    // Test completo del flujo
  });
});
```

### 7.2 Mocks de Firebase

**Problema Actual:**
- Tests pueden depender de Firebase real
- No hay mocks consistentes

**Recomendación:**
```typescript
// __tests__/mocks/firebase.ts
export const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(),
  // ...
};
```

---

## ⚙️ Configuración y DevOps

### 8.1 Variables de Entorno Tipadas

**Problema Actual:**
- Variables de entorno no validadas
- Pueden faltar en producción

**Recomendación:**
Ver sección 3.3 - Validación de Variables de Entorno

### 8.2 Scripts de Build Mejorados

**Problema Actual:**
- No hay validación pre-build
- No hay análisis de bundle

**Recomendación:**
```json
// package.json
{
  "scripts": {
    "build": "npm run validate-env && next build",
    "validate-env": "tsx scripts/validate-env.ts",
    "analyze": "ANALYZE=true next build"
  }
}
```

### 8.3 CI/CD Pipeline

**Recomendación:**
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:ci
      - run: npm run build
```

---

## ♿ Accesibilidad

### 9.1 Mejoras A11y

**Problema Actual:**
- ESLint tiene reglas de a11y deshabilitadas
- Falta de labels en algunos inputs
- Contraste de colores no verificado

**Recomendación:**
1. Habilitar reglas de a11y en ESLint
2. Agregar `aria-label` a todos los botones sin texto
3. Verificar contraste de colores (WCAG AA mínimo)
4. Agregar `skip to main content` link
5. Asegurar navegación por teclado

---

## 📊 Priorización de Mejoras

### 🔴 Alta Prioridad (Hacer Primero)
1. Eliminar console.log en producción
2. Validación de variables de entorno
3. Separar `lib/firestore.ts` en módulos
4. Agregar Error Boundaries
5. Validación con Zod en API routes

### 🟡 Media Prioridad
1. Lazy loading de componentes admin
2. Paginación en Firestore
3. Mejorar tipos TypeScript
4. Rate limiting en APIs
5. Tests de integración

### 🟢 Baja Prioridad (Mejoras Incrementales)
1. Memoización de componentes
2. Optimización de imágenes
3. CI/CD pipeline
4. Mejoras de accesibilidad
5. Análisis de bundle

---

## 🎯 Próximos Pasos

1. **Semana 1**: Alta prioridad - Seguridad y estructura
2. **Semana 2**: Media prioridad - Performance y testing
3. **Semana 3**: Baja prioridad - Optimizaciones y mejoras incrementales

---

## 📝 Notas Finales

Este documento es un análisis inicial. Las mejoras deben implementarse de forma incremental, priorizando seguridad y estabilidad primero.

Para cada mejora, considerar:
- Impacto en el código existente
- Tiempo de implementación
- Beneficio para usuarios/desarrolladores
- Riesgo de introducir bugs


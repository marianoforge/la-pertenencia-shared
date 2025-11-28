# 🔥 Firebase - Base de Datos y Configuración

Guía completa de Firebase: Firestore, Authentication, Storage y Reglas.

## 📋 Tabla de Contenidos

- [Configuración Inicial](#configuración-inicial)
- [Firestore Database](#firestore-database)
- [Authentication](#authentication)
- [Storage](#storage)
- [Reglas de Seguridad](#reglas-de-seguridad)
- [Índices](#índices)
- [Troubleshooting](#troubleshooting)

## ⚡ Configuración Inicial

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombre: "la-pertenencia" (o el que prefieras)
4. Habilita Google Analytics (opcional)
5. Crear proyecto

### 2. Configurar Aplicación Web

1. En el proyecto → Configuración (⚙️)
2. **Agregar app** → **Web** (</> icono)
3. Nombre de la app: "La Pertenencia Web"
4. Registrar app
5. **Copia la configuración** (la necesitarás para `.env.local`)

### 3. Habilitar Servicios

#### Firestore Database

```
1. Firebase Console → Firestore Database
2. Crear base de datos
3. Modo: Producción (por ahora)
4. Ubicación: us-central (o la más cercana)
5. Habilitar
```

#### Authentication

```
1. Firebase Console → Authentication
2. Get Started
3. Sign-in method → Email/Password → Habilitar
4. (Opcional) Google → Habilitar
```

#### Storage

```
1. Firebase Console → Storage
2. Get Started
3. Modo: Producción
4. Ubicación: us-central
5. Listo
```

## 📊 Firestore Database

### Estructura de Colecciones

```
firestore/
├── wines/                    # Catálogo de vinos
│   └── [wineId]
│       ├── marca: string
│       ├── bodega: string
│       ├── varietal: string
│       ├── tipo: string
│       ├── vintage: number
│       ├── precio: number
│       ├── stock: number
│       ├── description: string
│       ├── image: string
│       ├── featured: boolean
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── combos/                   # Combos de vinos
│   └── [comboId]
│       ├── name: string
│       ├── wines: string[]
│       ├── price: number
│       ├── image: string
│       ├── backgroundImage: string
│       └── featured: boolean
│
├── orders/                   # Pedidos
│   └── [orderId]
│       ├── orderNumber: string
│       ├── items: array
│       ├── totalAmount: number
│       ├── shippingCost: number
│       ├── finalAmount: number
│       ├── shippingInfo: object
│       ├── status: string
│       ├── paymentMethod: string
│       ├── mercadoPagoData: object
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── suscriptos/              # Suscriptores newsletter
│   └── [subscriptionId]
│       ├── email: string
│       ├── subscribedAt: timestamp
│       └── active: boolean
│
└── settings/                # Configuración del sitio
    └── site
        ├── shippingEnabled: boolean
        └── shippingCost: number
```

### Funciones Principales

**Archivo**: `lib/firestore.ts`

#### Vinos

```typescript
// Obtener todos los vinos
getAllWines(): Promise<Wine[]>

// Obtener vino por ID
getWineById(id: string): Promise<Wine | null>

// Agregar vino
addWine(wineData): Promise<string | null>

// Actualizar vino
updateWine(id: string, wineData): Promise<boolean>

// Eliminar vino
deleteWine(id: string): Promise<boolean>
```

#### Pedidos

```typescript
// Crear orden
createOrder(orderData): Promise<{success, orderId, orderNumber}>

// Obtener todas las órdenes
getAllOrders(): Promise<Order[]>

// Actualizar estado
updateOrderStatus(orderId, status): Promise<boolean>
```

#### Configuración

```typescript
// Obtener configuración del sitio
getSiteSettings(): Promise<SiteSettings>

// Actualizar configuración
updateSiteSettings(settings): Promise<boolean>
```

### Queries Comunes

#### Filtrar por categoría

```typescript
const winesRef = collection(db, "wines");
const q = query(
  winesRef,
  where("tipo", "==", "Tinto"),
  orderBy("marca")
);
const snapshot = await getDocs(q);
```

#### Obtener destacados

```typescript
const q = query(
  collection(db, "wines"),
  where("featured", "==", true),
  limit(6)
);
```

#### Buscar por precio

```typescript
const q = query(
  collection(db, "wines"),
  where("precio", ">=", 1000),
  where("precio", "<=", 5000)
);
```

## 🔐 Authentication

### Métodos Habilitados

1. **Email/Password** - Login tradicional
2. **Google** - Login con cuenta Google (opcional)

### Funciones de Auth

**Archivo**: `hooks/useAuth.ts`

```typescript
const { 
  user,           // Usuario actual
  loading,        // Estado de carga
  login,          // Iniciar sesión
  logout,         // Cerrar sesión
  signUp,         // Registrarse (deshabilitado)
} = useAuth();
```

### Verificar si es Admin

**Archivo**: `hooks/useIsAdmin.ts`

```typescript
const { isAdmin, isLoading } = useIsAdmin();

// isAdmin = true si el UID está en la lista de admins
```

### Proteger Rutas

```typescript
// pages/admin/index.tsx
useEffect(() => {
  if (!authLoading && !user) {
    router.push("/login");
  }
}, [user, authLoading, router]);
```

## 📁 Storage

### Uso Principal

- Imágenes de vinos
- Imágenes de combos
- Assets del sitio

### Subir Imagen

**Archivo**: `lib/storage.ts`

```typescript
// Subir imagen
uploadImage(file: File): Promise<string>

// Eliminar imagen
deleteImageByUrl(url: string): Promise<void>
```

### Organización

```
storage/
└── wines/
    ├── vino-1-abc123.jpg
    ├── vino-2-def456.jpg
    └── ...
```

### Tamaños Recomendados

- **Vinos**: 500x500px (máx 2MB)
- **Combos**: 800x600px (máx 3MB)
- **Hero**: 1920x1080px (máx 5MB)

## 🔒 Reglas de Seguridad

### Firestore Rules

**Archivo**: `firebase-rules/firestore.rules`

#### Estructura General

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Vinos: lectura pública, escritura admin
    match /wines/{wineId} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // Pedidos: crear público, leer/editar admin
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // Suscriptores: crear público, leer/editar admin
    match /suscriptos/{subscriptionId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // Configuración: leer público, escribir admin
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // Función de admin
    function isAdmin(userId) {
      return userId in [
        "TU-UID-AQUI",  // 👈 Agregar tus UIDs
      ];
    }
  }
}
```

#### Desplegar Reglas

```bash
# Desplegar reglas de Firestore
firebase deploy --only firestore:rules

# Desplegar reglas de Storage
firebase deploy --only storage:rules

# Desplegar todo
firebase deploy
```

### Storage Rules

**Archivo**: `firebase-rules/storage.rules`

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Solo admins pueden subir/eliminar
    match /wines/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📑 Índices

### ¿Qué son los Índices?

Los índices permiten queries complejas (filtros múltiples, ordenamiento).

### Archivo de Índices

**Archivo**: `firestore.indexes.json`

```json
{
  "indexes": [
    {
      "collectionGroup": "wines",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tipo", "order": "ASCENDING" },
        { "fieldPath": "precio", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### Desplegar Índices

```bash
firebase deploy --only firestore:indexes
```

### Crear Índices Automáticamente

Cuando hagas una query que requiere índice:

1. Firebase mostrará error con link
2. Click en el link
3. Crea el índice automáticamente
4. Espera 1-2 minutos
5. Reintenta la query

## 🐛 Troubleshooting

### Error: "Missing or insufficient permissions"

**Problema**: No tienes permiso para leer/escribir

**Solución:**
1. Verifica que las reglas estén desplegadas
2. Si eres admin, verifica tu UID en las reglas
3. Despliega reglas: `firebase deploy --only firestore:rules`
4. Espera 1-2 minutos para que se propague

### Error: "The query requires an index"

**Problema**: La query necesita un índice

**Solución:**
1. Click en el link del error
2. Firebase creará el índice automáticamente
3. O agrégalo manualmente en `firestore.indexes.json`
4. Despliega: `firebase deploy --only firestore:indexes`

### Error: "Firebase: Error (auth/user-not-found)"

**Problema**: Usuario no existe

**Solución:**
1. Verifica que el usuario esté en Firebase Auth
2. Crea el usuario en Firebase Console
3. Verifica el email escrito

### Error: "Storage object not found"

**Problema**: Imagen no existe en Storage

**Solución:**
1. Verifica que la imagen se subió correctamente
2. Verifica la URL de la imagen
3. Verifica permisos de Storage

### Lentitud en Queries

**Problema**: Las consultas son lentas

**Solución:**
1. Crea índices para queries complejas
2. Limita resultados con `limit()`
3. Usa paginación
4. Optimiza estructura de datos

## 📊 Monitoreo

### Firebase Console

**Ir a**: [Firebase Console](https://console.firebase.google.com/)

#### Firestore

- **Datos**: Ver/editar documentos directamente
- **Uso**: Ver lecturas/escrituras
- **Reglas**: Ver/editar reglas

#### Authentication

- **Usuarios**: Lista de usuarios registrados
- **Métodos**: Métodos de login habilitados
- **Plantillas**: Emails de verificación/reset

#### Storage

- **Archivos**: Ver archivos subidos
- **Uso**: Espacio utilizado
- **Reglas**: Ver/editar reglas

### Costos

Firebase tiene **plan gratuito** generoso:

**Firestore**:
- 50,000 lecturas/día
- 20,000 escrituras/día
- 20,000 eliminaciones/día

**Auth**:
- Ilimitado (gratis)

**Storage**:
- 5 GB almacenamiento
- 1 GB descarga/día

**Para más**: [Precios de Firebase](https://firebase.google.com/pricing)

## 🎯 Mejores Prácticas

### Estructura de Datos

1. **Documenta** la estructura de cada colección
2. **Usa tipos** TypeScript
3. **Valida** datos antes de guardar
4. **Normaliza** cuando sea necesario

### Seguridad

1. **Nunca** expongas credenciales privadas
2. **Despliega** reglas en cada cambio
3. **Prueba** reglas antes de producción
4. **Revisa** logs de seguridad

### Performance

1. **Crea índices** para queries complejas
2. **Usa límites** en queries
3. **Implementa paginación**
4. **Cachea** datos cuando sea posible

### Backup

1. **Exporta** datos periódicamente
2. **Documenta** cambios importantes
3. **Ten plan** de recuperación

---

**Anterior**: [`04-MERCADOPAGO.md`](./04-MERCADOPAGO.md)  
**Siguiente**: [`06-FEATURES.md`](./06-FEATURES.md)


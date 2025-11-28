# 🔐 Admin y Autenticación

Guía completa del sistema de administración y autenticación.

## 📋 Tabla de Contenidos

- [Crear Administradores](#crear-administradores)
- [Panel de Administración](#panel-de-administración)
- [Gestión de Vinos](#gestión-de-vinos)
- [Gestión de Combos](#gestión-de-combos)
- [Gestión de Pedidos](#gestión-de-pedidos)
- [Gestión de Suscriptores](#gestión-de-suscriptores)
- [Configuración General](#configuración-general)
- [Troubleshooting](#troubleshooting)

## 🔑 Crear Administradores

### Método 1: Primer Admin (Manual)

#### Paso 1: Crear Usuario en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. **Authentication** → **Users** → **"Add user"**
4. Ingresa email y contraseña
5. **Copia el UID generado**

#### Paso 2: Agregar UID a los Archivos

**Archivo 1:** `hooks/useIsAdmin.ts`

```typescript:7:10
const ADMIN_UIDS = [
  "abc123xyz", // Admin 1
  "def456uvw", // Admin 2
];
```

**Archivo 2:** `firebase-rules/firestore.rules`

```javascript:156:162
function isAdmin(userId) {
  return (
    userId in [
      "abc123xyz", // Admin 1
      "def456uvw", // Admin 2
    ]
  );
}
```

#### Paso 3: Desplegar Reglas

```bash
firebase deploy --only firestore:rules
```

### Método 2: Obtener UID de Usuario Existente

Si ya creaste el usuario pero no copiaste el UID:

```bash
# Opción 1: Usar script
npm run get-admin-uid

# Opción 2: Firebase Console
# Authentication → Users → Click en el usuario → Ver UID
```

### Método 3: Registro desde la App

**Nota**: El registro público está deshabilitado por seguridad. Solo login.

Si quieres habilitar registro:

```typescript
// En components/auth/LoginForm.tsx
// Descomentar sección de registro
```

## 🎛️ Panel de Administración

### Acceso

- **URL**: `http://localhost:3002/admin` (desarrollo)
- **URL**: `https://tu-dominio.com/admin` (producción)
- **Requiere**: Estar autenticado como admin

### Estructura del Panel

El panel tiene 5 pestañas principales:

```
┌──────────────────────────────────────┐
│  🍷 Vinos  │  📦 Combos  │  📧 Suscriptores  │  🛒 Pedidos  │  ⚙️ Otros  │
└──────────────────────────────────────┘
```

#### 1. 🍷 Pestaña Vinos

**Funciones:**
- Ver catálogo completo
- Agregar nuevo vino
- Editar vino existente
- Eliminar vino
- Buscar y filtrar

**Campos del vino:**
- Marca (nombre comercial)
- Bodega (productor)
- Varietal (tipo de uva)
- Tipo (Tinto, Blanco, Rosado, Espumante)
- Vintage (año)
- Precio
- Stock
- Descripción
- Imagen
- Featured (destacado)

#### 2. 📦 Pestaña Combos

**Funciones:**
- Ver combos disponibles
- Crear combo nuevo
- Editar combo
- Eliminar combo

**Componentes de un combo:**
- Nombre
- Lista de vinos incluidos
- Precio especial
- Imagen principal
- Imagen de fondo
- Featured

#### 3. 📧 Pestaña Suscriptores

**Funciones:**
- Ver lista de suscriptores
- Exportar emails
- Eliminar suscriptor
- Ver fecha de suscripción
- Filtrar por activos/inactivos

**Info por suscriptor:**
- Email
- Fecha de suscripción
- Estado (activo/inactivo)

#### 4. 🛒 Pestaña Pedidos

**Funciones:**
- Ver todos los pedidos
- Filtrar por estado
- Ver detalles del pedido
- Actualizar estado
- Ver información de envío

**Estados de pedido:**
- `pending` - Pendiente
- `paid` - Pagado
- `processing` - En proceso
- `shipped` - Enviado
- `delivered` - Entregado
- `cancelled` - Cancelado

**Info por pedido:**
- Número de orden
- Fecha
- Cliente (email/teléfono)
- Productos
- Total
- Costo de envío
- Estado de pago
- Dirección de envío

#### 5. ⚙️ Pestaña Otros

**Funciones:**
- Configurar costo de envío
- Habilitar/deshabilitar envío
- Otras configuraciones del sitio

Ver detalles en [`03-SISTEMA-ENVIO.md`](./03-SISTEMA-ENVIO.md)

## 🍷 Gestión de Vinos

### Agregar Vino Nuevo

1. Admin → Pestaña "🍷 Vinos"
2. Click en "Agregar Vino"
3. Completa el formulario:
   - **Marca** (requerido): Nombre del vino
   - **Bodega** (requerido): Productor
   - **Varietal** (requerido): Tipo de uva
   - **Tipo** (requerido): Categoría
   - **Vintage** (requerido): Año
   - **Precio** (requerido): En pesos argentinos
   - **Stock** (requerido): Cantidad disponible
   - **Descripción**: Texto descriptivo
   - **Imagen**: URL o upload
   - **Featured**: Marcar para destacar

4. Click en "Guardar"

### Editar Vino

1. Busca el vino en la lista
2. Click en "Editar"
3. Modifica los campos necesarios
4. Click en "Guardar"

### Eliminar Vino

1. Busca el vino en la lista
2. Click en "Eliminar"
3. Confirma la acción

**⚠️ Importante**: Esto también elimina la imagen de Firebase Storage.

### Migrar Vinos desde CSV

Si tienes un archivo CSV con vinos:

```bash
# El CSV debe estar en: data/vinosData.csv
npm run migrate-csv
```

**Formato del CSV:**
```csv
marca,bodega,varietal,tipo,vintage,precio,stock,descripcion,image
"Malbec Reserva","Bodega Los Andes","Malbec","Tinto",2021,5000,50,"Excelente malbec","url"
```

## 📦 Gestión de Combos

### Crear Combo

1. Admin → Pestaña "📦 Combos"
2. Click en "Crear Combo"
3. Completa:
   - **Nombre**: Nombre del combo
   - **Vinos**: Selecciona vinos del catálogo
   - **Precio**: Precio especial del combo
   - **Imagen**: Imagen principal
   - **Background**: Imagen de fondo
   - **Featured**: Destacar en home

4. Click en "Guardar"

### Editar/Eliminar Combo

Similar a la gestión de vinos.

## 🛒 Gestión de Pedidos

### Ver Pedidos

1. Admin → Pestaña "🛒 Pedidos"
2. Verás lista ordenada por fecha

### Ver Detalles de Pedido

Click en cualquier pedido para ver:
- Productos comprados
- Cantidades
- Precios
- Total
- Datos de envío
- Método de pago
- Estado de MercadoPago (si aplica)

### Actualizar Estado de Pedido

1. Abre el pedido
2. Cambia el estado en el selector
3. Guarda cambios

### Filtrar Pedidos

Usa los filtros para:
- Ver solo pendientes
- Ver solo pagados
- Ver por rango de fechas

### Ver Datos de Envío

Cada pedido incluye:
- Dirección completa
- Código postal
- Teléfono
- Costo de envío aplicado

**Nota**: Para copiar datos de envío en formato útil, ver [`COMO-VER-DATOS-ENVIO.md`](./COMO-VER-DATOS-ENVIO.md)

## 📧 Gestión de Suscriptores

### Ver Suscriptores

1. Admin → Pestaña "📧 Suscriptores"
2. Verás lista completa con emails y fechas

### Exportar Emails

```javascript
// En la consola del navegador (F12)
const emails = Array.from(document.querySelectorAll('.email-cell'))
  .map(el => el.textContent)
  .join(', ');

console.log(emails);
// Copia el resultado
```

### Eliminar Suscriptor

1. Busca el suscriptor
2. Click en "Eliminar"
3. Confirma

## ⚙️ Configuración General

Ver [`03-SISTEMA-ENVIO.md`](./03-SISTEMA-ENVIO.md) para configuración de envío.

Próximamente: Más opciones de configuración.

## 🔒 Seguridad

### Reglas Implementadas

**Firestore Rules:**
- Solo admins pueden:
  - Modificar vinos
  - Ver/modificar pedidos
  - Ver suscriptores
  - Modificar configuración

- Usuarios públicos pueden:
  - Ver catálogo de vinos
  - Crear pedidos
  - Suscribirse al newsletter

**Autenticación:**
- Email/Password
- Google Sign-in (opcional)
- Reset de contraseña

### Agregar Más Admins

```typescript
// hooks/useIsAdmin.ts
const ADMIN_UIDS = [
  "primer-admin-uid",
  "segundo-admin-uid",
  "tercer-admin-uid",
  // Agrega más aquí
];
```

**No olvides:**
1. Agregar también en `firestore.rules`
2. Desplegar: `firebase deploy --only firestore:rules`

## 🐛 Troubleshooting

### No puedo acceder al admin

**Problema**: "No tienes permisos" o redirect a home

**Solución**:
1. Verifica tu UID en Firebase Console
2. Confirma que está en `useIsAdmin.ts` (línea 7)
3. Confirma que está en `firestore.rules` (línea 158)
4. Despliega reglas: `firebase deploy --only firestore:rules`
5. Cierra sesión y vuelve a entrar

### Error de permisos al guardar

**Problema**: "Missing or insufficient permissions"

**Solución**:
1. Verifica que las reglas de Firestore estén actualizadas
2. Verifica que estés autenticado
3. Revisa la consola del navegador para más detalles

### Los cambios no se guardan

**Problema**: Cambios se pierden al recargar

**Solución**:
1. Verifica conexión a internet
2. Revisa errores en la consola
3. Verifica que Firestore esté correctamente configurado

### No puedo subir imágenes

**Problema**: Error al subir imagen de vino

**Solución**:
1. Verifica reglas de Storage en Firebase
2. Verifica que el archivo sea jpg/png
3. Verifica tamaño (máx recomendado: 5MB)

### Login con Google no funciona

**Problema**: Error al hacer login con Google

**Solución**:
1. Ve a Firebase Console → Authentication → Sign-in method
2. Habilita "Google" si no lo está
3. Configura el dominio autorizado

## 📊 Verificar Setup de Admin

Script para verificar que todo esté configurado:

```bash
npm run verify-admin
```

Este script verifica:
- Variables de entorno
- Conexión a Firebase
- Reglas de Firestore
- Autenticación configurada

## 🎯 Mejores Prácticas

### Gestión de Stock

- Actualiza el stock después de cada venta manual
- Revisa stock regularmente
- Marca como 0 productos temporalmente agotados
- No elimines vinos, mejor marca stock = 0

### Gestión de Pedidos

- Actualiza el estado de los pedidos
- Responde rápido a pedidos pendientes
- Usa "Pago Personalizado" para pagos offline
- Archiva o cancela pedidos viejos

### Seguridad

- No compartas tu contraseña de admin
- Usa contraseñas fuertes
- No agregues UIDs de usuarios no confiables
- Revisa periódicamente la lista de admins

---

**Siguiente**: [`03-SISTEMA-ENVIO.md`](./03-SISTEMA-ENVIO.md) - Configurar costos de envío


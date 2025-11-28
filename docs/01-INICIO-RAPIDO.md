# 🚀 Inicio Rápido - La Pertenencia

Guía para poner en marcha el proyecto en menos de 10 minutos.

## ✅ Pre-requisitos

- Node.js 18+ instalado
- npm o yarn
- Cuenta de Firebase
- Cuenta de MercadoPago (opcional para desarrollo)

## 📦 Instalación

### 1. Clonar y Configurar

```bash
# Instalar dependencias
cd la-pertenencia
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id

# MercadoPago (opcional para desarrollo)
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu-public-key
MERCADOPAGO_ACCESS_TOKEN=tu-access-token
```

**¿Dónde encontrar estas credenciales?**

**Firebase:**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a Configuración del proyecto (⚙️) → General
4. En "Tus apps" → App web → Config

**MercadoPago:**
1. Ve a [MercadoPago Developers](https://www.mercadopago.com/developers)
2. Tus integraciones → Credenciales
3. Usa "Credenciales de prueba" para desarrollo

### 3. Iniciar el Servidor

```bash
npm run dev
```

El sitio estará disponible en: `http://localhost:3002`

## 🔐 Crear tu Primer Usuario Admin

### Paso 1: Crear Usuario en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Users**
4. Haz clic en **"Add user"**
5. Ingresa tu email y contraseña
6. **Copia el UID que se genera** (lo necesitarás en el siguiente paso)

### Paso 2: Agregar UID como Admin

Necesitas agregar tu UID en dos lugares:

**Archivo 1:** `hooks/useIsAdmin.ts`

```typescript
const ADMIN_UIDS = [
  "PEGA-TU-UID-AQUI",  // 👈 Línea 7
];
```

**Archivo 2:** `firebase-rules/firestore.rules`

```javascript
function isAdmin(userId) {
  return (
    userId in [
      "PEGA-TU-UID-AQUI",  // 👈 Línea 158
    ]
  );
}
```

### Paso 3: Desplegar Reglas de Firestore

```bash
# Instala Firebase CLI si no lo tienes
npm install -g firebase-tools

# Login en Firebase
firebase login

# Inicializa el proyecto (solo primera vez)
firebase init

# Despliega las reglas
firebase deploy --only firestore:rules
```

### Paso 4: Probar el Acceso

1. Abre el navegador: `http://localhost:3002/login`
2. Ingresa tu email y contraseña
3. Si todo está bien, serás redirigido a `/admin`
4. Deberías ver el panel con todas las pestañas

## 📊 Configuración Inicial de Firestore

### Crear Colecciones Necesarias

El proyecto necesita estas colecciones en Firestore:

1. `wines` - Catálogo de vinos
2. `combos` - Combos de vinos
3. `orders` - Pedidos
4. `suscriptos` - Suscriptores del newsletter
5. `settings` - Configuración del sitio

### Agregar Datos Iniciales

#### Opción 1: Desde el Admin Panel

1. Ve a `http://localhost:3002/admin`
2. Pestaña "🍷 Vinos" → "Agregar Vino"
3. Llena el formulario y guarda

#### Opción 2: Migrar desde CSV

Si tienes un archivo `data/vinosData.csv`:

```bash
npm run migrate-csv
```

### Configurar Envío (Importante)

1. Ve al admin: `http://localhost:3002/admin`
2. Pestaña **"⚙️ Otros"**
3. En **"💰 Monto de Envío"**: Configura el costo (default: $500)
4. En **"📦 Configuración de Envío"**: Activa/desactiva el switch según necesites

## 🧪 Verificar que Todo Funcione

### Checklist de Verificación

- [ ] El servidor corre en `localhost:3002`
- [ ] Puedo hacer login en `/login`
- [ ] Puedo acceder a `/admin`
- [ ] Veo las pestañas: Vinos, Combos, Suscriptores, Pedidos, Otros
- [ ] Puedo crear un vino de prueba
- [ ] El carrito funciona correctamente
- [ ] Puedo calcular el costo de envío

### Si algo no funciona

**No puedo hacer login:**
→ Verifica que el usuario exista en Firebase Auth

**No puedo acceder al admin:**
→ Verifica que tu UID esté en `useIsAdmin.ts` y en `firestore.rules`

**Error de permisos en Firestore:**
→ Despliega las reglas: `firebase deploy --only firestore:rules`

**MercadoPago no funciona:**
→ Verifica las variables de entorno en `.env.local`

## 🎨 Próximos Pasos

Ahora que el proyecto está funcionando:

1. **Personalizar**: Ajusta colores, textos, imágenes en `/public/images`
2. **Configurar Envío**: Lee [`03-SISTEMA-ENVIO.md`](./03-SISTEMA-ENVIO.md)
3. **Configurar Pagos**: Lee [`04-MERCADOPAGO.md`](./04-MERCADOPAGO.md)
4. **Agregar Vinos**: Usa el panel admin para agregar tu catálogo
5. **Probar Checkout**: Haz una compra de prueba completa

## 📚 Documentación Adicional

- **Admin y Auth**: [`02-ADMIN-AUTH.md`](./02-ADMIN-AUTH.md)
- **Sistema de Envío**: [`03-SISTEMA-ENVIO.md`](./03-SISTEMA-ENVIO.md)
- **MercadoPago**: [`04-MERCADOPAGO.md`](./04-MERCADOPAGO.md)
- **Firebase**: [`05-FIREBASE.md`](./05-FIREBASE.md)
- **Features**: [`06-FEATURES.md`](./06-FEATURES.md)

## 🐛 Problemas Comunes

### Puerto 3002 ocupado

```bash
# Cambiar puerto en package.json:
"dev": "next dev --turbo -p 3003",
```

### Error: Cannot find module

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Firebase no inicializa

```bash
# Verifica que .env.local existe y tiene las variables correctas
cat .env.local

# Verifica que las variables empiezan con NEXT_PUBLIC_
```

### Build errors

```bash
# Limpiar caché
rm -rf .next
npm run build
```

---

**¿Listo?** → Continúa con [`02-ADMIN-AUTH.md`](./02-ADMIN-AUTH.md) para configurar más administradores.


# ✨ Features y Funcionalidades

Guía de features adicionales: Newsletter, Formulario de Contacto, y más.

## 📋 Tabla de Contenidos

- [Newsletter](#newsletter)
- [Formulario de Contacto](#formulario-de-contacto)
- [Carrito de Compras](#carrito-de-compras)
- [Crear Pedido de Prueba](#crear-pedido-de-prueba)
- [Ver Datos de Envío](#ver-datos-de-envío)
- [Otras Funcionalidades](#otras-funcionalidades)

## 📧 Newsletter

### Descripción

Sistema de suscripción al newsletter con almacenamiento en Firestore.

### Ubicación

- **Frontend**: Footer de todas las páginas
- **Componente**: `components/NewsLetterForm.tsx`
- **Admin**: Pestaña "📧 Suscriptores"

### Funcionalidad

#### Para Usuarios

1. Ingresa email en el footer
2. Click en "Suscribirse"
3. Confirmación visual
4. Email guardado en Firestore

#### Para Admins

1. Admin → Pestaña "📧 Suscriptores"
2. Ver lista completa de emails
3. Ver fecha de suscripción
4. Eliminar suscriptores
5. Exportar lista (manual)

### Exportar Emails

**Método 1: Desde la consola del navegador**

```javascript
// En la página de admin, presiona F12
// Pega este código en la consola:

const emails = Array.from(
  document.querySelectorAll('[data-email]')
).map(el => el.textContent);

console.log(emails.join(', '));
// Copia el resultado
```

**Método 2: Desde Firebase Console**

1. Firebase Console → Firestore
2. Colección `suscriptos`
3. Exporta manualmente

**Método 3: Script personalizado**

```typescript
// scripts/export-subscribers.ts
import { getAllNewsletterSubscriptions } from '../lib/firestore';

const subscribers = await getAllNewsletterSubscriptions();
const emails = subscribers.map(s => s.email).join('\n');
console.log(emails);
```

### Estructura de Datos

```typescript
interface NewsletterSubscription {
  id: string;
  email: string;
  subscribedAt: string;  // ISO timestamp
  active: boolean;
}
```

**Firestore**:
```
suscriptos/
  └── [subscriptionId]
      ├── email: "usuario@ejemplo.com"
      ├── subscribedAt: "2025-01-15T10:30:00.000Z"
      └── active: true
```

### Validación

- **Email válido**: Formato correcto
- **No duplicados**: Previene múltiples suscripciones (best effort)
- **Sanitización**: Limpia input del usuario

### Personalización

**Cambiar mensaje de éxito:**

```typescript
// components/NewsLetterForm.tsx
setMessage("¡Gracias por suscribirte!"); // 👈 Edita aquí
```

**Cambiar diseño:**

Edita estilos en `components/NewsLetterForm.tsx`

## 📬 Formulario de Contacto

### Descripción

Formulario de contacto que envía emails usando una API externa.

### Ubicación

- **Página**: `/contacto` (si existe)
- **Componente**: `components/Contacto.tsx`

### Funcionalidad

1. Usuario completa formulario:
   - Nombre
   - Email
   - Teléfono (opcional)
   - Mensaje

2. Click en "Enviar"
3. Se procesa vía API
4. Confirmación al usuario
5. Email enviado al admin

### API Endpoint

**Archivo**: `pages/api/contact.ts`

```typescript
POST /api/contact

Body: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

Response: {
  success: boolean;
  message?: string;
  error?: string;
}
```

### Configuración

Necesitas configurar un servicio de emails:

**Opciones populares:**
1. SendGrid (recomendado)
2. Mailgun
3. Resend
4. Postmark

**Setup con SendGrid:**

```bash
# Instalar
npm install @sendgrid/mail

# Variables de entorno (.env.local)
SENDGRID_API_KEY=tu-api-key
CONTACT_EMAIL=tu@email.com
```

**Código básico:**

```typescript
// pages/api/contact.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: process.env.CONTACT_EMAIL,
  from: 'noreply@tudominio.com',
  subject: `Contacto de ${name}`,
  text: message,
  html: `<strong>${message}</strong>`,
};

await sgMail.send(msg);
```

### Personalización

**Cambiar campos del formulario:**

Edita `components/Contacto.tsx`

**Cambiar destinatario:**

```env
CONTACT_EMAIL=ventas@tudominio.com
```

## 🛒 Carrito de Compras

### Descripción

Carrito lateral con gestión de productos y checkout.

### Ubicación

- **Componente**: `components/Cart.tsx`
- **Store**: `stores/useCartStore.ts`
- **Botón**: Icono en navbar

### Funcionalidades

#### Agregar Productos

```typescript
// En cualquier componente
const { addItem } = useCartStore();

addItem(wine, quantity);
```

#### Ver Carrito

```typescript
const { 
  items,           // Productos en el carrito
  totalItems,      // Cantidad total
  totalAmount,     // Monto total
  isOpen,          // Estado abierto/cerrado
  toggleCart,      // Abrir/cerrar
} = useCartStore();
```

#### Actualizar Cantidad

```typescript
const { updateQuantity } = useCartStore();

updateQuantity(wineId, newQuantity);
```

#### Eliminar Producto

```typescript
const { removeItem } = useCartStore();

removeItem(wineId);
```

#### Vaciar Carrito

```typescript
const { clearCart } = useCartStore();

clearCart();
```

### Flujo de Checkout

Ver [`04-MERCADOPAGO.md`](./04-MERCADOPAGO.md#flujo-de-pago)

### Configuración de Envío

Ver [`03-SISTEMA-ENVIO.md`](./03-SISTEMA-ENVIO.md)

### Persistencia

El carrito se guarda en:
- **LocalStorage**: Persiste entre sesiones
- **Zustand**: Estado global en memoria

### Personalización

**Cambiar diseño:**
Edita `components/Cart.tsx`

**Cambiar animación:**
```typescript
// components/Cart.tsx
transition={{
  duration: 0.3,  // 👈 Cambiar velocidad
  ease: [0.25, 0.46, 0.45, 0.94],
}}
```

## 🧪 Crear Pedido de Prueba

### Para Qué Sirve

Crear pedidos de prueba para:
- Testing del sistema
- Verificar flujo completo
- Probar visualización de pedidos
- Desarrollo sin compras reales

### Método 1: Script Automático

```bash
npm run create-mock-order
```

Este script crea un pedido con:
- Productos aleatorios
- Datos de envío ficticios
- Número de orden único
- Estado: pending

### Método 2: Desde el Carrito

1. Agrega productos al carrito
2. Completa datos de envío
3. Click en "PAGO PERSONALIZADO"
4. Confirma

### Método 3: Manualmente en Firestore

1. Firebase Console → Firestore
2. Colección `orders`
3. Agregar documento
4. Completa campos manualmente

### Estructura de Pedido

```typescript
interface Order {
  id: string;
  orderNumber: string;           // "ORD-1234567890-123"
  items: CartItem[];
  totalAmount: number;
  shippingCost: number;
  finalAmount: number;
  shippingInfo: {
    address: string;
    phone: string;
    postalCode: string;
  };
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "mercadopago" | "custom";
  mercadoPagoData?: {
    preferenceId: string;
    paymentId?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## 📋 Ver Datos de Envío

### Para Copiar Información de Envío

Cuando tienes pedidos y necesitas la información para envío:

**En el Admin:**

1. Admin → Pestaña "🛒 Pedidos"
2. Click en el pedido
3. Verás:
   - Dirección completa
   - Código postal
   - Teléfono
   - Productos y cantidades

**Para copiar formato útil:**

```javascript
// En consola del navegador (F12)
const orders = document.querySelectorAll('.order-item');
orders.forEach(order => {
  const address = order.querySelector('.address').textContent;
  const phone = order.querySelector('.phone').textContent;
  const cp = order.querySelector('.postal-code').textContent;
  console.log(`${address} | CP: ${cp} | Tel: ${phone}`);
});
```

### Exportar a CSV

Próximamente: Exportación directa a CSV de pedidos.

## 🎨 Otras Funcionalidades

### Filtros de Vinos

**Ubicación**: Página `/vinos`

**Filtros disponibles:**
- Por tipo (Tinto, Blanco, Rosado, Espumante)
- Por bodega
- Por varietal
- Por rango de precio
- Búsqueda por nombre

**Componente**: `components/WineFilters.tsx`

### Productos Destacados (Featured)

**Configuración:**
1. Admin → Vinos
2. Editar vino
3. Marcar checkbox "Featured"
4. Aparecerá en home

**Límite**: 6 vinos destacados en home

### Combos de Vinos

**Gestión:**
Ver [`02-ADMIN-AUTH.md`](./02-ADMIN-AUTH.md#gestión-de-combos)

### Notificaciones Visuales

**CartNotification**:
- Aparece al agregar producto
- Desaparece automáticamente
- Muestra nombre y cantidad

**Componente**: `components/CartNotification.tsx`

### Botón Flotante de WhatsApp

**Ubicación**: Esquina inferior derecha

**Configuración:**
```typescript
// components/WhatsAppFloatingButton.tsx
const PHONE_NUMBER = "5491123456789";  // 👈 Tu número
const MESSAGE = "Hola! Tengo una consulta...";  // 👈 Mensaje default
```

**Personalizar:**
- Número de teléfono
- Mensaje predeterminado
- Posición
- Diseño

### Modal de Verificación de Edad

**Para vinos/alcohol:**

Si quieres agregar verificación de edad:

```typescript
// components/AgeVerificationModal.tsx
// Ya existe, solo activar en la página principal
```

## 🔧 Scripts Útiles

### Migrar CSV a Firestore

```bash
npm run migrate-csv
```

Migra vinos desde `data/vinosData.csv` a Firestore.

### Obtener UID de Admin

```bash
npm run get-admin-uid
```

Muestra el UID del usuario autenticado actual.

### Verificar Setup de Admin

```bash
npm run verify-admin
```

Verifica configuración de admin y Firebase.

### Eliminar Todos los Vinos

```bash
# ⚠️ CUIDADO: Esto elimina TODOS los vinos
npm run delete-all-wines
```

## 📊 Futuras Features

Ideas para implementar:

- [ ] Sistema de reviews/calificaciones
- [ ] Wishlist/favoritos
- [ ] Cupones de descuento
- [ ] Envío gratis por monto mínimo
- [ ] Múltiples imágenes por vino
- [ ] Zoom en imágenes
- [ ] Comparador de vinos
- [ ] Blog de vinos
- [ ] Programa de puntos/lealtad
- [ ] Notificaciones push
- [ ] Chat en vivo
- [ ] Seguimiento de envío
- [ ] Stock alerts

---

**Anterior**: [`05-FIREBASE.md`](./05-FIREBASE.md)  
**Inicio**: [`README.md`](./README.md)


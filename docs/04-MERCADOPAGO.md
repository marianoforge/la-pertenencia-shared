# 💳 MercadoPago - Integración de Pagos

Guía completa para configurar y usar MercadoPago en La Pertenencia.

## 📋 Tabla de Contenidos

- [Configuración Inicial](#configuración-inicial)
- [Credenciales](#credenciales)
- [Modo Test vs Producción](#modo-test-vs-producción)
- [Flujo de Pago](#flujo-de-pago)
- [Webhook y Notificaciones](#webhook-y-notificaciones)
- [Troubleshooting](#troubleshooting)

## ⚡ Configuración Inicial

### 1. Crear Cuenta en MercadoPago

1. Ve a [MercadoPago Argentina](https://www.mercadopago.com.ar/)
2. Crea una cuenta si no la tienes
3. Verifica tu identidad (requerido para producción)
4. Completa los datos de tu negocio

### 2. Obtener Credenciales

1. Ve a [MercadoPago Developers](https://www.mercadopago.com/developers)
2. **Tus integraciones** → **Credenciales**
3. Verás dos tipos de credenciales:
   - **Credenciales de prueba** (para desarrollo)
   - **Credenciales de producción** (para producción)

### 3. Configurar Variables de Entorno

Agrega las credenciales en `.env.local`:

```env
# MercadoPago - Credenciales de PRUEBA (desarrollo)
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx

# MercadoPago - Credenciales de PRODUCCIÓN (comentadas por ahora)
# NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx
```

**⚠️ Importante:**
- `NEXT_PUBLIC_*` se expone al cliente (PUBLIC KEY)
- `MERCADOPAGO_ACCESS_TOKEN` es privado (servidor only)
- NO subas estas credenciales a Git

### 4. Reiniciar Servidor

```bash
# Detén el servidor (Ctrl+C)
# Reinicia
npm run dev
```

## 🔑 Credenciales

### Tipos de Credenciales

#### Public Key
- **Prefijo Test**: `TEST-`
- **Prefijo Producción**: `APP_USR-`
- **Uso**: Cliente (frontend)
- **Variable**: `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- **Se expone**: Sí (público)

#### Access Token
- **Prefijo Test**: `TEST-`
- **Prefijo Producción**: `APP_USR-`
- **Uso**: Servidor (backend)
- **Variable**: `MERCADOPAGO_ACCESS_TOKEN`
- **Se expone**: No (privado)

### Dónde Encontrarlas

```
1. Ve a https://www.mercadopago.com/developers
2. Tus integraciones
3. Nombre de tu aplicación
4. Credenciales

Verás:
├── Credenciales de prueba
│   ├── Public Key: TEST-xxxxx
│   └── Access Token: TEST-xxxxx
│
└── Credenciales de producción
    ├── Public Key: APP_USR-xxxxx
    └── Access Token: APP_USR-xxxxx
```

## 🧪 Modo Test vs Producción

### Modo Test (Desarrollo)

**Características:**
- NO se cobra dinero real
- Usa tarjetas de prueba
- Ideal para desarrollo
- Sin riesgo

**Tarjetas de Prueba:**

| Tipo | Número | CVV | Fecha | Resultado |
|------|--------|-----|-------|-----------|
| Mastercard | 5031 7557 3453 0604 | 123 | 11/25 | Aprobado |
| Visa | 4509 9535 6623 3704 | 123 | 11/25 | Aprobado |
| Rechazada | 5031 4332 1540 6351 | 123 | 11/25 | Rechazado |

**Más tarjetas**: [Tarjetas de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards)

### Modo Producción

**Requisitos:**
- ✅ Cuenta verificada
- ✅ Datos de negocio completos
- ✅ Certificado SSL (HTTPS)
- ✅ Términos y condiciones aceptados

**Para cambiar a producción:**

1. **Obtén credenciales de producción**
2. **Actualiza `.env.local`**:
   ```env
   # Comenta las de test
   # NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-...
   # MERCADOPAGO_ACCESS_TOKEN=TEST-...
   
   # Activa las de producción
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
   ```
3. **Reinicia el servidor**
4. **Prueba con compra pequeña real**
5. **Verifica que llegue el dinero**

**⚠️ Importante en Producción:**
- Los pagos son reales
- Las comisiones se aplican
- Necesitas HTTPS (no funciona en localhost)
- Debes tener webhook configurado

## 🛒 Flujo de Pago

### Desde el Carrito

```
1. Usuario agrega productos al carrito
   ↓
2. Ingresa dirección y código postal
   ↓
3. Calcula costo de envío
   ↓
4. Click en "PAGAR CON MERCADO PAGO"
   ↓
5. Se crea preferencia de pago (backend)
   ↓
6. Se guarda orden en Firestore (estado: pending)
   ↓
7. Redirección a MercadoPago
   ↓
8. Usuario completa pago
   ↓
9. MercadoPago redirige de vuelta
   ↓
10. Página de éxito/fracaso
```

### Preferencia de Pago

**Qué incluye:**
- Lista de productos con precios
- Costo de envío
- Total
- URLs de retorno (success, failure, pending)
- Información del comprador (opcional)

**Código simplificado:**
```typescript
// pages/api/mercadopago/create-preference.ts
const preference = {
  items: [...products],
  shipments: {
    cost: shippingCost,
    mode: "not_specified",
  },
  back_urls: {
    success: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    failure: `${process.env.NEXT_PUBLIC_URL}/payment/failure`,
    pending: `${process.env.NEXT_PUBLIC_URL}/payment/pending`,
  },
  auto_return: "approved",
};
```

### Estados de Pago

| Estado | Significado | Acción |
|--------|-------------|--------|
| `approved` | Pago aprobado | Procesar pedido |
| `pending` | Pago pendiente | Esperar confirmación |
| `rejected` | Pago rechazado | Notificar usuario |
| `in_process` | En proceso | Esperar |
| `cancelled` | Cancelado | Cancelar pedido |

## 🔔 Webhook y Notificaciones

### ¿Qué es un Webhook?

Un webhook es una URL que MercadoPago llama automáticamente cuando cambia el estado de un pago.

### Configurar Webhook

1. Ve a [MercadoPago Developers](https://www.mercadopago.com/developers)
2. **Tus integraciones** → Tu aplicación
3. **Webhooks**
4. Agrega URL: `https://tu-dominio.com/api/mercadopago/webhook`

**Eventos a escuchar:**
- `payment` - Cambio en estado de pago
- `merchant_order` - Cambio en orden

### Implementación del Webhook

**Archivo**: `pages/api/mercadopago/webhook.ts`

```typescript
// Recibe notificación de MercadoPago
POST /api/mercadopago/webhook

// Verifica el tipo de notificación
if (type === "payment") {
  // Obtiene info del pago
  const payment = await getPaymentInfo(id);
  
  // Actualiza estado de la orden en Firestore
  await updateOrderStatus(orderId, payment.status);
}
```

### Testing del Webhook

**En desarrollo (localhost):**

Usa [ngrok](https://ngrok.com/) para exponer tu localhost:

```bash
# Instala ngrok
npm install -g ngrok

# Expone puerto 3002
ngrok http 3002

# Usa la URL generada en webhook
https://xxxx.ngrok.io/api/mercadopago/webhook
```

## 💰 Comisiones y Costos

### Estructura de Comisiones (Argentina)

**Checkout Pro** (nuestro caso):
- Tarjeta de crédito: ~3.99% + $X fijo
- Tarjeta de débito: ~X%
- Transferencia: X%

**Nota**: Las comisiones varían. Verifica en tu cuenta de MercadoPago.

### Cómo se Acredita el Dinero

1. **Compra aprobada**: El dinero queda en tu cuenta de MercadoPago
2. **Disponible**: Según el medio de pago (inmediato o días)
3. **Transferencia**: Puedes transferir a tu cuenta bancaria

## 🎨 Personalización

### Botón de Pago

**Actual:**
```typescript
<Button onClick={handleMercadoPagoCheckout}>
  PAGAR CON MERCADO PAGO
</Button>
```

**Personalizar texto:**
```typescript
<Button onClick={handleMercadoPagoCheckout}>
  FINALIZAR COMPRA
</Button>
```

### URLs de Retorno

**Editar en**: `pages/api/mercadopago/create-preference.ts`

```typescript
back_urls: {
  success: `${baseUrl}/payment/success?order=${orderId}`,
  failure: `${baseUrl}/payment/failure`,
  pending: `${baseUrl}/payment/pending`,
}
```

### Páginas de Resultado

- `pages/payment/success.tsx` - Pago exitoso
- `pages/payment/failure.tsx` - Pago fallido
- `pages/payment/pending.tsx` - Pago pendiente

Personaliza estas páginas según tu marca.

## 🐛 Troubleshooting

### Error: "Invalid credentials"

**Problema**: Las credenciales no son válidas

**Solución:**
1. Verifica que copiaste bien las credenciales
2. Verifica que sean del mismo entorno (test o producción)
3. Verifica que no tengan espacios al inicio/final
4. Reinicia el servidor después de cambiar `.env.local`

### Error: "Cannot create preference"

**Problema**: No se puede crear la preferencia de pago

**Solución:**
1. Verifica que `MERCADOPAGO_ACCESS_TOKEN` esté configurado
2. Verifica que sea el Access Token correcto (no Public Key)
3. Revisa la consola del servidor para más detalles
4. Verifica que los productos tengan precios válidos

### El pago se aprueba pero no actualiza en Firestore

**Problema**: Webhook no está funcionando

**Solución:**
1. Verifica que el webhook esté configurado en MercadoPago
2. Verifica que la URL sea accesible (HTTPS)
3. En desarrollo, usa ngrok
4. Revisa logs del servidor
5. Verifica que la orden se haya creado en Firestore

### Error: "Missing HTTPS"

**Problema**: MercadoPago requiere HTTPS en producción

**Solución:**
1. MercadoPago NO funciona con HTTP en producción
2. Necesitas certificado SSL
3. Usa servicios como:
   - Vercel (SSL automático)
   - Netlify (SSL automático)
   - Firebase Hosting (SSL automático)

### El botón no redirige

**Problema**: Click en "Pagar con MercadoPago" no hace nada

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` esté configurado
4. Verifica que todos los campos estén completos (dirección, teléfono, CP)
5. Verifica que el costo de envío esté calculado

### Pago de prueba no funciona

**Problema**: Tarjeta de prueba no es aceptada

**Solución:**
1. Verifica que uses credenciales de TEST
2. Usa las tarjetas oficiales de prueba
3. Verifica fecha de vencimiento (debe ser futura)
4. Usa CVV 123
5. Usa cualquier nombre

## 📊 Ver Pagos en MercadoPago

### Panel de MercadoPago

1. Ve a [MercadoPago](https://www.mercadopago.com.ar/)
2. Inicia sesión
3. **Ventas y cobranzas** o **Actividad**
4. Verás lista de transacciones

### Información Disponible

Para cada pago verás:
- Monto
- Estado
- Fecha
- Comprador
- Método de pago
- Comisión
- Neto a cobrar

## 🔒 Seguridad

### Buenas Prácticas

1. **Nunca expongas** el Access Token en el frontend
2. **Usa HTTPS** en producción
3. **Valida** los datos del webhook
4. **Verifica** que el pago realmente exista
5. **Registra** todas las transacciones

### Variables de Entorno

```env
# ✅ CORRECTO
MERCADOPAGO_ACCESS_TOKEN=xxx  # Privado

# ❌ INCORRECTO  
NEXT_PUBLIC_MERCADOPAGO_ACCESS_TOKEN=xxx  # NO expongas esto
```

## 🎯 Mejores Prácticas

### Testing

1. **Siempre prueba** con credenciales de test primero
2. **Verifica** todas las tarjetas de prueba
3. **Prueba** casos de error (tarjeta rechazada)
4. **Valida** los montos correctos

### Producción

1. **Comienza** con un monto pequeño
2. **Monitorea** los primeros pagos
3. **Configura** notificaciones por email
4. **Ten** un proceso para reembolsos

### Soporte al Cliente

1. **Explica** el proceso de pago claramente
2. **Ofrece** métodos alternativos (Pago Personalizado)
3. **Responde** rápido a problemas de pago
4. **Mantén** registros de todas las transacciones

---

**Anterior**: [`03-SISTEMA-ENVIO.md`](./03-SISTEMA-ENVIO.md)  
**Siguiente**: [`05-FIREBASE.md`](./05-FIREBASE.md)


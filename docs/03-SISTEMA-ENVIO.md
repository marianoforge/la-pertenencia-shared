# 📦 Sistema de Envío

Guía completa del sistema de configuración de costos de envío.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Configuración Rápida](#configuración-rápida)
- [Configurar Monto de Envío](#configurar-monto-de-envío)
- [Habilitar/Deshabilitar Envío](#habilitardeshabilitar-envío)
- [Cómo Funciona](#cómo-funciona)
- [Casos de Uso](#casos-de-uso)
- [Troubleshooting](#troubleshooting)

## 🎯 Descripción General

El sistema de envío permite:

1. **Configurar un costo fijo único** para todos los pedidos
2. **Habilitar/deshabilitar** el cobro de envío con un switch
3. **Cambiar el monto** cuando quieras sin tocar código
4. **Mostrar "Envío Gratis"** cuando está deshabilitado

### Características

- ✅ Costo único fijo (no por zonas)
- ✅ Configurable desde el admin
- ✅ Switch on/off instantáneo
- ✅ Cambios en tiempo real
- ✅ Sin necesidad de recargar la página

## ⚡ Configuración Rápida

### 1. Acceder a la Configuración

```
1. Ir a http://localhost:3002/admin
2. Hacer login como admin
3. Click en pestaña "⚙️ Otros"
```

### 2. Configurar el Monto

```
En la sección "💰 Monto de Envío":
1. Ingresa el costo deseado (ej: 800)
2. Click en "Guardar"
3. ✅ Listo!
```

### 3. Activar/Desactivar

```
En la sección "📦 Configuración de Envío":
1. Usa el switch para activar/desactivar
2. Los cambios son automáticos
```

## 💰 Configurar Monto de Envío

### Interfaz en el Admin

En la pestaña "⚙️ Otros" verás:

```
┌────────────────────────────────────┐
│  💰 Monto de Envío                 │
│                                    │
│  Configura el costo único de       │
│  envío que se aplicará a todos     │
│  los pedidos.                      │
│                                    │
│  Costo de envío ($)                │
│  [  500  ]  [Guardar]              │
│                                    │
│  ● Costo actual: $500              │
└────────────────────────────────────┘
```

### Cambiar el Monto

**Paso a paso:**

1. **Ve al input** de "Costo de envío"
2. **Ingresa el nuevo valor** (solo números)
   - Para $500 → ingresa `500`
   - Para $1000 → ingresa `1000`
   - Para $750 → ingresa `750`
3. **Click en "Guardar"**
4. **Verás confirmación**: "Costo de envío actualizado a $XXX"

**El botón "Guardar":**
- Se deshabilita si no hay cambios
- Se habilita cuando modificas el valor
- Muestra "Guardando..." mientras procesa

### Valores Recomendados

**Por tipo de negocio:**

| Tipo de negocio | Costo sugerido | Notas |
|----------------|----------------|-------|
| Emprendimiento | $500 - $800 | Balance accesible |
| Tienda establecida | $800 - $1500 | Costo real de logística |
| Premium | $1500+ | Incluir packaging especial |

**Por estrategia:**

- **Envío accesible**: $500
- **Cubrir costos**: $800-1000
- **Con margen**: $1200-1500
- **Premium**: $1500+

## 🔄 Habilitar/Deshabilitar Envío

### Interfaz del Switch

```
┌────────────────────────────────────┐
│  📦 Configuración de Envío         │
│  ┌──────────────────────────────┐  │
│  │  Costo de Envío              │  │
│  │                              │  │
│  │  El costo está habilitado    │  │
│  │  Se cobrará $500             │  │
│  │                              │  │
│  │  [●────] Switch → ON/OFF     │  │
│  │                              │  │
│  │  ● Estado: Cobrando $500     │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

### Estados del Switch

**🟢 ACTIVADO (verde)**
- Texto: "Costo de envío activo"
- Estado: "Cobrando envío fijo de $XXX"
- Carrito: Muestra el costo configurado
- Color: Verde con punto animado

**🔵 DESACTIVADO (azul/gris)**
- Texto: "Envío gratis activo"
- Estado: "Envío gratis para todos los pedidos"
- Carrito: Muestra "Envío Gratis" en verde
- Color: Azul con punto animado

### Cambiar Estado

**Para cobrar envío:**
```
1. Activa el switch (debe ponerse verde)
2. Confirmación automática
3. El carrito mostrará el costo
```

**Para envío gratis:**
```
1. Desactiva el switch
2. Confirmación automática
3. El carrito mostrará "Envío Gratis"
```

## 🔧 Cómo Funciona

### Flujo Técnico

```
1. Admin modifica configuración
   ↓
2. Se guarda en Firestore (settings/site)
   ↓
3. Usuario abre carrito
   ↓
4. Carrito lee configuración
   ↓
5. Aplica lógica:
   - Si shippingEnabled=false → "Envío Gratis" ($0)
   - Si shippingEnabled=true → Monto configurado
```

### Estructura en Firestore

**Colección:** `settings`  
**Documento:** `site`

```json
{
  "shippingEnabled": true,
  "shippingCost": 500
}
```

**Valores por defecto:**
- `shippingEnabled`: `true`
- `shippingCost`: `500`

### Visualización en el Carrito

**Con envío habilitado ($500):**
```
Productos: $15,000
Costo de Envío: $500
────────────────────
Total: $15,500
```

**Con envío deshabilitado:**
```
Productos: $15,000
Costo de Envío: Envío Gratis ✨ (verde)
────────────────────
Total: $15,000
```

## 💡 Casos de Uso

### Caso 1: Promoción de Envío Gratis

**Escenario**: Black Friday con envío gratis

```
1. Ve a Admin → Otros
2. Desactiva el switch de envío
3. Los clientes verán "Envío Gratis"
4. Después del evento, reactiva el switch
```

**Duración**: Instantáneo, sin downtime

### Caso 2: Ajuste por Inflación

**Escenario**: Los costos logísticos aumentaron

```
1. Ve a Admin → Otros → Monto de Envío
2. Cambia de $500 a $700
3. Guarda
4. Todos los pedidos nuevos tendrán el nuevo costo
```

**Tiempo**: 10 segundos

### Caso 3: Envío Rebajado Temporal

**Escenario**: Promoción de fin de semana

```
1. Anota el costo actual (ej: $800)
2. Cambia a $400 (50% off)
3. Guarda
4. Después de la promo, vuelve a $800
```

### Caso 4: Testing de Checkout

**Escenario**: Probar el flujo de compra

```
1. Desactiva el envío (gratis)
2. Realiza compras de prueba
3. Reactiva cuando termines
```

### Caso 5: Envío Gratis en Compras Grandes

**Manual** (requiere revisión de pedido):
```
1. Cliente hace pedido grande
2. En admin, procesa como "Pago Personalizado"
3. Ajusta el monto manualmente sin envío
```

**Futuro** (automático con monto mínimo):
- Próxima feature: Envío gratis automático en compras > X

## 📊 Datos e Insights

### Código Postal

**Nota importante**: El código postal sigue siendo requerido para:
- Datos de entrega
- Información de envío
- Registro de pedido

**Pero NO afecta**: El costo (ya no se calcula por zonas)

### Cambios desde v1.0

**Antes (v1.0)**:
- ❌ Costo por zonas de CP
  - CP 1000-1439: $100
  - CP 1600-1670: $200
  - CP 1672-1778: $300
  - CP 1800-1899: $400
  - Otros: Error "fuera de zona"

**Ahora (v2.0)**:
- ✅ Costo único fijo
- ✅ Configurable desde admin
- ✅ Sin restricciones de zona
- ✅ Sin errores de "fuera de zona"

### Ventajas del Sistema Actual

1. **Simplicidad**: Un solo costo para todos
2. **Flexibilidad**: Cambia cuando quieras
3. **Sin sorpresas**: No hay zonas ni restricciones
4. **Transparencia**: Clientes saben el costo de antemano
5. **Control total**: Todo desde el admin

## 🐛 Troubleshooting

### El input no guarda el valor

**Síntoma**: El valor vuelve al anterior después de guardar

**Posibles causas:**
- No presionaste "Guardar"
- No tienes permisos de admin
- Error de conexión

**Solución:**
1. Verifica que el botón "Guardar" esté habilitado
2. Revisa la consola del navegador (F12)
3. Asegúrate de estar autenticado como admin
4. Verifica conexión a internet

### El carrito muestra un costo incorrecto

**Síntoma**: El costo en el carrito no coincide con el admin

**Solución:**
1. Recarga completamente la página (Ctrl+Shift+R o Cmd+Shift+R)
2. Verifica en Firebase Console: `settings/site/shippingCost`
3. Verifica que no haya caché del navegador
4. Calcula el envío nuevamente

### El switch no cambia el estado

**Síntoma**: El switch vuelve a su posición anterior

**Solución:**
1. Verifica permisos de admin
2. Revisa la consola para errores
3. Verifica las reglas de Firestore
4. Recarga la página

### Error: "Cannot read properties of undefined"

**Síntoma**: Error en la consola del navegador

**Solución:**
Este error ya está solucionado en la versión actual. Si lo ves:
1. Asegúrate de tener la última versión del código
2. Limpia caché: `rm -rf .next && npm run dev`

### Los cambios no se reflejan en el carrito

**Síntoma**: Cambios en admin pero carrito muestra valor antiguo

**Solución:**
1. El carrito carga la config al abrirse
2. Cierra y vuelve a abrir el carrito
3. O recarga la página completamente

## ⚙️ Configuración Avanzada

### Reglas de Firestore

El sistema necesita estas reglas (ya incluidas):

```javascript
match /settings/{settingId} {
  // Lectura pública (carrito necesita leer)
  allow read: if true;
  
  // Escritura solo admins
  allow write: if request.auth != null 
    && isAdmin(request.auth.uid);
}
```

### Verificar Configuración

**En Firebase Console:**
```
1. Ve a Firestore Database
2. Busca colección "settings"
3. Documento "site"
4. Verifica campos:
   - shippingEnabled: true/false
   - shippingCost: number
```

**Desde el código:**
```typescript
// En lib/firestore.ts
export const getSiteSettings = async (): Promise<SiteSettings>
```

## 🎯 Mejores Prácticas

### Gestión del Costo

- **Revisa costos** logísticos periódicamente
- **Ajusta el precio** según inflación
- **Comunica cambios** a tus clientes
- **Documenta** el costo actual para referencia

### Promociones

- **Planifica** promociones con anticipación
- **Usa el switch** para envío gratis temporal
- **No olvides** reactivar después del evento
- **Mide impacto** en ventas

### Comunicación

- **Informa** el costo de envío claramente
- **Explica** las condiciones
- **Considera** envío gratis en montos mínimos
- **Sé transparente** con tus clientes

---

**Anterior**: [`02-ADMIN-AUTH.md`](./02-ADMIN-AUTH.md)  
**Siguiente**: [`04-MERCADOPAGO.md`](./04-MERCADOPAGO.md)


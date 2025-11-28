# 📚 Documentación La Pertenencia

Documentación técnica completa del proyecto La Pertenencia - E-commerce de vinos.

## 🚀 Inicio Rápido

**¿Primera vez aquí?** → Lee [`01-INICIO-RAPIDO.md`](./01-INICIO-RAPIDO.md)

## 📖 Índice de Documentación

### Guías Principales

1. **[Inicio Rápido](./01-INICIO-RAPIDO.md)** - Setup inicial y primeros pasos
2. **[Admin y Autenticación](./02-ADMIN-AUTH.md)** - Sistema de administración y usuarios
3. **[Sistema de Envío](./03-SISTEMA-ENVIO.md)** - Configuración de costos de envío
4. **[MercadoPago](./04-MERCADOPAGO.md)** - Integración de pagos
5. **[Firebase](./05-FIREBASE.md)** - Base de datos y configuración
6. **[Features](./06-FEATURES.md)** - Newsletter, contacto, y otras funcionalidades

### Referencia Rápida

| Tema | Documento | Para qué sirve |
|------|-----------|----------------|
| Setup inicial | `01-INICIO-RAPIDO.md` | Poner el proyecto en marcha |
| Admin | `02-ADMIN-AUTH.md` | Gestionar vinos, pedidos, suscriptores |
| Envíos | `03-SISTEMA-ENVIO.md` | Configurar costos de envío |
| Pagos | `04-MERCADOPAGO.md` | Procesar pagos online |
| Base de datos | `05-FIREBASE.md` | Firestore, reglas, índices |
| Extras | `06-FEATURES.md` | Newsletter, formularios, etc. |

## 🎯 Por Caso de Uso

### Quiero configurar el proyecto por primera vez
→ Lee `01-INICIO-RAPIDO.md`

### Necesito crear un administrador
→ Ve a `02-ADMIN-AUTH.md` → Sección "Crear Primer Admin"

### Quiero cambiar el costo de envío
→ Ve a `03-SISTEMA-ENVIO.md` → Sección "Configurar Monto"

### Tengo un error con MercadoPago
→ Ve a `04-MERCADOPAGO.md` → Sección "Troubleshooting"

### Necesito actualizar reglas de Firestore
→ Ve a `05-FIREBASE.md` → Sección "Reglas de Seguridad"

### Quiero agregar un suscriptor manualmente
→ Ve a `06-FEATURES.md` → Sección "Newsletter"

## 🏗️ Arquitectura del Proyecto

```
la-pertenencia/
├── components/        # Componentes React
│   ├── admin/        # Panel de administración
│   ├── auth/         # Login y autenticación
│   └── ui/           # Componentes reutilizables
├── pages/            # Rutas Next.js
│   ├── admin/        # /admin
│   ├── api/          # API routes
│   └── ...
├── lib/              # Utilidades y configuración
│   ├── firebase.ts   # Config de Firebase
│   ├── firestore.ts  # Funciones de Firestore
│   └── mercadopago.ts# Config de MercadoPago
├── hooks/            # React hooks personalizados
├── stores/           # Estado global (Zustand)
├── types/            # TypeScript types
└── docs/             # Esta documentación
```

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15.3.1 (Pages Router)
- **UI**: React 19 + Tailwind CSS + HeroUI
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Pagos**: MercadoPago
- **Estado**: Zustand + TanStack Query
- **Lenguaje**: TypeScript

## 📝 Notas Importantes

### Reglas de Firestore
⚠️ **Importante**: Cada vez que cambies `firebase-rules/firestore.rules`, debes desplegarlo:
```bash
firebase deploy --only firestore:rules
```

### Variables de Entorno
Necesitas crear `.env.local` con:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# MercadoPago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=...
MERCADOPAGO_ACCESS_TOKEN=...
```

### Comandos Útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor en http://localhost:3002

# Build
npm run build        # Compila para producción
npm start            # Inicia servidor de producción

# Linting
npm run lint         # Verifica código

# Firebase
firebase deploy --only firestore:rules    # Despliega reglas
firebase deploy --only firestore:indexes  # Despliega índices

# Scripts personalizados
npm run migrate-csv              # Migra CSV a Firestore
npm run get-admin-uid            # Obtiene UID de admin
npm run verify-admin             # Verifica setup de admin
```

## 🐛 Troubleshooting

### El admin no tiene acceso
1. Verifica que tu UID esté en `hooks/useIsAdmin.ts`
2. Verifica que tu UID esté en `firebase-rules/firestore.rules`
3. Despliega las reglas: `firebase deploy --only firestore:rules`

### Error de permisos en Firestore
1. Verifica las reglas en Firebase Console
2. Asegúrate de estar autenticado
3. Verifica que los índices estén creados

### MercadoPago no funciona
1. Verifica las variables de entorno
2. Asegúrate de usar las credenciales correctas (test/prod)
3. Revisa la consola del navegador para errores

### El envío no calcula correctamente
1. Ve al admin → Pestaña "Otros"
2. Verifica el costo configurado
3. Verifica que el switch esté activado/desactivado según necesites

## 📞 Soporte

Si encuentras un problema que no está documentado:

1. Revisa la documentación específica del tema
2. Verifica la consola del navegador (F12)
3. Revisa los logs del servidor
4. Busca en los archivos de troubleshooting de cada tema

## 🔄 Mantener la Documentación Actualizada

Esta documentación está organizada en 6 archivos principales para facilitar el mantenimiento:

- Cada archivo cubre un tema específico
- Los duplicados y archivos obsoletos fueron consolidados
- Usa el índice de arriba para navegar rápidamente

---

**Última actualización**: Noviembre 2025  
**Versión del proyecto**: 2.0.0


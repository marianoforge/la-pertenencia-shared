/**
 * @deprecated Este archivo se mantiene solo para compatibilidad hacia atrás.
 * Por favor, importa directamente desde lib/firestore/wines, lib/firestore/orders, etc.
 * 
 * Este archivo será eliminado en una versión futura.
 */

// Re-exportar todo desde los nuevos módulos
export * from "./firestore/wines";
export * from "./firestore/orders";
export * from "./firestore/newsletter";
export * from "./firestore/settings";

// Re-exportar tipos
export type { NewsletterSubscription } from "./firestore/newsletter";
export type { SiteSettings } from "./firestore/settings";

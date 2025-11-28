export const QUERY_CONFIG = {
  STALE_TIME: {
    SHORT: 1 * 60 * 1000,
    MEDIUM: 2 * 60 * 1000,
    LONG: 5 * 60 * 1000,
  },
  RETRY: {
    DEFAULT: 3,
    SHORT: 2,
  },
  RETRY_DELAY: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

export const PLACEHOLDER_IMAGES = {
  WINE: "/images/wine-placeholder.svg",
  DEFAULT: "/images/wine-placeholder.jpg",
} as const;

export const QUANTITY_LIMITS = {
  MIN: 1,
  MAX: 99,
} as const;

export const SHARED_STYLES = {
  DIVIDER: "h-0 outline outline-[0.50px] outline-offset-[-0.25px]",
  DIVIDER_NEUTRAL: "outline-neutral-400",
  DIVIDER_YELLOW: "outline-yellow-700",
  CARD_CONTAINER: "bg-white rounded-lg overflow-hidden",
  FONT_LORA: "font-['Lora']",
  UPPERCASE_TITLE: "uppercase tracking-[4px] font-semibold",
  PRICE_TEXT: "text-3xl font-medium tracking-wider",
} as const;

export const ICONS = {
  CART: "/icons/Add carrito.svg",
  WHATSAPP: "/icons/wapp_icon.svg",
  FACEBOOK: "/icons/ICO FB.svg",
  INSTAGRAM: "/icons/ICON IG.svg",
  TWITTER: "/icons/ICON X.svg",
  YOUTUBE: "/icons/ICON YT.svg",
  CALENDAR: "/icons/ICON_Fecha.svg",
  CLOCK: "/icons/ICON_hora.svg",
  LOCATION: "/icons/ICON_lugar.svg",
} as const;

export const ICON_FILTERS = {
  GOLD: "brightness(0) saturate(100%) invert(71%) sepia(83%) saturate(1392%) hue-rotate(4deg) brightness(103%) contrast(103%)",
} as const;

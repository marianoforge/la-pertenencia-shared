export const themeColors = {
  // Colores puros
  negroPuro: "#000000",
  blancoPuro: "#FFFFFF",

  // Colores base
  negroBase: "#111111",
  blancoBg: "#FAFAFA",

  // Escala de grises
  gris90: "#292929",
  grisBg: "#F5F5F5",
  gris60: "#707070",
  gris30: "#A6A6A6",

  // Colores dorados (primarios)
  doradoLight: "#FEBB41",
  doradoDark: "#9B6502",
} as const;

export const typography = {
  // Typography specifications from design system
  h1: {
    fontSize: "32px",
    fontWeight: "400", // Regular
    lineHeight: "auto",
    letterSpacing: "0.5em", // 50%
    textTransform: "uppercase",
    fontFamily: "Lora",
  },
  h2: {
    fontSize: "20px",
    fontWeight: "500", // Medium
    lineHeight: "auto",
    letterSpacing: "0.5em", // 50%
    textTransform: "uppercase",
    fontFamily: "Lora",
  },
  h3: {
    fontSize: "40px",
    fontWeight: "500", // Medium
    lineHeight: "auto",
    letterSpacing: "0.25em", // 25%
    fontFamily: "Lora",
  },
  heroParagraph: {
    fontSize: "20px",
    fontWeight: "600", // Semibold
    lineHeight: "32px",
    letterSpacing: "0.02em", // 2%
    fontStyle: "italic",
    fontFamily: "Lora",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600", // Semi Bold
    lineHeight: "auto",
    letterSpacing: "0.25em", // 25%
    textTransform: "uppercase",
    fontFamily: "Lora",
  },
  cardSubtitle: {
    fontSize: "16px",
    fontWeight: "500", // Medium
    lineHeight: "auto",
    letterSpacing: "0.25em", // 25%
    fontStyle: "italic",
    fontFamily: "Lora",
  },
  cardParagraph: {
    fontSize: "16px",
    fontWeight: "400", // Regular
    lineHeight: "auto",
    letterSpacing: "0.05em", // 5%
    fontStyle: "italic",
    fontFamily: "Lora",
  },
  cardPrice: {
    fontSize: "32px",
    fontWeight: "500", // Medium
    lineHeight: "auto",
    letterSpacing: "0.05em", // 5%
    fontFamily: "Lora",
  },
  button: {
    fontSize: "16px",
    fontWeight: "500", // Medium
    lineHeight: "auto",
    letterSpacing: "0.5em", // 50%
    textTransform: "uppercase",
    fontFamily: "Lora",
  },
  input: {
    fontSize: "16px",
    fontWeight: "400", // Regular
    lineHeight: "auto",
    letterSpacing: "0.05em", // 5%
    fontFamily: "Lora",
  },
} as const;

export const lightTheme = {
  background: themeColors.blancoBg,
  foreground: themeColors.negroBase,
  primary: themeColors.doradoLight,
  primaryForeground: themeColors.negroPuro,
  secondary: themeColors.grisBg,
  secondaryForeground: themeColors.gris90,
  accent: themeColors.doradoDark,
  accentForeground: themeColors.blancoPuro,
  muted: themeColors.grisBg,
  mutedforeground: themeColors.gris60,
  card: themeColors.blancoPuro,
  cardForeground: themeColors.negroBase,
  border: themeColors.gris30,
  input: themeColors.grisBg,
  ring: themeColors.doradoLight,
} as const;

export const darkTheme = {
  background: themeColors.negroBase,
  foreground: themeColors.blancoBg,
  primary: themeColors.doradoLight,
  primaryForeground: themeColors.negroPuro,
  secondary: themeColors.gris90,
  secondaryForeground: themeColors.grisBg,
  accent: themeColors.doradoDark,
  accentForeground: themeColors.blancoPuro,
  muted: themeColors.gris90,
  mutedForeground: themeColors.gris30,
  card: themeColors.negroPuro,
  cardForeground: themeColors.blancoBg,
  border: themeColors.gris60,
  input: themeColors.gris90,
  ring: themeColors.doradoLight,
} as const;

export type ThemeColors = typeof themeColors;
export type Typography = typeof typography;
export type LightTheme = typeof lightTheme;
export type DarkTheme = typeof darkTheme;

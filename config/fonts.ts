import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Lora,
} from "next/font/google";

// Lora font with all needed weights and styles
export const fontLora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"], // Regular, Medium, Semi Bold, Bold
  style: ["normal", "italic"],
  display: "swap",
});

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Lora,
} from "next/font/google";


export const fontLora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"], 
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

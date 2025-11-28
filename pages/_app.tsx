import type { AppProps } from "next/app";

import { useState } from "react";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { fontSans, fontMono, fontLora } from "@/config/fonts";
import "@/styles/globals.css";
import AgeVerificationModal from "@/components/AgeVerificationModal";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            retry: 2,
          },
        },
      }),
  );

  return (
    <div
      className={`${fontLora.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider>
            <Component {...pageProps} />
            <AgeVerificationModal />
          </NextThemesProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </div>
  );
}

export const fonts = {
  lora: fontLora.style.fontFamily,
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};

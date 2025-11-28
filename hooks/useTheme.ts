import { useTheme as useNextTheme } from "next-themes";

import { themeColors, lightTheme, darkTheme } from "@/config/theme";

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const currentTheme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  return {
    theme,
    setTheme,
    resolvedTheme,
    colors: themeColors,
    currentTheme,
    isLight: resolvedTheme === "light",
    isDark: resolvedTheme === "dark",
    toggleTheme: () => setTheme(resolvedTheme === "light" ? "dark" : "light"),
  };
};

export default useTheme;

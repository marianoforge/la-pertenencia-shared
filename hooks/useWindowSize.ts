import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

interface UseWindowSizeOptions {
  debounceMs?: number;
  initialWidth?: number;
  initialHeight?: number;
}

export const useWindowSize = (options: UseWindowSizeOptions = {}) => {
  const {
    debounceMs = 150,
    initialWidth = 1200,
    initialHeight = 800,
  } = options;

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: initialWidth,
    height: initialHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Debounced version of handleResize
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, debounceMs);
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", debouncedHandleResize);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, [debounceMs]);

  return windowSize;
};

// Helper hook specifically for responsive layouts
export const useResponsiveLayout = () => {
  const { width } = useWindowSize();

  const breakpoints = {
    isMobile: width < 600,
    isTablet: width >= 600 && width < 900,
    isLaptop: width >= 900 && width < 1280,
    isDesktop: width >= 1280,
  };

  // Helper function to get items per page based on screen size
  const getItemsPerPage = (
    mobileCount = 1,
    tabletCount = 1,
    laptopCount = 2,
    desktopCount = 3,
  ) => {
    if (breakpoints.isDesktop) return desktopCount;
    if (breakpoints.isLaptop) return laptopCount;
    if (breakpoints.isTablet) return tabletCount;

    return mobileCount;
  };

  return {
    ...breakpoints,
    width,
    getItemsPerPage,
  };
};

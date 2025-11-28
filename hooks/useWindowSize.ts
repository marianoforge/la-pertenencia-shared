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
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, debounceMs);
    };

    
    handleResize();

    
    window.addEventListener("resize", debouncedHandleResize);

    
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, [debounceMs]);

  return windowSize;
};


export const useResponsiveLayout = () => {
  const { width } = useWindowSize();

  const breakpoints = {
    isMobile: width < 600,
    isTablet: width >= 600 && width < 900,
    isLaptop: width >= 900 && width < 1280,
    isDesktop: width >= 1280,
  };

  
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

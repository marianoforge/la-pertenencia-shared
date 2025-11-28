import { useState, useCallback, useEffect } from "react";

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

export const useDropdownPosition = (
  desktopRef: React.RefObject<HTMLButtonElement>,
  mobileRef: React.RefObject<HTMLButtonElement>,
  isOpen: boolean
) => {
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
  });

  const calculatePosition = useCallback(() => {
    const activeButton =
      window.innerWidth >= 768 ? desktopRef.current : mobileRef.current;

    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [desktopRef, mobileRef]);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleReposition = () => {
      calculatePosition();
    };

    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isOpen, calculatePosition]);

  return position;
};


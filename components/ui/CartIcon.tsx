import Image from "next/image";
import { ICONS, ICON_FILTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CartIconProps {
  className?: string;
  size?: number;
  variant?: "default" | "gold";
}

export const CartIcon: React.FC<CartIconProps> = ({ 
  className, 
  size = 20,
  variant = "default" 
}) => {
  return (
    <Image
      alt="Carrito"
      className={cn("object-contain", className)}
      height={size}
      src={ICONS.CART}
      style={variant === "gold" ? { filter: ICON_FILTERS.GOLD } : undefined}
      width={size}
    />
  );
};


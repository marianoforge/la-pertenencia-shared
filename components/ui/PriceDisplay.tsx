import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import { SHARED_STYLES } from "@/lib/constants";

interface PriceDisplayProps {
  price: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  price, 
  className,
  size = "lg"
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div
      className={cn(
        "text-center text-neutral-900",
        SHARED_STYLES.FONT_LORA,
        SHARED_STYLES.PRICE_TEXT,
        sizeClasses[size],
        className
      )}
    >
      {formatPrice(price)}
    </div>
  );
};


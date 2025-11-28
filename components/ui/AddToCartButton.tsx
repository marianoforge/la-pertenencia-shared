import { cn } from "@/lib/utils";
import { CartIcon } from "./CartIcon";

interface AddToCartButtonProps {
  onClick: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  isOutOfStock?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  onClick,
  disabled = false,
  isOutOfStock = false,
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs tracking-[4px] gap-2",
    md: "px-4 md:px-6 py-2 text-xs md:text-base tracking-[4px] md:tracking-[8px] gap-2 md:gap-3",
    lg: "px-6 md:px-12 py-2 md:py-3 text-base md:text-lg tracking-[6px] md:tracking-[8px] gap-3 md:gap-4",
  };

  return (
    <button
      className={cn(
        "bg-neutral-900 rounded-sm border border-amber-300",
        "inline-flex justify-center items-center",
        "font-['Lora'] font-medium uppercase",
        "hover:bg-neutral-800 transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        className
      )}
      disabled={disabled || isOutOfStock}
      onClick={onClick}
    >
      <span className="text-dorado-light">
        {isOutOfStock ? "agotado" : "agregar"}
      </span>
      <CartIcon size={size === "sm" ? 16 : size === "lg" ? 24 : 20} variant="gold" />
    </button>
  );
};


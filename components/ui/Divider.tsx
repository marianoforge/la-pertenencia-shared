import { cn } from "@/lib/utils";
import { SHARED_STYLES } from "@/lib/constants";

interface DividerProps {
  variant?: "neutral" | "yellow";
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ 
  variant = "neutral", 
  className 
}) => {
  const variantStyles = {
    neutral: SHARED_STYLES.DIVIDER_NEUTRAL,
    yellow: SHARED_STYLES.DIVIDER_YELLOW,
  };

  return (
    <div
      className={cn(
        "self-stretch",
        SHARED_STYLES.DIVIDER,
        variantStyles[variant],
        className
      )}
    />
  );
};


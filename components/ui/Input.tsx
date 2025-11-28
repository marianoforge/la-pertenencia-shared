import React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: "default" | "newsletter";
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, variant = "default", className, ...props }, ref) => {
    const baseStyles =
      "w-full font-['Lora'] tracking-wide focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-colors";

    const variants = {
      default:
        "px-4 py-2 bg-white border border-neutral-400 rounded text-neutral-900 text-base font-normal",
      newsletter:
        "px-5 py-4 bg-white/10 border-b border-neutral-400 text-white text-base font-normal placeholder-white/70",
    };

    if (variant === "newsletter") {
      return (
        <div
          className={cn(
            "self-stretch inline-flex justify-start items-center gap-16",
            className,
          )}
        >
          <input
            ref={ref}
            className={cn(
              baseStyles,
              variants[variant],
              "bg-transparent border-0 border-b",
            )}
            placeholder={label}
            {...props}
          />
        </div>
      );
    }

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {label && (
          <label className="text-neutral-900 text-sm font-medium font-['Lora'] tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(baseStyles, variants[variant])}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
export type { InputProps };

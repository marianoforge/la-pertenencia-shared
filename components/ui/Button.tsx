import React from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "quantity-plus"
    | "quantity-minus";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", children, className, ...props },
    ref,
  ) => {
    const baseStyles =
      "mt-2 max-[480px]:w-full max-[480px]:max-w-none max-w-[350px] inline-flex justify-center items-center gap-2.5 font-['Lora'] font-medium uppercase transition-colors duration-200 max-[380px]:whitespace-normal max-[380px]:text-center whitespace-nowrap";

    const variants = {
      primary:
        "h-9 md:h-auto max-[380px]:px-4 px-7 py-3 md:px-12 md:py-4 bg-amber-300 rounded-sm outline outline-[0.36px] md:outline-[0.50px] outline-offset-[-0.36px] md:outline-offset-[-0.50px] outline-neutral-900 border border-negro-base text-neutral-900 text-sm md:text-base max-[380px]:tracking-[4px] tracking-[7px] md:tracking-[8px] hover:bg-amber-400",
      secondary:
        "max-[380px]:px-4 px-12 py-4 bg-neutral-900 rounded-sm outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 text-dorado-light text-base hover:bg-neutral-800",
      outline:
        "max-[380px]:px-4 px-12 py-4 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-neutral-400 text-neutral-900 text-base hover:bg-neutral-50",
      "quantity-plus":
        "w-7 h-7 px-3 py-1.5 bg-neutral-900 rounded-[3px] outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 text-dorado-light text-base font-bold tracking-normal hover:bg-neutral-800",
      "quantity-minus":
        "w-7 h-7 px-3 py-1.5 bg-neutral-900 rounded-[3px] outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 text-dorado-light text-base font-bold tracking-normal hover:bg-neutral-800",
    };

    const sizes = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };

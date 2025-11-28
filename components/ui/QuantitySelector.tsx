import React from "react";

import { Button } from "./Button";

import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div 
      className={cn("flex justify-center items-center gap-2.5", className)}
      role="group"
      aria-label="Selector de cantidad"
    >
      <Button
        aria-label={`Disminuir cantidad a ${value - 1}`}
        disabled={value <= min}
        variant="quantity-minus"
        onClick={handleDecrease}
      >
        <span aria-hidden="true">-</span>
      </Button>
      <div 
        className="w-9 h-9 px-3 py-1.5 bg-white rounded-[3px] outline outline-1 outline-offset-[-1px] outline-neutral-400 flex justify-center items-center gap-16"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="justify-start text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
          {value}
        </div>
      </div>
      <Button
        aria-label={`Aumentar cantidad a ${value + 1}`}
        disabled={value >= max}
        variant="quantity-plus"
        onClick={handleIncrease}
      >
        <span aria-hidden="true">+</span>
      </Button>
    </div>
  );
};

export { QuantitySelector };
export type { QuantitySelectorProps };

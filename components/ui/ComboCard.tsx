import React from "react";

import { QuantitySelector } from "./QuantitySelector";
import { Divider } from "./Divider";
import { PriceDisplay } from "./PriceDisplay";

import { Combo } from "@/types/combo";
import { cn } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useAddToCart";
import { ICONS, ICON_FILTERS } from "@/lib/constants";

interface ComboCardProps {
  combo: Combo;
  onAddToCart?: (combo: Combo, quantity: number) => void;
  className?: string;
}

const ComboCard: React.FC<ComboCardProps> = ({
  combo,
  onAddToCart,
  className,
}) => {
  const { quantity, setQuantity, addToCart } = useAddToCart({
    onSuccess: (_, qty) => {
      if (onAddToCart) {
        onAddToCart(combo, qty);
      }
    },
  });

  return (
    <div
      className={cn(
        "relative bg-white rounded-[3px] overflow-hidden",
        "flex flex-col gap-3 p-3 w-full h-[560px]",
        "sm:flex-row sm:gap-5 sm:pl-3.5 sm:pr-5 sm:py-5 sm:w-auto sm:h-[420px]",
        "lg:inline-flex lg:justify-center lg:items-center lg:h-auto",
        className
      )}
    >
      {/* Background Image - Covers entire card */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          alt="Combo background"
          className="w-full h-full object-cover"
          src={combo.backgroundImage}
        />
      </div>

      {/* Wine Bottles - Single Image with All Three Wines */}
      <div className="flex justify-center items-end relative z-10 h-44 sm:flex-none sm:w-1/2 sm:h-auto lg:h-80">
        <img
          alt={combo.name}
          className="w-auto h-40 sm:w-80 sm:h-auto lg:w-84 lg:h-72 object-contain object-bottom"
          src={combo.image}
        />
      </div>

      {/* Info Panel */}
      <div className="p-3 sm:p-5 bg-white/70 inline-flex flex-col justify-center items-center gap-1 relative z-10 sm:flex-1 overflow-y-auto">
        {/* Title */}
        <div className="self-stretch pb-2.5 flex flex-col justify-start items-start gap-1">
          <div className="self-stretch text-center justify-start text-black text-sm sm:text-base font-semibold font-['Lora'] uppercase tracking-[2px] sm:tracking-[4px]">
            {combo.name}
          </div>
        </div>

        {/* Divider */}
        <Divider variant="yellow" />

        {/* Description */}
        <div className="self-stretch py-[5px] inline-flex justify-center items-center gap-2.5">
          <div className="flex-1 justify-start text-black text-sm sm:text-base font-normal font-['Lora'] leading-normal tracking-wide">
            {combo.description.map((line, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-yellow-700 font-bold">•</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <Divider variant="yellow" />

        {/* Price */}
        <div className="self-stretch py-[5px] inline-flex justify-center items-center gap-2.5">
          <PriceDisplay 
            price={combo.price} 
            className="w-full sm:w-64 text-black text-xl sm:text-2xl lg:text-3xl" 
          />
        </div>

        {/* Quantity Selector */}
        <div className="self-stretch py-2 inline-flex justify-center items-center gap-4">
          <Divider variant="yellow" className="flex-1" />
          <QuantitySelector value={quantity} onChange={setQuantity} />
          <Divider variant="yellow" className="flex-1" />
        </div>

        {/* Add to Cart Button */}
        <button
          className="self-stretch px-6 sm:pl-12 sm:pr-10 py-2 bg-neutral-900 rounded-sm outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 inline-flex justify-center items-center gap-2 sm:gap-4 hover:bg-neutral-800 transition-colors"
          onClick={() => addToCart(combo as any)}
        >
          <div className="justify-start text-amber-300 text-sm sm:text-base font-medium font-['Lora'] uppercase tracking-[4px] sm:tracking-[8px]">
            agregar
          </div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 relative rounded-sm flex items-center justify-center">
            <img
              alt="Carrito"
              className="w-5 h-5 sm:w-6 sm:h-6"
              src={ICONS.CART}
              style={{ filter: ICON_FILTERS.GOLD }}
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export { ComboCard };
export type { ComboCardProps };

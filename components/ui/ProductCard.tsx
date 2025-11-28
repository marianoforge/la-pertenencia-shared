import React from "react";

import { Button } from "./Button";
import { QuantitySelector } from "./QuantitySelector";
import { Divider } from "./Divider";
import { PriceDisplay } from "./PriceDisplay";
import { CartIcon } from "./CartIcon";

import { cn } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useAddToCart";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  imageAlt: string;
  description: string[];
  variant?: "large" | "small";
  className?: string;
  onAddToCart?: (quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  image,
  imageAlt,
  description,
  variant = "small",
  className,
  onAddToCart,
}) => {
  const { quantity, setQuantity, addToCart } = useAddToCart({
    onSuccess: (_, qty) => {
      if (onAddToCart) {
        onAddToCart(qty);
      }
    },
  });

  if (variant === "large") {
    return (
      <div
        className={cn(
          "w-[640px] relative flex justify-center items-start overflow-hidden",
          className,
        )}
      >
        <div className="w-full relative rounded-lg overflow-hidden">
          <img
            alt={imageAlt}
            className="w-800 h-[430px] object-cover rounded-lg"
            src={image}
          />
        </div>
        <div className="py-5 px-4 left-[30px] top-[38.78px] absolute bg-white inline-flex flex-col justify-start items-start gap-1">
          <div className="w-72 flex flex-col justify-start items-start gap-1">
            <div className="justify-start text-neutral-900 text-base font-semibold font-['Lora'] uppercase tracking-[4px]">
              {title}
            </div>
            <div className="w-72 pt-[5px] pb-2.5 inline-flex justify-start items-start gap-2.5">
              <div className="w-60 justify-start text-yellow-700 text-base font-normal font-['Lora'] tracking-wide">
                {description.map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {index < description.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <Divider variant="neutral" />
          <div className="self-stretch py-[5px] inline-flex justify-center items-center gap-2.5">
            <PriceDisplay price={price} className="w-64" />
          </div>
          <Divider variant="neutral" />
          <div className="self-stretch pt-4 pb-2 inline-flex justify-center items-center gap-4">
            <div className="flex-1 h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <div className="flex-1 h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
          </div>
          <Button
            className="self-stretch pl-12 pr-10 py-2"
            variant="secondary"
            onClick={() => addToCart({} as any)}
          >
            <span className="justify-start text-dorado-light text-base font-medium font-['Lora'] uppercase tracking-[8px]">
              agregar
            </span>
            <CartIcon size={24} variant="gold" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white inline-flex flex-col justify-start items-center",
        className,
      )}
    >
      <img
        alt={imageAlt}
        className="w-72 h-36 object-cover object-center rounded-tl-lg rounded-tr-lg border-b-[3px] border-neutral-900"
        src={image}
      />
      <div className="p-5 flex flex-col justify-start items-start gap-1">
        <div className="flex flex-col justify-start items-start gap-1">
          <div className="justify-start text-neutral-900 text-base font-semibold font-['Lora'] uppercase tracking-[4px]">
            {title}
          </div>
          <div className=" inline-flex justify-center items-center gap-2.5">
            <div className="w-60 justify-start text-yellow-700 text-base font-normal font-['Lora'] tracking-wide">
              {description.map((item, index) => (
                <React.Fragment key={index}>
                  {item}
                  {index < description.length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <Divider variant="neutral" />
        <div className="self-stretch py-[5px] inline-flex justify-center items-center gap-2.5">
          <PriceDisplay price={price} className="w-64" />
        </div>
        <Divider variant="neutral" />
        <div className="self-stretch pt-4 pb-2 inline-flex justify-center items-center gap-4">
          <div className="flex-1 h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
          <QuantitySelector value={quantity} onChange={setQuantity} />
          <div className="flex-1 h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
        </div>
        <Button
          className="self-stretch pl-12 pr-10 py-2"
          variant="secondary"
          onClick={() => addToCart({} as any)}
        >
          <span className="justify-start text-dorado-light text-base font-medium font-['Lora'] uppercase tracking-[8px]">
            agregar
          </span>
          <CartIcon size={24} variant="gold" />
        </Button>
      </div>
    </div>
  );
};

export { ProductCard };
export type { ProductCardProps };

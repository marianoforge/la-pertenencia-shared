import { useState } from "react";
import Image from "next/image";

import { QuantitySelector } from "../ui";

interface GiftKitCardProps {
  id: string;
  name: string;
  items: string[];
  price: number;
  image: string;
  onAddToCart: (name: string, quantity: number) => void;
  size?: "small" | "large";
}

export const GiftKitCard: React.FC<GiftKitCardProps> = ({
  id: _id,
  name,
  items,
  price,
  image,
  onAddToCart,
  size = "small",
}) => {
  const [quantity, setQuantity] = useState(2);

  const isLarge = size === "large";

  return (
    <div
      className={`w-full mx-auto ${
        isLarge ? "relative h-[400px]" : "bg-white inline-flex flex-col"
      } flex-1`}
    >
      <div
        className={`relative ${
          isLarge
            ? "h-[400px] rounded-lg"
            : "h-36 lg:h-32 rounded-tl-lg rounded-tr-lg border-b-[3px] border-neutral-900"
        }`}
      >
        <Image
          alt={name}
          className="object-cover rounded-lg"
          fill
          src={image}
        />
      </div>

      <div
        className={`${
          isLarge
            ? "w-80 p-5 absolute top-8 sm:left-6 bg-white"
            : "self-stretch p-5"
        } flex flex-col justify-start items-start gap-1`}
      >
        <div className="w-72 flex flex-col justify-start items-start gap-1">
          <div className="justify-start text-neutral-900 text-sm md:text-base font-semibold font-['Lora'] uppercase tracking-[3.50px] md:tracking-[4px]">
            {name}
          </div>
          <div className="w-72 pt-[5px] pb-2.5 inline-flex justify-start items-start gap-2.5">
            <div className="w-60 justify-start text-yellow-700 text-sm md:text-base font-normal font-['Lora'] tracking-wide">
              {items.map((item, idx) => (
                <span key={idx}>
                  {item}
                  <br />
                </span>
              ))}
            </div>
          </div>
        </div>
        <hr className="self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
        <div className="self-stretch py-[5px] inline-flex justify-center items-center gap-2.5">
          <div className="flex-1 text-center justify-start text-neutral-900 text-3xl font-medium font-['Lora'] tracking-wider">
            $ {price.toLocaleString()}
          </div>
        </div>
        <hr className="self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
        
        <QuantitySelector
          max={99}
          min={1}
          value={quantity}
          onChange={setQuantity}
        />
        
        <button
          className="self-stretch pl-9 pr-7 py-1.5 lg:pl-12 lg:pr-10 lg:py-2 bg-neutral-900 rounded-sm outline outline-[0.38px] lg:outline-[0.50px] outline-offset-[-0.38px] lg:outline-offset-[-0.50px] outline-amber-300 inline-flex justify-center items-center gap-3 lg:gap-4"
          type="button"
          onClick={() => onAddToCart(name, quantity)}
        >
          <span className="justify-start text-dorado-light text-base font-medium font-['Lora'] uppercase tracking-[8px]">
            agregar
          </span>
          <Image
            alt=""
            aria-hidden="true"
            className="object-contain"
            height={32}
            src="/icons/Add carrito.svg"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(71%) sepia(83%) saturate(1392%) hue-rotate(4deg) brightness(103%) contrast(103%)",
            }}
            width={32}
          />
        </button>
      </div>
    </div>
  );
};


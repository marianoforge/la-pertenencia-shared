import Image from "next/image";

import { Wine } from "@/types/wine";
import { Divider } from "@/components/ui/Divider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { useAddToCart } from "@/hooks/useAddToCart";
import { getValidImageUrl, getWineImageAlt } from "@/lib/imageUtils";

interface WineCardProps {
  wine: Wine;
  index?: number;
  onAddToCart?: (wine: Wine, quantity: number) => void;
}

const WineCard = ({ wine, index = 0, onAddToCart }: WineCardProps) => {
  const {
    quantity,
    increaseQuantity: increase,
    decreaseQuantity: decrease,
    addToCart,
  } = useAddToCart({
    onSuccess: (item, qty) => {
      if (onAddToCart) {
        onAddToCart(item as Wine, qty);
      }
    },
  });

  const imageUrl = getValidImageUrl(wine.image);
  const imageAlt = getWineImageAlt(wine.marca, wine.winery, wine.vintage);

  return (
    <div className="w-[400px] h-[380px] bg-gradient-to-l from-gray-100 to-white/0 inline-flex justify-center items-center">
      <div className="w-[130px] h-[313px] relative">
        <Image
          alt={imageAlt}
          className="object-contain mt-16"
          height={313}
          priority={index === 0}
          src={imageUrl}
          width={130}
        />
      </div>
      <div className="w-56 inline-flex flex-col justify-center items-center gap-1">
        <div className="self-stretch pb-2.5 flex flex-col justify-start items-start gap-1">
          <div className="min-h-10 w-full self-stretch flex text-center items-center justify-center text-neutral-900 text-sm font-semibold font-['Lora'] uppercase tracking-[3.50px]">
            {wine.marca}
          </div>
          <div className="self-stretch text-center justify-start text-yellow-700 text-sm font-medium font-['Lora'] tracking-[3.50px]">
            {wine.tipo}
          </div>
        </div>
        <Divider variant="neutral" />
        <div className="self-stretch py-[5px] inline-flex justify-center items-center gap-2.5">
          <PriceDisplay price={wine.price} className="w-64" />
        </div>
        <Divider variant="neutral" />
        <div className="self-stretch min-h-[50px] py-[5px] inline-flex justify-center items-center gap-2.5">
          <div className="text-center justify-start text-neutral-900 text-sm font-normal font-['Lora'] tracking-wide px-2 line-clamp-2">
            {wine.description}
          </div>
        </div>
        <div className="self-stretch pb-2 inline-flex justify-center items-center gap-4">
          <Divider variant="neutral" className="flex-1" />
          <div className="flex justify-center items-center gap-2.5">
            <button
              className="w-7 h-7 px-3 py-1.5 bg-neutral-900 rounded-[3px] outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 flex justify-center items-center gap-16 cursor-pointer hover:bg-neutral-800 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
              onClick={decrease}
            >
              <div className="justify-start text-dorado-light text-base font-bold font-['Lora']">
                -
              </div>
            </button>
            <div className="w-9 h-9 px-3 py-1.5 bg-white rounded-[3px] outline outline-1 outline-offset-[-1px] outline-neutral-400 flex justify-center items-center gap-16">
              <div className="justify-start text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
                {quantity}
              </div>
            </div>
            <button
              className="w-7 h-7 px-3 py-1.5 bg-neutral-900 rounded-[3px] outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 flex justify-center items-center gap-16 cursor-pointer hover:bg-neutral-800 transition-colors disabled:opacity-50"
              disabled={quantity >= wine.stock}
              onClick={() => increase(wine.stock)}
            >
              <div className="justify-start text-dorado-light text-base font-bold font-['Lora']">
                +
              </div>
            </button>
          </div>
          <Divider variant="neutral" className="flex-1" />
        </div>
        <AddToCartButton
          className="max-[480px]:w-full max-[380px]:px-4 pl-9 pr-7 py-1.5"
          isOutOfStock={wine.stock === 0}
          size="md"
          onClick={() => addToCart(wine)}
        />
      </div>
    </div>
  );
};

export default WineCard;

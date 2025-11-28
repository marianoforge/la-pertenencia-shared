import Image from "next/image";
import { useRouter } from "next/router";

import { Wine } from "@/types/wine";
import { Divider } from "@/components/ui/Divider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { useAddToCart } from "@/hooks/useAddToCart";
import { getValidImageUrl, getWineImageAlt } from "@/lib/imageUtils";

interface WineGridCardProps {
  wine: Wine;
  onAddToCart?: (wine: Wine, quantity: number) => void;
}

const WineGridCard = ({ wine, onAddToCart }: WineGridCardProps) => {
  const router = useRouter();
  
  const { 
    quantity, 
    increaseQuantity: increase, 
    decreaseQuantity: decrease, 
    addToCart 
  } = useAddToCart({
    onSuccess: (item, qty) => {
      if (onAddToCart) {
        onAddToCart(item as Wine, qty);
      }
    },
  });

  const handleCardClick = () => {
    router.push(`/vinos/${wine.id}`);
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToCart(wine);
  };

  const handleQuantityChange = (
    e: React.MouseEvent, 
    action: () => void
  ) => {
    e.stopPropagation();
    action();
  };

  const imageUrl = getValidImageUrl(wine.image);
  const imageAlt = getWineImageAlt(wine.marca, wine.winery, wine.vintage);

  return (
    <div
      className="w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Wine Image */}
      <div className="w-full h-48 md:h-56 lg:h-64 bg-gradient-to-l from-white to-zinc-100/50 flex items-center justify-center relative">
        <Image
          alt={imageAlt}
          className="max-w-full max-h-full object-contain"
          height={200}
          priority={false}
          src={imageUrl}
          width={200}
        />
      </div>

      {/* Wine Details */}
      <div className="p-3 md:p-4">
        {/* Wine Name */}
        <div className="text-center mb-2">
          <h3 className="text-xs md:text-sm font-semibold font-['Lora'] uppercase tracking-[2px] md:tracking-[3.50px] text-neutral-900 min-h-[36px] md:min-h-[48px] flex items-center justify-center leading-tight">
            {wine.marca}
          </h3>
        </div>

        {/* Wine Category */}
        <div className="text-center mb-3 md:mb-4">
          <p className="text-xs md:text-sm font-medium font-['Lora'] tracking-[2px] md:tracking-[3.50px] text-yellow-700">
            {wine.tipo}
          </p>
        </div>

        {/* Divider */}
        <Divider variant="neutral" className="mb-3 md:mb-4" />

        {/* Price */}
        <div className="text-center mb-3 md:mb-4">
          <PriceDisplay 
            price={wine.price} 
            className="text-xl md:text-2xl lg:text-3xl"
          />
        </div>

        {/* Divider */}
        <Divider variant="neutral" className="mb-4 md:mb-4" />

        {/* Description */}
        <div className="min-h-16 max-h-16 text-center mb-4 md:mb-6">
          <p className="text-xs md:text-sm font-normal font-['Lora'] tracking-wide text-neutral-900 line-clamp-3 leading-relaxed">
            {wine.description}
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="mb-3 md:mb-4">
          {/* Label "Cajas por X:" */}
          <div className="text-center mb-2">
            <span className="text-neutral-900 text-xs md:text-sm font-medium font-['Lora'] tracking-wide">
              Cajas por {wine.boxSize || 6} unidades
            </span>
          </div>

          <div className="flex justify-center items-center gap-2 md:gap-4">
            <Divider variant="neutral" className="flex-1" />
            <div className="flex justify-center items-center gap-1.5 md:gap-2.5">
              <button
                className="w-6 h-6 md:w-7 md:h-7 bg-neutral-900 rounded-[3px] border border-amber-300 flex justify-center items-center cursor-pointer hover:bg-neutral-800 transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
                onClick={(e) => handleQuantityChange(e, decrease)}
              >
                <span className="text-dorado-light text-sm md:text-base font-bold font-['Lora']">
                  -
                </span>
              </button>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-[3px] border border-neutral-400 flex justify-center items-center">
                <span className="text-neutral-900 text-sm md:text-base font-normal font-['Lora'] tracking-wide">
                  {quantity}
                </span>
              </div>
              <button
                className="w-6 h-6 md:w-7 md:h-7 bg-neutral-900 rounded-[3px] border border-amber-300 flex justify-center items-center cursor-pointer hover:bg-neutral-800 transition-colors disabled:opacity-50"
                disabled={quantity >= wine.stock}
                onClick={(e) => handleQuantityChange(e, () => increase(wine.stock))}
              >
                <span className="text-dorado-light text-sm md:text-base font-bold font-['Lora']">
                  +
                </span>
              </button>
            </div>
            <Divider variant="neutral" className="flex-1" />
          </div>
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton
          className="w-full px-3 md:px-4 py-2 text-xs md:text-base tracking-[4px] md:tracking-[8px]"
          isOutOfStock={wine.stock === 0}
          size="md"
          onClick={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default WineGridCard;

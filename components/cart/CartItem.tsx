import Image from "next/image";
import { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/lib/formatters";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { wine, quantity, priceAtTimeOfAdd } = item;
  const totalPrice = priceAtTimeOfAdd * quantity;

  return (
    <div className="flex gap-4 p-4 bg-neutral-50 rounded-sm border border-neutral-200">
      {/* Wine Image */}
      <div className="w-20 h-20 bg-neutral-900 rounded-sm flex items-center justify-center flex-shrink-0 relative overflow-hidden">
        {wine.image ? (
          <Image
            alt={wine.marca}
            className="w-full h-full object-cover"
            height={80}
            src={wine.image}
            width={80}
          />
        ) : (
          <svg
            fill="none"
            height="32"
            viewBox="0 0 24 24"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C12 2 8 6 8 12C8 16 10 20 12 22C14 20 16 16 16 12C16 6 12 2 12 2Z"
              stroke="#D4AF37"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M12 8V16"
              stroke="#D4AF37"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>

      {/* Wine Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm font-['Lora'] text-neutral-900 mb-1 truncate uppercase tracking-[1px]">
          {wine.marca}
        </h4>
        <p className="text-xs text-neutral-600 font-['Lora'] mb-3 tracking-wide">
          {wine.winery} • {wine.vintage}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mb-3">
          <button
            className="w-7 h-7 bg-neutral-900 rounded-sm outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 flex items-center justify-center text-dorado-light text-sm font-bold font-['Lora'] hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity <= 1}
            onClick={() => onUpdateQuantity(wine.id, quantity - 1)}
          >
            -
          </button>
          <span className="text-sm font-medium font-['Lora'] text-neutral-900 w-8 text-center tracking-wide">
            {quantity}
          </span>
          <button
            className="w-7 h-7 bg-neutral-900 rounded-sm outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 flex items-center justify-center text-dorado-light text-sm font-bold font-['Lora'] hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity >= wine.stock}
            onClick={() => onUpdateQuantity(wine.id, quantity + 1)}
          >
            +
          </button>
        </div>

        {/* Price and Remove */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold font-['Lora'] text-neutral-900 tracking-wide">
            {formatPrice(totalPrice)}
          </span>
          <button
            aria-label="Eliminar item"
            className="text-neutral-500 hover:text-red-600 transition-colors p-1"
            onClick={() => onRemove(wine.id)}
          >
            <svg
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6H5H21M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V6H19ZM10 11V17M14 11V17"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};


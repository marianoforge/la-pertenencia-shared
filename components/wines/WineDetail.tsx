import { useState } from "react";
import Image from "next/image";

import { Wine } from "@/types/wine";
import { useCartStore } from "@/stores/useCartStore";
import { isValidImage } from "@/lib/imageUtils";
import { SearchInput } from "../ui";
import { WineBreadcrumb } from "./WineBreadcrumb";
import { WineImage } from "./WineImage";
import { WineInfoSection } from "./WineInfoSection";

interface WineDetailProps {
  wine: Wine;
  onAddToCart?: (wine: Wine, quantity: number) => void;
}

const WineDetail = ({ wine, onAddToCart }: WineDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(wine, quantity);
    setQuantity(1);
    onAddToCart?.(wine, quantity);
  };

  const imageUrl = isValidImage(wine.image)
    ? wine.image
    : "/images/wine-placeholder.svg";

  const originalPrice = Math.round(wine.price * 1.25);
  const discountPercentage = Math.round(
    ((originalPrice - wine.price) / originalPrice) * 100
  );

  return (
    <article>
      <header className="w-full mx-auto md:px-2 lg:px-2 bg-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-[5px] rounded-sm overflow-hidden">
          <WineBreadcrumb wineName={wine.marca} winery={wine.winery} />
          <SearchInput
            className="w-full sm:w-72"
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </header>

      <main className="w-full max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 md:px-6 lg:px-8 lg:pl-0 py-8">
          <WineImage
            discountPercentage={discountPercentage}
            imageUrl={imageUrl}
            vintage={wine.vintage}
            wineName={wine.marca}
            winery={wine.winery}
          />

          {/* Right Column - Wine Information */}
          <div className="w-full lg:w-1/2 xl:w-3/5 flex flex-col gap-6">
            <header className="self-stretch inline-flex flex-col justify-start items-start gap-5">
              <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
                <h1 className="self-stretch justify-start text-neutral-900 text-xl font-semibold font-['Lora'] uppercase tracking-[8px]">
                  {wine.winery} {wine.marca}
                </h1>
                <p className="self-stretch justify-start text-yellow-700 text-xl font-medium font-['Lora'] tracking-[5px]">
                  {wine.tipo}
                </p>
              </div>
              <hr className="self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
              <div className="pb-[5px] flex flex-col justify-start items-start gap-[5px]">
                <div className="h-12 pb-[5px] inline-flex justify-start items-center gap-5">
                  <p className="text-center justify-start text-neutral-900 text-3xl font-medium font-['Lora'] tracking-wider">
                    <span className="sr-only">Precio actual: </span>${" "}
                    {wine.price.toLocaleString()}
                  </p>
                  <div
                    aria-hidden="true"
                    className="w-6 h-0 origin-center rotate-90 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400 self-center"
                  />
                  <p className="text-center justify-start text-neutral-400 text-xl font-medium font-['Lora'] line-through tracking-wide self-center">
                    <span className="sr-only">Precio anterior: </span>${" "}
                    {Math.round(wine.price * 1.2).toLocaleString()}
                  </p>
                </div>
              </div>
              <hr className="self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
              <div className="self-stretch inline-flex justify-start items-center gap-2.5">
                <p className="text-neutral-900 text-base font-semibold font-['Lora'] tracking-wide">
                  Stock Disponible:
                </p>
                <p className="text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
                  {wine.stock} unidades
                </p>
              </div>
              <hr className="self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
            </header>
            <section
              aria-label="Opciones de compra"
              className="self-stretch flex-1 flex flex-col justify-end items-start gap-2.5"
            >
              {/* Label "Cajas por X:" */}
              <p className="w-64 text-center mb-1 text-neutral-900 text-sm md:text-base font-medium font-['Lora'] tracking-wide">
                Cajas por {wine.boxSize || 6} unidades
              </p>

              <div className="w-64 py-2 inline-flex justify-center items-center gap-4">
                <hr
                  aria-hidden="true"
                  className="flex-1 h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400"
                />
                <div
                  className="flex justify-center items-center gap-2.5"
                  role="group"
                  aria-label="Selector de cantidad"
                >
                  <button
                    aria-label="Disminuir cantidad"
                    className="w-7 h-7 px-3 py-1.5 bg-neutral-900 rounded-[3px] outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 flex justify-center items-center gap-16 cursor-pointer hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    <span
                      aria-hidden="true"
                      className="justify-start text-dorado-light text-base font-bold font-['Lora']"
                    >
                      -
                    </span>
                  </button>
                  <output className="w-9 h-9 px-3 py-1.5 bg-white rounded-[3px] outline outline-1 outline-offset-[-1px] outline-neutral-400 flex justify-center items-center gap-16">
                    <span className="justify-start text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
                      {quantity}
                    </span>
                  </output>
                  <button
                    aria-label="Aumentar cantidad"
                    className="w-7 h-7 px-3 py-1.5 bg-neutral-900 rounded-[3px] outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 flex justify-center items-center gap-16 cursor-pointer hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    disabled={quantity >= wine.stock}
                    type="button"
                    onClick={() =>
                      setQuantity((prev) => Math.min(wine.stock, prev + 1))
                    }
                  >
                    <span
                      aria-hidden="true"
                      className="justify-start text-dorado-light text-base font-bold font-['Lora']"
                    >
                      +
                    </span>
                  </button>
                </div>
                <hr
                  aria-hidden="true"
                  className="flex-1 h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400"
                />
              </div>
              <button
                aria-label={
                  wine.stock === 0
                    ? "Producto agotado"
                    : `Agregar ${quantity} ${quantity === 1 ? "caja" : "cajas"} al carrito`
                }
                className="max-[480px]:w-full w-64 max-[380px]:px-4 pl-12 pr-10 py-2 bg-neutral-900 rounded-sm outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 inline-flex justify-center items-center gap-4 cursor-pointer hover:bg-neutral-800 transition-colors disabled:opacity-50"
                disabled={wine.stock === 0}
                type="button"
                onClick={handleAddToCart}
              >
                <span className="justify-start text-dorado-light text-base font-medium font-['Lora'] uppercase max-[380px]:tracking-[4px] tracking-[8px]">
                  {wine.stock === 0 ? "agotado" : "agregar"}
                </span>
                <Image
                  alt=""
                  aria-hidden="true"
                  className="object-contain"
                  height={20}
                  src="/icons/Add carrito.svg"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(71%) sepia(83%) saturate(1392%) hue-rotate(4deg) brightness(103%) contrast(103%)",
                  }}
                  width={20}
                />
              </button>
            </section>
          </div>
        </div>

        <hr className="self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-neutral-400" />
        <WineInfoSection wine={wine} />
      </main>
    </article>
  );
};

export default WineDetail;

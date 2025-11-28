import Image from "next/image";

import { Wine } from "@/types/wine";

interface WineHeroProps {
  featuredWine?: Wine;
  onAddToCart?: (wine: Wine, quantity: number) => void;
}

const WineHero = ({ featuredWine }: WineHeroProps) => {
  return (
    <>
      {/* Desktop/Tablet Version */}
      <div className="max-[720px]:hidden w-[1300px] h-[400px] relative bg-neutral-900 flex flex-col mx-auto overflow-hidden mt-6">
        <div className="relative">
          <div>
            <Image
              alt="Back Hero Inside"
              className="absolute w-[620px] h-[361px] bg-neutral-900 rounded-sm top-5 left-8 z-10"
              height={361}
              src="/images/back2HeroVinos.png"
              width={620}
            />
          </div>
          <div>
            <Image
              alt="Botella Vinos"
              className="absolute rounded-sm top-10 left-14 z-10"
              height={300}
              src="/images/botellaHeroVinos.png"
              width={220}
            />
          </div>

          <div className="absolute top-16 left-[280px] z-20 self-stretch px-7 py-2 inline-flex flex-col justify-center items-center gap-1">
            <div className="self-stretch pb-2.5 flex flex-col justify-start items-start gap-4">
              <div className="self-stretch text-center justify-start text-black text-xl font-semibold font-['Lora'] uppercase tracking-[5px]">
                la pertenencia
              </div>
              <div className="self-stretch text-center justify-start text-yellow-700 text-base font-medium font-['Lora'] tracking-[4px]">
                Malbec y Cabernet Franc
              </div>
            </div>
            <div className="self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-yellow-700" />

            <div className="self-stretch py-[5px] inline-flex justify-center items-center gap-2.5 mt-4">
              <div className="w-64 text-center justify-start text-black text-base font-normal font-['Lora'] italic leading-normal tracking-wide">
                Vinos creados para quienes disfrutan cada copa como una
                experiencia única, con la esencia y pasión que nos representa.
                ¡Prepárate para descubrirlos!{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-end items-end">
          <Image
            alt="Back Hero"
            height={646}
            src="/images/backHeroVinos.png"
            width={1149}
          />
        </div>
      </div>

      {/* Mobile Version */}
      <div className="min-[721px]:hidden w-full max-w-[1300px] mx-auto mt-6">
        <div className="w-full wine-banner-container relative">
          <img
            alt="Vinos - Background Mobile"
            className="wine-banner-mobile w-full"
            src="/images/bannerMobileVinos.png"
          />
        </div>
      </div>
    </>
  );
};

export default WineHero;

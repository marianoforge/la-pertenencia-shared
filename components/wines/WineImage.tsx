import Image from "next/image";

interface WineImageProps {
  imageUrl: string;
  wineName: string;
  winery: string;
  vintage: number;
  discountPercentage: number;
}

export const WineImage: React.FC<WineImageProps> = ({
  imageUrl,
  wineName,
  winery,
  vintage,
  discountPercentage,
}) => (
  <div className="w-full lg:w-1/2 xl:w-3/5">
    <div
      className="relative rounded-lg p-8 md:p-12 flex items-center justify-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/wine-bg.png')",
      }}
    >
      {discountPercentage > 0 && (
        <div
          className="absolute top-4 right-4 w-16 h-16 flex items-center justify-center text-black text-base font-bold font-['Lora'] z-10"
          style={{
            backgroundImage: "url('/images/star-discount.svg')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          -{discountPercentage}%
        </div>
      )}

      <Image
        priority
        alt={`${wineName} - ${winery} ${vintage}`}
        className="max-w-full max-h-full object-contain relative z-10"
        height={400}
        src={imageUrl}
        width={300}
      />
    </div>
  </div>
);


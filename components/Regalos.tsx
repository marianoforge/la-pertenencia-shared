import { Button, Section, SectionHeader } from "./ui";
import { GiftKitCard } from "./gifts/GiftKitCard";

const GIFT_KITS = [
  {
    id: "kit1",
    name: 'Kit "la pertenecia"',
    items: [
      "La pertenencia Malbec",
      "Set de 2 copas",
      "Tapón hermético",
      "Bomba de vacío",
    ],
    price: 35990,
    image: "/images/kitlapertenencia.png",
    size: "large" as const,
  },
  {
    id: "kit2",
    name: 'Kit "1ra Copa"',
    items: ["1 copa premium grabada", "Sacacorchos profesional"],
    price: 30990,
    image: "/images/kitprimeracopa.png",
    size: "small" as const,
  },
  {
    id: "kit3",
    name: 'Kit "2da Copa"',
    items: ["1 copa premium grabada", "Sacacorchos profesional"],
    price: 30990,
    image: "/images/kitsegundacopa.png",
    size: "small" as const,
  },
] as const;

const Regalos = () => {
  const handleAddToCart = (productName: string, quantity: number) => {
    console.log(`Adding ${quantity} of ${productName} to cart`);
  };

  return (
    <Section className="!px-0" id="regalos" variant="default">
      <SectionHeader
        subtitle="Regalos empresariales"
        title="Regala momentos que se brindan"
      />

      <div className="w-full max-w-[1300px] pt-6 md:pt-10 flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 px-4 sm:px-0">
        {/* Kit grande */}
        <div className="w-full sm:justify-start h-[400px] relative flex justify-center items-start overflow-hidden">
          <GiftKitCard
            {...GIFT_KITS[0]}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Kits pequeños */}
        <div className="w-full flex flex-col sm:flex-row gap-6 md:gap-8 lg:gap-10">
          <GiftKitCard
            {...GIFT_KITS[1]}
            onAddToCart={handleAddToCart}
          />
          <GiftKitCard
            {...GIFT_KITS[2]}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      <div className="w-full max-w-[1300px] pt-5 flex flex-col justify-center items-center gap-6 md:gap-7 px-4 sm:px-0">
        <div className="text-center text-neutral-900 text-sm sm:text-sm md:text-base lg:text-xl font-normal font-['Lora'] leading-tight md:leading-normal lg:leading-loose tracking-wide">
          Diseñamos experiencias en forma de regalo. Vinos seleccionados,
          presentaciones cuidadas y propuestas personalizadas para que vos, tu
          empresa o tu marca dejen una huella en cada obsequio.
        </div>

        <div className="w-full max-w-[1300px] pt-2.5 flex flex-col justify-center items-center gap-7 px-4 sm:px-0">
          <Button size="sm" variant="primary">
            quiero saber más
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default Regalos;

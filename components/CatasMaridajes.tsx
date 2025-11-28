import React from "react";
import NextLink from "next/link";
import Image from "next/image";

import { Section, SectionHeader, EventCard, Button } from "./ui";

const CatasMaridajes = () => {
  const events = [
    {
      id: 1,
      title: "MARIDAJE",
      description:
        "En La Pertenencia creemos que cada vino tiene una historia, y cada plato, un capítulo que la complementa. Buscamos esa armonía perfecta donde aromas, texturas se entrelazan.",
      date: "28 Junio, 2025",
      time: "20:30",
      location: "Palermo - CABA",
      image: "/images/maridajecarnesrojas.png",
      imageAlt: "Maridaje",
    },
    {
      id: 2,
      title: "CATAS TEMATICAS",
      description:
        "Cada encuentro gira en torno a un eje, puede ser una región vitivinícola, una cepa, una bodega o incluso una añada especial para sumergirte en un mundo de matices y sensaciones.",
      date: "28 Junio, 2025",
      time: "20:30",
      location: "Palermo - CABA",
      image: "/images/cocteleria.png",
      imageAlt: "Coctelería",
    },
    {
      id: 3,
      title: "COCTELERIA",
      description:
        "En La Pertenencia exploramos recetas que van desde clásicos con un toque innovador, hasta creaciones propias que sorprenden a todos los sentidos.",
      date: "28 Junio, 2025",
      time: "20:30",
      location: "Palermo - CABA",
      image: "/images/catastematicas.png",
      imageAlt: "Categoría temática",
    },
  ];

  return (
    <Section id="catas-maridajes" variant="gray">
      <SectionHeader
        subtitle="Encuentros que conectan"
        title="Catas y maridajes"
      />

      <div className="w-full max-w-[1300px] pt-2.5 pb-5 md:pb-7 lg:pb-10 flex flex-col justify-center items-center gap-2.5 sm:px-0">
        <div className="text-center text-neutral-900 text-sm md:text-base lg:text-xl font-normal font-['Lora'] leading-tight md:leading-normal lg:leading-loose tracking-wide">
          Creemos que las degustaciones y catas son más que una prueba de
          productos; son experiencias sensoriales y sociales para disfrutar,
          aprender y compartir, acompañadas de buenos vinos, quesos y valiosos
          tips de maridaje.
        </div>
      </div>

      <div className="w-full max-w-[1300px] px-0 sm:px-2.5 md:px-5 lg:px-2.5 flex flex-col lg:flex-row justify-start items-start gap-10 lg:gap-10">
        <div className="w-full lg:flex-1 flex flex-col justify-start items-start gap-5 md:gap-14">
          {events.map((event) => (
            <EventCard
              key={event.id}
              date={event.date}
              description={event.description}
              image={event.image}
              imageAlt={event.imageAlt}
              location={event.location}
              time={event.time}
              title={event.title}
            />
          ))}
        </div>

        <div className="w-full lg:w-[510px] h-12 lg:h-full flex flex-col justify-between items-start gap-5 lg:gap-0">
          <div className="w-full hidden lg:flex flex-1 lg:flex-grow relative rounded-lg overflow-hidden">
            <Image
              alt="Maridaje eventos"
              className="object-cover rounded-lg"
              fill
              src="/images/maridajeeventos.png"
            />
          </div>
          <div className="w-full justify-center items-center lg:items-stretch mt-4 min-[481px]:flex hidden">
            <NextLink className="w-full" href="/catas">
              <Button
                className="w-full"
                style={{ minWidth: "100%" }}
                variant="primary"
              >
                todos los eventos
              </Button>
            </NextLink>
          </div>
        </div>
      </div>

      {/* Button for mobile - outside containers to be full width */}
      <div className="w-full max-w-[1300px] max-[480px]:px-0 px-4 sm:px-0 max-[480px]:block hidden">
        <NextLink className="w-full" href="/catas">
          <Button variant="primary">todos los eventos</Button>
        </NextLink>
      </div>
    </Section>
  );
};

export default CatasMaridajes;

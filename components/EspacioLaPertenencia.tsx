import React from "react";
import Image from "next/image";

import { Section, SectionHeader, Button } from "./ui";

const EspacioLaPertenencia = () => {
  return (
    <Section id="espacio" variant="default">
      <SectionHeader
        subtitle="Espacio La Pertenencia"
        title="Nuestro lugar, tu lugar."
      />

      <div className="w-full max-w-[1300px] pt-5 md:pt-12 pb-5 flex flex-col justify-center items-center gap-7 md:gap-10 sm:px-0">
        {/* Full width image */}
        <div className="w-full relative rounded-lg overflow-hidden h-64 sm:h-80 md:h-96 lg:h-[400px]">
          <Image
            alt="Espacio La Pertenencia"
            className="object-cover"
            fill
            src="/images/nuestro-lugar.png"
          />
        </div>

        {/* Centered text content below image */}
        <div className="w-full px-0 sm:px-5 md:px-7 flex flex-col justify-center items-center gap-7">
          <div className="text-center text-neutral-900 text-lg font-normal font-['Lora'] italic leading-loose tracking-wide">
            En La Pertenencia, cada evento se vive como una experiencia única.
            <br />
            Nuestro espacio está pensado para celebraciones privadas,
            degustaciones, presentaciones o encuentros corporativos.
            <br />
            Consultanos disponibilidad y diseñemos juntos tu evento.
          </div>

          {/* Button for desktop - centered */}
          <div className="min-[481px]:block hidden">
            <a
              href="https://wa.me/5491161525562?text=Quiero%20reservar%20el%20espacio%20La%20Pertenencia"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary">Reservar espacio</Button>
            </a>
          </div>
        </div>

        {/* Button for mobile - full width */}
        <div className="w-full max-w-[1300px] max-[480px]:px-0 px-4 sm:px-0 max-[480px]:block hidden">
          <a
            href="https://wa.me/5491161525562?text=Quiero%20reservar%20el%20espacio%20La%20Pertenencia"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button variant="primary">Reservar espacio</Button>
          </a>
        </div>
      </div>
    </Section>
  );
};

export default EspacioLaPertenencia;

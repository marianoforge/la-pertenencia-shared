import React from "react";
import Link from "next/link";

import { Section, SectionHeader, Button } from "./ui";

const ImaginaTuVino = () => {
  return (
    <Section id="imagina-tu-vino" variant="gray">
      <div>
        <SectionHeader
          subtitle="Tu propio vino, tu propia historia."
          title="imagina un vino"
        />
      </div>

      <div className="w-full max-w-[1300px] pt-8 md:pt-12 pb-5 flex flex-col lg:flex-row justify-center items-start gap-6 md:gap-8 lg:gap-10 sm:px-0 ">
        <div
          className="w-full lg:w-[580px] h-48 sm:h-48 md:h-96 lg:h-[470px] relative rounded-lg overflow-hidden flex-shrink-0"
        >
          <img
            alt="Imagen de vino"
            className="w-full h-[444px] object-cover rounded-lg shadow-[inset_0px_4px_36.099998474121094px_0px_rgba(0,0,0,0.25)]"
            src="/images/imagina.png"
          />
        </div>
        <div
          className="flex-1 w-full lg:w-auto inline-flex flex-col justify-start items-start lg:items-start gap-4 md:gap-5"
        >
          <div className="text-neutral-900 text-sm md:text-base lg:text-xl font-semibold font-['Lora'] italic leading-tight md:leading-normal lg:leading-normal tracking-tight">
            ¿Alguna vez soñaste con tener tu propio vino, con tu sello personal?
          </div>
          <div className="flex-1 flex flex-col justify-start items-start gap-2 md:gap-2.5">
            <div className="text-neutral-900 text-sm md:text-base lg:text-xl font-normal font-['Lora'] italic leading-tight md:leading-normal lg:leading-normal tracking-tight">
              <span className="font-semibold">
                &quot;Crea tu vino, viví tu experiencia&quot;
              </span>
              <span>
                {" "}
                es mucho más que una propuesta, es la invitación a sumergirse en
                el fascinante mundo de la enología y ser el protagonista de tu
                propia creación.
              </span>
            </div>
            <div className="text-neutral-900 text-sm md:text-base lg:text-xl font-normal font-['Lora'] italic leading-tight md:leading-normal lg:leading-normal tracking-tight">
              <span className="font-semibold">En La Pertenencia </span>
              <span>
                te abrimos las puertas a un viaje sensorial inolvidable para
                conocer los viñedos donde nacerá tu vino, a sentir el aroma de
                la tierra y las hojas, y a conocer el cuidado artesanal con el
                que se cultivan las uvas.
              </span>
            </div>
            <div className="text-neutral-900 text-sm md:text-base lg:text-xl font-normal font-['Lora'] italic leading-tight md:leading-normal lg:leading-loose tracking-tight">
              <span className="font-semibold">
                De la mano de Lucas Moschetti,{" "}
              </span>
              <span>
                nuestro enólogo experto y apasionado, cada paso de este viaje
                será una aventura enriquecedora.
              </span>
            </div>
          </div>
          {/* Button for desktop - inside right content */}
          <div className="w-full pt-2.5 lg:pt-0 lg:mt-8 min-[481px]:flex hidden flex-col">
            <Link href="/crea-tu-vino">
              <Button size="sm" variant="primary">
                Quiero saber más
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Button for mobile - outside flex container to be full width */}
      <div className="w-full max-w-[1300px] max-[480px]:px-0 px-4 sm:px-0 max-[480px]:block hidden">
        <Link className="block w-full" href="/crea-tu-vino">
          <Button size="sm" variant="primary">
            Quiero saber más
          </Button>
        </Link>
      </div>
    </Section>
  );
};

export default ImaginaTuVino;

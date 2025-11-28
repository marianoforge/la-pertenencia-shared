import React from "react";
import Image from "next/image";

import { Section, SectionHeader } from "./ui";

export default function MembresiasSection() {
  return (
    <>
      {/* Hero Section with Background Image */}
      <Section className="!p-0" variant="default">
        <div className="w-full max-w-[1300px] pt-10 mb-10">
          <div data-aos="fade-up">
            <SectionHeader
              subtitle="Una caja. Tres vinos. Un Ritual."
              title="Membresía mensual"
            />
          </div>
        </div>
        <div
          className="w-full max-w-[1300px] h-96 relative bg-neutral-900 rounded-lg overflow-hidden"
          data-aos="fade-up"
        >
          <Image
            alt="Membresías - Background"
            className="object-cover object-[87%_center]"
            fill
            src="/images/membresia_headerbg_new.png"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        </div>
      </Section>

      {/* Content Section */}
      <Section className="lg:!px-0 lg:!py-16" variant="default">
        {/* Título Principal */}
        <div className="w-full max-w-[1300px] flex flex-col justify-start items-start gap-5 italic">
          <div className="w-full text-neutral-900 text-2xl md:text-[32px] font-semibold font-['Lora'] leading-relaxed tracking-wide">
            Una caja. Tres vinos. Cada mes.
          </div>
        </div>

        {/* Descripción */}
        <div className="w-full max-w-[1300px] flex flex-col justify-start items-start gap-2.5 mt-5 italic">
          <div className="w-full text-neutral-900 text-lg md:text-xl font-semibold font-['Lora'] leading-relaxed md:leading-loose tracking-tight">
            Vinos elegidos para vos, por quienes viven el vino como una
            experiencia de vida.
          </div>
          <div className="w-full text-neutral-900 text-lg md:text-xl font-normal font-['Lora'] leading-relaxed md:leading-loose tracking-tight">
            La membresía de La Pertenencia es más que una suscripción: es una
            forma de formar parte de una comunidad que celebra el vino como
            excusa para encontrarse, aprender y disfrutar.
            <br />
            <br />
            Cada mes seleccionamos 3 etiquetas especialmente pensadas para vos.
            Vinos con historia, con alma, con algo para contarte. Algunos serán
            conocidos, otros tal vez los descubras por primera vez. Todos van a
            tener algo en común: te van a emocionar.
          </div>
        </div>

        {/* Dos Columnas: Membresías + Imagen */}
        <div className="w-full max-w-[1300px] py-10 flex flex-col lg:flex-row justify-start items-start gap-10 ">
          {/* Columna Izquierda: Membresías */}
          <div
            className="flex-1 w-full lg:max-w-[630px] flex flex-col justify-start items-start gap-6"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            {/* Título de membresías */}
            <div className="w-full text-amber-700 text-lg md:text-xl font-medium font-['Lora'] uppercase tracking-[3px] md:tracking-[5px]">
              dos tipos de membresías:
            </div>

            {/* Tarjeta Membresía PLATA */}
            <div className="w-full bg-neutral-100 rounded-sm p-5 md:p-6 flex flex-col gap-4">
              <p className="text-neutral-900 text-base md:text-lg font-normal font-['Lora'] leading-relaxed italic">
                <span className="font-semibold not-italic">
                  Membresía PLATA:
                </span>{" "}
                Una selección de tres vinos especiales para descubrir nuevas
                etiquetas cada mes.
              </p>
              {/* <div className="w-full h-[1px] bg-neutral-300"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-3">
                <span className="text-neutral-900 text-3xl md:text-[41px] font-bold font-['Lora']">
                  $ 50.000
                </span>
                <span className="text-neutral-600 text-sm md:text-base font-normal font-['Lora'] italic">
                  * Precio promocional el primer mes
                </span>
              </div> */}
            </div>

            {/* Tarjeta Membresía ORO */}
            <div className="w-full bg-neutral-100 rounded-sm p-5 md:p-6 flex flex-col gap-4">
              <p className="text-neutral-900 text-base md:text-lg font-normal font-['Lora'] leading-relaxed italic">
                <span className="font-semibold not-italic">Membresía ORO:</span>{" "}
                Vinos de partidas limitadas y etiquetas de alta gama, elegidos
                para paladares curiosos y coleccionistas.
              </p>
              {/* <div className="w-full h-[1px] bg-neutral-300"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-3">
                <span className="text-neutral-900 text-3xl md:text-[41px] font-bold font-['Lora']">
                  $ 85.000
                </span>
                <span className="text-neutral-600 text-sm md:text-base font-normal font-['Lora'] italic">
                  * Precio promocional el primer mes
                </span>
              </div> */}
            </div>

            {/* Botón CTA */}
            <a
              className="w-full max-w-[350px] px-8 md:px-10 py-4 bg-amber-300 rounded-[4px] border border-neutral-900 flex justify-center items-center gap-2.5 mt-2 md:mt-28 hover:bg-amber-400 transition-colors shadow-sm"
              href="https://wa.me/5491161525562?text=Hola!%20Quiero%20mi%20membresía"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="text-neutral-900 text-sm md:text-base font-medium font-['Lora'] uppercase tracking-[6px] md:tracking-[8px]">
                Quiero sumarme
              </div>
            </a>
          </div>

          {/* Columna Derecha: Imagen */}
          <div
            className="w-full lg:w-[630px] flex flex-col justify-start items-start gap-3 italic"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div className="w-full h-[442px] relative rounded-lg overflow-hidden">
              <Image
                alt="Membresía - Cajas de vino"
                className="object-cover"
                fill
                src="/images/membresia_cajas.png"
              />
            </div>
            <div className="w-full text-left">
              <span className="text-neutral-900 text-sm md:text-base font-semibold font-['Lora'] leading-tight tracking-tight">
                Una caja. Tres vinos. Cada mes.
              </span>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

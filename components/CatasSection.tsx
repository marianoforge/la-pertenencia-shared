import React from "react";
import Image from "next/image";

import { Section, SectionHeader } from "./ui";

export default function CatasSection() {
  return (
    <>
      {/* Hero Section with Background Image */}
      <Section className="!p-0" variant="default">
        <div className="w-full max-w-[1300px] pt-10 mb-10">
          <div data-aos="fade-up">
            <SectionHeader
              subtitle="Encuentros que conectan"
              title="Catas y maridajes"
            />
          </div>
        </div>
        <div
          className="w-full max-w-[1300px] h-96 relative bg-neutral-900 rounded-lg overflow-hidden"
          data-aos="fade-up"
        >
          <Image
            alt="Catas y Maridajes - Background"
            className="object-cover object-[88%_88%]"
            fill
            src="/images/catas_hederbg_new.png"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/5 to-transparent" />
        </div>
      </Section>

      {/* Content Section */}
      <Section className="lg:!px-0 lg:!py-16" variant="default">
        <div className="w-full max-w-[1300px] flex flex-col justify-start items-start gap-5 italic">
          <div className="w-full text-neutral-900 text-lg md:text-xl font-semibold font-['Lora'] leading-relaxed md:leading-loose tracking-wide">
            Un vino. Un momento agradable. Un descubrimiento ? Un aprendizaje.
            En resumen, una experiencia para disfrutar y conectar.
          </div>
        </div>

        <div className="w-full max-w-[1300px] flex flex-col justify-start items-start gap-2.5 italic">
          <div className="w-full text-neutral-900 text-lg md:text-xl font-semibold font-['Lora'] leading-relaxed md:leading-loose tracking-tight">
            Eventos pensados para explorar, compartir y pertenecer.
          </div>
          <div className="w-full text-neutral-900 text-lg md:text-xl font-normal font-['Lora'] leading-relaxed md:leading-loose tracking-tight">
            Las catas y degustaciones en La Pertenencia no son solo para
            entendidos. Son espacios en para quienes disfrutan de descubrir,
            aprender y conectar. Cada encuentro es distinto: nuevas etiquetas,
            maridajes originales y personas que buscan algo más que una copa,
            acompañados por sommeliers y enólogos. apasionados, que nos proponen
            experiencias sensoriales donde el vino y la comida abren la puerta a
            nuevas charlas, amistades y momentos en los que todos somos
            protagonistas.
          </div>
        </div>

        <div className="w-full max-w-[1300px] py-5 flex flex-col lg:flex-row justify-center items-start gap-10 italic">
          {/* Left Content */}
          <div
            className="flex-1 w-full flex flex-col justify-start items-start gap-2.5"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div className="w-full text-yellow-700 text-lg md:text-xl font-medium font-['Lora'] uppercase tracking-[3px] md:tracking-[5px]">
              Tipos de encuentros:
            </div>
            <ul className="w-full text-neutral-900 text-base md:text-lg lg:text-xl font-normal font-['Lora'] leading-relaxed md:leading-loose tracking-tight list-disc pl-6 space-y-2">
              <li>Catas temáticas – varietales, regiones, bodegas boutique.</li>
              <li>
                Maridajes especiales – con picadas, quesos, chocolates, o cocina
                de autor.
              </li>
              <li>
                Lugares únicos – Paseos por terrazas, bodegas urbanas, casas
                secretas
              </li>
            </ul>

            <div className="w-full text-yellow-700 text-lg md:text-xl font-medium font-['Lora'] uppercase tracking-[3px] md:tracking-[5px] mt-4">
              Ideal para:
            </div>
            <ul className="w-full text-neutral-900 text-base md:text-lg lg:text-xl font-normal font-['Lora'] leading-relaxed md:leading-loose tracking-tight list-disc pl-6 space-y-2">
              <li>Grupos de amigos</li>
              <li>Celebraciones íntimas</li>
              <li>Salidas originales</li>
              <li>Regalos vivenciales</li>
            </ul>

            <a
              className="px-8 md:px-12 py-4 bg-amber-300 rounded-sm outline outline-[0.50px] outline-offset-[-0.50px] outline-neutral-900 flex justify-center items-center gap-2.5 mt-6 hover:bg-amber-400 transition-colors"
              href="https://wa.me/5491161525562?text=Hola!%20Me%20interesa%20participar%20en%20las%20catas?"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="text-neutral-900 text-sm md:text-base font-medium font-['Lora'] uppercase tracking-[6px] md:tracking-[8px]">
                quiero participar
              </div>
            </a>
          </div>

          {/* Right Image */}
          <div
            className="w-full lg:w-[679px] flex flex-col justify-center items-start gap-2.5 italic "
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div className="w-full h-[462px] relative rounded-lg overflow-hidden">
              <Image
                alt="Pato y Nana - Fundadoras de La Pertenencia"
                className="object-cover"
                fill
                src="/images/pato_nana.png"
              />
            </div>
            <div className="w-full text-left">
              <span className="text-neutral-900 text-sm md:text-base font-semibold font-['Lora'] leading-tight tracking-tight">
                Pato y Nana,
              </span>
              <span className="text-neutral-900 text-sm md:text-base font-normal font-['Lora'] leading-tight tracking-tight">
                &nbsp;fundadoras de La Pertenencia
              </span>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

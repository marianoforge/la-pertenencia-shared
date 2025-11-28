import React from "react";

import { Section, SectionHeader } from "./ui";

export default function CreaTuVinoSection() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Quiero crear mi vino");
    const whatsappUrl = `https://wa.me/5491161525562?text=${message}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Hero Section with Background Image */}
      <Section className="!p-0" variant="default">
        <div className="w-full max-w-[1300px] pt-10">
          <div data-aos="fade-up">
            <SectionHeader
              className="mb-10"
              subtitle="Tu propio vino, tu propia historia."
              title="imagina un vino"
            />
          </div>
        </div>
        <div
          className="w-full max-w-[1300px] h-96 relative bg-neutral-900 rounded-lg overflow-hidden"
          data-aos="fade-up"
        >
          <img
            alt="Imagina tu vino - Background"
            className="w-full h-full object-cover object-[50%_center] absolute inset-0"
            src="/images/crea-tu-vino-bg.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        </div>
      </Section>

      {/* Content Section */}
      <Section className="lg:!px-0 lg:!py-16" variant="default">
        <div className="w-full max-w-[1300px] flex flex-col justify-start items-start gap-5 italic">
          <div className="w-full text-neutral-900 text-lg md:text-xl font-semibold font-['Lora'] leading-relaxed md:leading-loose tracking-wide">
            Una aventura en Mendoza para crear tu propia etiqueta, de la mano de
            quienes saben transformar uvas en emociones.
          </div>
        </div>

        <div className="w-full max-w-[1300px] flex flex-col justify-start items-start italic">
          <div className="w-full text-neutral-900 text-lg md:text-xl font-semibold font-['Lora'] leading-relaxed md:leading-loose tracking-tight">
            ¿Alguna vez soñaste con tener tu propio vino?
          </div>
          <div className="w-full text-neutral-900 text-lg md:text-xl font-normal font-['Lora'] leading-relaxed md:leading-loose tracking-tight">
            Te acompañamos a vivir esta experiencia única y personal, a vivirla
            desde adentro.... Pensada para que cada detalle refleje tu esencia,
            tus gustos y tu historia. No se trata de hacer un vino más. Se trata
            de crear tu vino.
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
              Cómo funciona:
            </div>
            <ul className="w-full text-neutral-900 text-base md:text-lg lg:text-xl font-normal font-['Lora'] leading-relaxed md:leading-loose tracking-tight list-disc pl-6 space-y-2">
              <li>
                Te esperamos en Mendoza – Armamos un itinerario a medida según
                tu disponibilidad.
              </li>
              <li>
                Conoces a nuestros enólogos, o como nos gusta llamarlos, los
                alquimistas que harán la magia junto con vos.
              </li>
              <li>Visitamos el viñedo</li>
              <li>
                Conocemos la bodega donde se gestará tu vino y el paso a paso de
                cómo se hará.
              </li>
              <li>
                Te acompañamos en el viaje de elegir el nombre y la etiqueta.
              </li>
              <li>
                Producción y entrega: Te llevás una partida de tu propio vino
                para disfrutar, compartir, regalar o comercializar
              </li>
            </ul>

            <div className="w-full text-yellow-700 text-lg md:text-xl font-medium font-['Lora'] uppercase tracking-[3px] md:tracking-[5px] mt-4">
              Ideal para:
            </div>
            <ul className="w-full text-neutral-900 text-base md:text-lg lg:text-xl font-normal font-['Lora'] leading-relaxed md:leading-loose tracking-tight list-disc pl-6 space-y-2">
              <li>Disfrutar</li>
              <li>Compartir con amigos</li>
              <li>Regalos corporativos de alto impacto</li>
              <li>Bodas, aniversarios, celebraciones únicas</li>
              <li>Proyectos personales con alma</li>
            </ul>

            {/* Button for desktop - inside left content */}
            <button
              className="min-[481px]:flex hidden max-[380px]:px-4 px-8 md:px-12 py-4 bg-amber-300 rounded-sm outline outline-[0.50px] outline-offset-[-0.50px] outline-neutral-900 justify-center items-center gap-2.5 mt-6 hover:bg-amber-400 transition-colors cursor-pointer"
              onClick={handleWhatsAppClick}
            >
              <div className="text-neutral-900 text-sm md:text-base font-medium font-['Lora'] uppercase max-[380px]:tracking-[3px] tracking-[6px] md:tracking-[8px]">
                Quiero crear mi vino
              </div>
            </button>
          </div>

          {/* Right Image */}
          <div
            className="flex flex-col justify-center items-start gap-2.5 w-full lg:w-auto italic"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div className="w-full max-w-[460px] h-[400px] md:h-[500px] lg:h-[582px] relative rounded-lg overflow-hidden mx-auto lg:mx-0">
              <img
                alt="Lucas Moschetti - Enólogo"
                className="w-full h-full object-cover absolute inset-0"
                src="/images/foto-lucas-moschetti.png"
              />
            </div>
            <div className="w-full max-w-[460px] text-center lg:text-left mx-auto lg:mx-0">
              <span className="text-neutral-900 text-sm md:text-base font-semibold font-['Lora'] leading-tight tracking-tight">
                Lucas Moschetti,
              </span>
              <span className="text-neutral-900 text-sm md:text-base font-normal font-['Lora'] leading-tight tracking-tight">
                nuestro enólogo experto y apasionado, cada paso de este viaje
                será una aventura enriquecedora.
              </span>
            </div>
          </div>
        </div>

        {/* Button for mobile - outside flex container to be full width */}
        <button
          className="max-[480px]:flex hidden w-full max-[380px]:px-4 px-8 md:px-12 py-4 bg-amber-300 rounded-sm outline outline-[0.50px] outline-offset-[-0.50px] outline-neutral-900 justify-center items-center gap-2.5 mt-6 hover:bg-amber-400 transition-colors cursor-pointer"
          onClick={handleWhatsAppClick}
        >
          <div className="text-neutral-900 text-sm md:text-base font-medium font-['Lora'] uppercase max-[380px]:tracking-[3px] tracking-[6px] md:tracking-[8px]">
            Quiero crear mi vino
          </div>
        </button>
      </Section>
    </>
  );
}

import React from "react";

import { Section, SectionHeader } from "./ui";

const TermsAndConditions = () => {
  const terms = [
    {
      title: "Generalidades",
      content:
        "El presente documento establece los Términos y Condiciones de uso del sitio web www.lapertenencia.com, operado por La Pertenencia. Al acceder, navegar o realizar una compra en el Sitio, el usuario acepta estos Términos.",
    },
    {
      title: "Capacidad legal",
      content:
        "Solo pueden comprar personas mayores de 18 años. La empresa se reserva el derecho de cancelar pedidos si se detecta falsedad en los datos ingresados.",
    },
    {
      title: "Precios y disponibilidad",
      content:
        "Todos los precios están expresados en pesos argentinos e incluyen IVA. Los productos están sujetos a disponibilidad de stock. La Pertenencia se reserva el derecho de modificar precios sin previo aviso.",
    },
    {
      title: "Formas de pago",
      content:
        "Se aceptan tarjetas de crédito, débito, transferencias y otros métodos habilitados en el Sitio. Las operaciones son procesadas a través de plataformas seguras.",
    },
    {
      title: "Envíos",
      content:
        "La entrega se realiza por correo o mensajería, dependiendo del destino. La Pertenencia no se responsabiliza por demoras imputables a terceros.",
    },
    {
      title: "Política de devoluciones",
      content:
        "Solo se aceptarán devoluciones por productos dañados o defectuosos, comunicados dentro de las 48 horas de recibido el pedido.",
    },
    {
      title: "Propiedad intelectual",
      content:
        "Todos los contenidos del Sitio (textos, imágenes, logos, etc.) son propiedad de La Pertenencia o de terceros con autorización. Está prohibida su reproducción sin consentimiento.",
    },
    {
      title: "Modificaciones",
      content:
        "La empresa se reserva el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigencia al ser publicadas en el Sitio.",
    },
  ];

  return (
    <Section className="bg-white" id="terminos-y-condiciones">
      <SectionHeader
        subtitle="Términos y Condiciones"
        subtitleClassName="text-neutral-900 text-2xl md:text-3xl lg:text-4xl font-medium font-['Lora'] tracking-[6px] md:tracking-[8px] lg:tracking-[10px] mb-8"
        title=""
      />

      <div className="w-full max-w-[1300px] py-5 flex flex-col justify-start items-start gap-5">
        {terms.map((term, index) => (
          <React.Fragment key={index}>
            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              {/* Title */}
              <div className="w-full">
                <div className="w-full justify-start text-yellow-700 text-sm md:text-base font-semibold font-['Lora'] uppercase tracking-[3px] md:tracking-[4px]">
                  {term.title}
                </div>
              </div>

              {/* Content */}
              <div className="w-full pt-1.5">
                <div className="w-full justify-start text-neutral-900 text-sm md:text-base font-normal font-['Lora'] leading-normal tracking-wide">
                  {term.content}
                </div>
              </div>
            </div>

            {/* Divider - only show if not the last item */}
            {index < terms.length - 1 && (
              <div className="w-full h-0 border-b border-neutral-400 border-opacity-50" />
            )}
          </React.Fragment>
        ))}
      </div>
    </Section>
  );
};

export default TermsAndConditions;

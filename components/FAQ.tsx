import React from "react";

import { Section, SectionHeader } from "./ui";

const FAQ = () => {
  const faqs = [
    {
      question: "¿Hacen envíos a todo el país?",
      answer:
        "Sí, realizamos envíos a todo el territorio argentino a través de servicios logísticos confiables. \n\nEnvíos gratuitos a partir de la compra de $ 90.000 en Caba y Gran Buenos Aires (nos reservamos el derecho a modificar este monto).\nInterior del País, hacenos tu consulta.\n\nAl finalizar tu compra, podrás ver el costo y tiempo estimado de entrega según tu ubicación.",
    },
    {
      question: "¿Cuál es el tiempo de entrega?",
      answer:
        "El tiempo de entrega estimado es de 3 a 7 días hábiles, dependiendo de la localidad. Te enviaremos un número de seguimiento para que puedas ver el estado de tu pedido.\n\nMáximo 48 hs",
    },
    {
      question: "¿Puedo programar una entrega para un día específico?",
      answer:
        "En algunos casos sí. Si tenés un pedido especial o querés enviar un regalo, escribinos a info@lapertenencia.com antes de finalizar la compra y lo coordinamos.",
    },
    {
      question: "¿Hay un monto mínimo de compra?",
      answer:
        "La cantidad mínima de compra son 3 botellas (no necesariamente del mismo vino)",
    },
    {
      question: "¿Venden vinos para regalar?",
      answer:
        "Sí, ofrecemos presentaciones especiales para regalar, y también kits personalizados. Consultanos.",
    },
    {
      question: "¿Se puede comprar sin ser mayor de edad?",
      answer:
        "No. La venta de bebidas alcohólicas está prohibida a menores de 18 años. Antes de comprar, se solicita confirmación de mayoría de edad.",
    },
    {
      question: "¿Qué pasa si el vino llega dañado?",
      answer:
        "Si el producto llega roto o en mal estado, escribinos dentro de las 48 hs a info@lapertenencia.com con fotos del estado del paquete y lo solucionamos.",
    },
  ];

  return (
    <Section className="bg-white" id="preguntas-frecuentes">
      <SectionHeader
        subtitle="PREGUNTAS FRECUENTES"
        subtitleClassName="text-neutral-900 text-2xl md:text-3xl lg:text-4xl font-medium font-['Lora'] tracking-[6px] md:tracking-[8px] lg:tracking-[10px] mb-8"
        title=""
      />

      <div className="w-full max-w-[1300px] py-5 flex flex-col justify-start items-start gap-5">
        {faqs.map((faq, index) => (
          <React.Fragment key={index}>
            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              {/* Question */}
              <div className="w-full">
                <div className="w-full justify-start text-yellow-700 text-sm md:text-base font-semibold font-['Lora'] uppercase tracking-[3px] md:tracking-[4px]">
                  {faq.question}
                </div>
              </div>

              {/* Answer */}
              <div className="w-full pt-1.5">
                <div className="w-full justify-start text-neutral-900 text-sm md:text-base font-normal font-['Lora'] leading-normal tracking-wide whitespace-pre-line">
                  {faq.answer.includes("info@lapertenencia.com") ? (
                    <>
                      {faq.answer.split("info@lapertenencia.com")[0]}
                      <a
                        className="text-neutral-900 text-sm md:text-base font-normal font-['Lora'] underline leading-normal tracking-wide hover:text-yellow-700 transition-colors"
                        href="mailto:info@lapertenencia.com"
                      >
                        info@lapertenencia.com
                      </a>
                      {faq.answer.split("info@lapertenencia.com")[1]}
                    </>
                  ) : (
                    faq.answer
                  )}
                </div>
              </div>
            </div>

            {/* Divider - only show if not the last item */}
            {index < faqs.length - 1 && (
              <div className="w-full h-0 border-b border-neutral-400 border-opacity-50" />
            )}
          </React.Fragment>
        ))}
      </div>
    </Section>
  );
};

export default FAQ;

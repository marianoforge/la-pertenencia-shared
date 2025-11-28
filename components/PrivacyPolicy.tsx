import React from "react";

import { Section, SectionHeader } from "./ui";

const PrivacyPolicy = () => {
  const privacyPolicies = [
    {
      title: "Información recopilada",
      content:
        "Cuando navegás o comprás en www.lapertenencia.com, recopilamos información como tu nombre, dirección de correo, dirección de envío y datos de pago. También utilizamos cookies para mejorar tu experiencia.",
    },
    {
      title: "Uso de la información",
      content:
        "La información se utiliza para procesar tus pedidos, brindarte atención personalizada y enviarte novedades si aceptaste recibirlas.",
    },
    {
      title: "Protección de datos",
      content:
        "Implementamos medidas de seguridad para proteger tu información personal. No compartimos tus datos con terceros, salvo para fines logísticos o de procesamiento de pagos.",
    },
    {
      title: "Cookies",
      content:
        "Usamos cookies para recordar tus preferencias y mejorar la navegación. Podés deshabilitarlas desde tu navegador, aunque algunas funciones podrían no funcionar correctamente.",
    },
    {
      title: "Derechos del usuario",
      content:
        "Podés solicitar en cualquier momento la modificación o eliminación de tus datos personales escribiendo a info@lapertenencia.com.",
    },
    {
      title: "Modificaciones",
      content:
        "Nos reservamos el derecho de actualizar esta política. Cualquier cambio será informado en esta sección.",
    },
  ];

  return (
    <Section className="bg-white" id="politica-de-privacidad">
      <SectionHeader
        subtitle="Política de Privacidad"
        subtitleClassName="text-neutral-900 text-2xl md:text-3xl lg:text-4xl font-medium font-['Lora'] tracking-[6px] md:tracking-[8px] lg:tracking-[10px] mb-8"
        title=""
      />

      <div className="w-full max-w-[1300px] py-5 flex flex-col justify-start items-start gap-5">
        {privacyPolicies.map((policy, index) => (
          <React.Fragment key={index}>
            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              {/* Title */}
              <div className="w-full">
                <div className="w-full justify-start text-yellow-700 text-sm md:text-base font-semibold font-['Lora'] uppercase tracking-[3px] md:tracking-[4px]">
                  {policy.title}
                </div>
              </div>

              {/* Content */}
              <div className="w-full pt-1.5">
                <div className="w-full justify-start text-neutral-900 text-sm md:text-base font-normal font-['Lora'] leading-normal tracking-wide">
                  {policy.content.includes("info@lapertenencia.com") ? (
                    <>
                      {policy.content.split("info@lapertenencia.com")[0]}
                      <a
                        className="text-neutral-900 text-sm md:text-base font-normal font-['Lora'] underline leading-normal tracking-wide hover:text-yellow-700 transition-colors"
                        href="mailto:info@lapertenencia.com"
                      >
                        info@lapertenencia.com
                      </a>
                      {policy.content.split("info@lapertenencia.com")[1]}
                    </>
                  ) : (
                    policy.content
                  )}
                </div>
              </div>
            </div>

            {/* Divider - only show if not the last item */}
            {index < privacyPolicies.length - 1 && (
              <div className="w-full h-0 border-b border-neutral-400 border-opacity-50" />
            )}
          </React.Fragment>
        ))}
      </div>
    </Section>
  );
};

export default PrivacyPolicy;

import React, { useState } from "react";

import { Section } from "./ui";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    motivo: "",
    consulta: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const motivosOptions = [
    "Consulta sobre vinos",
    "Membresía mensual",
    "Catas y maridajes",
    "Regalos",
    "Otro",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMotivoSelect = (motivo: string) => {
    setFormData((prev) => ({
      ...prev,
      motivo,
    }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: "¡Mensaje enviado con éxito! Te responderemos pronto.",
        });
        // Limpiar formulario
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          motivo: "",
          consulta: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Error al enviar el mensaje. Intenta nuevamente.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Error al enviar el mensaje. Verifica tu conexión.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section
      className="relative md:min-h-[800px] min-h-[630px] !px-0"
      id="contacto"
      variant="full-width"
    >
      {/* Background Image */}
      <img
        alt="Contacto"
        className="w-full h-full object-cover absolute inset-0"
        src="/images/contactanos.png"
      />

      {/* Overlay */}
      <div className="md:h-[800px] absolute inset-0 bg-gradient-to-l from-neutral-900 via-neutral-900/85 to-neutral-900" />

      {/* Form Container */}
      <div className="relative z-10 w-full max-[380px]:px-0 max-[480px]:px-0 px-4 flex justify-center items-center">
        <div className="w-full max-w-96 sm:max-w-2xl px-4 sm:px-8 flex flex-col justify-start items-center gap-7 overflow-hidden rounded-lg">
          {/* Header */}
          <div className="self-stretch py-5 flex flex-col justify-start items-center gap-2.5">
            <div className=" text-center justify-start text-dorado-light text-sm md:text-base lg:text-xl font-medium font-['Lora'] uppercase tracking-[7px] md:tracking-[8px] lg:tracking-[10px]">
              contactanos
            </div>
            <div className="self-stretch text-center justify-start text-neutral-100 text-2xl md:text-3xl lg:text-4xl font-medium font-['Lora'] tracking-[3px] md:tracking-[4px] lg:tracking-[5px]">
              Pertenecer es encontrarse
            </div>
          </div>

          {/* Form */}
          <form
            className="self-stretch flex justify-center items-start"
            onSubmit={handleSubmit}
          >
            <div className="flex-1 md:inline-flex flex flex-col justify-center items-center gap-5 md:gap-6">
              {/* Nombre y Apellido */}
              <div className="self-stretch flex justify-start items-start gap-5">
                <div className="flex-1 px-4 py-2.5 md:px-5 md:py-4 bg-white/10 border-b border-neutral-400 flex justify-start items-center">
                  <input
                    required
                    className="w-full bg-transparent text-white text-sm md:text-base font-normal font-['Lora'] tracking-wide placeholder-white placeholder-opacity-70 focus:outline-none"
                    name="nombre"
                    placeholder="Nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex-1 px-4 py-2.5 md:px-5 md:py-4 bg-white/10 border-b border-neutral-400 flex justify-start items-center">
                  <input
                    required
                    className="w-full bg-transparent text-white text-sm md:text-base font-normal font-['Lora'] tracking-wide placeholder-white placeholder-opacity-70 focus:outline-none"
                    name="apellido"
                    placeholder="Apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="self-stretch px-4 py-2.5 md:px-5 md:py-4 bg-white/10 border-b border-neutral-400 flex justify-start items-center">
                <input
                  required
                  className="w-full bg-transparent text-white text-sm md:text-base font-normal font-['Lora'] tracking-wide placeholder-white placeholder-opacity-70 focus:outline-none"
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Motivo Dropdown */}
              <div className="self-stretch px-4 py-2.5 md:px-5 md:py-4 bg-white/10 border-b border-neutral-400 relative">
                <button
                  className="w-full flex justify-between items-center text-left"
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-white text-sm md:text-base font-normal font-['Lora'] tracking-wide">
                    {formData.motivo || "Motivo"}
                  </span>
                  <div className="w-2.5 h-3 relative">
                    <div
                      className={`w-2.5 h-1.5 border-[1.50px] border-white transition-transform ${isDropdownOpen ? "rotate-0" : "rotate-180"}`}
                      style={{
                        borderLeft: "transparent",
                        borderRight: "transparent",
                        borderBottom: "1.50px solid white",
                        borderTop: "transparent",
                        width: "0",
                        height: "0",
                        borderLeftWidth: "5px",
                        borderRightWidth: "5px",
                        borderBottomWidth: "6px",
                      }}
                    />
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-neutral-700 border border-neutral-400 z-20 max-h-40 overflow-y-auto">
                    {motivosOptions.map((motivo) => (
                      <button
                        key={motivo}
                        className="w-full px-4 py-2 text-left text-white text-sm md:text-base font-normal font-['Lora'] tracking-wide hover:bg-white/10 transition-colors"
                        type="button"
                        onClick={() => handleMotivoSelect(motivo)}
                      >
                        {motivo}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Consulta */}
              <div className="self-stretch h-28 md:h-40 px-4 py-2.5 md:px-5 md:py-4 bg-white/10 border-b border-neutral-400 flex justify-start items-start">
                <textarea
                  required
                  className="w-full h-full bg-transparent text-white text-sm md:text-base font-normal font-['Lora'] tracking-wide placeholder-white placeholder-opacity-70 focus:outline-none resize-none"
                  name="consulta"
                  placeholder="Tu consulta..."
                  value={formData.consulta}
                  onChange={handleInputChange}
                />
              </div>

              {/* Submit Button */}
              <button
                className="self-stretch h-9 px-7 py-3 bg-amber-300 rounded-sm outline outline-[0.36px] outline-offset-[-0.36px] outline-neutral-900 flex justify-center items-center gap-2 hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                type="submit"
              >
                <span className="text-neutral-900 text-sm font-medium font-['Lora'] uppercase tracking-[7px]">
                  {isLoading ? "Enviando..." : "Enviar"}
                </span>
              </button>

              {/* Success/Error Message */}
              {message && (
                <div
                  className={`self-stretch text-center text-sm md:text-base font-['Lora'] px-4 py-3 rounded ${
                    message.type === "success"
                      ? "bg-green-500/20 text-green-300 border border-green-500/50"
                      : "bg-red-500/20 text-red-300 border border-red-500/50"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
};

export default Contacto;

import { useState, useEffect } from "react";

const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si ya se ha confirmado la edad en esta sesión
    const hasConfirmedAge = sessionStorage.getItem("ageConfirmed");

    if (!hasConfirmedAge) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem("ageConfirmed", "true");
    setIsOpen(false);
  };

  const handleDeny = () => {
    // Redirigir a una página de error o cerrar la aplicación
    window.location.href = "https://www.google.com";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay con fondo opaco */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-80 md:w-[28rem] lg:w-[32rem] h-60 sm:h-52 md:h-44 p-7 py-8 bg-neutral-50 rounded-sm flex flex-col justify-start items-start gap-2.5 overflow-hidden mx-4">
        <div className="self-stretch flex flex-col justify-center items-start gap-2.5">
          <div className="self-stretch pb-5 inline-flex justify-between items-center">
            <div className="justify-start text-black text-base font-semibold font-['Lora'] uppercase tracking-[4px] text-center w-full">
              ¿Sos mayor de 18 años?
            </div>
          </div>
        </div>

        <div className="self-stretch py-2 inline-flex justify-start items-end gap-3 md:gap-5 flex-col sm:flex-row">
          <button
            className="flex-1 h-10 px-7 py-2 bg-neutral-900 rounded-sm outline outline-[0.50px] outline-offset-[-0.50px] outline-amber-300 flex justify-center items-center gap-4 w-full sm:w-auto cursor-pointer hover:bg-neutral-800 transition-colors duration-200"
            onClick={handleConfirm}
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          >
            <div className="justify-start text-dorado-light text-base font-medium font-['Lora'] tracking-[3.20px]">
              SI
            </div>
          </button>
          <button
            className="flex-1 h-10 px-7 py-2 rounded-sm outline outline-[0.50px] outline-offset-[-0.50px] outline-neutral-900 flex justify-center items-center gap-4 w-full sm:w-auto cursor-pointer hover:bg-neutral-100 transition-colors duration-200"
            onClick={handleDeny}
            onKeyDown={(e) => e.key === "Enter" && handleDeny()}
          >
            <div className="justify-start text-neutral-900 text-base font-medium font-['Lora'] tracking-[3.20px]">
              NO
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;

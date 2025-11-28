import React, { useState } from "react";
import { addNewsletterSubscription } from "@/lib/firestore";

const NewsLetterForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await addNewsletterSubscription(email);

      if (result.success) {
        setMessage({
          type: "success",
          text: "¡Gracias por suscribirte! Pronto recibirás nuestras novedades.",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: result.error || "Error al suscribirse. Intenta nuevamente.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Error al suscribirse. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative flex items-center justify-center">
      <div className="w-full max-w-[1920px] mx-auto relative">
        <img
          alt="Newsletter"
          className="w-full h-80 sm:h-[262px] md:h-64 lg:h-[300px] object-cover"
          src="/images/newsletterSectionBG.png"
        />
        <div className="absolute top-[36px] left-1/2 -translate-x-1/2 sm:top-10 lg:top-[15%] min-[900px]:left-auto min-[900px]:translate-x-0 min-[900px]:right-[max(0px,calc((100vw-1300px)/2))] max-[380px]:left-3 max-[380px]:right-3 max-[480px]:left-4 max-[480px]:right-4 max-[480px]:translate-x-0">
          <div className="max-[480px]:w-full w-80 sm:w-96 lg:w-[600px] lg:h-[300px] px-7 pt-5 pb-10 bg-neutral-900 rounded outline outline-1 outline-offset-[-1px] outline-neutral-400 inline-flex flex-col justify-center items-center gap-5">
            <div className="self-stretch pt-2.5 flex flex-col justify-start items-center gap-1.5">
              <div className="self-stretch text-center justify-start text-dorado-light text-sm font-medium md:text-lg font-['Lora'] uppercase tracking-[7px]">
                newsletter
              </div>
              <div className="self-stretch text-center justify-start text-white text-sm font-normal font-['Lora'] leading-tight tracking-wide">
                Suscríbete a nuestro Newsletter y disfruta de experiencias
                únicas.
              </div>
            </div>
            <form
              className="self-stretch flex flex-col justify-center items-center gap-5"
              onSubmit={handleSubmit}
            >
              <div className="self-stretch px-4 py-2.5 bg-white/10 border-b border-neutral-400 inline-flex justify-start items-center gap-16">
                <input
                  required
                  className="flex-1 bg-transparent outline-none text-white text-sm font-normal font-['Lora'] tracking-wide placeholder:text-white/70"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                className="self-stretch h-9 px-7 py-3 bg-amber-300 rounded-sm outline outline-[0.36px] outline-offset-[-0.36px] outline-neutral-900 inline-flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
                type="submit"
                disabled={isLoading}
              >
                <div className="justify-start text-neutral-900 text-sm font-medium font-['Lora'] uppercase tracking-[7px]">
                  {isLoading ? "suscribiendo..." : "suscribirse"}
                </div>
              </button>
              {message && (
                <div
                  className={`self-stretch text-center text-sm font-['Lora'] ${
                    message.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetterForm;

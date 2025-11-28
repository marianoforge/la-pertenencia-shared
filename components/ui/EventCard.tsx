import React from "react";

import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  description: string;
  date?: string;
  time?: string;
  location?: string;
  image: string;
  imageAlt: string;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  image,
  imageAlt,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-neutral-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-amber-300 overflow-hidden",
        "flex flex-col sm:flex-row items-start gap-0 sm:gap-5 md:gap-6 lg:gap-6",
        className
      )}
    >
      {/* Image */}
      <img
        alt={imageAlt}
        className="w-full h-56 sm:w-28 sm:h-28 md:w-36 md:h-full object-cover flex-shrink-0"
        src={image}
      />

      {/* Content */}
      <div className="w-full flex flex-col justify-start items-start gap-2 p-2.5 sm:p-0 sm:pt-6 sm:pr-5 md:pr-7 lg:pr-0">
        {/* Title and Description */}
        <div className="flex flex-col justify-start items-start gap-2">
          <div className="text-neutral-900 text-sm md:text-base font-semibold font-['Lora'] uppercase tracking-[3.50px] md:tracking-[4px]">
            {title}
          </div>
          <div className="text-yellow-700 text-sm md:text-base font-normal font-['Lora'] tracking-wide sm:w-full md:w-[515px] lg:w-[515px] px-2">
            {description}
          </div>
        </div>

        {/* Metadata */}
        <div className="pb-[5px] flex justify-start items-center gap-3 sm:gap-5 flex-wrap">
          {/* Date */}
          {/* <div className="flex justify-start items-center gap-[5px]">
            <img
              alt="Fecha"
              className="w-5 h-5 object-contain"
              src="/icons/ICON_Fecha.svg"
            />
            <div className="text-neutral-500 text-xs md:text-base font-normal font-['Lora'] tracking-wide">
              {date}
            </div>
          </div> */}

          {/* Time */}
          {/* <div className="flex justify-start items-center gap-[5px]">
            <img
              alt="Hora"
              className="w-5 h-5 object-contain"
              src="/icons/ICON_hora.svg"
            />
            <div className="text-neutral-500 text-xs md:text-base font-normal font-['Lora'] tracking-wide">
              {time}
            </div>
          </div> */}

          {/* Location */}
          {/* <div className="flex justify-start items-center gap-1">
            <img
              alt="Lugar"
              className="w-5 h-5 object-contain"
              src="/icons/ICON_lugar.svg"
            />
            <div className="text-neutral-500 text-xs md:text-base font-normal font-['Lora'] tracking-wide">
              {location}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export { EventCard };
export type { EventCardProps };

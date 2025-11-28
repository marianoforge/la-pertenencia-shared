import React from "react";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}) => {
  return (
    <div
      className={cn(
        "w-full max-w-[1300px] flex flex-col justify-start items-center gap-2.5",
        className,
      )}
    >
      <div
        className={cn(
          "w-full text-center text-yellow-700 text-sm md:text-base lg:text-xl font-medium font-['Lora'] uppercase tracking-[7px] md:tracking-[8px] lg:tracking-[10px] mb-2",
          titleClassName,
        )}
      >
        {title}
      </div>
      <div
        className={cn(
          "px-4 sm:px-0 w-full text-center text-neutral-900 text-2xl md:text-3xl lg:text-4xl font-medium font-['Lora'] tracking-[6px] md:tracking-[8px] lg:tracking-[10px]",
          subtitleClassName,
        )}
      >
        {subtitle}
      </div>
    </div>
  );
};

export { SectionHeader };
export type { SectionHeaderProps };

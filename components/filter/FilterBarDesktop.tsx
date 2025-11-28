import { useRef } from "react";
import Image from "next/image";

import { SearchInput, DropdownIcon } from "../ui";

interface FilterBarDesktopProps {
  sortBy: string;
  sortOptions: readonly { value: string; label: string }[];
  searchTerm: string;
  onToggleFilters: () => void;
  onSearchChange: (value: string) => void;
  onDropdownToggle: () => void;
}

export const FilterBarDesktop: React.FC<FilterBarDesktopProps> = ({
  sortBy,
  sortOptions,
  searchTerm,
  onToggleFilters,
  onSearchChange,
  onDropdownToggle,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="hidden md:flex justify-between items-center gap-3">
      {/* Left side - Filter button */}
      <button
        className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-100 rounded-sm transition-colors"
        type="button"
        onClick={onToggleFilters}
      >
        <span className="text-neutral-900 text-sm md:text-base font-normal font-['Lora'] tracking-wide">
          Filtrar por:
        </span>
        <Image
          alt="Filtrar"
          className="w-5 h-5"
          height={20}
          src="/images/icon-filtros.svg"
          width={20}
        />
      </button>

      {/* Center - Search Input */}
      <SearchInput
        className="flex-1 max-w-md mx-4"
        value={searchTerm}
        onChange={onSearchChange}
      />

      {/* Right side - Sort dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-neutral-900 text-sm md:text-base font-normal font-['Lora'] tracking-wide">
          Ordenar por:
        </span>

        <div className="relative z-[9998]">
          <button
            ref={buttonRef}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-400 rounded-sm text-left hover:border-neutral-600 transition-colors min-w-[120px]"
            type="button"
            onClick={onDropdownToggle}
          >
            <span className="text-neutral-900 font-['Lora'] text-sm flex-1">
              {sortOptions.find((option) => option.value === sortBy)?.label ||
                "Más relevantes"}
            </span>
            <DropdownIcon />
          </button>
        </div>
      </div>
    </div>
  );
};


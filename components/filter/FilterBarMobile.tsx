import { useRef } from "react";
import Image from "next/image";

import { SearchInput, DropdownIcon } from "../ui";

interface FilterBarMobileProps {
  sortBy: string;
  sortOptions: readonly { value: string; label: string }[];
  searchTerm: string;
  onToggleFilters: () => void;
  onSearchChange: (value: string) => void;
  onDropdownToggle: () => void;
}

export const FilterBarMobile: React.FC<FilterBarMobileProps> = ({
  sortBy,
  sortOptions,
  searchTerm,
  onToggleFilters,
  onSearchChange,
  onDropdownToggle,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex md:hidden flex-col gap-3">
      {/* Search Input */}
      <SearchInput value={searchTerm} onChange={onSearchChange} />

      {/* Sort dropdown */}
      <div className="flex items-center gap-3 justify-end">
        <span className="text-neutral-900 text-sm font-normal font-['Lora'] tracking-wide">
          Ordenar por:
        </span>

        <div className="relative z-[9998] flex-1">
          <button
            ref={buttonRef}
            className="w-full flex items-center gap-2 px-4 py-2 border border-neutral-400 rounded-sm text-left hover:border-neutral-600 transition-colors"
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

        {/* Filter button */}
        <button
          className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 rounded-sm transition-colors"
          type="button"
          onClick={onToggleFilters}
        >
          <Image
            alt="Filtrar"
            className="w-5 h-5"
            height={20}
            src="/images/icon-filtros.svg"
            width={20}
          />
        </button>
      </div>
    </div>
  );
};


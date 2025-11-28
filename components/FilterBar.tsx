import { useState, useRef, useCallback, useEffect } from "react";

import { useFilterStore } from "@/stores/useFilterStore";
import { SORT_OPTIONS } from "@/lib/wineConstants";
import { useDropdownPosition } from "@/hooks/useDropdownPosition";
import { FilterBarDesktop } from "./filter/FilterBarDesktop";
import { FilterBarMobile } from "./filter/FilterBarMobile";
import { SortDropdownPortal } from "./filter/SortDropdownPortal";

interface FilterBarProps {
  onSortChange?: (sortBy: string) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const FilterBar = ({
  onSortChange,
  searchTerm = "",
  onSearchChange,
}: FilterBarProps) => {
  const { toggleFilters, sortBy, updateSort } = useFilterStore();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const desktopButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const dropdownPosition = useDropdownPosition(
    desktopButtonRef,
    mobileButtonRef,
    showSortDropdown
  );

  const handleSortChange = useCallback(
    (value: string) => {
      updateSort(value);
      setShowSortDropdown(false);
      onSortChange?.(value);
    },
    [updateSort, onSortChange]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDesktop =
        desktopButtonRef.current && !desktopButtonRef.current.contains(target);
      const isOutsideMobile =
        mobileButtonRef.current && !mobileButtonRef.current.contains(target);

      if (isOutsideDesktop && isOutsideMobile) {
        const isDropdownButton = (target as HTMLElement).closest(
          '[data-dropdown-option="true"]'
        );
        if (!isDropdownButton) {
          setShowSortDropdown(false);
        }
      }
    };

    if (showSortDropdown) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortDropdown]);

  return (
    <>
      <div className="self-stretch py-5 rounded-sm border-t border-neutral-400 relative z-[9997]">
        <FilterBarDesktop
          searchTerm={searchTerm}
          sortBy={sortBy}
          sortOptions={SORT_OPTIONS}
          onDropdownToggle={() => setShowSortDropdown(!showSortDropdown)}
          onSearchChange={onSearchChange || (() => {})}
          onToggleFilters={toggleFilters}
        />

        <FilterBarMobile
          searchTerm={searchTerm}
          sortBy={sortBy}
          sortOptions={SORT_OPTIONS}
          onDropdownToggle={() => setShowSortDropdown(!showSortDropdown)}
          onSearchChange={onSearchChange || (() => {})}
          onToggleFilters={toggleFilters}
        />
      </div>
      
      <SortDropdownPortal
        dropdownPosition={dropdownPosition}
        isOpen={showSortDropdown}
        sortOptions={SORT_OPTIONS}
        onSortChange={handleSortChange}
      />
    </>
  );
};

export default FilterBar;

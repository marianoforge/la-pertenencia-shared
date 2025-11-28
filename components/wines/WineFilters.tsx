import { useState } from "react";

import { WineFilters as WineFiltersType } from "@/types/wine";
import { Dropdown } from "../ui";
import {
  SORT_OPTIONS,
  REGION_OPTIONS,
  BRAND_OPTIONS,
  WINE_TYPE_OPTIONS,
  VARIETAL_OPTIONS,
} from "@/lib/wineConstants";

interface WineFiltersProps {
  onFiltersChange: (filters: WineFiltersType) => void;
  onSortChange: (sort: string) => void;
}

const WineFilters = ({ onFiltersChange, onSortChange }: WineFiltersProps) => {
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedBodega, setSelectedBodega] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedVarietal, setSelectedVarietal] = useState("");
  const [currentFilters, setCurrentFilters] = useState<WineFiltersType>({});

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showBodegaDropdown, setShowBodegaDropdown] = useState(false);
  const [showMarcaDropdown, setShowMarcaDropdown] = useState(false);
  const [showTipoDropdown, setShowTipoDropdown] = useState(false);
  const [showVarietalDropdown, setShowVarietalDropdown] = useState(false);

  const updateFilter = (
    filterType: "bodega" | "marca" | "tipo" | "varietal",
    value: string
  ) => {
    const newFilters = { ...currentFilters };

    switch (filterType) {
      case "bodega":
        setSelectedBodega(value);
        newFilters.region = value || undefined;
        break;
      case "marca":
        setSelectedMarca(value);
        break;
      case "tipo":
        setSelectedTipo(value);
        newFilters.category = value || undefined;
        break;
      case "varietal":
        setSelectedVarietal(value);
        break;
    }

    setCurrentFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="self-stretch py-5 rounded-sm border-t border-neutral-400 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0 overflow-visible">
      {/* Ordenar por */}
      <div className="flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2 sm:gap-5">
        <div className="text-black text-sm md:text-base font-normal font-['Lora'] tracking-wide whitespace-nowrap">
          Ordenar por:
        </div>
        <Dropdown
          className="w-full sm:w-48"
          isOpen={showSortDropdown}
          label="Ordenar"
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={(value) => {
            setSortBy(value);
            onSortChange(value);
          }}
          onToggle={() => setShowSortDropdown(!showSortDropdown)}
        />
      </div>

      {/* Filtrar por */}
      <div className="flex flex-col lg:flex-row lg:justify-start lg:items-center gap-4 lg:gap-5">
        <div className="text-black text-sm md:text-base font-normal font-['Lora'] tracking-wide whitespace-nowrap">
          Filtrar por:
        </div>
        <div className="grid grid-cols-2 lg:flex lg:justify-start lg:items-center gap-2 lg:gap-5">
          <Dropdown
            className="w-full lg:w-40"
            isOpen={showBodegaDropdown}
            label="Bodega"
            options={REGION_OPTIONS}
            placeholder="Bodega"
            value={selectedBodega}
            onChange={(value) => updateFilter("bodega", value)}
            onToggle={() => setShowBodegaDropdown(!showBodegaDropdown)}
          />

          <Dropdown
            className="w-full lg:w-40"
            isOpen={showMarcaDropdown}
            label="Marca"
            options={BRAND_OPTIONS}
            placeholder="Marca"
            value={selectedMarca}
            onChange={(value) => updateFilter("marca", value)}
            onToggle={() => setShowMarcaDropdown(!showMarcaDropdown)}
          />

          <Dropdown
            className="w-full lg:w-40"
            isOpen={showTipoDropdown}
            label="Tipo"
            options={WINE_TYPE_OPTIONS}
            placeholder="Tipo"
            value={selectedTipo}
            onChange={(value) => updateFilter("tipo", value)}
            onToggle={() => setShowTipoDropdown(!showTipoDropdown)}
          />

          <Dropdown
            className="w-full lg:w-40"
            isOpen={showVarietalDropdown}
            label="Varietal"
            options={VARIETAL_OPTIONS}
            placeholder="Varietal"
            value={selectedVarietal}
            onChange={(value) => updateFilter("varietal", value)}
            onToggle={() => setShowVarietalDropdown(!showVarietalDropdown)}
          />
        </div>
      </div>
    </div>
  );
};

export default WineFilters;

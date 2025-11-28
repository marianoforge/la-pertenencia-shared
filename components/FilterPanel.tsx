import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useFilterStore } from "@/stores/useFilterStore";
import { useWineFilterOptions } from "@/hooks/useWineFilterOptions";
import { COLOR_OPTIONS, SPARKLING_OPTIONS } from "@/lib/wineConstants";
import { FilterPanelDropdown } from "./filter/FilterPanelDropdown";

const FilterPanel = () => {
  const { isOpen, filters, closeFilters, updateFilters, clearFilters } =
    useFilterStore();

  const [showBodegaDropdown, setShowBodegaDropdown] = useState(false);
  const [showMarcaDropdown, setShowMarcaDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showEspumanteDropdown, setShowEspumanteDropdown] = useState(false);
  const [showVarietalDropdown, setShowVarietalDropdown] = useState(false);

  const [selectedBodega, setSelectedBodega] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedEspumante, setSelectedEspumante] = useState("");
  const [selectedVarietal, setSelectedVarietal] = useState("");

  const { data: filterOptions } = useWineFilterOptions();

  const bodegas = (filterOptions as any)?.bodegas || [];
  const marcas = (filterOptions as any)?.marcas || [];
  const varietales = (filterOptions as any)?.varietales || [];

  const handleFilterChange = (filterType: string, value: string) => {
    let newFilters = { ...filters };

    switch (filterType) {
      case "bodega":
        setSelectedBodega(value);
        newFilters.bodega = value || undefined;
        setShowBodegaDropdown(false);
        break;
      case "marca":
        setSelectedMarca(value);
        newFilters.marca = value || undefined;
        setShowMarcaDropdown(false);
        break;
      case "color":
        setSelectedColor(value);
        newFilters.category = value || undefined;
        setShowColorDropdown(false);
        break;
      case "espumante":
        setSelectedEspumante(value);
        newFilters.category = value === "Sí" ? "Espumante" : undefined;
        setShowEspumanteDropdown(false);
        break;
      case "varietal":
        setSelectedVarietal(value);
        newFilters.varietal = value || undefined;
        setShowVarietalDropdown(false);
        break;
    }

    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    setSelectedBodega("");
    setSelectedMarca("");
    setSelectedColor("");
    setSelectedEspumante("");
    setSelectedVarietal("");
    clearFilters();
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Cerrar filtros"
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeFilters}
          />

          {/* Filter Panel */}
          <motion.div
            animate={{ x: 0 }}
            className="fixed left-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            exit={{ x: "-100%" }}
            initial={{ x: "-100%" }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94], // easeOutCubic
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-400">
              <h2 className="text-lg font-semibold font-['Lora'] text-neutral-900 uppercase tracking-[4px]">
                Filtrar por:
              </h2>
              <button
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
                onClick={closeFilters}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanelDropdown
                allLabel="Todas las bodegas"
                isOpen={showBodegaDropdown}
                label="Bodega"
                options={bodegas}
                selectedValue={selectedBodega}
                onChange={(value) => handleFilterChange("bodega", value)}
                onToggle={() => setShowBodegaDropdown(!showBodegaDropdown)}
              />

              <FilterPanelDropdown
                allLabel="Todas las marcas"
                isOpen={showMarcaDropdown}
                label="Marca"
                options={marcas}
                selectedValue={selectedMarca}
                onChange={(value) => handleFilterChange("marca", value)}
                onToggle={() => setShowMarcaDropdown(!showMarcaDropdown)}
              />

              <FilterPanelDropdown
                allLabel="Todos los colores"
                isOpen={showColorDropdown}
                label="Color"
                options={[...COLOR_OPTIONS]}
                selectedValue={selectedColor}
                onChange={(value) => handleFilterChange("color", value)}
                onToggle={() => setShowColorDropdown(!showColorDropdown)}
              />

              <FilterPanelDropdown
                allLabel="Todos"
                isOpen={showEspumanteDropdown}
                label="Espumante"
                options={[...SPARKLING_OPTIONS]}
                selectedValue={
                  selectedEspumante ? `Espumante: ${selectedEspumante}` : ""
                }
                onChange={(value) => handleFilterChange("espumante", value)}
                onToggle={() => setShowEspumanteDropdown(!showEspumanteDropdown)}
              />

              <FilterPanelDropdown
                allLabel="Todos los varietales"
                isOpen={showVarietalDropdown}
                label="Varietal"
                options={varietales}
                selectedValue={selectedVarietal}
                onChange={(value) => handleFilterChange("varietal", value)}
                onToggle={() => setShowVarietalDropdown(!showVarietalDropdown)}
              />
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-neutral-400 flex gap-3">
              <button
                className="flex-1 h-10 px-4 py-2 bg-neutral-900 rounded-sm flex justify-center items-center hover:bg-neutral-800 transition-colors"
                onClick={closeFilters}
              >
                <span className="text-dorado-light text-sm font-medium font-['Lora'] uppercase tracking-[3px]">
                  Aplicar
                </span>
              </button>
              <button
                className="flex-1 h-10 px-4 py-2 rounded-sm border border-neutral-400 flex justify-center items-center hover:bg-neutral-100 transition-colors"
                onClick={handleClearFilters}
              >
                <span className="text-neutral-900 text-sm font-medium font-['Lora'] uppercase tracking-[3px]">
                  Descartar
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;

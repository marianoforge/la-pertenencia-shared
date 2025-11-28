import { motion, AnimatePresence } from "framer-motion";

import { DropdownIcon } from "../ui";

interface FilterPanelDropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  isOpen: boolean;
  allLabel?: string;
  onToggle: () => void;
  onChange: (value: string) => void;
}

export const FilterPanelDropdown: React.FC<FilterPanelDropdownProps> = ({
  label,
  options,
  selectedValue,
  isOpen,
  allLabel = `Todos los ${label.toLowerCase()}`,
  onToggle,
  onChange,
}) => (
  <div className="mb-6">
    <div className="relative">
      <button
        className="w-full px-4 py-3 bg-white border border-neutral-400 rounded-sm text-left flex justify-between items-center hover:border-neutral-600 transition-colors"
        type="button"
        onClick={onToggle}
      >
        <span className="text-neutral-900 font-['Lora'] text-sm">
          {selectedValue || label}
        </span>
        <DropdownIcon />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            className="absolute top-full left-0 right-0 bg-white border border-neutral-400 border-t-0 rounded-b-sm z-10 max-h-40 overflow-y-auto"
            exit={{ opacity: 0, y: -10, scaleY: 0 }}
            initial={{ opacity: 0, y: -10, scaleY: 0 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
              transformOrigin: "top",
            }}
          >
            <button
              className="w-full px-4 py-2 text-left text-neutral-900 font-['Lora'] text-sm hover:bg-neutral-100 transition-colors"
              type="button"
              onClick={() => onChange("")}
            >
              {allLabel}
            </button>
            {options.map((option) => (
              <button
                key={option}
                className="w-full px-4 py-2 text-left text-neutral-900 font-['Lora'] text-sm hover:bg-neutral-100 transition-colors"
                type="button"
                onClick={() => onChange(option)}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);


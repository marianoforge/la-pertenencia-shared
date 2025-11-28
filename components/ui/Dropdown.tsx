import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { DropdownIcon } from "./icons/DropdownIcon";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: readonly DropdownOption[] | DropdownOption[];
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  isOpen,
  onToggle,
  onChange,
  className = "",
  placeholder,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder || label;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        className="w-full pl-3 pr-2.5 py-2.5 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-neutral-400 flex justify-between items-center hover:bg-gray-50 transition-colors"
        type="button"
        onClick={onToggle}
      >
        <div className="text-black text-xs md:text-base font-normal font-['Lora'] tracking-wide truncate">
          {displayLabel}
        </div>
        <DropdownIcon />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            className="absolute top-full left-0 w-full bg-white border border-neutral-400 rounded-sm mt-1 z-[9999] shadow-lg max-h-60 overflow-y-auto"
            exit={{ opacity: 0, y: -10, scaleY: 0 }}
            initial={{ opacity: 0, y: -10, scaleY: 0 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
              transformOrigin: "top",
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                className="w-full px-3 py-2 text-left text-xs md:text-base font-normal font-['Lora'] tracking-wide hover:bg-gray-50 transition-colors"
                type="button"
                onClick={() => {
                  onChange(option.value);
                  onToggle();
                }}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


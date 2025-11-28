import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SortDropdownPortalProps {
  isOpen: boolean;
  sortOptions: readonly { value: string; label: string }[];
  dropdownPosition: { top: number; left: number; width: number };
  onSortChange: (value: string) => void;
}

export const SortDropdownPortal: React.FC<SortDropdownPortalProps> = ({
  isOpen,
  sortOptions,
  dropdownPosition,
  onSortChange,
}) => {
  if (typeof window === "undefined") {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="sort-dropdown"
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-400 rounded-b-sm shadow-2xl"
          exit={{ opacity: 0, y: -10 }}
          initial={{ opacity: 0, y: -10 }}
          style={{
            position: "fixed",
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: Math.max(dropdownPosition.width, 180),
            zIndex: 99999,
            backgroundColor: "white",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          }}
          transition={{
            duration: 0.15,
            ease: "easeOut",
          }}
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className="w-full px-4 py-2 text-left text-neutral-900 font-['Lora'] text-sm bg-white hover:bg-neutral-100 transition-colors first:rounded-t-sm last:rounded-b-sm"
              data-dropdown-option="true"
              type="button"
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};


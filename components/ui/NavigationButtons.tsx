interface NavigationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  ariaLabel?: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  ariaLabel: _ariaLabel = "Navegación",
}) => (
  <div className="flex justify-center items-center gap-4">
    <button
      aria-label="Anterior"
      className="p-2 text-neutral-900 hover:text-neutral-600 transition-colors disabled:text-neutral-400 disabled:cursor-not-allowed"
      disabled={currentPage === 0}
      type="button"
      onClick={onPrevious}
    >
      <svg
        fill="none"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>

    <div className="text-neutral-900 text-sm font-medium font-['Lora'] min-w-[40px] text-center">
      {currentPage + 1} / {totalPages}
    </div>

    <button
      aria-label="Siguiente"
      className="p-2 text-neutral-900 hover:text-neutral-600 transition-colors disabled:text-neutral-400 disabled:cursor-not-allowed"
      disabled={currentPage === totalPages - 1}
      type="button"
      onClick={onNext}
    >
      <svg
        fill="none"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  </div>
);


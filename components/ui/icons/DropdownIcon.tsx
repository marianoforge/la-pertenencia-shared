interface DropdownIconProps {
  "aria-hidden"?: boolean;
}

export const DropdownIcon: React.FC<DropdownIconProps> = ({ 
  "aria-hidden": ariaHidden = false,
}) => (
  <div className="w-5 h-5 relative flex items-center justify-center">
    <svg
      aria-hidden={ariaHidden}
      fill="none"
      height="6"
      viewBox="0 0 12 6"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L6 5L11 1"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  </div>
);


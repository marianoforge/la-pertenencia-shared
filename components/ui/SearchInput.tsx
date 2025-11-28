import { SearchIcon } from "./icons/SearchIcon";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Buscar vinos...",
  className = "",
}) => (
  <div className={`pl-3 pr-2.5 py-2.5 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-neutral-400 flex justify-between items-center ${className}`}>
    <input
      className="flex-1 outline-none text-black text-sm md:text-base font-normal font-['Lora'] tracking-wide bg-transparent"
      placeholder={placeholder}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <SearchIcon />
  </div>
);


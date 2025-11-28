import { Input } from "@heroui/input";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AdminSearchBar: React.FC<AdminSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}) => {
  return (
    <Input
      className={className}
      placeholder={placeholder}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

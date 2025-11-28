interface OrderFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "processing", label: "Procesando" },
  { value: "completed", label: "Completados" },
  { value: "cancelled", label: "Cancelados" },
];

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {STATUS_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedStatus === option.value
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => onStatusChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

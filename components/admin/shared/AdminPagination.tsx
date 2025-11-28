import { Button } from "@heroui/button";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        disabled={currentPage === 1}
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </Button>

      <span className="text-sm text-gray-600">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        disabled={currentPage === totalPages}
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente
      </Button>
    </div>
  );
};

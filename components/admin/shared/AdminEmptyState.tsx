import { Button } from "@heroui/button";

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {description && (
        <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      )}

      {actionLabel && onAction && (
        <Button color="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

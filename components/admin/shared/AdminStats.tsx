import { Card } from "@heroui/card";

interface StatCardProps {
  label: string;
  value: number | string;
  variant?: "default" | "warning" | "info" | "success" | "danger";
  format?: "number" | "currency";
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  variant = "default",
  format = "number",
}) => {
  const borderColors = {
    default: "",
    warning: "border-l-4 border-yellow-500",
    info: "border-l-4 border-blue-500",
    success: "border-l-4 border-green-500",
    danger: "border-l-4 border-red-500",
  };

  const textColors = {
    default: "text-gray-900",
    warning: "text-yellow-700",
    info: "text-blue-700",
    success: "text-green-700",
    danger: "text-red-700",
  };

  const formatValue = () => {
    if (format === "currency" && typeof value === "number") {
      return `$${value.toLocaleString("es-AR")}`;
    }
    return value;
  };

  return (
    <Card className={`p-4 shadow-sm ${borderColors[variant]}`}>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${textColors[variant]}`}>
        {formatValue()}
      </div>
    </Card>
  );
};

interface AdminStatsProps {
  stats: Array<{
    label: string;
    value: number | string;
    variant?: "default" | "warning" | "info" | "success" | "danger";
    format?: "number" | "currency";
  }>;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

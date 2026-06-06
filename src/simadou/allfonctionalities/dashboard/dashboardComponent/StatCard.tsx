import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red" | "teal";
  trend?: {
    value: string;
    positive: boolean;
  };
}

const colorMap: Record<
  StatCardProps["color"],
  { bg: string; icon: string; badge: string; text: string }
> = {
  blue:   { bg: "bg-blue-50",   icon: "bg-blue-500",   badge: "bg-blue-100",   text: "text-blue-700" },
  green:  { bg: "bg-green-50",  icon: "bg-green-500",  badge: "bg-green-100",  text: "text-green-700" },
  purple: { bg: "bg-purple-50", icon: "bg-purple-500", badge: "bg-purple-100", text: "text-purple-700" },
  orange: { bg: "bg-orange-50", icon: "bg-orange-500", badge: "bg-orange-100", text: "text-orange-700" },
  red:    { bg: "bg-red-50",    icon: "bg-red-500",    badge: "bg-red-100",    text: "text-red-700" },
  teal:   { bg: "bg-teal-50",   icon: "bg-teal-500",   badge: "bg-teal-100",   text: "text-teal-700" },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}) => {
  const c = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${c.icon}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend.positive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">
          {value}
        </p>
        <p className="text-sm font-medium text-gray-500 mt-0.5">{title}</p>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatCard;
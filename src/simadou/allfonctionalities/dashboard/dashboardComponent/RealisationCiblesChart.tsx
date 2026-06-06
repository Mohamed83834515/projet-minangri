import React from "react";
import {
  ComposedChart,
  Bar,
  // Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface RealisationCibleRow {
  annee: string | number;
  realisation: number;
  cibles: number;
}

interface RealisationCiblesChartProps {
  data: RealisationCibleRow[];
  title?: string;
  subtitle?: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-800 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color || entry.fill }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
};

const RealisationCiblesChart: React.FC<RealisationCiblesChartProps> = ({
  data,
  title = "Réalisation vs Cibles cumulées",
  subtitle = "Évolution par année",
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
          barCategoryGap="35%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="annee"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 120]}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="realisation"
            name="Réalisation"
            fill="#22C55E"
            radius={[4, 4, 0, 0]}
            label={{ position: "top", fontSize: 10, fill: "#6b7280", formatter: (v) => Number(v) > 0 ? `${v}` : "" }}
          />
          <Bar
            dataKey="cibles"
            name="Cibles"
            fill="#EAB308"
            radius={[4, 4, 0, 0]}
            label={{ position: "top", fontSize: 10, fill: "#6b7280", formatter: (v) => Number(v) > 0 ? `${v}` : "" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RealisationCiblesChart;
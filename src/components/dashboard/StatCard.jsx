import { Card } from "../Card";

/**
 * StatCard - Displays a summary statistic with icon
 * @param {string} label - Label for the stat
 * @param {string|number} value - The stat value
 * @param {React.Component} Icon - Lucide icon component
 * @param {string} color - Tailwind gradient classes for icon background
 * @param {string} trend - Optional trend text (e.g., "↑ 12% from last month")
 */
export const StatCard = ({ label, value, icon: Icon, color, trend }) => {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-lightGrey text-sm mb-2">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      {trend && <div className="text-xs text-green-400">{trend}</div>}
    </Card>
  );
};

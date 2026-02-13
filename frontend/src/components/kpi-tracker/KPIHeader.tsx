/**
 * KPIHeader Component
 * Page header with title, subtitle, and Add KPI button
 */

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface KPIHeaderProps {
  userRole: string;
  onAddKPI?: () => void;
}

export const KPIHeader = ({ userRole, onAddKPI }: KPIHeaderProps) => {
  const isSuperAdmin = userRole === "SUPERADMIN";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">KPI Tracker</h1>
        <p className="text-gray-400 text-base">
          Monitor and manage employee performance metrics
        </p>
      </div>

      {isSuperAdmin && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddKPI}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus size={20} />
          Add KPI
        </motion.button>
      )}
    </motion.div>
  );
};

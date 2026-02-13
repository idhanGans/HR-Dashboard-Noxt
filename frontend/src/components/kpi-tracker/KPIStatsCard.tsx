/**
 * KPIStatsCard Component
 * Overall Company KPI Card with glassmorphism design
 */

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPIStatsCardProps {
  score: number;
}

export const KPIStatsCard = ({ score }: KPIStatsCardProps) => {
  const getStatusLabel = (score: number): string => {
    if (score >= 8.5) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Improvement Needed";
    return "Critical";
  };

  const getStatusColor = (score: number): string => {
    if (score >= 8.5) return "text-green-400";
    if (score >= 7) return "text-yellow-400";
    if (score >= 5) return "text-orange-400";
    return "text-red-400";
  };

  const getBgColor = (score: number): string => {
    if (score >= 8.5)
      return "from-green-500/20 to-green-600/10 border-green-500/30";
    if (score >= 7)
      return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
    if (score >= 5)
      return "from-orange-500/20 to-orange-600/10 border-orange-500/30";
    return "from-red-500/20 to-red-600/10 border-red-500/30";
  };

  const statusLabel = getStatusLabel(score);
  const statusColor = getStatusColor(score);
  const bgColor = getBgColor(score);
  const isGood = score >= 7;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${bgColor} backdrop-blur-xl p-8 mb-6`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-300 text-sm font-medium mb-3 uppercase tracking-wider">
              Overall Company KPI
            </p>
            <div className="flex items-baseline gap-3 mb-4">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-7xl font-bold text-white"
              >
                {score.toFixed(1)}
              </motion.span>
              <span className="text-3xl text-gray-400 font-medium">/10</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-4 py-2 rounded-full ${statusColor} bg-black/20 backdrop-blur-sm font-semibold text-sm`}
              >
                {isGood ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`flex-shrink-0 w-32 h-32 rounded-2xl bg-gradient-to-br ${bgColor} flex items-center justify-center`}
          >
            <svg
              className={`w-16 h-16 ${statusColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

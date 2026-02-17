/**
 * SparklineChart Component
 * Mini trend chart showing last 6 months performance
 */

import { motion } from "framer-motion";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export const SparklineChart = ({
  data,
  width = 100,
  height = 30,
  color = "#3b82f6",
}: SparklineChartProps) => {
  if (!data || data.length === 0) {
    return <div className="w-[100px] h-[30px] bg-gray-800/50 rounded" />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </svg>
  );
};

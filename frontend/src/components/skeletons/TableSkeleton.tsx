import type { ReactNode } from "react";

type SkeletonColumn = {
  key: string;
  label: ReactNode;
};

interface TableSkeletonProps {
  columns: SkeletonColumn[];
  rows?: number;
  columnWidths?: string[];
  minWidthClass?: string;
}

export const TableSkeleton = ({
  columns,
  rows = 5,
  columnWidths = ["w-24", "w-16", "w-20", "w-12", "w-28", "w-32"],
  minWidthClass = "min-w-[640px]",
}: TableSkeletonProps) => (
  <div className="w-full">
    <div className="overflow-x-auto w-full max-w-full min-w-0">
      <table className={`w-full ${minWidthClass}`}>
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-lightGrey"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="animate-pulse">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr
              key={`table-skeleton-${rowIdx}`}
              className="border-b border-white/5"
            >
              {columns.map((col, colIdx) => (
                <td
                  key={String(col.key)}
                  className="px-3 py-2 sm:px-4 sm:py-3"
                >
                  <div
                    className={`h-4 ${columnWidths[colIdx % columnWidths.length]} bg-white/10 rounded`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

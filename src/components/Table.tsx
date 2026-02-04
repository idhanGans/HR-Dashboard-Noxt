import { isValidElement } from "react";
import type { ReactNode } from "react";

type TableColumn<T> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
};

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  mobileVariant?: "card" | "table";
}

// Reusable Table component
const renderCellValue = (value: unknown): ReactNode => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (isValidElement(value)) return value;
  return String(value);
};

export const Table = <T extends object>({
  columns,
  data,
  mobileVariant = "card",
}: TableProps<T>) => {
  const showCardView = mobileVariant === "card";
  const tableWrapperClass = showCardView ? "hidden sm:block" : "block";

  return (
    <div className="w-full">
      <div
        className={`${tableWrapperClass} overflow-x-auto w-full max-w-full min-w-0`}
      >
        <table className="w-full min-w-[640px]">
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
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-white/5 hover:bg-white/5 transition-all"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-white"
                  >
                    {col.render
                      ? col.render(row)
                      : renderCellValue(row[col.key as keyof T])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCardView && (
        <div className="sm:hidden space-y-3">
          {data.map((row, idx) => (
            <div
              key={idx}
              className="border border-white/10 rounded-lg bg-white/5 p-4"
            >
              <div className="space-y-3">
                {columns.map((col) => (
                  <div key={String(col.key)} className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-lightGrey">
                      {col.label}
                    </p>
                    <div className="text-sm text-white">
                      {col.render
                        ? col.render(row)
                        : renderCellValue(row[col.key as keyof T])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

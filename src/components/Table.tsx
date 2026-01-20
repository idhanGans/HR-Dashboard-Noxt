// Reusable Table component
export const Table = ({ columns, data, mobileVariant = "card" }) => {
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
                  key={col.key}
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
                    key={col.key}
                    className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-white"
                  >
                    {col.render ? col.render(row) : row[col.key]}
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
                  <div key={col.key} className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-lightGrey">
                      {col.label}
                    </p>
                    <div className="text-sm text-white">
                      {col.render ? col.render(row) : row[col.key]}
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

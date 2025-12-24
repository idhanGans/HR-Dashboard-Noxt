// Reusable Table component
export const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-sm font-semibold text-lightGrey"
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
                <td key={col.key} className="px-4 py-3 text-sm text-white">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

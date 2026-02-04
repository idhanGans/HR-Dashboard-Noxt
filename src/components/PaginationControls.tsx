import { useEffect, useState } from "react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (nextPage: number) => void;
  isLoading?: boolean;
}

export const PaginationControls = ({
  page,
  totalPages,
  totalItems,
  onPageChange,
  isLoading,
}: PaginationControlsProps) => {
  const [pageInput, setPageInput] = useState(String(page));
  const maxPage = Math.max(totalPages, 1);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  if (totalPages <= 1 && !totalItems) return null;

  const canGoBack = page > 1;
  const canGoNext = page < totalPages;

  const commitPageInput = () => {
    const parsed = Number(pageInput);
    if (!Number.isFinite(parsed)) {
      setPageInput(String(page));
      return;
    }
    const nextPage = Math.min(Math.max(Math.trunc(parsed), 1), maxPage);
    if (nextPage !== page) {
      onPageChange(nextPage);
    } else {
      setPageInput(String(nextPage));
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={!canGoBack || isLoading}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {"<<"}
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoBack || isLoading}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {"<"}
        </button>
        <input
          id="page-input"
          type="number"
          min={1}
          max={maxPage}
          value={pageInput}
          onChange={(event) => setPageInput(event.target.value)}
          onBlur={commitPageInput}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitPageInput();
            }
          }}
          className="w-20 h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-center focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext || isLoading}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {">"}
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext || isLoading}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

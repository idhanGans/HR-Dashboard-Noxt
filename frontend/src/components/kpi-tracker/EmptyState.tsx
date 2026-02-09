interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

/**
 * EmptyState - Generic empty state component
 */
export const EmptyState = ({
  title = "No data available",
  message = "Try adjusting your filters or check back later",
  icon = "📊",
}: EmptyStateProps) => {
  return (
    <div className="glass-card">
      <div className="flex flex-col items-center justify-center py-16 text-lightGrey">
        <div className="text-5xl mb-4">{icon}</div>
        <p className="text-lg font-medium text-white mb-2">{title}</p>
        <p className="text-sm max-w-sm text-center">{message}</p>
      </div>
    </div>
  );
};

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getOrgChartTree } from "../../services/orgChart";
import { OrgChartTree } from "../organization/OrgChartTree";

interface OrganizationChartProps {
  className?: string;
}

/**
 * OrganizationChart - Displays organization hierarchy using react-organizational-chart
 */
export const OrganizationChart = ({ className }: OrganizationChartProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orgChartTree"],
    queryFn: getOrgChartTree,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className || ""}`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-blue-400 animate-spin" />
          <p className="text-sm text-lightGrey">Loading organization structure...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center py-12 ${className || ""}`}>
        <div className="text-center">
          <p className="text-red-400 mb-2">Failed to load organization structure</p>
          <p className="text-sm text-lightGrey">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`flex items-center justify-center py-12 ${className || ""}`}>
        <p className="text-lightGrey">No organization data available</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className || ""}`}>
        <p className="text-lightGrey">No organization chart yet</p>
      </div>
    );
  }

  return <OrgChartTree nodes={data} className={className} />;
};

export default OrganizationChart;

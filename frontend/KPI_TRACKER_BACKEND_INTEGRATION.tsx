/**
 * EXAMPLE: How to Connect KPI Tracker to Backend
 * 
 * This file shows how to integrate the KPI Tracker with a real backend API
 * Replace mock data with actual API calls using React Query
 */

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DashboardLayout } from "../components/DashboardLayout";
import {
  KPIHeader,
  KPIStatsCard,
  KPIFilters,
  KPITable,
  KPIManageModal,
} from "../components/kpi-tracker";
import { evaluationPeriods, departments, statusOptions } from "../data/kpi-mock-data";
import type { EmployeeKPI, KPIFiltersState } from "../types/kpi-tracker";
import type { LayoutProps } from "../types/auth";

/**
 * API Client (src/lib/apiClient.ts)
 * 
 * export const kpiApi = {
 *   // Fetch all KPI data
 *   getEmployeeKPIs: async () => {
 *     const response = await axios.get('/api/kpi/employees');
 *     return response.data;
 *   },
 * 
 *   // Update employee KPI metrics
 *   updateEmployeeKPI: async (employeeId: string, metrics: EmployeeKPI['metrics']) => {
 *     const response = await axios.put(`/api/kpi/employees/${employeeId}`, {
 *       metrics,
 *       updatedAt: new Date().toISOString(),
 *     });
 *     return response.data;
 *   },
 * 
 *   // Get company KPI stats
 *   getCompanyKPIStats: async () => {
 *     const response = await axios.get('/api/kpi/company/stats');
 *     return response.data;
 *   },
 * 
 *   // Create evaluation period
 *   createEvaluationPeriod: async (period: { name: string; startDate: string; endDate: string }) => {
 *     const response = await axios.post('/api/kpi/periods', period);
 *     return response.data;
 *   },
 * };
 */

/**
 * FULL EXAMPLE: KPI Tracker with Backend Integration
 */
export const BackendIntegratedKpiTrackerPage = ({
  onLogout,
  userName,
  userRole,
}: LayoutProps) => {
  // ═══════════════════════════════════════════════════════════════
  // 1. FETCH KPI DATA WITH REACT QUERY
  // ═══════════════════════════════════════════════════════════════

  const {
    data: kpiData = [],
    isLoading: isLoadingKPIData,
    error: kpiError,
  } = useQuery({
    queryKey: ["kpi-employees"],
    queryFn: async () => {
      // Replace with actual API call
      // const response = await kpiApi.getEmployeeKPIs();
      // return response.data;
      
      // For now, return mock data
      const mockResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            // Mock data here
          ]);
        }, 500);
      });
      return mockResponse;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data for 10 minutes
  });

  // ═══════════════════════════════════════════════════════════════
  // 2. MUTATION: UPDATE KPI METRICS
  // ═══════════════════════════════════════════════════════════════

  const { mutate: updateKPI, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      employeeId,
      metrics,
    }: {
      employeeId: string;
      metrics: EmployeeKPI["metrics"];
    }) => {
      // Replace with actual API call
      // return kpiApi.updateEmployeeKPI(employeeId, metrics);
      
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    },
    onSuccess: () => {
      // Refetch data after successful update
      // queryClient.invalidateQueries({ queryKey: ["kpi-employees"] });
      alert("KPI updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update KPI:", error);
      alert("Failed to update KPI. Please try again.");
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // 3. LOCAL STATE
  // ═══════════════════════════════════════════════════════════════

  const [filters, setFilters] = useState<KPIFiltersState>({
    searchQuery: "",
    department: "All Departments",
    period: "January 2026 (Active)",
    status: "All Status",
  });

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeKPI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // 4. COMPUTED VALUES
  // ═══════════════════════════════════════════════════════════════

  const calculateAverage = (metrics: EmployeeKPI["metrics"]): number => {
    const values = Object.values(metrics);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const getScoreStatus = (score: number): string => {
    if (score >= 8.5) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Warning";
    return "Critical";
  };

  const filteredEmployees = useMemo(() => {
    return kpiData.filter((employee) => {
      if (
        filters.searchQuery &&
        !employee.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.department !== "All Departments" &&
        employee.department !== filters.department
      ) {
        return false;
      }

      const periodLabel = filters.period.replace(" (Active)", "");
      if (employee.period !== periodLabel) {
        return false;
      }

      if (filters.status !== "All Status") {
        const avgScore = calculateAverage(employee.metrics);
        const status = getScoreStatus(avgScore);
        if (status !== filters.status) {
          return false;
        }
      }

      return true;
    });
  }, [kpiData, filters]);

  const companyKPI = useMemo(() => {
    if (filteredEmployees.length === 0) return 0;
    const totalScore = filteredEmployees.reduce(
      (sum, employee) => sum + calculateAverage(employee.metrics),
      0
    );
    return totalScore / filteredEmployees.length;
  }, [filteredEmployees]);

  // ═══════════════════════════════════════════════════════════════
  // 5. HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleFilterChange = (newFilters: Partial<KPIFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleEdit = (employee: EmployeeKPI) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleView = (employee: EmployeeKPI) => {
    // Could open a different modal for view-only mode
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSave = async (
    employee: EmployeeKPI,
    metrics: EmployeeKPI["metrics"]
  ) => {
    // ═════════════════════════════════════════════════════════════
    // CALL API TO UPDATE KPI
    // ═════════════════════════════════════════════════════════════
    updateKPI(
      {
        employeeId: employee.id.toString(),
        metrics,
      },
      {
        onSuccess: () => {
          // Close modal on success
          setIsModalOpen(false);
          setSelectedEmployee(null);
        },
      }
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleAddKPI = () => {
    // Could open a different modal for creating new KPI
    console.log("Add KPI clicked");
  };

  // ═══════════════════════════════════════════════════════════════
  // 6. ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════

  if (kpiError) {
    return (
      <DashboardLayout userRole={userRole} userName={userName} onLogout={onLogout}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading KPI Data</h2>
            <p className="text-gray-400">{(kpiError as Error).message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. RENDER UI
  // ═══════════════════════════════════════════════════════════════

  return (
    <DashboardLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Loading State */}
        {isLoadingKPIData && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white">Loading KPI Data...</p>
            </div>
          </div>
        )}

        <KPIHeader userRole={userRole} onAddKPI={handleAddKPI} />
        <KPIStatsCard score={companyKPI} />
        <KPIFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={departments}
          periods={evaluationPeriods}
          statusOptions={statusOptions}
        />
        <KPITable
          employees={filteredEmployees}
          userRole={userRole}
          onEdit={handleEdit}
          onView={handleView}
        />

        {/* Modal with loading state */}
        <KPIManageModal
          isOpen={isModalOpen}
          employee={selectedEmployee}
          userRole={userRole}
          onClose={handleCloseModal}
          onSave={handleSave}
        />

        {/* Saving indicator */}
        {isUpdating && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving changes...</span>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

/**
 * ═══════════════════════════════════════════════════════════════
 * SETUP STEPS
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. Install/update packages:
 *    npm install @tanstack/react-query
 * 
 * 2. Create API client (src/lib/apiClient.ts):
 *    - Define axios instance
 *    - Export kpiApi methods
 * 
 * 3. Set up Query Client (src/lib/queryClient.ts):
 *    import { QueryClient } from '@tanstack/react-query';
 *    export const queryClient = new QueryClient({
 *      defaultOptions: {
 *        queries: {
 *          staleTime: 5 * 60 * 1000,
 *          gcTime: 10 * 60 * 1000,
 *          retry: 1,
 *        },
 *      },
 *    });
 * 
 * 4. Wrap app with QueryClientProvider in App.tsx:
 *    <QueryClientProvider client={queryClient}>
 *      {/* app routes */}
 *    </QueryClientProvider>
 * 
 * 5. Update your page import to use BackendIntegratedKpiTrackerPage
 * 
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * EXPECTED BACKEND ENDPOINTS
 * ═══════════════════════════════════════════════════════════════
 * 
 * GET /api/kpi/employees
 * Response: {
 *   success: boolean;
 *   data: EmployeeKPI[];
 * }
 * 
 * PUT /api/kpi/employees/:id
 * Request: {
 *   metrics: {
 *     collaboration: number;
 *     codeQuality: number;
 *     completionRate: number;
 *     customerSatisfaction: number;
 *   };
 *   updatedAt: string (ISO date);
 * }
 * Response: {
 *   success: boolean;
 *   data: EmployeeKPI;
 *   message: string;
 * }
 * 
 * POST /api/kpi/periods
 * Request: {
 *   name: string;
 *   startDate: string (ISO date);
 *   endDate: string (ISO date);
 * }
 * Response: {
 *   success: boolean;
 *   data: Period;
 * }
 * 
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * BEST PRACTICES
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. Query Caching
 *    - Set appropriate staleTime
 *    - Use gcTime for memory management
 * 
 * 2. Error Handling
 *    - Display user-friendly error messages
 *    - Provide retry functionality
 * 
 * 3. Loading States
 *    - Show loading indicators
 *    - Disable buttons during loading
 * 
 * 4. Data Validation
 *    - Validate API responses
 *    - Use TypeScript for type safety
 * 
 * 5. Performance
 *    - Use useMemo for computed values
 *    - Avoid unnecessary re-renders
 *    - Debounce filter inputs if needed
 * 
 * ═══════════════════════════════════════════════════════════════
 */

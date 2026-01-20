import { createContext, useContext } from "react";
import { EmployeeContextValue } from "../types/employee";

export const EmployeeContext = createContext<EmployeeContextValue | null>(null);

/**
 * Custom hook to access employee context
 */
export const useEmployees = (): EmployeeContextValue => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used within EmployeeProvider");
  }
  return context;
};

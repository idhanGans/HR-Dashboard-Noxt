import { createContext, useContext } from "react";

export const EmployeeContext = createContext(null);

/**
 * Custom hook to access employee context
 */
export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used within EmployeeProvider");
  }
  return context;
};

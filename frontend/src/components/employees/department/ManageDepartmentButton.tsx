import { Building2 } from "lucide-react";
import { Button } from "../../Button";

interface ManageDepartmentButtonProps {
  onClick: () => void;
  userRole: string;
}

/**
 * ManageDepartmentButton - Top-right button on Employee page to open Department management
 * Hidden for EMPLOYEE role
 */
export const ManageDepartmentButton = ({
  onClick,
  userRole,
}: ManageDepartmentButtonProps) => {
  // EMPLOYEE role cannot access department management
  if (userRole === "EMPLOYEE") {
    return null;
  }

  return (
    <Button
      variant="secondary"
      onClick={onClick}
      className="flex items-center gap-2 w-full sm:w-auto"
    >
      <Building2 size={18} />
      Manage Departments
    </Button>
  );
};

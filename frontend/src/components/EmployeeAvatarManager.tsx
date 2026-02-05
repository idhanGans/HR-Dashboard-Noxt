import { useState } from "react";
import { Card } from "./Card";
import { AvatarUpload } from "./settings/AvatarUpload";
import { AvatarDisplay } from "./AvatarDisplay";
import { useAvatarUrl } from "../hooks/useAvatar";
import { X } from "lucide-react";

interface EmployeeAvatarManagerProps {
  employees: Array<{
    id: number;
    name: string;
    department: string;
    photoUrl?: string;
  }>;
}

/**
 * EmployeeAvatarListItem - Individual employee list item with avatar
 */
const EmployeeAvatarListItem = ({
  employee,
  isSelected,
  onClick,
}: {
  employee: { id: number; name: string; department: string; photoUrl?: string };
  isSelected: boolean;
  onClick: () => void;
}) => {
  const { avatarUrl } = useAvatarUrl(employee.id);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
        isSelected
          ? "bg-blue-500/20 border border-blue-400"
          : "bg-white/5 border border-white/10 hover:border-blue-400/50"
      }`}
    >
      <AvatarDisplay
        src={avatarUrl}
        name={employee.name}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">
          {employee.name}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {employee.department}
        </p>
      </div>
    </button>
  );
};

/**
 * EmployeeAvatarManager - Component for managing employee avatars
 * Allows managers/admins to upload avatars for employees
 * Uses backend API for avatar storage
 */
export const EmployeeAvatarManager = ({
  employees,
}: EmployeeAvatarManagerProps) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null,
  );

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Employee List */}
      <Card className="lg:col-span-1">
        <h3 className="text-lg font-bold text-white mb-4">Select Employee</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {employees.map((employee) => (
            <EmployeeAvatarListItem
              key={employee.id}
              employee={employee}
              isSelected={selectedEmployeeId === employee.id}
              onClick={() => setSelectedEmployeeId(employee.id)}
            />
          ))}
        </div>
      </Card>

      {/* Avatar Upload */}
      <div className="lg:col-span-2">
        {selectedEmployee ? (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedEmployee.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {selectedEmployee.department}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmployeeId(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <AvatarUpload
              userId={selectedEmployee.id}
              userName={selectedEmployee.name}
            />
          </Card>
        ) : (
          <Card className="flex items-center justify-center h-64">
            <p className="text-gray-400">
              Select an employee to upload or manage their avatar
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

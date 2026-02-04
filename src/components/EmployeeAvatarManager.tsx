import { useState } from "react";
import { Card } from "./Card";
import { AvatarUpload } from "./settings/AvatarUpload";
import { getEmployeeAvatar, saveEmployeeAvatar } from "../utils/avatarUtils";
import { AvatarDisplay } from "./AvatarDisplay";
import { X } from "lucide-react";

interface EmployeeAvatarManagerProps {
  employees: Array<{
    id: number;
    name: string;
    department: string;
  }>;
  onAvatarUpdate?: (employeeId: number, avatarData: string) => void;
}

/**
 * EmployeeAvatarManager - Component for managing employee avatars
 * Allows managers/admins to upload avatars for employees
 */
export const EmployeeAvatarManager = ({
  employees,
  onAvatarUpdate,
}: EmployeeAvatarManagerProps) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null,
  );
  const [avatars, setAvatars] = useState<Record<number, string | null>>(() => {
    const result: Record<number, string | null> = {};
    employees.forEach((emp) => {
      result[emp.id] = getEmployeeAvatar(emp.id);
    });
    return result;
  });

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  const handleAvatarChange = (avatarData: string) => {
    if (selectedEmployeeId === null) return;

    saveEmployeeAvatar(selectedEmployeeId, avatarData);
    setAvatars((prev) => ({
      ...prev,
      [selectedEmployeeId]: avatarData,
    }));

    if (onAvatarUpdate) {
      onAvatarUpdate(selectedEmployeeId, avatarData);
    }
  };

  const handleRemoveAvatar = (employeeId: number) => {
    setAvatars((prev) => ({
      ...prev,
      [employeeId]: null,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Employee List */}
      <Card className="lg:col-span-1">
        <h3 className="text-lg font-bold text-white mb-4">Select Employee</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {employees.map((employee) => (
            <button
              key={employee.id}
              onClick={() => setSelectedEmployeeId(employee.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                selectedEmployeeId === employee.id
                  ? "bg-blue-500/20 border border-blue-400"
                  : "bg-white/5 border border-white/10 hover:border-blue-400/50"
              }`}
            >
              <AvatarDisplay
                src={avatars[employee.id]}
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
              currentAvatar={avatars[selectedEmployee.id] || undefined}
              onAvatarChange={handleAvatarChange}
              userName={selectedEmployee.name}
            />

            {avatars[selectedEmployee.id] && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    handleRemoveAvatar(selectedEmployee.id);
                    saveEmployeeAvatar(selectedEmployee.id, "");
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors inline-flex items-center gap-2"
                >
                  <X size={16} />
                  Remove Employee Avatar
                </button>
              </div>
            )}
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

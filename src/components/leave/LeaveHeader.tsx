import { Plus } from "lucide-react";
import { Button } from "../Button";

/**
 * LeaveHeader - Page header for leave management page
 * @param {Function} onRequestLeave - Callback when request leave button is clicked
 */
export const LeaveHeader = ({ onRequestLeave }) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Leave Management
        </h1>
        <p className="text-lightGrey">Track and manage employee leaves.</p>
      </div>
      <Button
        onClick={onRequestLeave}
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <Plus size={18} />
        Request Leave
      </Button>
    </div>
  );
};

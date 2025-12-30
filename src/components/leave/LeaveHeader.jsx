import { Plus } from "lucide-react";
import { Button } from "../Button";

/**
 * LeaveHeader - Page header for leave management page
 * @param {Function} onRequestLeave - Callback when request leave button is clicked
 */
export const LeaveHeader = ({ onRequestLeave }) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Leave Management</h1>
        <p className="text-lightGrey">Track and manage employee leaves.</p>
      </div>
      <Button onClick={onRequestLeave} className="flex items-center gap-2">
        <Plus size={18} />
        Request Leave
      </Button>
    </div>
  );
};

import { Modal } from "../Modal";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

/**
 * LeaveRequestModal - Modal for requesting, reviewing, and approving/rejecting leaves
 */
export const LeaveRequestModal = ({
  isOpen,
  onClose,
  mode,
  leaveRequest,
  onApprove,
  onReject,
  employeeName,
}) => {
  const getLeaveTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "paid leave":
        return "text-blue-400 bg-blue-400/10";
      case "sick leave":
        return "text-red-400 bg-red-400/10";
      case "vacation":
        return "text-purple-400 bg-purple-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-400 bg-green-400/10";
      case "rejected":
        return "text-red-400 bg-red-400/10";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  // Calculate duration in days
  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1
    );
  };

  const daysRequested = calculateDays(
    leaveRequest?.startDate,
    leaveRequest?.endDate,
  );

  // Validation checks
  const getValidationStatus = () => {
    const validations = {
      dateRange: leaveRequest?.startDate && leaveRequest?.endDate,
      leaveType: leaveRequest?.type,
      reason: leaveRequest?.reason?.trim().length > 0,
      sufficient: (leaveRequest?.availableBalance || 0) >= daysRequested,
    };
    return validations;
  };

  const validations = getValidationStatus();
  const allValid = Object.values(validations).every((v) => v);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "review"
          ? `Review Leave Request - ${employeeName}`
          : "Request Leave"
      }
    >
      <div className="space-y-6">
        {/* Employee/Requester Info */}
        {mode === "review" && (
          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400 mb-1">Requested by</p>
            <p className="text-lg font-semibold text-white">{employeeName}</p>
            <p className="text-xs text-gray-500 mt-2">
              Requested on {leaveRequest?.requestedDate}
            </p>
          </div>
        )}

        {/* Leave Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={leaveRequest?.startDate || ""}
                onChange={(e) => {
                  if (mode !== "review") {
                    leaveRequest.startDate = e.target.value;
                  }
                }}
                disabled={mode === "review"}
                className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors ${
                  mode === "review" ? "cursor-not-allowed opacity-70" : ""
                }`}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={leaveRequest?.endDate || ""}
                onChange={(e) => {
                  if (mode !== "review") {
                    leaveRequest.endDate = e.target.value;
                  }
                }}
                disabled={mode === "review"}
                className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors ${
                  mode === "review" ? "cursor-not-allowed opacity-70" : ""
                }`}
              />
            </div>
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Leave Type
            </label>
            <select
              value={leaveRequest?.type || ""}
              disabled={mode === "review"}
              className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors ${
                mode === "review" ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              <option value="" className="bg-gray-800">
                Select leave type
              </option>
              <option value="Paid Leave" className="bg-gray-800">
                Paid Leave
              </option>
              <option value="Sick Leave" className="bg-gray-800">
                Sick Leave
              </option>
              <option value="Vacation" className="bg-gray-800">
                Vacation
              </option>
              <option value="Unpaid Leave" className="bg-gray-800">
                Unpaid Leave
              </option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason (Optional)
            </label>
            <textarea
              value={leaveRequest?.reason || ""}
              disabled={mode === "review"}
              rows={3}
              className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors resize-none ${
                mode === "review" ? "cursor-not-allowed opacity-70" : ""
              }`}
              placeholder="Provide a reason for your leave request"
            />
          </div>
        </div>

        {/* Validation Checklist */}
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-3">Validation</h4>
          <div className="space-y-2">
            {/* Date Range Check */}
            <div className="flex items-center gap-3">
              {validations.dateRange ? (
                <CheckCircle size={18} className="text-green-400" />
              ) : (
                <XCircle size={18} className="text-red-400" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${validations.dateRange ? "text-green-400" : "text-red-400"}`}
                >
                  Date Range Valid
                </p>
                <p className="text-xs text-gray-400">
                  Start and end dates are required
                </p>
              </div>
            </div>

            {/* Leave Type Check */}
            <div className="flex items-center gap-3">
              {validations.leaveType ? (
                <CheckCircle size={18} className="text-green-400" />
              ) : (
                <XCircle size={18} className="text-red-400" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${validations.leaveType ? "text-green-400" : "text-red-400"}`}
                >
                  Leave Type Selected
                </p>
                <p className="text-xs text-gray-400">
                  A leave type must be specified
                </p>
              </div>
            </div>

            {/* Sufficient Balance Check */}
            {validations.leaveType && (
              <div className="flex items-center gap-3">
                {validations.sufficient ? (
                  <CheckCircle size={18} className="text-green-400" />
                ) : (
                  <AlertCircle size={18} className="text-yellow-400" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${validations.sufficient ? "text-green-400" : "text-yellow-400"}`}
                  >
                    Sufficient Balance
                  </p>
                  <p className="text-xs text-gray-400">
                    {daysRequested} days requested,{" "}
                    {leaveRequest?.availableBalance || 0} days available
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {leaveRequest?.type && daysRequested > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-xs text-gray-400 mb-1">Duration</p>
              <p className="text-lg font-semibold text-white">
                {daysRequested}
              </p>
              <p className="text-xs text-gray-500">days</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-xs text-gray-400 mb-1">Type</p>
              <div
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getLeaveTypeColor(leaveRequest?.type)}`}
              >
                {leaveRequest?.type}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-xs text-gray-400 mb-1">Available</p>
              <p className="text-lg font-semibold text-white">
                {leaveRequest?.availableBalance || 0}
              </p>
              <p className="text-xs text-gray-500">days</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
          >
            {mode === "review" ? "Close" : "Cancel"}
          </button>

          {mode === "review" ? (
            <>
              <button
                onClick={() => onReject()}
                className="flex-1 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 font-medium transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove()}
                disabled={!allValid}
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                  allValid
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Approve
              </button>
            </>
          ) : (
            <button
              onClick={() => onApprove()}
              disabled={!allValid}
              className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                allValid
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Request
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

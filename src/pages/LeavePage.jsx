import {
  Card,
  DashboardLayout,
  Button,
  Table,
  StatusBadge,
} from "../components";
import { Calendar, Plus } from "lucide-react";

// Leave management page
export const LeavePage = ({ onLogout }) => {
  const leaveRecords = [
    {
      date: "2024-12-25 to 2024-12-26",
      type: "Paid Leave",
      status: "approved",
      days: 2,
    },
    {
      date: "2024-11-20 to 2024-11-22",
      type: "Sick Leave",
      status: "approved",
      days: 3,
    },
    {
      date: "2024-10-15 to 2024-10-18",
      type: "Vacation",
      status: "approved",
      days: 4,
    },
    {
      date: "2025-01-15 to 2025-01-18",
      type: "Vacation",
      status: "pending",
      days: 4,
    },
  ];

  const leaveBalance = [
    { type: "Paid Leave", balance: 8, used: 4, total: 12 },
    { type: "Sick Leave", balance: 5, used: 3, total: 8 },
    { type: "Vacation", balance: 6, used: 4, total: 10 },
  ];

  const columns = [
    { key: "date", label: "Date Range" },
    { key: "type", label: "Leave Type" },
    { key: "days", label: "Days" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <DashboardLayout userRole="Administrator" onLogout={onLogout}>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Leave Management
          </h1>
          <p className="text-lightGrey">Track and manage employee leaves.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          Request Leave
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {leaveBalance.map((leave) => (
          <Card key={leave.type}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">{leave.type}</h3>
              <p className="text-lightGrey text-sm">
                {leave.total} days available
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-lightGrey">Used</span>
                  <span className="text-white font-semibold">
                    {leave.used} days
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(leave.used / leave.total) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-lightGrey">Balance</span>
                  <span className="text-white font-semibold">
                    {leave.balance} days
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(leave.balance / leave.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Leave Requests */}
      <Card>
        <h2 className="text-lg font-bold text-white mb-4">Leave Requests</h2>
        <Table columns={columns} data={leaveRecords} />
      </Card>

      {/* Leave Policy Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <h2 className="text-lg font-bold text-white mb-4">Leave Policy</h2>
          <div className="space-y-4 text-sm">
            <div className="pb-4 border-b border-white/10">
              <p className="text-white font-semibold mb-1">Paid Leave</p>
              <p className="text-lightGrey">12 days per year, fully paid</p>
            </div>
            <div className="pb-4 border-b border-white/10">
              <p className="text-white font-semibold mb-1">Sick Leave</p>
              <p className="text-lightGrey">8 days per year, fully paid</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Vacation</p>
              <p className="text-lightGrey">
                10 days per year, must be approved
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-white mb-4">
            Recent Approvals
          </h2>
          <div className="space-y-4">
            {[
              {
                name: "Alice Johnson",
                type: "Paid Leave",
                date: "Dec 25-26",
                status: "approved",
              },
              {
                name: "Bob Smith",
                type: "Vacation",
                date: "Jan 15-18",
                status: "pending",
              },
              {
                name: "Carol White",
                type: "Sick Leave",
                date: "Dec 20",
                status: "approved",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="pb-3 border-b border-white/10 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-lightGrey text-xs">{item.type}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-xs text-lightGrey mt-2">{item.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

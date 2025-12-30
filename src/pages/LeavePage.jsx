import { DashboardLayout } from "../components";
import {
  LeaveBalanceCard,
  LeaveRequestsTable,
  LeavePolicyCard,
  RecentApprovalsCard,
  LeaveHeader,
} from "../components/leave";

// Leave records data
const LEAVE_RECORDS = [
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

// Leave balance data
const LEAVE_BALANCE = [
  { type: "Paid Leave", balance: 8, used: 4, total: 12 },
  { type: "Sick Leave", balance: 5, used: 3, total: 8 },
  { type: "Vacation", balance: 6, used: 4, total: 10 },
];

/**
 * LeaveBalanceGrid - Grid of leave balance cards
 */
const LeaveBalanceGrid = ({ balances }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {balances.map((leave) => (
      <LeaveBalanceCard key={leave.type} leave={leave} />
    ))}
  </div>
);

/**
 * PolicyAndApprovalsSection - Grid with policy and recent approvals
 */
const PolicyAndApprovalsSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
    <LeavePolicyCard />
    <RecentApprovalsCard />
  </div>
);

/**
 * LeavePage - Leave management page
 */
export const LeavePage = ({ onLogout, userName, userRole }) => {
  const handleRequestLeave = () => {
    alert("Leave request form will open here");
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <LeaveHeader onRequestLeave={handleRequestLeave} />

      <LeaveBalanceGrid balances={LEAVE_BALANCE} />

      <LeaveRequestsTable records={LEAVE_RECORDS} />

      <PolicyAndApprovalsSection />
    </DashboardLayout>
  );
};

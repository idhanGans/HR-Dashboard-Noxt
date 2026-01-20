import { DashboardLayout } from "../components";
import {
  LeaveBalanceCard,
  LeaveRequestsTable,
  LeavePolicyCard,
  RecentApprovalsCard,
  LeaveHeader,
} from "../components/leave";
import { leaveBalance, leaveRecords } from "../utils/dummyData";

/**
 * LeaveBalanceGrid - Grid of leave balance cards
 */
const LeaveBalanceGrid = ({ balances }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

      <LeaveBalanceGrid balances={leaveBalance} />

      <LeaveRequestsTable records={leaveRecords} />

      <PolicyAndApprovalsSection />
    </DashboardLayout>
  );
};

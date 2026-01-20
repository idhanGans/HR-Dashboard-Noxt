import { Card } from "../Card";

/**
 * LeaveBalanceCard - Displays leave balance for a specific type
 * @param {Object} leave - Leave balance object with type, balance, used, total
 */
export const LeaveBalanceCard = ({ leave }) => {
  const usedPercentage = (leave.used / leave.total) * 100;
  const balancePercentage = (leave.balance / leave.total) * 100;

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{leave.type}</h3>
        <p className="text-lightGrey text-sm">{leave.total} days available</p>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-lightGrey">Used</span>
            <span className="text-white font-semibold">{leave.used} days</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${usedPercentage}%` }}
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
              style={{ width: `${balancePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

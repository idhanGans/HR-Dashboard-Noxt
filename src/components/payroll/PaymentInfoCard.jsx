import { Card } from "../Card";

/**
 * PaymentInfoCard - Displays payment/bank information
 * @param {Object} employee - Employee object with payroll data
 */
export const PaymentInfoCard = ({ employee }) => {
  const defaultInfo = {
    bankName: "Not specified",
    accountHolder: "Not specified",
    accountNumber: "Not specified",
  };

  const paymentInfo = employee?.payroll
    ? {
        bankName: employee.payroll.bankName || "Not specified",
        accountHolder: employee.name || "Not specified",
        accountNumber: employee.payroll.bankAccount
          ? `****${employee.payroll.bankAccount.slice(-4)}`
          : "Not specified",
      }
    : defaultInfo;

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Payment Info</h3>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-lightGrey mb-1">Bank Name</p>
          <p className="text-white font-medium">{paymentInfo.bankName}</p>
        </div>
        <div>
          <p className="text-lightGrey mb-1">Account Holder</p>
          <p className="text-white font-medium">{paymentInfo.accountHolder}</p>
        </div>
        <div>
          <p className="text-lightGrey mb-1">Account Number</p>
          <p className="text-white font-medium">{paymentInfo.accountNumber}</p>
        </div>
      </div>
    </Card>
  );
};

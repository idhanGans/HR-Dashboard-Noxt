import { Card } from "../Card";

/**
 * PaymentInfoCard - Displays payment/bank information
 * @param {Object} paymentInfo - Payment info object
 */
export const PaymentInfoCard = ({ paymentInfo }) => {
  const defaultInfo = {
    bankName: "Global Finance Bank",
    accountHolder: "John Doe",
    accountNumber: "****1234",
  };

  const { bankName, accountHolder, accountNumber } = paymentInfo || defaultInfo;

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Payment Info</h3>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-lightGrey mb-1">Bank Name</p>
          <p className="text-white font-medium">{bankName}</p>
        </div>
        <div>
          <p className="text-lightGrey mb-1">Account Holder</p>
          <p className="text-white font-medium">{accountHolder}</p>
        </div>
        <div>
          <p className="text-lightGrey mb-1">Account Number</p>
          <p className="text-white font-medium">{accountNumber}</p>
        </div>
      </div>
    </Card>
  );
};

import { Card } from "../Card";
import { Button } from "../Button";
import { LogOut } from "lucide-react";

/**
 * CheckOutCard - Card for check-out action
 * @param {boolean} isCheckedIn - Whether user is checked in
 * @param {Function} onClick - Callback when button is clicked
 */
export const CheckOutCard = ({ isCheckedIn, onClick }) => {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Check-out</h3>
        <p className="text-sm text-lightGrey">Record your departure time</p>
      </div>
      <Button
        onClick={onClick}
        disabled={!isCheckedIn}
        className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogOut size={18} />
        Check-out
      </Button>
    </Card>
  );
};

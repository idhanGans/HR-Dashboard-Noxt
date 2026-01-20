import { Card } from "../Card";
import { Button } from "../Button";
import { Clock } from "lucide-react";

/**
 * CheckInCard - Card for check-in action
 * @param {boolean} isCheckedIn - Whether user is already checked in
 * @param {Function} onClick - Callback when button is clicked
 */
export const CheckInCard = ({ isCheckedIn, onClick }) => {
  return (
    <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Check-in</h3>
        <p className="text-sm text-lightGrey">Record your arrival time</p>
      </div>
      <Button
        onClick={onClick}
        disabled={isCheckedIn}
        className="flex items-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Clock size={18} />
        {isCheckedIn ? "Already Checked-in" : "Check-in"}
      </Button>
    </Card>
  );
};

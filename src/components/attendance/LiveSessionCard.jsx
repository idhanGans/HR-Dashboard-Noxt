import { Card } from "../Card";

/**
 * Formats milliseconds to HH:MM:SS string
 * @param {number} ms - Milliseconds to format
 * @returns {string} Formatted time string
 */
const formatHMS = (ms) => {
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

/**
 * Formats timestamp to readable time string
 * @param {number} ts - Timestamp in milliseconds
 * @returns {string} Formatted time string
 */
const formatTime = (ts) =>
  ts
    ? new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "-";

/**
 * LiveSessionCard - Displays current session status and elapsed time
 * @param {boolean} isCheckedIn - Whether user is checked in
 * @param {number} checkInTime - Check-in timestamp in milliseconds
 * @param {number} elapsed - Elapsed time in milliseconds
 */
export const LiveSessionCard = ({ isCheckedIn, checkInTime, elapsed }) => {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Live Session</h3>
        <p className="text-sm text-lightGrey">
          {isCheckedIn
            ? `Started: ${formatTime(checkInTime)}`
            : "Not checked in yet"}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs text-lightGrey mb-1">Elapsed</p>
        <p className="text-2xl font-bold text-white">
          {isCheckedIn ? formatHMS(elapsed) : "00:00:00"}
        </p>
      </div>
    </Card>
  );
};

import { Card } from "../Card";
import { Button } from "../Button";

export const InterviewSchedule = ({ slots }) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          Interview Schedule
        </h3>
        <Button variant="ghost">Calendar</Button>
      </div>
      <div className="space-y-4">
        {slots.map((slot) => (
          <div
            key={`${slot.time}-${slot.candidate}`}
            className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 border border-white/10 rounded-lg px-4 py-3 bg-white/5"
          >
            <div className="text-sm font-semibold text-white w-14">
              {slot.time}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {slot.candidate}
              </p>
              <p className="text-xs text-lightGrey">{slot.role}</p>
              <p className="text-xs text-lightGrey mt-1">
                Panel: {slot.interviewers}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

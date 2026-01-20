import { DashboardLayout } from "../components";
import {
  HiringHeader,
  HiringStats,
  OpenPositionsTable,
  CandidatePipeline,
  InterviewSchedule,
} from "../components/hiring";
import {
  hiringStats,
  openPositions,
  candidatePipeline,
  interviewSchedule,
} from "../utils/dummyData";

export const HiringPage = ({ onLogout, userName, userRole }) => {
  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={onLogout}
    >
      <div className="flex flex-col gap-6">
        <HiringHeader />

        <HiringStats stats={hiringStats} />

        <OpenPositionsTable positions={openPositions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CandidatePipeline candidates={candidatePipeline} />
          <InterviewSchedule slots={interviewSchedule} />
        </div>
      </div>
    </DashboardLayout>
  );
};

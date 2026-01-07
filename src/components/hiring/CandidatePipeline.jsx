import { Card } from "../Card";
import { Button } from "../Button";

export const CandidatePipeline = ({ candidates }) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Candidate Pipeline</h3>
        <Button variant="ghost">Review</Button>
      </div>
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.name}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-white/10 rounded-lg px-4 py-3 bg-white/5"
          >
            <div>
              <p className="text-sm font-semibold text-white">
                {candidate.name}
              </p>
              <p className="text-xs text-lightGrey">
                {candidate.role} • {candidate.stage}
              </p>
            </div>
            <span className="text-sm font-semibold text-white">
              {candidate.score}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

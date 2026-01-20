import { Button } from "../Button";

export const HiringHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Hiring Pipeline
        </h2>
        <p className="text-sm text-lightGrey">
          Track open roles, candidate stages, and upcoming interviews.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" className="w-full sm:w-auto">
          Import Candidates
        </Button>
        <Button className="w-full sm:w-auto">Post New Role</Button>
      </div>
    </div>
  );
};

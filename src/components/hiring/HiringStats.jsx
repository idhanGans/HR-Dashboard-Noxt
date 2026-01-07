import { Card } from "../Card";

export const HiringStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <p className="text-sm text-lightGrey">{stat.label}</p>
          <p className="text-2xl sm:text-3xl font-semibold text-white mt-2">
            {stat.value}
          </p>
          <p className="text-xs text-lightGrey mt-2">{stat.note}</p>
        </Card>
      ))}
    </div>
  );
};

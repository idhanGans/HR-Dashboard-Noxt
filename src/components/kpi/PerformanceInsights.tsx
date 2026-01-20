import { Card } from "../Card";

/**
 * PerformanceInsights - Displays performance insight cards
 * @param {Object} insights - Insights object with topPerformer, mostImproved, needsAttention
 */
export const PerformanceInsights = ({ insights }) => {
  const defaultInsights = {
    topPerformer: { department: "HR Department", score: "8.9/10" },
    mostImproved: {
      department: "Engineering",
      improvement: "+5% improvement this month",
    },
    needsAttention: {
      department: "Marketing",
      note: "Below target performance",
    },
  };

  const { topPerformer, mostImproved, needsAttention } =
    insights || defaultInsights;

  return (
    <Card>
      <h2 className="text-lg font-bold text-white mb-4">
        Performance Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InsightItem
          color="green"
          label="Top Performer"
          value={topPerformer.department}
          note={`Score: ${topPerformer.score}`}
        />
        <InsightItem
          color="blue"
          label="Most Improved"
          value={mostImproved.department}
          note={mostImproved.improvement}
        />
        <InsightItem
          color="yellow"
          label="Needs Attention"
          value={needsAttention.department}
          note={needsAttention.note}
        />
      </div>
    </Card>
  );
};

/**
 * InsightItem - Individual insight display item
 */
const InsightItem = ({ color, label, value, note }) => {
  const colorClasses = {
    green: "bg-green-900/20 border-green-400/30 text-green-400",
    blue: "bg-blue-900/20 border-blue-400/30 text-blue-400",
    yellow: "bg-yellow-900/20 border-yellow-400/30 text-yellow-400",
  };

  const textColor = colorClasses[color]?.split(" ").pop() || "text-green-400";
  const bgBorder = colorClasses[color] || colorClasses.green;

  return (
    <div className={`p-4 border rounded-lg ${bgBorder}`}>
      <p className={`${textColor} text-sm font-semibold mb-2`}>{label}</p>
      <p className="text-white font-bold text-lg">{value}</p>
      <p className="text-lightGrey text-xs mt-1">{note}</p>
    </div>
  );
};

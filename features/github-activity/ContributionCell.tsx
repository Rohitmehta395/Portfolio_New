import { ContributionDay } from "@/lib/github/fetchContributions";

interface ContributionCellProps {
  day: ContributionDay;
}

const levelColorMap: Record<ContributionDay["level"], string> = {
  NONE: "bg-neutral-800 border-neutral-700/50",
  FIRST_QUARTILE: "bg-emerald-950 border-emerald-900",
  SECOND_QUARTILE: "bg-emerald-800 border-emerald-700",
  THIRD_QUARTILE: "bg-emerald-600 border-emerald-500",
  FOURTH_QUARTILE: "bg-emerald-400 border-emerald-300",
};

/**
 * Presentational cell component representing a single day in the contribution heatmap.
 */
export function ContributionCell({ day }: ContributionCellProps) {
  const bgClass = levelColorMap[day.level] || levelColorMap.NONE;

  return (
    <div
      className={`h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 border rounded-[1px]  transition-colors ${bgClass}`}
      title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
      aria-label={`${day.count} contributions on ${day.date}`}
    />
  );
}

export default ContributionCell;

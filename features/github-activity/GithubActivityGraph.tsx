import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  fetchContributions,
  type ContributionWeek,
} from "@/lib/github/fetchContributions";
import { ContributionCell } from "./ContributionCell";
import { ReactiveEyes } from "./ReactiveEyes";
import { YearSelector } from "./YearSelector";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

type MonthGroup = { month: string; weeks: ContributionWeek[] };

/**
 * Groups consecutive weeks that fall in the same month, so the month header
 * and grid can render as discrete blocks — each block sized proportionally
 * to how many weeks it spans.
 */
function groupWeeksByMonth(weeks: ContributionWeek[]): MonthGroup[] {
  const groups: MonthGroup[] = [];

  for (const week of weeks) {
    const firstDay = week.days[0];
    const month = firstDay
      ? MONTH_NAMES[new Date(firstDay.date).getMonth()]
      : "";
    const currentGroup = groups.at(-1);

    if (currentGroup?.month === month) {
      currentGroup.weeks.push(week);
    } else {
      groups.push({ month, weeks: [week] });
    }
  }

  return groups;
}

/** Legend swatches shown next to "Less ... More" */
function ContributionLegend() {
  const shades = [
    "border-neutral-700/50 bg-neutral-800/60",
    "border-emerald-900 bg-emerald-950",
    "border-emerald-700 bg-emerald-800",
    "border-emerald-500 bg-emerald-600",
    "border-emerald-300 bg-emerald-400",
  ];

  return (
    <div className="flex items-center gap-2">
      <span>Less</span>
      <div className="flex gap-1">
        {shades.map((shade) => (
          <div key={shade} className={`h-3 w-3 rounded-xs border ${shade}`} />
        ))}
      </div>
      <span>More</span>
    </div>
  );
}

/** Header row: activity label, total commit count, legend, and year selector */
function GraphHeader({
  totalContributions,
  displayYear,
  hasData,
}: {
  totalContributions?: number;
  displayYear: number;
  hasData: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="flex flex-col">
        <span className="text-[10px] md:text-xs font-semibold tracking-widest text-neutral-500 uppercase">
          GITHUB ACTIVITY
        </span>
        <span className="text-lg md:text-xl font-bold text-white mt-1 whitespace-nowrap">
          {hasData
            ? `${totalContributions!.toLocaleString()} Commits in ${displayYear}`
            : "Github Contributions"}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 sm:ml-auto">
        <ContributionLegend />
        <YearSelector />
      </div>
    </div>
  );
}

/** Row of month labels, each sized to match the week-count of its grid block */
function MonthLabels({ monthGroups }: { monthGroups: MonthGroup[] }) {
  return (
    <div className="flex w-full ml-6 mb-1.5 gap-1">
      {monthGroups.map((group, gIdx) => (
        <div
          key={gIdx}
          className="text-[10px] font-mono tracking-wider text-neutral-500 whitespace-nowrap"
          style={{ flex: `${group.weeks.length} 0 0%` }}
        >
          {group.month}
        </div>
      ))}
    </div>
  );
}

/** The contribution cells themselves, grouped into month-blocks */
function ContributionGrid({ monthGroups }: { monthGroups: MonthGroup[] }) {
  return (
    <div className="flex gap-1">
      {/* Days Sidebar */}
      <div className="flex flex-col justify-between text-[10px] font-mono text-neutral-500 py-0.5 pt-4">
        <span>Mon</span>
        <span>Wed</span>
        <span>Fri</span>
      </div>

      {/* Month-blocks, each sized to its own week count */}
      <div className="flex gap-4 flex-1">
        {monthGroups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="flex"
            style={{ flex: `${group.weeks.length} 0 0%` }}
          >
            {group.weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[2.5px] flex-1">
                {week.days.map((day) => (
                  <ContributionCell key={day.date} day={day} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Server Component rendering a GitHub contribution calendar grid.
 * Fetches data server-side and falls back gracefully if the API/credentials
 * are unavailable.
 */
export async function GithubActivityGraph({ year }: { year?: number }) {
  const result = await fetchContributions(year);
  const displayYear = year ?? new Date().getFullYear();
  const hasData = result.success && !!result.data;
  const monthGroups = hasData ? groupWeeksByMonth(result.data!.weeks) : [];

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-12 max-w-[120rem] mx-auto flex flex-col gap-10">
      {/* Section Title + CTA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full px-2">
        <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-foreground flex flex-wrap items-center gap-x-3 gap-y-0 leading-tight">
          Want to know about my{" "}
          <span className="font-cursive text-6xl md:text-7xl lg:text-[5rem] font-normal text-[#8B5CF6] -mt-4 md:mt-0 pt-2 sm:pt-4 lowercase tracking-normal">
            story?
          </span>
        </h2>
        <Link
          href="/journey"
          className="group px-6 py-3 rounded-full border-2 border-foreground text-foreground text-xs font-bold tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors flex items-center gap-2"
        >
          READ MY JOURNEY
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>

      {/* Dark Graph Container */}
      <div className="relative w-full rounded-[2rem] bg-[#1a1a1a] p-6 sm:p-8 md:p-12 shadow-2xl mt-8 md:mt-0">
        {/* Absolute Massive Googly Eyes */}
        <div className="absolute -top-14 md:top-auto md:-bottom-12 right-8 md:right-10 z-[70]">
          <ReactiveEyes />
        </div>

        <div className="flex flex-col gap-10 relative z-[60] w-full">
          <GraphHeader
            totalContributions={result.data?.totalContributions}
            displayYear={displayYear}
            hasData={hasData}
          />

          {!hasData ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 text-center">
              <p className="text-sm text-neutral-400">
                {result.error ||
                  "Live contribution data is currently unavailable."}
              </p>
            </div>
          ) : (
             <div className="overflow-x-auto pb-4 scrollbar-none w-full max-w-full md:max-w-[70%]">
              <div className="w-full min-w-[560px] flex flex-col">
                <MonthLabels monthGroups={monthGroups} />
                <ContributionGrid monthGroups={monthGroups} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GithubActivityGraph;

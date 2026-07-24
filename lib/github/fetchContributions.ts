import { env } from "@/config/env";

export interface ContributionDay {
  date: string;
  count: number;
  color: string;
  level:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionsData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface FetchContributionsResult {
  success: boolean;
  data: ContributionsData | null;
  error?: string;
}

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime, $to: DateTime) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

/**
 * Server-side fetcher querying GitHub GraphQL API for contribution calendar.
 * Uses Next.js revalidation cache (3600s) and handles credentials/API failures gracefully.
 */
export async function fetchContributions(
  year?: number,
): Promise<FetchContributionsResult> {
  let token = "";
  let username = "";

  try {
    const gh = env.github;
    token = gh.token;
    username = gh.username;
  } catch (e: any) {
    return {
      success: false,
      data: null,
      error: "GitHub credentials unconfigured in environment.",
    };
  }

  if (!token || !username) {
    return {
      success: false,
      data: null,
      error: "GitHub token or username is empty.",
    };
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: {
          username,
          ...(year
            ? {
                from: `${year}-01-01T00:00:00Z`,
                to: `${year}-12-31T23:59:59Z`,
              }
            : {}),
        },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        error: `GitHub API error: ${response.status} ${response.statusText}`,
      };
    }

    const json = await response.json();

    if (json.errors && json.errors.length > 0) {
      return {
        success: false,
        data: null,
        error: json.errors[0]?.message || "GraphQL query returned errors.",
      };
    }

    const calendar =
      json.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return {
        success: false,
        data: null,
        error: "Failed to parse contribution calendar from GitHub response.",
      };
    }

    const formattedWeeks: ContributionWeek[] = calendar.weeks.map(
      (week: any) => ({
        days: week.contributionDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          color: day.color,
          level: day.contributionLevel || "NONE",
        })),
      }),
    );

    // Pad the calendar to 53 weeks (full year) if the API truncated future months.
    // Padded days continue the real date sequence (rather than using an empty
    // date string) so downstream month-grouping/labeling stays accurate.
    const lastWeek = formattedWeeks[formattedWeeks.length - 1];
    const lastRealDay = lastWeek?.days[lastWeek.days.length - 1];
    let cursor = lastRealDay?.date
      ? new Date(lastRealDay.date)
      : new Date(`${year ?? new Date().getFullYear()}-01-01T00:00:00Z`);

    while (formattedWeeks.length < 53) {
      const days: ContributionDay[] = [];
      for (let i = 0; i < 7; i++) {
        cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
        days.push({
          date: cursor.toISOString().slice(0, 10),
          count: 0,
          color: "",
          level: "NONE",
        });
      }
      formattedWeeks.push({ days });
    }

    return {
      success: true,
      data: {
        totalContributions: calendar.totalContributions,
        weeks: formattedWeeks,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err?.message || "Network error fetching GitHub contributions.",
    };
  }
}

export default fetchContributions;

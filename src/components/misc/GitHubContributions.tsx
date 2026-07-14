interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: ContributionWeek[];
        };
      };
    };
  };
}

interface GitHubContributionsProps {
  username: string;
  showHeading?: boolean;
}

export default async function GitHubContributions({
  username,
  showHeading = true,
}: GitHubContributionsProps) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  let days: ContributionDay[] = [];
  let error: string | null = null;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    const data: ContributionResponse = await response.json();
    const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
    days = weeks.flatMap((week) => week.contributionDays).slice(-365);
  } catch {
    error = "Unable to load contributions.";
  }

  const colorFor = (count: number) => {
    if (count === 0) return "var(--contrib-level-0)";
    if (count <= 3) return "var(--contrib-level-1)";
    if (count <= 6) return "var(--contrib-level-2)";
    if (count <= 9) return "var(--contrib-level-3)";
    return "var(--contrib-level-4)";
  };

  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const contributionLevels = [
    "var(--contrib-level-0)",
    "var(--contrib-level-1)",
    "var(--contrib-level-2)",
    "var(--contrib-level-3)",
    "var(--contrib-level-4)"
  ];

  return (
    <div className={`space-y-6 ${showHeading ? "mt-12" : ""}`}>
      <div className="flex flex-col gap-4">
        {showHeading && (
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-primary flex-shrink-0">GitHub Activity</h2>
            <div className="h-[1px] w-full bg-neutral-200 dark:bg-neutral-200" />
          </div>
        )}
        <div className="flex justify-between items-center">
          <p className="text-sm text-neutral-500">Past year for @{username}</p>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Less</span>
            {contributionLevels.map((color) => (
              <span key={color} className="w-3 h-3 rounded-sm" style={{ background: color }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-neutral-600">
          Contribution data is unavailable. {" "}
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            View @{username} on GitHub
          </a>
          .
        </p>
      ) : (
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week) => (
              <div key={week[0].date} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className="w-3 h-3 rounded-sm transition-all duration-300 hover:scale-110 hover:ring-2 hover:ring-accent hover:ring-offset-1 dark:hover:ring-offset-black"
                    style={{ background: colorFor(day.contributionCount) }}
                    title={`${day.date}: ${day.contributionCount} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
}

export default function GitHubContributions({ username }: GitHubContributionsProps) {
  const [days, setDays] = useState<ContributionDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        const res = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ query, variables: { login: username } }),
        });
        if (!res.ok) throw new Error("GitHub API error");
        const data: ContributionResponse = await res.json();
        const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
        const all: ContributionDay[] = [];
        weeks.forEach((week) => week.contributionDays.forEach((day) => all.push(day)));
        setDays(all.slice(-365));
      } catch {
        setError("Unable to load contributions (set NEXT_PUBLIC_GITHUB_TOKEN for full data).");
      }
    };
    fetchData();
  }, [token, username]);

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
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6 mt-12"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-primary flex-shrink-0 font-serif">GitHub Activity</h2>
          <div className="h-[1px] w-full bg-neutral-200 dark:bg-neutral-900" />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-neutral-500">Past year for @{username}</p>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Less</span>
            {contributionLevels.map((c, i) => (
              <span key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-1">
                {week.map((day, j) => (
                  <div
                    key={j}
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
    </motion.div>
  );
}

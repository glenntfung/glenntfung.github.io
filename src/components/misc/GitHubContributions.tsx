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
    if (count === 0) return "#ebedf0";
    if (count <= 3) return "#9be9a8";
    if (count <= 6) return "#40c463";
    if (count <= 9) return "#30a14e";
    return "#216e39";
  };

  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">GitHub Activity</h2>
          <p className="text-sm text-neutral-500 mt-1">Past year for @{username}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
          <span>Less</span>
          {["#ebedf0","#9be9a8","#40c463","#30a14e","#216e39"].map(c => (
            <span key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
      {error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-1">
                {week.map((day, j) => (
                  <div
                    key={j}
                    className="w-3 h-3 rounded-sm transition-all duration-200 hover:ring-2 hover:ring-accent hover:ring-offset-1 dark:hover:ring-offset-black"
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

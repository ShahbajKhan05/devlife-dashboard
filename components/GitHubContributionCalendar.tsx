import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  GitHubContributionCalendar,
  GitHubContributionDay,
} from "@/lib/github";

type GitHubContributionCalendarProps = {
  calendar: GitHubContributionCalendar | null;
  year: number;
  loading?: boolean;
  onYearChange?: (year: number) => void;
  linkHref?: string;
};

const availableYears = (currentYear: number) =>
  Array.from({ length: currentYear - 2007 }, (_, index) => currentYear - index);

export default function GitHubContributionCalendar({
  calendar,
  year,
  loading = false,
  onYearChange,
  linkHref,
}: GitHubContributionCalendarProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  useEffect(() => {
    const actualCurrentYear = new Date().getUTCFullYear();
    setCurrentYear((year) =>
      year === actualCurrentYear ? year : actualCurrentYear
    );
  }, []);
  const contributionDays =
    calendar?.available && calendar.year === year
      ? calendar.weeks.flatMap((week) => week.contributionDays)
      : [];
  let leastActiveDay: GitHubContributionDay | null = null;
  let mostActiveDay: GitHubContributionDay | null = null;

  for (const day of contributionDays) {
    if (!leastActiveDay || day.count < leastActiveDay.count) leastActiveDay = day;
    if (!mostActiveDay || day.count > mostActiveDay.count) mostActiveDay = day;
  }

  return (
    <section
      aria-label={`GitHub public contribution calendar for ${year}`}
      aria-busy={loading}
      className="overflow-hidden rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#80631F]">
            Public contribution calendar
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#191919]">
            {calendar?.available && calendar.year === year
              ? `${calendar.totalContributions} public contributions`
              : "Contribution history"}
          </h2>
          <p className="mt-1 text-sm text-[#625D4C]">
            {calendar?.available && calendar.year === year
              ? `GitHub's contribution total for ${year}; private contributions are excluded.`
              : `GitHub contributions for ${year}, when available.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {linkHref && (
            <Link
              href={linkHref}
              className="inline-flex min-h-10 items-center text-sm font-bold text-[#785C19] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
            >
              Full GitHub activity
            </Link>
          )}
          {onYearChange && (
            <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[#625D4C]">
              Year
              <select
                value={year}
                onChange={(event) => onYearChange(Number(event.target.value))}
                className="min-h-11 rounded-lg border border-[#DCCB91] bg-white px-3 text-base text-[#191919] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
              >
                {availableYears(currentYear).map((availableYear) => (
                  <option key={availableYear} value={availableYear}>
                    {availableYear}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      {loading && (
        <p aria-live="polite" className="mt-4 text-sm text-[#625D4C]">
          Loading GitHub contribution data…
        </p>
      )}

      {!loading && calendar?.available && calendar.year === year && (
        <>
          <p className="mt-4 text-xs leading-5 text-[#625D4C]">
            Each square reflects a daily contribution count returned by GitHub.
            Contribution totals can include commits, pull requests, and issues.
          </p>
          <div
            aria-label={`Daily contribution counts for ${year}. Scroll horizontally to view all weeks.`}
            role="group"
            className="mt-4 overflow-x-auto pb-2"
            tabIndex={0}
          >
            <div className="flex w-max gap-1">
              {calendar.weeks.map((week, weekIndex) => (
                <div
                  key={`${year}-week-${weekIndex}`}
                  className="flex flex-col gap-1"
                >
                  {week.contributionDays.map((day) => (
                    <time
                      key={day.date}
                      dateTime={day.date}
                      aria-label={`${day.date}: ${day.count} public ${
                        day.count === 1 ? "contribution" : "contributions"
                      }`}
                      title={`${day.date}: ${day.count} public ${
                        day.count === 1 ? "contribution" : "contributions"
                      }`}
                      className="size-3 rounded-[3px] border border-black/5 sm:size-[13px]"
                      style={{ backgroundColor: day.color }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          {leastActiveDay && mostActiveDay && (
            <div
              aria-label="Contribution intensity legend"
              role="group"
              className="mt-2 flex items-center justify-end gap-2 text-xs text-[#625D4C]"
            >
              <span>Less</span>
              <span
                aria-hidden="true"
                title={`${leastActiveDay.count} contributions`}
                className="size-3 rounded-[3px] border border-black/5"
                style={{ backgroundColor: leastActiveDay.color }}
              />
              <span
                aria-hidden="true"
                title={`${mostActiveDay.count} contributions`}
                className="size-3 rounded-[3px] border border-black/5"
                style={{ backgroundColor: mostActiveDay.color }}
              />
              <span>More</span>
            </div>
          )}
        </>
      )}

      {!loading && (!calendar || !calendar.available || calendar.year !== year) && (
        <p
          aria-live="polite"
          className="mt-4 rounded-lg border border-[#E8DDBB] bg-[#FBF6E3] p-3 text-sm leading-5 text-[#625D4C]"
        >
          {calendar?.year === year && calendar.error
            ? calendar.error
            : "GitHub did not return contribution data for this year."}
          {calendar?.rateLimited && calendar.retryAt && (
            <span className="mt-1 block text-xs">
              Rate limit resets at{" "}
              <time dateTime={calendar.retryAt}>{calendar.retryAt}</time>.
            </span>
          )}
          {!calendar && (
            <span className="mt-1 block text-xs">
              Contribution totals require a server-side GitHub token with public
              profile read access.
            </span>
          )}
        </p>
      )}
    </section>
  );
}

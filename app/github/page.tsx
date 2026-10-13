"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import GitHubContributionCalendar from "@/components/GitHubContributionCalendar";
import { PageHeader, PageLayout } from "@/components/PageLayout";
import { useGitHubData } from "@/hooks/useGitHubData";

function formatGitHubDate(value: string, withTime = false): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" as const } : {}),
    timeZone: "UTC",
  }).format(date);
}

export default function GitHubPage() {
  const [year, setYear] = useState(() => new Date().getUTCFullYear());
  const { data, error, loading, rateLimited, retryAt, reload } =
    useGitHubData(year);
  const stats = [
    { label: "Public repositories", value: data?.publicRepos },
    { label: "Stars on public repos", value: data?.totalStars },
    { label: "Followers", value: data?.followers },
    { label: "Following", value: data?.following },
    { label: "Forks across public repos", value: data?.totalForks },
  ];

  return (
    <PageLayout className="space-y-6">
      <PageHeader
        eyebrow="GitHub overview"
        title="My coding activity"
        description="Public profile statistics, contribution history and languages used across my repositories."
      />

      {data && (
        <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:flex-row sm:items-center sm:p-5">
          <a
            href={data.profileUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${data.username}'s GitHub profile`}
            className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.avatar}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-full border-2 border-[#E8DDBB] object-cover"
            />
          </a>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold text-[#191919]">
              {data.name || data.username}
            </h2>
            <p className="text-sm font-semibold text-[#80631F]">
              @{data.username}
            </p>
            {data.bio && (
              <p className="mt-1 max-w-3xl text-sm leading-5 text-[#625D4C]">
                {data.bio}
              </p>
            )}
          </div>
          <a
            href={data.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E5D8AD] bg-white px-3.5 text-sm font-bold text-[#785C19] transition-colors hover:bg-[#FBF5DD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
          >
            GitHub profile
            <ExternalLink aria-hidden="true" size={14} />
          </a>
        </section>
      )}

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-[#FFFDF0] p-4 text-sm text-red-800"
        >
          <div>
            <p>{error}</p>
            {rateLimited && retryAt && (
              <p className="mt-1 text-xs">
                Rate limit resets at{" "}
                <time dateTime={retryAt}>{formatGitHubDate(retryAt, true)}</time>.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={reload}
            className="min-h-11 rounded-lg bg-[#191919] px-4 py-2 font-bold text-white hover:bg-[#423A28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
          >
            Try again
          </button>
        </div>
      )}

      <section
        aria-label="GitHub statistics"
        aria-busy={loading}
        className="grid grid-cols-2 gap-3 xl:grid-cols-5"
      >
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5"
          >
            <p className="text-sm text-[#625D4C]">{stat.label}</p>
            <p className="mt-2 text-2xl font-black tabular-nums sm:text-3xl">
              {loading ? "…" : (stat.value ?? "—")}
            </p>
          </article>
        ))}
      </section>

      <GitHubContributionCalendar
        calendar={data?.contributions ?? null}
        year={year}
        loading={loading}
        onYearChange={setYear}
      />

      <section className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5">
        <h2 className="font-bold">Primary languages by repository count</h2>
        <p className="mt-1 text-sm leading-5 text-[#625D4C]">
          Counts public repositories where GitHub reports each language as the
          primary language. These are not percentages of code.
        </p>
        {data?.topLanguages.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {data.topLanguages.map((language) => (
              <li
                key={language.name}
                className="rounded-full bg-[#F8F0C9] px-3 py-1.5 text-sm font-semibold text-[#785C19]"
              >
                {language.name}
                <span className="ml-1 text-[#625D4C]">
                  · {language.count} {language.count === 1 ? "repo" : "repos"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p aria-live="polite" className="mt-2 text-sm text-[#625D4C]">
            {loading ? "Loading repository languages…" : "No language data available."}
          </p>
        )}
      </section>

      {data && data.repositories.length > 0 && (
        <section aria-labelledby="repo-languages-heading" className="space-y-3">
          <div>
            <h2
              id="repo-languages-heading"
              className="text-lg font-extrabold text-[#191919]"
            >
              Repository language details
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#625D4C]">
              Source-size shares come from GitHub&apos;s language byte counts and
              are shown only when GitHub returns them.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.repositories
              .filter((repository) => repository.languages?.length)
              .map((repository) => {
                const languageBytes =
                  repository.languages?.reduce(
                    (total, language) => total + language.bytes,
                    0
                  ) ?? 0;

                return (
                  <article
                    key={repository.id}
                    className="min-w-0 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4"
                  >
                    <h3 className="break-words font-bold text-[#191919]">
                      {repository.name}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {repository.languages?.map((language) => (
                        <li
                          key={language.name}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="truncate text-[#625D4C]">
                            {language.name}
                          </span>
                          <span className="shrink-0 font-semibold tabular-nums text-[#191919]">
                            {languageBytes > 0
                              ? `${((language.bytes / languageBytes) * 100).toFixed(1)}%`
                              : "—"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
          </div>
          {!data.repositories.some(
            (repository) => repository.languages?.length
          ) && (
            <p className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 text-sm text-[#625D4C]">
              Detailed language byte counts are unavailable for these
              repositories.
            </p>
          )}
        </section>
      )}

      <section aria-labelledby="recent-activity-heading" className="space-y-3">
        <div>
          <h2
            id="recent-activity-heading"
            className="text-lg font-extrabold text-[#191919]"
          >
            Recent public activity
          </h2>
          <p className="mt-1 text-sm leading-5 text-[#625D4C]">
            Public push-event commits and selected issue or pull-request events
            from GitHub. This is not an all-time commit total.
          </p>
        </div>
        {loading && !data && (
          <p aria-live="polite" className="text-sm text-[#625D4C]">
            Loading recent public activity…
          </p>
        )}
        {data?.activity.error && (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 text-sm leading-5 text-[#625D4C]"
          >
            <div>
              <p>{data.activity.error}</p>
              {data.activity.retryAt && (
                <p className="mt-1 text-xs">
                  Rate limit resets at{" "}
                  <time dateTime={data.activity.retryAt}>
                    {formatGitHubDate(data.activity.retryAt, true)}
                  </time>
                  .
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={reload}
              className="min-h-11 rounded-lg border border-[#E5D8AD] bg-white px-3.5 font-bold text-[#785C19] hover:bg-[#FBF5DD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
            >
              Retry activity
            </button>
          </div>
        )}
        {data &&
          (data.activity.commits.length > 0 ||
            data.activity.events.length > 0) && (
          <div className="grid gap-3 lg:grid-cols-2">
            {!!data.activity.commits.length && (
              <section className="min-w-0 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5">
                <h3 className="font-bold text-[#191919]">Recent push commits</h3>
                <ul className="mt-3 divide-y divide-[#F0E7C9]">
                  {data.activity.commits.map((commit) => (
                    <li key={`${commit.repository}-${commit.sha}`} className="py-3 first:pt-0 last:pb-0">
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block min-w-0 rounded-sm text-sm font-semibold leading-5 text-[#191919] hover:text-[#785C19] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
                      >
                        <span className="line-clamp-2 break-words">
                          {commit.message}
                        </span>
                      </a>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#625D4C]">
                        <a
                          href={commit.repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all font-semibold hover:underline"
                        >
                          {commit.repository}
                        </a>
                        <span aria-hidden="true">·</span>
                        <time dateTime={commit.pushedAt}>
                          Push event{" "}
                          {formatGitHubDate(commit.pushedAt, true)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {!!data.activity.events.length && (
              <section className="min-w-0 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5">
                <h3 className="font-bold text-[#191919]">
                  Issues and pull requests
                </h3>
                <ul className="mt-3 divide-y divide-[#F0E7C9]">
                  {data.activity.events.map((event) => (
                    <li key={event.id} className="py-3 first:pt-0 last:pb-0">
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-words text-sm font-semibold leading-5 text-[#191919] hover:text-[#785C19] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
                      >
                        {event.title || event.action || event.type}
                      </a>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#625D4C]">
                        <span>{event.type}</span>
                        {event.action && <span>· {event.action}</span>}
                        <span aria-hidden="true">·</span>
                        <a
                          href={event.repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all font-semibold hover:underline"
                        >
                          {event.repository}
                        </a>
                        <span aria-hidden="true">·</span>
                        <time dateTime={event.occurredAt}>
                          {formatGitHubDate(event.occurredAt, true)}
                        </time>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
          )}
        {data &&
        !loading &&
        !data.activity.error &&
        data.activity.commits.length === 0 &&
        data.activity.events.length === 0 ? (
          <p className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 text-sm text-[#625D4C]">
            No recent public activity was returned by GitHub.
          </p>
        ) : null}
      </section>
    </PageLayout>
  );
}

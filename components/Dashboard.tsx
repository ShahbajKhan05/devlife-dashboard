"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Code2,
  ExternalLink,
  FolderGit2,
  GitCommitHorizontal,
  GitFork,
  Search,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { DailyLogPreview } from "@/components/DailyLog";
import GitHubContributionCalendar from "@/components/GitHubContributionCalendar";
import { useGitHubData } from "@/hooks/useGitHubData";

const navigation = [
  { label: "Overview", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "GitHub Activity", href: "/github" },
  { label: "Experience", href: "/experience" },
  { label: "About", href: "/about" },
  { label: "Daily Log", href: "/daily-log" },
];

function getHttpUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCount(value: number | null | undefined): string {
  return value === null || value === undefined ? "—" : value.toLocaleString();
}

const panelClass =
  "min-w-0 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0]";

export default function Dashboard() {
  const { data, error, loading, rateLimited, retryAt, reload } =
    useGitHubData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRepositories = useMemo(() => {
    const repositories = data?.repositories ?? [];
    const query = searchQuery.trim().toLowerCase();
    const ordered = [...repositories].sort(
      (first, second) =>
        new Date(second.updatedAt).getTime() -
        new Date(first.updatedAt).getTime()
    );

    if (!query) return ordered;

    return ordered.filter((repository) =>
      [
        repository.name,
        repository.description ?? "",
        repository.language ?? "",
        ...repository.topics,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [data?.repositories, searchQuery]);

  const languageTotal =
    data?.topLanguages.reduce((total, language) => total + language.count, 0) ??
    0;
  const recentContributionCount =
    data?.contributions.available === true
      ? data.contributions.totalContributions
      : null;

  const metrics: {
    label: string;
    value: number | null | undefined;
    detail: string;
    Icon: LucideIcon;
  }[] = [
    {
      label: "Public repositories",
      value: data?.publicRepos,
      detail: "Public GitHub projects",
      Icon: FolderGit2,
    },
    {
      label: "GitHub followers",
      value: data?.followers,
      detail: "Current public profile count",
      Icon: Users,
    },
    {
      label: "Total public stars",
      value: data?.totalStars,
      detail: "Across public repositories",
      Icon: Star,
    },
    {
      label: `${data?.contributions.year ?? new Date().getUTCFullYear()} contributions`,
      value: recentContributionCount,
      detail: "GitHub contribution calendar",
      Icon: GitCommitHorizontal,
    },
  ];

  const activityItems = [
    ...(data?.activity.commits ?? []).map((commit) => ({
      id: `commit-${commit.sha}`,
      kind: "Commit",
      repository: commit.repository,
      detail: commit.message,
      occurredAt: commit.pushedAt,
      url: commit.url,
    })),
    ...(data?.activity.events ?? []).map((event) => ({
      id: `event-${event.id}`,
      kind: event.type.replace(/Event$/, "").replace(/([a-z])([A-Z])/g, "$1 $2"),
      repository: event.repository,
      detail: event.title || event.action || event.type,
      occurredAt: event.occurredAt,
      url: event.url,
    })),
  ]
    .sort(
      (first, second) =>
        new Date(second.occurredAt).getTime() -
        new Date(first.occurredAt).getTime()
    )
    .slice(0, 7);

  const connectionStatus = loading
    ? "Connecting to GitHub"
    : data
      ? "GitHub data connected"
      : "GitHub data unavailable";

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-[#E8DDBB] pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/"
            className="text-lg font-black tracking-tight text-[#191919] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B08D35]"
          >
            DevLife<span className="text-[#B08D35]">.</span>
          </Link>
          <span className="hidden h-5 w-px bg-[#E8DDBB] sm:block" />
          <span className="text-xs font-semibold text-[#706951]">
            Developer Dashboard
          </span>
          <span className="inline-flex items-center gap-2 text-[11px] font-medium text-[#625D4C]">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${
                data ? "bg-emerald-600" : loading ? "bg-amber-500" : "bg-[#A39B81]"
              }`}
            />
            <span role="status">{connectionStatus}</span>
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative block min-w-0 sm:w-64">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A826C]"
              size={16}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search projects, tech, repos"
              aria-label="Search projects, technologies, and repositories"
              className="h-10 w-full rounded-lg border border-[#E8DDBB] bg-[#FFFDF0] pl-9 pr-3 text-sm text-[#191919] outline-none placeholder:text-[#8A826C] focus:border-[#B08D35] focus:ring-2 focus:ring-[#B08D35]/15"
            />
          </label>
          <nav
            aria-label="Dashboard sections"
            className="flex min-w-0 gap-1 overflow-x-auto sm:justify-end"
          >
            {navigation.slice(0, 4).map(({ label, href }, index) => (
              <Link
                key={href}
                href={href}
                aria-current={index === 0 ? "page" : undefined}
                className={`inline-flex min-h-10 shrink-0 items-center rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35] ${
                  index === 0
                    ? "bg-[#F5EBC0] text-[#785C19]"
                    : "text-[#625D4C] hover:bg-[#FAF4D9] hover:text-[#191919]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="space-y-5 sm:space-y-6">
        <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#80631F]">
              Portfolio overview
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#191919] sm:text-3xl">
              Developer Overview
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#625D4C]">
              A real-time view of my projects, technologies, and development
              activity.
            </p>
          </div>
          <a
            href={data?.profileUrl ?? "https://github.com/ShahbajKhan05"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-2 self-start rounded-lg border border-[#E8DDBB] bg-[#FFFDF0] px-3 text-xs font-semibold text-[#625D4C] transition-colors hover:bg-[#FAF4D9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35] sm:self-auto"
          >
            <Code2 aria-hidden="true" size={15} />
            @{data?.username ?? "ShahbajKhan05"}
            <ArrowUpRight aria-hidden="true" size={14} />
          </a>
        </section>

        {error && (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E8DDBB] bg-[#FFFDF0] px-4 py-3 text-sm text-[#625D4C]"
          >
            <p>
              {error}
              {rateLimited && retryAt
                ? ` Rate limit resets ${formatDate(retryAt)}.`
                : ""}
            </p>
            <button
              type="button"
              onClick={reload}
              className="min-h-9 rounded-md border border-[#E2D6AD] px-3 text-xs font-bold text-[#785C19] hover:bg-[#F8F0C9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
            >
              Retry
            </button>
          </div>
        )}

        <section
          aria-label="GitHub metrics"
          className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4"
        >
          {metrics.map(({ label, value, detail, Icon }) => (
            <article
              key={label}
              aria-busy={loading}
              className={`${panelClass} p-4 sm:p-5`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold leading-5 text-[#625D4C]">
                  {label}
                </p>
                <Icon
                  aria-hidden="true"
                  className="shrink-0 text-[#947123]"
                  size={17}
                />
              </div>
              <p className="mt-2 text-2xl font-black tabular-nums tracking-tight text-[#191919]">
                {loading ? "…" : formatCount(value)}
              </p>
              <p className="mt-1 text-[10px] text-[#8A826C]">{detail}</p>
            </article>
          ))}
        </section>

        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(270px,0.8fr)]">
          <section
            aria-labelledby="project-overview-heading"
            className={`${panelClass} p-4 sm:p-5`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0E7C9] pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#80631F]">
                  Repository intelligence
                </p>
                <h2
                  id="project-overview-heading"
                  className="mt-1 text-lg font-extrabold tracking-tight text-[#191919]"
                >
                  Global Project Overview
                </h2>
                <p className="mt-1 text-xs text-[#706951]">
                  Project distribution by primary programming language
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FAF4D9] px-2.5 py-1.5 text-xs font-semibold text-[#785C19]">
                <FolderGit2 aria-hidden="true" size={14} />
                {loading ? "…" : formatCount(data?.repositories.length)} projects
              </span>
            </div>

            <div className="grid gap-5 pt-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <section aria-labelledby="language-distribution-heading">
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    id="language-distribution-heading"
                    className="text-xs font-bold text-[#191919]"
                  >
                    Language distribution
                  </h3>
                  <span className="text-[10px] text-[#8A826C]">
                    Repositories
                  </span>
                </div>
                {data?.topLanguages.length ? (
                  <ul className="mt-3 space-y-3">
                    {data.topLanguages.slice(0, 5).map((language) => {
                      const percentage =
                        languageTotal > 0
                          ? (language.count / languageTotal) * 100
                          : 0;

                      return (
                        <li key={language.name}>
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="truncate font-semibold text-[#383425]">
                              {language.name}
                            </span>
                            <span className="shrink-0 tabular-nums text-[#706951]">
                              {language.count}
                            </span>
                          </div>
                          <div
                            aria-hidden="true"
                            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F0E7C9]"
                          >
                            <div
                              className="h-full rounded-full bg-[#B08D35]"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-3 rounded-lg bg-[#FAF4D9] p-3 text-xs leading-5 text-[#706951]">
                    {loading
                      ? "Loading language data…"
                      : "Language data is not available for these public repositories."}
                  </p>
                )}
              </section>

              <section aria-labelledby="repositories-heading" className="min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    id="repositories-heading"
                    className="text-xs font-bold text-[#191919]"
                  >
                    {searchQuery ? "Matching repositories" : "Recently updated"}
                  </h3>
                  <Link
                    href="/projects"
                    className="inline-flex min-h-8 items-center gap-1 text-[11px] font-bold text-[#785C19] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
                  >
                    All projects
                    <ArrowUpRight aria-hidden="true" size={12} />
                  </Link>
                </div>

                {loading ? (
                  <p
                    aria-live="polite"
                    className="mt-3 rounded-lg bg-[#FAF4D9] p-3 text-xs text-[#706951]"
                  >
                    Loading public repositories…
                  </p>
                ) : filteredRepositories.length ? (
                  <ul className="mt-2 divide-y divide-[#F0E7C9]">
                    {filteredRepositories.slice(0, 5).map((repository) => {
                      const repositoryUrl = getHttpUrl(repository.url);

                      return (
                        <li key={repository.id} className="min-w-0 py-2.5">
                          <div className="flex min-w-0 items-start justify-between gap-3">
                            <div className="min-w-0">
                              {repositoryUrl ? (
                                <a
                                  href={repositoryUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex max-w-full items-center gap-1 truncate text-xs font-bold text-[#191919] hover:text-[#785C19] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
                                >
                                  <span className="truncate">
                                    {repository.name}
                                  </span>
                                  <ExternalLink
                                    aria-hidden="true"
                                    className="shrink-0"
                                    size={12}
                                  />
                                </a>
                              ) : (
                                <p className="truncate text-xs font-bold text-[#191919]">
                                  {repository.name}
                                </p>
                              )}
                              <p className="mt-1 line-clamp-1 text-[10px] text-[#706951]">
                                {repository.description ||
                                  (repository.language
                                    ? `${repository.language} repository`
                                    : "Public GitHub repository")}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2 text-[10px] text-[#706951]">
                              {repository.language && (
                                <span className="max-w-20 truncate rounded bg-[#FAF4D9] px-1.5 py-1">
                                  {repository.language}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1">
                                <Star
                                  aria-hidden="true"
                                  className="text-[#947123]"
                                  size={12}
                                />
                                {repository.stars}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-3 rounded-lg bg-[#FAF4D9] p-3 text-xs leading-5 text-[#706951]">
                    {searchQuery
                      ? "No public repositories match this search."
                      : error || "No public repositories are available."}
                  </p>
                )}
              </section>
            </div>
          </section>

          <section
            aria-labelledby="development-activity-heading"
            className={`${panelClass} p-4 sm:p-5`}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#F0E7C9] pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#80631F]">
                  Public GitHub feed
                </p>
                <h2
                  id="development-activity-heading"
                  className="mt-1 text-lg font-extrabold tracking-tight text-[#191919]"
                >
                  Development Activity
                </h2>
              </div>
              <span
                className={`mt-1 size-2 shrink-0 rounded-full ${
                  data?.activity.commits.length || data?.activity.events.length
                    ? "bg-emerald-600"
                    : loading
                      ? "bg-amber-500"
                      : "bg-[#A39B81]"
                }`}
                aria-label={
                  loading
                    ? "Activity loading"
                    : activityItems.length
                      ? "Recent activity available"
                      : "No recent activity available"
                }
              />
            </div>

            {loading ? (
              <p
                aria-live="polite"
                className="mt-4 rounded-lg bg-[#FAF4D9] p-3 text-xs text-[#706951]"
              >
                Loading recent public GitHub activity…
              </p>
            ) : activityItems.length ? (
              <ol className="mt-1 divide-y divide-[#F0E7C9]">
                {activityItems.map((item) => {
                  const activityUrl = getHttpUrl(item.url);
                  const ActivityIcon =
                    item.kind === "Commit"
                      ? GitCommitHorizontal
                      : Activity;

                  return (
                    <li key={item.id} className="flex gap-3 py-3">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-[#FAF4D9] text-[#80631F]">
                        <ActivityIcon aria-hidden="true" size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="rounded bg-[#F5EBC0] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#785C19]">
                            {item.kind}
                          </span>
                          <span className="truncate text-[10px] font-semibold text-[#706951]">
                            {item.repository}
                          </span>
                        </div>
                        {activityUrl ? (
                          <a
                            href={activityUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block break-words text-xs leading-5 text-[#383425] hover:text-[#785C19] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
                          >
                            {item.detail}
                          </a>
                        ) : (
                          <p className="mt-1 break-words text-xs leading-5 text-[#383425]">
                            {item.detail}
                          </p>
                        )}
                        <time
                          dateTime={item.occurredAt}
                          className="mt-1 block text-[10px] text-[#8A826C]"
                        >
                          {formatDate(item.occurredAt)}
                        </time>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="mt-4 rounded-lg bg-[#FAF4D9] p-3">
                <p className="text-xs font-semibold text-[#383425]">
                  No recent public activity
                </p>
                <p className="mt-1 text-xs leading-5 text-[#706951]">
                  {data?.activity.error ||
                    "GitHub has not returned any recent public commits or events."}
                </p>
              </div>
            )}

            <Link
              href="/github"
              className="mt-3 inline-flex min-h-9 items-center gap-1 text-xs font-bold text-[#785C19] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
            >
              View GitHub activity
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </section>
        </div>

        <nav
          aria-label="Portfolio sections"
          className="flex flex-wrap gap-2 border-t border-[#E8DDBB] pt-4"
        >
          {navigation.slice(4).map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-9 items-center rounded-lg border border-[#E8DDBB] bg-[#FFFDF0] px-3 text-xs font-semibold text-[#625D4C] transition-colors hover:bg-[#FAF4D9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <GitHubContributionCalendar
        calendar={data?.contributions ?? null}
        year={data?.contributions.year ?? new Date().getUTCFullYear()}
        loading={loading}
        linkHref="/github"
      />

      <DailyLogPreview />
    </div>
  );
}

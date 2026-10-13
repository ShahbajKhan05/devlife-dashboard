"use client";

import { Code2, ExternalLink, GitFork, Globe2, Star } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { useGitHubData } from "@/hooks/useGitHubData";
import type { GitHubRepository } from "@/lib/github";

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

function formatGitHubDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

function ProjectCorridor({
  repositories,
}: {
  repositories: GitHubRepository[];
}) {
  const corridorRepositories = Array.from(
    { length: Math.max(12, repositories.length * 2) },
    (_, index) => repositories[index % repositories.length]
  );

  return (
    <div
      aria-hidden="true"
      className="projects-stream__scene"
    >
      <div className="projects-stream__horizon" />
      <div className="projects-stream__glow" />
      {(["left", "right"] as const).map((side) => (
        <div className="projects-stream__rail" key={side}>
          {corridorRepositories.map((repository, index) => (
            <div
              className={`projects-stream__card projects-stream__card--${side}`}
              key={`${side}-${repository.id}-${index}`}
              style={{
                animationDelay: `${-(index * (8 / corridorRepositories.length))}s`,
              }}
            >
              <div className="projects-stream__window">
                <div className="projects-stream__window-bar">
                  <span className="projects-stream__window-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="projects-stream__window-label">
                    {repository.language || "PROJECT"}
                  </span>
                </div>
                <div className="projects-stream__code-lines">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <p className="projects-stream__card-name">{repository.name}</p>
              <p className="projects-stream__card-language">
                {repository.language || "Open source"}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function RepositoryCard({
  repository,
  index,
}: {
  repository: GitHubRepository;
  index: number;
}) {
  const sourceUrl = getHttpUrl(repository.url);
  const homepageUrl = getHttpUrl(repository.homepage);
  const repositoryLanguages = repository.languages ?? [];
  const languageBytes = repositoryLanguages.reduce(
    (total, language) => total + language.bytes,
    0
  );

  return (
    <article className="group flex min-w-0 flex-col rounded-2xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 shadow-[0_8px_24px_rgba(58,46,14,0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#D8C58E] hover:shadow-[0_14px_32px_rgba(58,46,14,0.09)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#80631F]">
          Work / {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex min-w-0 flex-wrap justify-end gap-1.5">
          <span className="rounded-full border border-[#E5D8AD] bg-[#FBF5DD] px-2.5 py-1 text-xs font-semibold text-[#785C19]">
            {repository.visibility}
          </span>
          {repository.isFork && (
            <span className="rounded-full border border-[#E5D8AD] px-2.5 py-1 text-xs font-semibold text-[#625D4C]">
              Fork
            </span>
          )}
          {repository.isArchived && (
            <span className="rounded-full border border-[#E5D8AD] px-2.5 py-1 text-xs font-semibold text-[#625D4C]">
              Archived
            </span>
          )}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mt-4 flex h-28 items-end overflow-hidden rounded-xl border border-[#EEE4C4] bg-[radial-gradient(ellipse_at_50%_110%,rgba(176,141,53,0.18),transparent_65%),linear-gradient(135deg,#FBF6E3,#FFFDF0)] p-3"
      >
        <div className="w-full rounded-lg border border-[#E8DDBB] bg-[#FFFDF0]/90 p-2.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#B08D35]" />
            <span className="h-1.5 w-12 rounded-full bg-[#E9D9A8]" />
          </div>
          <div className="mt-2 space-y-1.5">
            <span className="block h-1 w-[82%] rounded-full bg-[#D8C58E]" />
            <span className="block h-1 w-[58%] rounded-full bg-[#E8DDBB]" />
            <span className="block h-1 w-[70%] rounded-full bg-[#E8DDBB]" />
          </div>
        </div>
      </div>

      <h2 className="mt-4 break-words text-lg font-extrabold tracking-tight text-[#191919]">
        {repository.name}
      </h2>
      <p className="mt-1 min-h-10 flex-1 text-sm leading-5 text-[#625D4C]">
        {repository.description || "Description not available."}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-[#FBF6E3] px-3 py-2.5 text-xs">
        <div className="min-w-0">
          <dt className="text-[#706951]">Created</dt>
          <dd className="mt-0.5 font-semibold text-[#423A28]">
            <time dateTime={repository.createdAt}>
              {formatGitHubDate(repository.createdAt)}
            </time>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[#706951]">Last updated</dt>
          <dd className="mt-0.5 font-semibold text-[#423A28]">
            <time dateTime={repository.updatedAt}>
              {formatGitHubDate(repository.updatedAt)}
            </time>
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#625D4C]">
        {repository.language && (
          <span className="inline-flex items-center gap-1.5">
            <Code2 aria-hidden="true" size={14} className="text-[#947123]" />
            {repository.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Star aria-hidden="true" size={14} className="text-[#947123]" />
          {repository.stars}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GitFork aria-hidden="true" size={14} className="text-[#947123]" />
          {repository.forks}
        </span>
      </div>

      {repository.topics.length > 0 && (
        <ul
          aria-label={`${repository.name} topics`}
          className="mt-3 flex flex-wrap gap-1.5"
        >
          {repository.topics.map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-[#E8DDBB] px-2 py-1 text-[11px] text-[#625D4C]"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}

      {repositoryLanguages.length > 0 && (
        <div className="mt-3 border-t border-[#F0E7C9] pt-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#706951]">
            Language bytes by source share
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {repositoryLanguages.map((language) => (
              <li
                key={language.name}
                className="rounded-full bg-[#F8F0C9] px-2.5 py-1 text-xs font-semibold text-[#785C19]"
              >
                {language.name}
                {languageBytes > 0 &&
                  ` · ${((language.bytes / languageBytes) * 100).toFixed(1)}%`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F0E7C9] pt-3">
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#191919] px-3.5 text-sm font-bold text-white transition-colors hover:bg-[#423A28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
          >
            Source Code
            <ExternalLink aria-hidden="true" size={14} />
          </a>
        )}
        {homepageUrl && (
          <a
            href={homepageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#E5D8AD] bg-white px-3.5 text-sm font-bold text-[#785C19] transition-colors hover:bg-[#FBF5DD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
          >
            Live Demo
            <Globe2 aria-hidden="true" size={14} />
          </a>
        )}
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const { data, error, loading, reload } = useGitHubData();
  const repositories = data?.repositories ?? [];
  const hasRepositories = repositories.length > 0;

  return (
    <PageLayout className="space-y-7 sm:space-y-8">
      <header className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#80631F] sm:text-xs">
          Portfolio / Selected work
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[#191919] sm:text-5xl">
          Ideas into Projects.
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-[#625D4C] sm:text-base">
          Explore the experiments, interfaces, and code behind my work.
        </p>
      </header>

      <section
        aria-label="Project showcase"
        className="relative isolate overflow-hidden rounded-2xl border border-[#E8DDBB] bg-[#FAF5DF] shadow-[0_16px_40px_rgba(58,46,14,0.06)]"
      >
        {hasRepositories ? (
          <ProjectCorridor repositories={repositories} />
        ) : (
          <div aria-hidden="true" className="projects-stream__scene" />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#80631F]">
              Open source / In motion
            </p>
            <p className="mt-1 text-xs text-[#706951]">
              Built from real repositories
            </p>
          </div>
          <div className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0]/90 px-3 py-2 text-right shadow-sm backdrop-blur-sm">
            <p className="font-mono text-xl font-bold leading-none text-[#191919]">
              {hasRepositories
                ? String(repositories.length).padStart(2, "0")
                : loading
                  ? "—"
                  : error
                    ? "—"
                    : "00"}
            </p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#706951]">
              repositories
            </p>
          </div>
        </div>

        {!hasRepositories && (
          <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pt-12">
            {loading && (
              <p
                aria-live="polite"
                className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0]/95 px-4 py-3 text-sm font-medium text-[#625D4C] shadow-sm"
              >
                Loading public repositories…
              </p>
            )}
            {!loading && error && (
              <div
                role="alert"
                className="flex w-full max-w-lg flex-col items-start gap-3 rounded-xl border border-red-200 bg-[#FFFDF0] p-4 text-sm text-red-800 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <p>{error}</p>
                <button
                  type="button"
                  onClick={reload}
                  className="min-h-11 shrink-0 rounded-lg bg-[#191919] px-4 py-2 font-bold text-white transition-colors hover:bg-[#423A28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
                >
                  Try again
                </button>
              </div>
            )}
            {!loading && !error && (
              <p className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0]/95 px-4 py-3 text-sm text-[#625D4C] shadow-sm">
                No public projects found.
              </p>
            )}
          </div>
        )}

        {hasRepositories && loading && (
          <p aria-live="polite" className="sr-only">
            Refreshing public repositories…
          </p>
        )}
        {hasRepositories && error && (
          <div
            role="status"
            className="absolute bottom-3 left-3 z-20 max-w-[calc(100%-24px)] rounded-lg border border-red-200 bg-[#FFFDF0] px-3 py-2 text-xs text-red-800 shadow-sm"
          >
            Repository refresh failed. Showing the previously loaded projects.
            <button
              type="button"
              onClick={reload}
              className="ml-2 min-h-8 font-bold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
            >
              Retry
            </button>
          </div>
        )}
      </section>

      {hasRepositories && (
        <section aria-labelledby="all-projects-heading" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#80631F]">
                The details
              </p>
              <h2
                id="all-projects-heading"
                className="mt-1 text-2xl font-extrabold tracking-tight text-[#191919] sm:text-3xl"
              >
                Browse the work
              </h2>
            </div>
            <p className="text-sm text-[#625D4C]">
              {repositories.length}{" "}
              {repositories.length === 1 ? "repository" : "repositories"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {repositories.map((repository, index) => (
              <RepositoryCard
                key={repository.id}
                repository={repository}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      <style>{`
        .projects-stream__scene {
          position: relative;
          height: clamp(290px, 38vw, 440px);
          overflow: hidden;
          perspective: 1100px;
          perspective-origin: 50% 44%;
          transform-style: preserve-3d;
          isolation: isolate;
          background:
            radial-gradient(ellipse at 50% 49%, rgba(176, 141, 53, 0.15), transparent 34%),
            linear-gradient(180deg, rgba(255, 253, 240, 0.42), rgba(250, 245, 223, 0.1));
        }

        .projects-stream__scene::before {
          position: absolute;
          z-index: -1;
          inset: 42% -12% -34%;
          content: "";
          opacity: 0.42;
          background-image:
            linear-gradient(rgba(176, 141, 53, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(176, 141, 53, 0.12) 1px, transparent 1px);
          background-size: 46px 38px;
          transform: perspective(420px) rotateX(66deg);
          transform-origin: center top;
          mask-image: linear-gradient(to bottom, black, transparent 84%);
        }

        .projects-stream__horizon {
          position: absolute;
          top: 44%;
          left: 50%;
          width: min(68%, 760px);
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(176, 141, 53, 0.4), transparent);
          transform: translateX(-50%);
        }

        .projects-stream__glow {
          position: absolute;
          top: 44%;
          left: 50%;
          width: 9px;
          height: 9px;
          border: 1px solid rgba(176, 141, 53, 0.42);
          border-radius: 999px;
          background: #fffdf0;
          box-shadow: 0 0 0 8px rgba(176, 141, 53, 0.06), 0 0 30px rgba(176, 141, 53, 0.3);
          transform: translate(-50%, -50%);
        }

        .projects-stream__rail {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }

        .projects-stream__card {
          --corridor-x: 31vw;
          --corridor-y: 18vh;
          position: absolute;
          top: 46%;
          left: 50%;
          width: clamp(154px, 17vw, 210px);
          min-height: 134px;
          padding: 10px;
          border: 1px solid rgba(214, 194, 138, 0.82);
          border-radius: 12px;
          background: rgba(255, 253, 240, 0.96);
          box-shadow: 0 12px 30px rgba(58, 46, 14, 0.12);
          transform-style: preserve-3d;
          transform-origin: 50% 50%;
          backface-visibility: hidden;
          will-change: transform, opacity;
          animation: projects-stream-travel 8s linear infinite both;
        }

        .projects-stream__card--left {
          --corridor-x: -31vw;
          --corridor-y: 18vh;
          --curve-x: -15vw;
          --curve-y: 7vh;
          --mid-x: -22vw;
          --mid-y: 11vh;
          --tilt-y: 12deg;
          --tilt-z: -8deg;
          margin-left: -50%;
          margin-top: -68px;
        }

        .projects-stream__card--right {
          --corridor-x: 31vw;
          --corridor-y: 18vh;
          --curve-x: 15vw;
          --curve-y: 7vh;
          --mid-x: 22vw;
          --mid-y: 11vh;
          --tilt-y: -12deg;
          --tilt-z: 8deg;
          margin-left: -50%;
          margin-top: -68px;
        }

        .projects-stream__window {
          min-height: 78px;
          padding: 9px;
          overflow: hidden;
          border: 1px solid #eee4c4;
          border-radius: 8px;
          background:
            radial-gradient(ellipse at 100% 100%, rgba(176, 141, 53, 0.12), transparent 55%),
            #fbf6e3;
        }

        .projects-stream__window-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          padding-bottom: 7px;
          border-bottom: 1px solid rgba(232, 221, 187, 0.8);
        }

        .projects-stream__window-dots {
          display: flex;
          flex: 0 0 auto;
          gap: 3px;
        }

        .projects-stream__window-dots i {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #b08d35;
          opacity: 0.58;
        }

        .projects-stream__window-label {
          overflow: hidden;
          color: #80631f;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .projects-stream__code-lines {
          display: grid;
          gap: 5px;
          padding-top: 9px;
        }

        .projects-stream__code-lines i {
          display: block;
          width: 70%;
          height: 3px;
          border-radius: 999px;
          background: #ddc98e;
          opacity: 0.72;
        }

        .projects-stream__code-lines i:nth-child(2) {
          width: 48%;
          margin-left: 12%;
          background: #e8ddbb;
        }

        .projects-stream__code-lines i:nth-child(3) {
          width: 58%;
          margin-left: 6%;
          background: #d9c48a;
          opacity: 0.52;
        }

        .projects-stream__card-name {
          margin-top: 8px;
          overflow: hidden;
          color: #191919;
          font-size: 11px;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .projects-stream__card-language {
          margin-top: 2px;
          color: #706951;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        @keyframes projects-stream-travel {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, -740px) scale(0.15) rotateY(0deg) rotateZ(0deg);
          }
          8% {
            opacity: 0.06;
            transform: translate3d(0, 0, -600px) scale(0.23) rotateY(0deg) rotateZ(0deg);
          }
          22% {
            opacity: 0.65;
            transform: translate3d(var(--curve-x), var(--curve-y), -270px) scale(0.43) rotateY(var(--tilt-y)) rotateZ(var(--tilt-z));
          }
          66% {
            opacity: 0.94;
            transform: translate3d(var(--mid-x), var(--mid-y), 110px) scale(0.83) rotateY(var(--tilt-y)) rotateZ(var(--tilt-z));
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--corridor-x), var(--corridor-y), 490px) scale(1.18) rotateY(var(--tilt-y)) rotateZ(var(--tilt-z));
          }
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .projects-stream__scene {
            height: 350px;
            perspective: 900px;
          }

          .projects-stream__card {
            --corridor-x: 24vw;
            width: clamp(150px, 20vw, 184px);
          }

          .projects-stream__card--left {
            --corridor-x: -24vw;
            --corridor-y: 15vh;
            --curve-x: -11vw;
            --mid-x: -17vw;
            --mid-y: 9vh;
          }

          .projects-stream__card--right {
            --corridor-x: 24vw;
            --corridor-y: 15vh;
            --curve-x: 11vw;
            --mid-x: 17vw;
            --mid-y: 9vh;
          }
        }

        @media (max-width: 639px) {
          .projects-stream__scene {
            height: 300px;
            perspective: 680px;
            perspective-origin: 50% 46%;
          }

          .projects-stream__scene::before {
            inset: 48% -15% -28%;
            background-size: 34px 30px;
            transform: perspective(330px) rotateX(62deg);
          }

          .projects-stream__horizon,
          .projects-stream__glow {
            top: 47%;
          }

          .projects-stream__card {
            --corridor-x: 21vw;
            --corridor-y: 12vh;
            --curve-x: 9vw;
            --curve-y: 5vh;
            width: clamp(126px, 39vw, 158px);
            min-height: 116px;
            padding: 8px;
            border-radius: 10px;
            animation-duration: 8s;
          }

          .projects-stream__card:nth-child(n + 7) {
            display: none;
          }

          .projects-stream__card--left {
            --corridor-x: -21vw;
            --corridor-y: 12vh;
            --curve-x: -9vw;
            --curve-y: 5vh;
            --mid-x: -14vw;
            --mid-y: 7vh;
            --tilt-y: 7deg;
            --tilt-z: -5deg;
            margin-top: -59px;
          }

          .projects-stream__card--right {
            --corridor-x: 21vw;
            --corridor-y: 12vh;
            --curve-x: 9vw;
            --curve-y: 5vh;
            --mid-x: 14vw;
            --mid-y: 7vh;
            --tilt-y: -7deg;
            --tilt-z: 5deg;
            margin-top: -59px;
          }

          .projects-stream__window {
            min-height: 66px;
            padding: 7px;
          }

          .projects-stream__window-bar {
            padding-bottom: 5px;
          }

          .projects-stream__code-lines {
            gap: 4px;
            padding-top: 7px;
          }

          .projects-stream__card-name {
            margin-top: 6px;
            font-size: 10px;
          }

          .projects-stream__card-language {
            font-size: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .projects-stream__card {
            display: none;
            animation: none !important;
            opacity: 0;
            will-change: auto;
          }

          .projects-stream__card:nth-child(-n + 2) {
            display: block;
            opacity: 1;
            animation: none !important;
          }

          .projects-stream__card--left:nth-child(1) {
            transform: translate3d(-92%, -32%, 0) scale(0.78);
          }

          .projects-stream__card--left:nth-child(2) {
            transform: translate3d(-92%, 32%, 0) scale(0.78);
          }

          .projects-stream__card--right:nth-child(1) {
            transform: translate3d(92%, -32%, 0) scale(0.78);
          }

          .projects-stream__card--right:nth-child(2) {
            transform: translate3d(92%, 32%, 0) scale(0.78);
          }
        }
      `}</style>
    </PageLayout>
  );
}

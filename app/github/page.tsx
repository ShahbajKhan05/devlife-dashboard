"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageHeader, PageLayout } from "@/components/PageLayout";
import { useGitHubData } from "@/hooks/useGitHubData";

export default function GitHubPage() {
  const { data, error, loading, reload } = useGitHubData();
  const stats = [
    { label: "Public repositories", value: data?.publicRepos },
    { label: "Stars", value: data?.totalStars },
    { label: "Followers", value: data?.followers },
    { label: "Following", value: data?.following },
  ];

  return (
    <PageLayout className="space-y-6">
      <PageHeader
        eyebrow="GitHub overview"
        title="My coding activity"
        description="Public profile statistics, contribution history and languages used across my repositories."
      />

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-[#FFFDF0] p-4 text-sm text-red-800"
        >
          <p>{error}</p>
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
        className="grid grid-cols-2 gap-3 xl:grid-cols-4"
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

      <section className="overflow-hidden rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-bold">Contribution history</h2>
            <p className="mt-1 text-sm text-[#625D4C]">
              Contributions for {data?.username || "ShahbajKhan05"}
            </p>
          </div>
          <Link
            href={data?.profileUrl || "https://github.com/ShahbajKhan05"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-1 text-sm font-bold text-[#785C19] hover:underline"
          >
            Open GitHub
            <ExternalLink aria-hidden="true" size={14} />
          </Link>
        </div>
        <div className="mt-4 min-w-0 overflow-x-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ghchart.rshah.org/B08D35/ShahbajKhan05"
            alt="GitHub contribution graph for ShahbajKhan05"
            className="h-auto min-w-[600px] max-w-none"
          />
        </div>
      </section>

      <section className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-bold">Top repository languages</h2>
          {!loading && data && (
            <span className="text-sm text-[#625D4C]">
              {data.totalForks} forks across public repositories
            </span>
          )}
        </div>
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
    </PageLayout>
  );
}

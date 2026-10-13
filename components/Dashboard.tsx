"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  ExternalLink,
  GitFork,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";
import { DailyLogPreview } from "@/components/DailyLog";
import { PageHeader, PageLayout } from "@/components/PageLayout";
import { useGitHubData } from "@/hooks/useGitHubData";

const skillGroups = [
  {
    title: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Backend & tools",
    skills: ["Node.js", "REST APIs", "SQL", "Git", "GitHub", "VS Code"],
  },
];

function SectionHeading({
  eyebrow,
  title,
  href,
  linkText = "View all",
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkText?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#80631F]">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-bold text-[#785C19] hover:bg-[#F8F0C9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
      >
        {linkText}
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </div>
  );
}

const stats = [
  { label: "Public repositories", key: "publicRepos", Icon: Code2 },
  { label: "Stars", key: "totalStars", Icon: Star },
  { label: "Followers", key: "followers", Icon: Users },
  { label: "Forks", key: "totalForks", Icon: GitFork },
] as const;

export default function Dashboard() {
  const { data, error, loading, reload } = useGitHubData();

  return (
    <PageLayout className="space-y-7">
      <section className="rounded-2xl border border-[#E8DDBB] bg-[#FFFDF0] p-5 sm:p-7">
        <PageHeader
          eyebrow="Portfolio overview"
          title={`Hi, I'm ${data?.name || "Shahbaj Khan"}.`}
          description="A Computer Science Engineering graduate interested in web development and creating user-friendly digital experiences."
        />
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#191919] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#423A28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
          >
            About me
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#E2D6AD] px-4 py-2 text-sm font-bold hover:bg-[#F8F1D7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
          >
            Explore projects
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section aria-label="GitHub statistics">
        {error && (
          <div
            role="status"
            className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2D6AD] bg-[#FFFDF0] p-3 text-sm text-[#625D4C]"
          >
            <p>{error} The rest of your portfolio is still available.</p>
            <button
              type="button"
              onClick={reload}
              className="min-h-10 rounded-lg border border-[#E2D6AD] px-3 font-semibold hover:bg-[#F8F0C9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35]"
            >
              Retry
            </button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map(({ label, key, Icon }) => (
            <article
              key={label}
              aria-busy={loading}
              className="min-w-0 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm leading-5 text-[#625D4C]">{label}</p>
                <Icon
                  aria-hidden="true"
                  className="shrink-0 text-[#947123]"
                  size={18}
                />
              </div>
              <p className="mt-3 text-2xl font-black tabular-nums sm:text-3xl">
                {loading ? "…" : (data?.[key] ?? "—")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Selected work"
          title="Recent projects"
          href="/projects"
        />

        {loading ? (
          <p
            aria-live="polite"
            className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 text-sm text-[#625D4C]"
          >
            Loading public repositories…
          </p>
        ) : data?.repositories.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.repositories.slice(0, 3).map((repository) => (
              <article
                key={repository.id}
                className="flex min-w-0 flex-col rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <Code2
                    aria-hidden="true"
                    className="shrink-0 text-[#947123]"
                    size={21}
                  />
                  {repository.language && (
                    <span className="max-w-[65%] truncate rounded-full bg-[#F8F0C9] px-2.5 py-1 text-xs font-semibold text-[#785C19]">
                      {repository.language}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 break-words text-base font-extrabold">
                  {repository.name.replaceAll("-", " ")}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-5 text-[#625D4C]">
                  {repository.description || "Public GitHub repository."}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#625D4C]">
                  <span className="inline-flex items-center gap-1">
                    <Star aria-hidden="true" size={14} /> {repository.stars}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork aria-hidden="true" size={14} /> {repository.forks}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#F0E7C9] pt-3">
                  <Link
                    href={repository.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-8 items-center gap-1 text-sm font-bold text-[#785C19] hover:underline"
                  >
                    Repository
                    <ExternalLink aria-hidden="true" size={14} />
                  </Link>
                  {repository.homepage && (
                    <Link
                      href={repository.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-8 items-center gap-1 text-sm font-bold text-[#785C19] hover:underline"
                    >
                      Live demo
                      <ExternalLink aria-hidden="true" size={14} />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 text-sm text-[#625D4C]">
            {error || "No public repositories found."}
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionHeading
            eyebrow="Tools & technologies"
            title="Skills preview"
            href="/skills"
          />
          <div className="space-y-4 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-bold">{group.title}</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-lg border border-[#E5D8AD] bg-white px-2.5 py-1.5 text-sm"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="My journey"
            title="Experience & education"
            href="/experience"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4">
              <GraduationCap
                aria-hidden="true"
                className="text-[#947123]"
                size={20}
              />
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#80631F]">
                Education
              </p>
              <h3 className="mt-1 font-bold">
                B.Tech, Computer Science Engineering
              </h3>
              <p className="mt-1 text-sm leading-5 text-[#625D4C]">
                Truba Institute of Engineering, Bhopal · 2021–2025
              </p>
            </article>
            <article className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4">
              <Code2
                aria-hidden="true"
                className="text-[#947123]"
                size={20}
              />
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#80631F]">
                Recent role
              </p>
              <h3 className="mt-1 font-bold">Logistics Support Executive</h3>
              <p className="mt-1 text-sm leading-5 text-[#625D4C]">
                AKSEDGE SOFTWARE PVT. LTD. · May–June 2026
              </p>
            </article>
          </div>
        </section>
      </div>

      <section aria-labelledby="contributions-title">
        <SectionHeading
          eyebrow="Consistency"
          title="GitHub contributions"
          href="/github"
        />
        <div className="overflow-hidden rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-[#625D4C]">
              Contribution history for ShahbajKhan05
            </p>
            <Link
              href="https://github.com/ShahbajKhan05"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-1 text-sm font-bold text-[#785C19] hover:underline"
            >
              GitHub profile
              <ExternalLink aria-hidden="true" size={14} />
            </Link>
          </div>
          <div className="min-w-0 overflow-x-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ghchart.rshah.org/B08D35/ShahbajKhan05"
              alt="GitHub contribution graph for ShahbajKhan05"
              className="h-auto min-w-[600px] max-w-none"
            />
          </div>
        </div>
      </section>

      <DailyLogPreview />
    </PageLayout>
  );
}

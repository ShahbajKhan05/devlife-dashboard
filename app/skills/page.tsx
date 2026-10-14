
"use client";

import { useMemo, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import {
  SiHtml5 as siHtml5,
  SiCss as siCss,
  SiJavascript as siJavascript,
  SiTypescript as siTypescript,
  SiReact as siReact,
  SiNextdotjs as siNextdotjs,
  SiTailwindcss as siTailwindcss,
  SiSass as siSass,
  SiBootstrap as siBootstrap,
  SiVite as siVite,
  SiWebpack as siWebpack,
  SiFramer as siFramer,
  SiThreedotjs as siThreedotjs,
  SiRedux as siRedux,
  SiReactquery as siReactquery,
  SiStorybook as siStorybook,
  SiShadcnui as siShadcnui,
  SiAstro as siAstro,
  SiAngular as siAngular,
  SiVuedotjs as siVuedotjs,
  SiSvelte as siSvelte,
  SiJest as siJest,
  SiTestinglibrary as siTestinglibrary,
  SiWebgl as siWebgl,
  SiGreensock as siGreensock,
  SiNodedotjs as siNodedotjs,
  SiExpress as siExpress,
  SiNestjs as siNestjs,
  SiPython as siPython,
  SiDjango as siDjango,
  SiFastapi as siFastapi,
  SiGraphql as siGraphql,
  SiPrisma as siPrisma,
  SiPostgresql as siPostgresql,
  SiMongodb as siMongodb,
  SiMysql as siMysql,
  SiRedis as siRedis,
  SiFirebase as siFirebase,
  SiGithub as siGithub,
  SiGit as siGit,
  SiDocker as siDocker,
  SiPostman as siPostman,
  SiFigma as siFigma,
  SiVercel as siVercel,
  SiNetlify as siNetlify,
  SiNotion as siNotion,
  SiNpm as siNpm,
} from "@icons-pack/react-simple-icons";
import {
  Sparkles,
  Code2,
  Terminal,
  Database,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { PageLayout } from "@/components/PageLayout";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>> | LucideIcon;

type Skill = {
  name: string;
  category: string;
  percentage: number;
  Icon: IconComponent;
};

const skills: Skill[] = [
  // FRONTEND — 25
  { name: "HTML5", category: "Frontend", percentage: 95, Icon: siHtml5 },
  { name: "CSS3", category: "Frontend", percentage: 90, Icon: siCss },
  { name: "JavaScript", category: "Frontend", percentage: 90, Icon: siJavascript },
  { name: "TypeScript", category: "Frontend", percentage: 85, Icon: siTypescript },
  { name: "React", category: "Frontend", percentage: 95, Icon: siReact },
  { name: "Next.js", category: "Frontend", percentage: 90, Icon: siNextdotjs },
  { name: "Tailwind CSS", category: "Frontend", percentage: 90, Icon: siTailwindcss },
  { name: "Sass", category: "Frontend", percentage: 75, Icon: siSass },
  { name: "Bootstrap", category: "Frontend", percentage: 80, Icon: siBootstrap },
  { name: "Vite", category: "Frontend", percentage: 85, Icon: siVite },
  { name: "Webpack", category: "Frontend", percentage: 65, Icon: siWebpack },
  { name: "Framer Motion", category: "Frontend", percentage: 85, Icon: siFramer },
  { name: "GSAP", category: "Frontend", percentage: 80, Icon: siGreensock },
  { name: "Three.js", category: "Frontend", percentage: 75, Icon: siThreedotjs },
  { name: "Redux Toolkit", category: "Frontend", percentage: 80, Icon: siRedux },
  { name: "TanStack Query", category: "Frontend", percentage: 75, Icon: siReactquery },
  { name: "Storybook", category: "Frontend", percentage: 70, Icon: siStorybook },
  { name: "shadcn/ui", category: "Frontend", percentage: 90, Icon: siShadcnui },
  { name: "Astro", category: "Frontend", percentage: 65, Icon: siAstro },
  { name: "Angular", category: "Frontend", percentage: 60, Icon: siAngular },
  { name: "Vue.js", category: "Frontend", percentage: 65, Icon: siVuedotjs },
  { name: "Svelte", category: "Frontend", percentage: 60, Icon: siSvelte },
  { name: "Jest", category: "Frontend", percentage: 70, Icon: siJest },
  { name: "Testing Library", category: "Frontend", percentage: 70, Icon: siTestinglibrary },
  { name: "WebGL", category: "Frontend", percentage: 65, Icon: siWebgl },

  // BACKEND — 10
  { name: "Node.js", category: "Backend", percentage: 85, Icon: siNodedotjs },
  { name: "Express.js", category: "Backend", percentage: 80, Icon: siExpress },
  { name: "NestJS", category: "Backend", percentage: 65, Icon: siNestjs },
  { name: "Python", category: "Backend", percentage: 80, Icon: siPython },
  { name: "Django", category: "Backend", percentage: 65, Icon: siDjango },
  { name: "FastAPI", category: "Backend", percentage: 70, Icon: siFastapi },
  { name: "GraphQL", category: "Backend", percentage: 70, Icon: siGraphql },
  { name: "REST APIs", category: "Backend", percentage: 90, Icon: Globe },
  { name: "Prisma ORM", category: "Backend", percentage: 80, Icon: siPrisma },
  { name: "Authentication", category: "Backend", percentage: 80, Icon: Code2 },

  // DATABASE — 5
  { name: "PostgreSQL", category: "Database", percentage: 80, Icon: siPostgresql },
  { name: "MongoDB", category: "Database", percentage: 85, Icon: siMongodb },
  { name: "MySQL", category: "Database", percentage: 75, Icon: siMysql },
  { name: "Redis", category: "Database", percentage: 65, Icon: siRedis },
  { name: "Firebase", category: "Database", percentage: 80, Icon: siFirebase },

  // TOOLS & WORKFLOW — 10
  { name: "VS Code", category: "Tools", percentage: 95, Icon: Code2 },
  { name: "GitHub", category: "Tools", percentage: 95, Icon: siGithub },
  { name: "Git", category: "Tools", percentage: 90, Icon: siGit },
  { name: "Docker", category: "Tools", percentage: 65, Icon: siDocker },
  { name: "Postman", category: "Tools", percentage: 85, Icon: siPostman },
  { name: "Figma", category: "Tools", percentage: 80, Icon: siFigma },
  { name: "Vercel", category: "Tools", percentage: 90, Icon: siVercel },
  { name: "Netlify", category: "Tools", percentage: 75, Icon: siNetlify },
  { name: "Notion", category: "Tools", percentage: 85, Icon: siNotion },
  { name: "npm", category: "Tools", percentage: 90, Icon: siNpm },
];

const categories = ["All", "Frontend", "Backend", "Database", "Tools"] as const;

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("All");

  const filteredSkills = useMemo(
    () =>
      activeCategory === "All"
        ? skills
        : skills.filter((skill) => skill.category === activeCategory),
    [activeCategory],
  );

  const counts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category,
          category === "All"
            ? skills.length
            : skills.filter((skill) => skill.category === category).length,
        ]),
      ) as Record<(typeof categories)[number], number>,
    [],
  );

  return (
    <PageLayout className="space-y-7 sm:space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80631F]">
          My expertise
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#191919] sm:text-4xl">
          Tools &amp; Stack
        </h1>

        <p className="mt-2 text-sm text-[#80631F]">
          Technologies, frameworks and tools I work with.
        </p>
      </header>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Frontend", count: 25, Icon: Code2 },
          { label: "Backend", count: 10, Icon: Terminal },
          { label: "Database", count: 5, Icon: Database },
          { label: "Tools", count: 10, Icon: Sparkles },
        ].map(({ label, count, Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4"
          >
            <Icon size={20} className="text-[#80631F]" />
            <p className="mt-3 text-2xl font-black text-[#191919]">
              {count}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#80631F]">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-200 ${
              activeCategory === category
                ? "border-[#80631F] bg-[#80631F] text-white"
                : "border-[#E8DDBB] bg-[#FFFDF0] text-[#80631F] hover:border-[#D6C28A] hover:bg-[#FBF6E3]"
            }`}
          >
            {category}
            <span className="ml-2 opacity-75">{counts[category]}</span>
          </button>
        ))}
      </div>

      {/* Skill cards */}
      <ul className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
        {filteredSkills.map(({ name, category, percentage, Icon }) => (
          <li
            key={name}
            className="group flex min-h-[100px] min-w-0 items-center gap-3 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] px-3.5 py-3.5 shadow-[0_5px_18px_rgba(58,46,14,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D6C28A] hover:shadow-[0_9px_24px_rgba(58,46,14,0.07)] sm:gap-4 sm:px-4"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-[#E8DDBB] bg-[#FBF6E3] text-[#80631F] transition-colors group-hover:border-[#D6C28A] group-hover:bg-[#F5EBCB]">
              <Icon
                aria-hidden="true"
                width={21}
                height={21}
                className="max-h-[21px] max-w-[21px]"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-[#191919] sm:text-[15px]">
                {name}
              </span>

              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#80631F] sm:text-[10px]">
                {category}
              </span>

              <span
                className="mt-2 block h-1 overflow-hidden rounded-full bg-[#EDE4C9]"
                role="progressbar"
                aria-label={`${name} self-assessed proficiency`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
              >
                <span
                  className="block h-full rounded-full bg-[#80631F] transition-[width] duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </span>
            </span>

            <span className="shrink-0 self-start pt-1 text-xs font-bold tabular-nums text-[#191919]">
              {percentage}%
            </span>
          </li>
        ))}
      </ul>

      <p className="text-center text-xs text-[#80631F]/80">
        Showing {filteredSkills.length} of {skills.length} technologies.
      </p>
    </PageLayout>
  );
}

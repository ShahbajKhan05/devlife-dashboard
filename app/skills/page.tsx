import {
  Atom,
  BookOpenCheck,
  Code2,
  CodeXml,
  Component,
  GitBranch,
  Layers3,
  Lightbulb,
  MousePointer2,
  NotebookPen,
  Orbit,
  PenTool,
  Sparkles,
  Triangle,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PageLayout } from "@/components/PageLayout";

const skills: {
  name: string;
  category: string;
  percentage: number;
  Icon: LucideIcon;
}[] = [
  { name: "Figma", category: "Design Tool", percentage: 75, Icon: PenTool },
  {
    name: "React",
    category: "JavaScript Library",
    percentage: 95,
    Icon: Atom,
  },
  {
    name: "Next.js",
    category: "Full Stack Framework",
    percentage: 90,
    Icon: Layers3,
  },
  {
    name: "Tailwind CSS",
    category: "CSS Framework",
    percentage: 90,
    Icon: Wind,
  },
  { name: "v0", category: "AI Tool", percentage: 85, Icon: Sparkles },
  { name: "Vite", category: "Build Tool", percentage: 80, Icon: Zap },
  {
    name: "TypeScript",
    category: "Programming Language",
    percentage: 85,
    Icon: CodeXml,
  },
  {
    name: "GitHub",
    category: "Version Control",
    percentage: 95,
    Icon: GitBranch,
  },
  {
    name: "VS Code",
    category: "Code Editor",
    percentage: 70,
    Icon: Code2,
  },
  {
    name: "Vercel",
    category: "Hosting Platform",
    percentage: 80,
    Icon: Triangle,
  },
  {
    name: "Notion",
    category: "Productivity Tool",
    percentage: 85,
    Icon: NotebookPen,
  },
  {
    name: "Cursor",
    category: "AI Code Editor",
    percentage: 95,
    Icon: MousePointer2,
  },
  {
    name: "Astro",
    category: "Web Framework",
    percentage: 60,
    Icon: Orbit,
  },
  {
    name: "shadcn/ui",
    category: "Component Library",
    percentage: 90,
    Icon: Component,
  },
];

export default function SkillsPage() {
  return (
    <PageLayout className="space-y-7 sm:space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80631F]">
          Tech stack
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#191919] sm:text-4xl">
          Tools &amp; Stack
        </h1>
      </header>

      <ul className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
        {skills.map(({ name, category, percentage, Icon }) => (
          <li
            key={name}
            className="flex min-h-[82px] min-w-0 items-center gap-3 rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] px-3.5 py-3 shadow-[0_5px_18px_rgba(58,46,14,0.035)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#D6C28A] hover:shadow-[0_9px_24px_rgba(58,46,14,0.07)] sm:gap-4 sm:px-4"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-[#E8DDBB] bg-[#FBF6E3] text-[#80631F]">
              <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-[#191919] sm:text-[15px]">
                {name}
              </span>
              <span className="mt-1 block text-[9px] font-semibold uppercase leading-4 tracking-[0.12em] text-[#80631F] sm:text-[10px]">
                {category}
              </span>
            </span>
            <span
              aria-label={`${percentage}%`}
              className="shrink-0 text-sm font-bold tabular-nums text-[#191919]"
            >
              {percentage}%
            </span>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}

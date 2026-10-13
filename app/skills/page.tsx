"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { PageHeader, PageLayout } from "@/components/PageLayout";

const groups = [
  {
    title: "Frontend development",
    description: "User interfaces and responsive layouts",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend and data",
    description: "Application logic and APIs",
    skills: ["Node.js", "REST APIs", "SQL"],
  },
  {
    title: "Tools and workflow",
    description: "Development and collaboration",
    skills: ["Git", "GitHub", "VS Code"],
  },
  {
    title: "Professional strengths",
    description: "Skills developed through work experience",
    skills: [
      "Problem-solving",
      "Communication",
      "Issue resolution",
      "Team coordination",
      "Time management",
    ],
  },
];

function subscribeToViewport(callback: () => void) {
  window.addEventListener("resize", callback, { passive: true });
  return () => window.removeEventListener("resize", callback);
}

function getViewportWidth() {
  return window.innerWidth;
}

function getServerViewportWidth() {
  return 0;
}

function SkillCardContent({
  group,
  index,
}: {
  group: (typeof groups)[number];
  index: number;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#80631F]">
          Skill group {String(index + 1).padStart(2, "0")}
        </p>
        <span
          aria-label={`${group.skills.length} skills`}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-[#E5D8AD] bg-[#FBF5DD] text-xs font-semibold text-[#785C19]"
        >
          {String(group.skills.length).padStart(2, "0")}
        </span>
      </div>
      <h2 className="mt-3 text-lg font-extrabold leading-tight tracking-tight text-[#191919] sm:text-xl">
        {group.title}
      </h2>
      <p className="mt-1.5 text-[13px] leading-5 text-[#706951]">
        {group.description}
      </p>
      <ul className="mt-auto flex flex-wrap gap-2 pt-4">
        {group.skills.map((skill) => (
          <li
            key={skill}
            className="max-w-full break-words rounded-lg border border-[#E5D8AD] bg-white/80 px-2.5 py-1.5 text-xs font-medium leading-4 text-[#383425] sm:text-[13px]"
          >
            {skill}
          </li>
        ))}
      </ul>
    </>
  );
}

function StaticSkillCard({
  group,
  index,
}: {
  group: (typeof groups)[number];
  index: number;
}) {
  return (
    <article className="flex min-h-[230px] min-w-0 flex-col rounded-2xl border border-[#E8DDBB] border-t-2 border-t-[#B08D35] bg-[#FFFDF0] p-4 shadow-[0_10px_30px_rgba(58,46,14,0.05)] sm:p-5">
      <SkillCardContent group={group} index={index} />
    </article>
  );
}

function MorphingSkillCard({
  group,
  index,
  progress,
  stageWidth,
  cardWidth,
}: {
  group: (typeof groups)[number];
  index: number;
  progress: MotionValue<number>;
  stageWidth: number;
  cardWidth: number;
}) {
  const cardHeight = 292;
  const scatterFactors = [-0.78, 0.7, -0.52, 0.78];
  const scatterHeights = [-68, 74, 106, -94];
  const scatterRotations = [-5, 4, -3, 5];
  const orbitRotations = [0, 2, 0, -2];
  const availableX = Math.max(0, (stageWidth - cardWidth) / 2 - 18);
  const scatterX = scatterFactors[index] * availableX;
  const scatterY = scatterHeights[index];
  const orbitAngle = -Math.PI / 2 + index * (Math.PI / 2);
  const orbitX = Math.cos(orbitAngle) * Math.min(stageWidth * 0.34, 320);
  const orbitY = Math.sin(orbitAngle) * 150;
  const columns = stageWidth >= 1100 ? groups.length : 2;
  const row = Math.floor(index / columns);
  const column = index % columns;
  const rowCount = Math.min(columns, groups.length - row * columns);
  const normalizedColumn = rowCount > 1 ? column / (rowCount - 1) : 0.5;
  const galleryX =
    (column - (rowCount - 1) / 2) *
    ((stageWidth - cardWidth) / Math.max(1, rowCount - 1));
  const galleryY =
    (columns === groups.length ? 54 : row === 0 ? -96 : 106) +
    Math.sin(normalizedColumn * Math.PI) * (columns === groups.length ? 82 : 34);

  const x = useTransform(
    progress,
    [0, 0.38, 0.72, 1],
    [scatterX, orbitX, galleryX, galleryX]
  );
  const y = useTransform(
    progress,
    [0, 0.38, 0.72, 1],
    [scatterY, orbitY, galleryY, galleryY]
  );
  const rotate = useTransform(
    progress,
    [0, 0.38, 0.72, 1],
    [scatterRotations[index], orbitRotations[index], 0, 0]
  );
  const rotateX = useTransform(progress, [0, 0.38, 0.72, 1], [4, 0, 0, 0]);
  const scale = useTransform(progress, [0, 0.38, 0.72, 1], [0.92, 1, 0.97, 1]);
  const depth = useTransform(
    progress,
    [0, 0.38, 0.72, 1],
    [index * 5, 18 + index * 5, 12 + index * 3, 8]
  );

  return (
    <motion.article
      aria-label={group.title}
      className="absolute top-1/2 flex h-[292px] min-w-0 flex-col rounded-2xl border border-[#E8DDBB] border-t-2 border-t-[#B08D35] bg-[#FFFDF0]/95 p-4 shadow-[0_18px_48px_rgba(58,46,14,0.11)] backdrop-blur-sm sm:p-5"
      style={{
        left: "50%",
        width: cardWidth,
        marginLeft: -cardWidth / 2,
        marginTop: -cardHeight / 2,
        x,
        y,
        rotate,
        rotateX,
        scale,
        z: depth,
        opacity: 1,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
    >
      <SkillCardContent group={group} index={index} />
    </motion.article>
  );
}

function MorphingSkills() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportWidth = useSyncExternalStore(
    subscribeToViewport,
    getViewportWidth,
    getServerViewportWidth
  );
  const shellWidth =
    viewportWidth === 0
      ? 1080
      : viewportWidth -
        (viewportWidth >= 1024 ? 240 : 0) -
        (viewportWidth >= 1024 ? 56 : viewportWidth >= 640 ? 48 : 32);
  const stageWidth = Math.max(320, Math.min(shellWidth, 1180));
  const cardWidth = Math.min(
    286,
    Math.max(190, stageWidth >= 1100 ? (stageWidth - 60) / 4 : stageWidth * 0.32)
  );
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.45,
  });
  const headingOpacity = useTransform(
    progress,
    [0, 0.04, 0.08, 0.25],
    [0, 1, 1, 0]
  );
  const headingY = useTransform(progress, [0, 0.08, 0.25], [20, 0, -24]);
  const centerOpacity = useTransform(
    progress,
    [0.2, 0.34, 0.58, 0.8],
    [0, 1, 1, 0]
  );
  const centerScale = useTransform(progress, [0.2, 0.38, 0.8], [0.86, 1, 0.92]);
  const hintOpacity = useTransform(
    progress,
    [0, 0.05, 0.12, 1],
    [0.4, 1, 0, 0]
  );

  return (
    <motion.section
      ref={sectionRef}
      aria-label="Scroll-driven skills showcase"
      className="relative mt-4 hidden h-[250svh] md:block motion-reduce:!hidden"
    >
      <div className="sticky top-16 h-[calc(100svh-4rem)] min-h-[560px] overflow-hidden lg:top-0 lg:h-screen lg:min-h-[620px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(176,141,53,0.14), transparent 52%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[min(62vw,40rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B08D35]/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[min(44vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B08D35]/10"
        />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ opacity: centerOpacity, scale: centerScale }}
        >
          <p className="text-5xl font-black tracking-tight text-[#B08D35]/25 sm:text-6xl">
            {String(groups.length).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#706951]">
            skill groups
          </p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-4 top-[7%] z-20 mx-auto max-w-xl text-center sm:top-[8%]"
          style={{ opacity: headingOpacity, y: headingY }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#80631F] sm:text-xs">
            A closer look at the toolkit
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#191919] sm:text-4xl">
            Skills in orbit.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-5 text-[#706951]">
            Four groups, arranged around the work they support.
          </p>
        </motion.div>

        {groups.map((group, index) => (
          <MorphingSkillCard
            key={group.title}
            group={group}
            index={index}
            progress={progress}
            stageWidth={stageWidth}
            cardWidth={cardWidth}
          />
        ))}

        <motion.p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#706951] sm:bottom-8 sm:text-xs"
          style={{ opacity: hintOpacity }}
        >
          Scroll to reshape the skill map
        </motion.p>
      </div>
    </motion.section>
  );
}

export default function SkillsPage() {
  const prefersReducedMotion = useReducedMotion() === true;

  return (
    <PageLayout className="space-y-6">
      <PageHeader
        eyebrow="Tech stack"
        title="Skills & tools"
        description="Technical and professional strengths, grouped by the work they support."
      />

      {!prefersReducedMotion && <MorphingSkills />}

      <div
        className={`grid gap-3 md:grid-cols-2 ${
          prefersReducedMotion
            ? "motion-reduce:md:!grid"
            : "md:hidden motion-reduce:md:!grid"
        }`}
      >
        {groups.map((group, index) => (
          <StaticSkillCard key={group.title} group={group} index={index} />
        ))}
      </div>
    </PageLayout>
  );
}

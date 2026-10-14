import { PageLayout } from "@/components/PageLayout";

const technologyIcons = {
  nextjs: { name: "Next.js", src: "/icons/tech/nextjs.svg" },
  react: { name: "React", src: "/icons/tech/react.svg" },
  typescript: { name: "TypeScript", src: "/icons/tech/typescript.svg" },
  tailwindcss: { name: "Tailwind CSS", src: "/icons/tech/tailwindcss.svg" },
} as const;

type TechnologyName = keyof typeof technologyIcons;

type Project = {
  name: string;
  description: string;
  url: string;
  techStack: TechnologyName[];
};

const verifiedNextStack: TechnologyName[] = ["nextjs", "react"];

const projects: Project[] = [
  {
    name: "Paisa Tracker X",
    description: "A money-tracking project presented under the Paisa Tracker X name.",
    url: "https://paisa-tracker-x.vercel.app/",
    techStack: verifiedNextStack,
  },
  {
    name: "Shahbaj Portfolio",
    description: "A portfolio website presented under the Shahbaj Portfolio name.",
    url: "https://shah-portfolio-nine.vercel.app/",
    techStack: verifiedNextStack,
  },
  {
    name: "0.5-production",
    description: "A live project published under the 0.5-production name.",
    url: "https://05-production.vercel.app/",
    techStack: verifiedNextStack,
  },
  {
    name: "ForecastX",
    description: "A forecast-focused project presented under the ForecastX name.",
    url: "https://forecastx-tau.vercel.app/",
    techStack: verifiedNextStack,
  },
  {
    name: "Irfan Portfolio",
    description: "A portfolio website presented under the Irfan Portfolio name.",
    url: "https://irfan-portfolio-theta.vercel.app/",
    techStack: verifiedNextStack,
  },
  {
    name: "Note-X",
    description: "A notes-focused project presented under the Note-X name.",
    url: "https://note-x-eta.vercel.app/",
    techStack: verifiedNextStack,
  },
  {
    name: "Noor Technologies",
    description: "A web presence presented under the Noor Technologies name.",
    url: "https://noor-studio-five.vercel.app/",
    techStack: verifiedNextStack,
  },
  {
    name: "DevLife Dashboard",
    description:
      "A developer portfolio featuring projects, skills, and GitHub activity.",
    url: "https://devlife-dashboard-six.vercel.app/",
    techStack: ["nextjs", "react", "typescript", "tailwindcss"],
  },
  {
    name: "Rashid Mega Mart",
    description: "A live project published under the Rashid Mega Mart name.",
    url: "https://rashid-mega-mart.vercel.app/",
    techStack: verifiedNextStack,
  },
];

function ProjectPreview({ name, number }: { name: string; number: string }) {
  return (
    <svg
      aria-hidden="true"
      className="block aspect-[240/130] w-[120px]"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 240 130"
    >
      <rect width="240" height="130" fill="#F3F3F1" />
      <rect
        x="12.5"
        y="12.5"
        width="215"
        height="105"
        fill="white"
        stroke="#E5E5E3"
      />
      <circle cx="25" cy="26" r="2" fill="#191919" />
      <circle cx="33" cy="26" r="2" fill="#C9C9C6" />
      <circle cx="41" cy="26" r="2" fill="#C9C9C6" />
      <path d="M13 38.5h214" stroke="#E5E5E3" />
      <text
        fill="#777773"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        letterSpacing="1"
        x="25"
        y="57"
      >
        PROJECT {number}
      </text>
      <text
        fill="#191919"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="600"
        x="25"
        y="77"
      >
        {name.toUpperCase()}
      </text>
      <path d="M25 90h112" stroke="#D8D8D5" />
      <path d="M25 99h72" stroke="#E4E4E1" />
    </svg>
  );
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#FFFAD8]">
      <PageLayout className="space-y-0">
        <h1 className="sr-only">Selected projects</h1>

        <section aria-label="Selected projects">
          <div
            className="hidden grid-cols-[minmax(0,1fr)_minmax(0,2fr)_120px] gap-x-4 border-b border-[#E7E7E7] py-3 text-[10px] font-medium uppercase tracking-[0.08em] text-[#858585] md:grid lg:gap-x-8"
          >
            <span>Projects</span>
            <span>Description</span>
            <span className="text-right">Gallery</span>
          </div>

          <ol className="m-0 list-none p-0">
            {projects.map((project, index) => {
              const number = String(index + 1).padStart(2, "0");

              return (
                <li
                  key={project.url}
                  className="grid grid-cols-1 gap-y-3 border-b border-[#E7E7E7] py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_120px] md:items-center md:gap-x-4 md:py-6 lg:gap-x-8"
                >
                  <div className="flex min-w-0 flex-col items-start gap-2">
                    <div className="flex min-w-0 items-baseline gap-2 text-[11px] leading-[1.45] text-[#111111]">
                      <span className="shrink-0 tabular-nums">{number}</span>
                      <h2 className="min-w-0 font-medium uppercase">
                        {project.name}
                      </h2>
                    </div>
                    <div className="flex min-w-0 flex-wrap items-start gap-x-2 gap-y-1">
                      <span className="shrink-0 pt-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-[#858585]">
                        Tech stack
                      </span>
                      <ul
                        aria-label={`${project.name} tech stack`}
                        className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1"
                      >
                        {project.techStack.map((technologyName, techIndex) => {
                          const technology = technologyIcons[technologyName];

                          return (
                            <li
                              key={technologyName}
                              className="project-tech-item"
                              style={{
                                animationDelay: `${techIndex * 70}ms`,
                              }}
                            >
                              <span className="project-tech-icon inline-flex items-center gap-1 text-[10px] leading-5 text-[#42423F]">
                                <img
                                  alt={technology.name}
                                  className="size-3.5 shrink-0 object-contain"
                                  height={14}
                                  src={technology.src}
                                  width={14}
                                />
                                <span aria-hidden="true">
                                  {technology.name}
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <p className="max-w-2xl text-[16px] leading-[1.3] text-[#111111]">
                    {project.description}
                  </p>

                  <a
                    aria-label={`Open ${project.name} in a new tab`}
                    className="w-fit justify-self-end focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#555555]"
                    href={project.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <ProjectPreview name={project.name} number={number} />
                  </a>
                </li>
              );
            })}
          </ol>
        </section>
      </PageLayout>
      <style>{`
        @keyframes project-tech-enter {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .project-tech-item {
          animation: project-tech-enter 380ms ease-out both;
        }

        .project-tech-icon {
          transition: transform 180ms ease-out;
        }

        .project-tech-item:hover .project-tech-icon {
          transform: translateY(-1px);
        }

        @media (prefers-reduced-motion: reduce) {
          .project-tech-item {
            animation: none;
          }

          .project-tech-icon {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

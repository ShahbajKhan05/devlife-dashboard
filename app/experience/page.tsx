import {
  Award,
  BriefcaseBusiness,
  GraduationCap,
  MessageSquareText,
  RotateCcw,
  UsersRound,
} from "lucide-react";
import { PageHeader, PageLayout } from "@/components/PageLayout";

const experience = [
  {
    role: "Logistics Support Executive",
    company: "AKSEDGE SOFTWARE PVT. LTD.",
    startDate: "2026-05",
    startLabel: "May 2026",
    endDate: "2026-06",
    endLabel: "June 2026",
    responsibilities: [
      "Tracked shipments and responded to delivery-status queries.",
      "Supported customers by phone and email, coordinating with logistics teams.",
      "Maintained accurate service documentation.",
    ],
  },
  {
    role: "Associate – Customer Support",
    company: "Tech Mahindra Limited · Flipkart",
    startDate: "2025-08",
    startLabel: "August 2025",
    endDate: "2025-10",
    endLabel: "October 2025",
    responsibilities: [
      "Handled 150+ customer chats daily, assisting with delivery delays and order tracking.",
      "Coordinated with logistics teams while supporting customer satisfaction and productivity targets.",
    ],
  },
  {
    role: "Customer Support L2 Supervisor",
    company: "Startek Inc. · Flipkart",
    startDate: "2024-08",
    startLabel: "August 2024",
    endDate: "2025-02",
    endLabel: "February 2025",
    responsibilities: [
      "Handled 30+ L2 return and refund cases daily and verified product eligibility.",
      "Coordinated logistics pickups, maintained 90+ CSAT, and worked toward SLA/TAT targets.",
    ],
  },
];

const highlights = [
  { value: "150+", label: "Customer chats daily", Icon: MessageSquareText },
  { value: "30+", label: "L2 cases daily", Icon: RotateCcw },
  { value: "90+", label: "CSAT", Icon: Award },
  { value: "03", label: "Experience entries", Icon: BriefcaseBusiness },
];

const competencies = [
  "Customer Support",
  "L2 Escalation Handling",
  "Chat, Voice & Email Support",
  "Logistics Operations",
  "Order Management",
  "Returns & Refunds",
  "CSAT Management",
  "SLA/TAT",
  "CRM Tools",
  "MS Excel and MS Word",
  "Communication",
  "Team Collaboration",
];

export default function ExperiencePage() {
  return (
    <PageLayout className="space-y-10 sm:space-y-12">
      <PageHeader
        eyebrow="Professional background"
        title="Experience & education"
        description="Customer support professional with experience in customer service, L2 escalation handling, and logistics operations."
      />

      <section aria-labelledby="highlights-heading">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="highlights-heading"
            className="text-lg font-extrabold tracking-tight sm:text-xl"
          >
            Key highlights
          </h2>
          <p className="text-xs text-[#625D4C]">
            Resume-reported achievements
          </p>
        </div>
        <dl className="grid grid-cols-2 border-y border-[#E8DDBB] sm:grid-cols-4">
          {highlights.map(({ value, label, Icon }) => (
            <div
              key={label}
              className="flex min-w-0 items-start gap-3 border-b border-[#E8DDBB] px-3 py-4 sm:border-b-0 sm:border-r sm:px-4 sm:py-5 sm:last:border-r-0 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r"
            >
              <Icon
                aria-hidden="true"
                className="mt-1 shrink-0 text-[#947123]"
                size={17}
              />
              <div>
                <dt className="text-xs leading-5 text-[#625D4C]">{label}</dt>
                <dd className="mt-0.5 text-xl font-extrabold tracking-tight text-[#191919] sm:text-2xl">
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="experience-heading">
        <div className="mb-5 flex items-center gap-2.5">
          <BriefcaseBusiness
            aria-hidden="true"
            className="text-[#947123]"
            size={20}
          />
          <h2
            id="experience-heading"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            Professional experience
          </h2>
        </div>

        <ol className="m-0 list-none border-l border-[#DCC990] p-0">
          {experience.map((item, index) => (
            <li
              key={`${item.company}-${item.startDate}`}
              className="relative pl-5 sm:pl-7"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-2 size-[9px] rounded-full border-2 border-[#947123] bg-[#FFFAD8]"
              />
              <article
                className={`experience-entry -mt-1 border-b border-[#E8DDBB] transition-transform duration-200 hover:translate-x-0.5 ${
                  index === experience.length - 1
                    ? "border-b-0 pb-0"
                    : "mb-5 pb-5 sm:mb-7 sm:pb-6"
                }`}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                  <div>
                    <h3 className="text-base font-bold leading-snug sm:text-lg">
                      {item.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#625D4C]">
                      {item.company}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-semibold text-[#947123] sm:pt-1 sm:text-sm">
                    <time dateTime={item.startDate}>{item.startLabel}</time>
                    <span aria-hidden="true"> – </span>
                    <time dateTime={item.endDate}>{item.endLabel}</time>
                  </p>
                </div>
                <ul className="mt-3 space-y-1.5 pl-5 text-sm leading-6 text-[#39372F] marker:text-[#947123]">
                  {item.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="education-heading">
        <div className="mb-5 flex items-center gap-2.5">
          <GraduationCap
            aria-hidden="true"
            className="text-[#947123]"
            size={22}
          />
          <h2
            id="education-heading"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            Education
          </h2>
        </div>
        <div className="grid gap-x-8 gap-y-5 border-y border-[#E8DDBB] py-5 md:grid-cols-2">
          <article>
            <p className="text-xs font-semibold text-[#947123]">2021 – 2025</p>
            <h3 className="mt-1 font-bold">
              B.Tech – Computer Science Engineering
            </h3>
            <p className="mt-1 text-sm leading-6 text-[#625D4C]">
              Truba Institute of Engineering, Bhopal · RGPV
            </p>
            <p className="mt-1 text-sm font-semibold text-[#191919]">
              CGPA: 7.4
            </p>
          </article>
          <article className="border-t border-[#E8DDBB] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="text-xs font-semibold text-[#947123]">2007 – 2021</p>
            <h3 className="mt-1 font-bold">Secondary education</h3>
            <p className="mt-1 text-sm leading-6 text-[#625D4C]">
              B.N.P. Memorial Hr. Sec. School, Rewa
            </p>
            <p className="mt-1 text-sm text-[#191919]">
              Class 12 (PCM): 81.8% <span aria-hidden="true">·</span> Class 10:
              80.8%
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="competencies-heading">
        <div className="mb-4 flex items-center gap-2.5">
          <UsersRound
            aria-hidden="true"
            className="text-[#947123]"
            size={20}
          />
          <h2
            id="competencies-heading"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            Core competencies
          </h2>
        </div>
        <ul
          aria-label="Core competencies"
          className="m-0 flex list-none flex-wrap gap-2 p-0"
        >
          {competencies.map((competency) => (
            <li
              key={competency}
              className="rounded-full border border-[#DCC990] px-3 py-1.5 text-xs font-medium text-[#514323] sm:text-sm"
            >
              {competency}
            </li>
          ))}
        </ul>
      </section>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .experience-entry {
            transition: none;
          }

          .experience-entry:hover {
            transform: none;
          }
        }
      `}</style>
    </PageLayout>
  );
}

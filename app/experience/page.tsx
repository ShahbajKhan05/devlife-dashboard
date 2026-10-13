import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import { PageHeader, PageLayout } from "@/components/PageLayout";

const experience = [
  {
    role: "Logistics Support Executive",
    company: "AKSEDGE SOFTWARE PVT. LTD.",
    period: "May 2026 – June 2026",
    description: [
      "Handled shipment tracking, logistics and delivery-status queries.",
      "Supported customers through calls, emails and service channels.",
      "Coordinated with operations teams and maintained accurate records.",
    ],
  },
  {
    role: "Associate – Customer Support",
    company: "Tech Mahindra Limited · Flipkart",
    period: "August 2025 – October 2025",
    description: [
      "Managed high-volume customer chats for delivery operations.",
      "Assisted with delivery delays, order tracking and promise-date concerns.",
      "Coordinated with logistics teams to resolve customer issues.",
    ],
  },
  {
    role: "Customer Support L2 Supervisor",
    company: "Startek Inc. · Flipkart",
    period: "August 2024 – February 2025",
    description: [
      "Handled complex customer return and refund cases.",
      "Verified product eligibility and coordinated logistics pickups.",
      "Worked towards customer satisfaction and SLA/TAT targets.",
    ],
  },
];

export default function ExperiencePage() {
  return (
    <PageLayout className="space-y-7">
      <PageHeader
        eyebrow="My journey"
        title="Experience & education"
        description="My professional background in customer support and logistics operations, alongside my academic journey."
      />

      <section>
        <div className="mb-4 flex items-center gap-2">
          <BriefcaseBusiness
            aria-hidden="true"
            className="text-[#947123]"
            size={20}
          />
          <h2 className="text-xl font-extrabold sm:text-2xl">
            Professional experience
          </h2>
        </div>
        <div className="space-y-3">
          {experience.map((item) => (
            <article
              key={`${item.company}-${item.period}`}
              className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-bold">{item.role}</h3>
                <p className="text-sm font-semibold text-[#80631F]">
                  {item.period}
                </p>
              </div>
              <p className="mt-1 text-sm font-medium text-[#625D4C]">
                {item.company}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-5 text-[#625D4C]">
                {item.description.map((description) => (
                  <li key={description}>{description}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap
            aria-hidden="true"
            className="text-[#947123]"
            size={21}
          />
          <h2 className="text-xl font-extrabold sm:text-2xl">Education</h2>
        </div>
        <article className="rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 sm:p-5">
          <p className="text-sm font-semibold text-[#80631F]">2021 – 2025</p>
          <h3 className="mt-1 font-bold">
            B.Tech – Computer Science Engineering
          </h3>
          <p className="mt-1 text-sm text-[#625D4C]">
            Truba Institute of Engineering, Bhopal · RGPV
          </p>
          <p className="mt-2 text-sm font-semibold">CGPA: 7.4</p>
        </article>
      </section>
    </PageLayout>
  );
}

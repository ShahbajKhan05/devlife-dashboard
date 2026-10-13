"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Briefcase,
  Code2,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PageHeader, PageLayout } from "@/components/PageLayout";

const highlights = [
  {
    title: "Web development",
    description: "Building responsive interfaces using React and Next.js.",
    Icon: Code2,
  },
  {
    title: "Problem-solving",
    description:
      "Applying issue resolution and analytical thinking to practical challenges.",
    Icon: Lightbulb,
  },
  {
    title: "Continuous learning",
    description: "Improving technical skills through hands-on projects.",
    Icon: BookOpenCheck,
  },
];

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion();
  const revealInitial =
    prefersReducedMotion === true ? false : { opacity: 0, y: 14 };

  return (
    <PageLayout className="space-y-7 sm:space-y-8">
      <PageHeader
        eyebrow="About me"
        title="Hi, I'm Shahbaj Khan."
        description="My path from Computer Science Engineering to customer operations and hands-on web development."
      />

      <motion.section
        aria-labelledby="about-introduction-heading"
        initial={revealInitial}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-[#E8DDBB] bg-[#FFFDF0] p-5 shadow-[0_12px_34px_rgba(58,46,14,0.06)] sm:p-7 lg:p-8"
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 bg-[#B08D35]"
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(240px,0.75fr)] lg:items-center lg:gap-8">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#80631F]">
              Introduction
            </p>
            <h2
              id="about-introduction-heading"
              className="mt-2 text-xl font-extrabold tracking-tight text-[#191919] sm:text-2xl"
            >
              A background in technology and operations
            </h2>
            <div className="mt-4 max-w-2xl space-y-3 text-[15px] leading-7 text-[#625D4C]">
              <p>
                I&apos;m a Computer Science Engineering graduate interested in
                web development and user-friendly digital experiences. I&apos;ve
                built responsive interfaces using React and Next.js.
              </p>
              <p>
                I&apos;ve also worked in customer support and logistics
                operations. Through that experience, I&apos;ve developed
                communication, problem-solving, issue-resolution, and
                coordination skills.
              </p>
            </div>
            <Link
              href="/projects"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#191919] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#423A28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D35] sm:px-5"
            >
              View my projects
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <aside
            aria-label="Education and work background"
            className="rounded-xl border border-[#E8DDBB] bg-[#FBF6E3] p-4 sm:p-5"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#80631F]">
              At a glance
            </p>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#E5D8AD] bg-[#FFFDF0] text-[#947123]">
                  <GraduationCap aria-hidden="true" size={19} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-xs font-semibold text-[#706951]">
                    Education
                  </p>
                  <p className="mt-1 text-sm font-bold leading-5 text-[#191919]">
                    Computer Science Engineering graduate
                  </p>
                </div>
              </div>
              <div className="h-px bg-[#E8DDBB]" />
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#E5D8AD] bg-[#FFFDF0] text-[#947123]">
                  <Briefcase aria-hidden="true" size={19} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-xs font-semibold text-[#706951]">
                    Professional experience
                  </p>
                  <p className="mt-1 text-sm font-bold leading-5 text-[#191919]">
                    Customer support and logistics operations
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.section>

      <section aria-labelledby="about-highlights-heading">
        <motion.div
          initial={revealInitial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="mb-4"
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#80631F]">
            Highlights
          </p>
          <h2
            id="about-highlights-heading"
            className="mt-1 text-xl font-extrabold text-[#191919] sm:text-2xl"
          >
            What shapes my work
          </h2>
        </motion.div>

        <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map(({ title, description, Icon }, index) => (
            <motion.article
              key={title}
              initial={revealInitial}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.38,
                delay: prefersReducedMotion ? 0 : 0.12 + index * 0.08,
                ease: "easeOut",
              }}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -3,
                      transition: {
                        type: "spring",
                        stiffness: 340,
                        damping: 26,
                      },
                    }
              }
              className="group h-full min-h-[178px] rounded-xl border border-[#E8DDBB] bg-[#FFFDF0] p-4 transition-[border-color,box-shadow] duration-200 hover:border-[#D6C28A] hover:shadow-[0_12px_28px_rgba(58,46,14,0.08)] sm:p-5"
            >
              <span className="grid size-11 place-items-center rounded-xl border border-[#E5D8AD] bg-[#FBF6E3] text-[#947123] transition-colors duration-200 group-hover:bg-[#F7EDC9]">
                <Icon aria-hidden="true" size={21} />
              </span>
              <h3 className="mt-4 font-bold text-[#191919]">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[#625D4C]">
                {description}
              </p>
            </motion.article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

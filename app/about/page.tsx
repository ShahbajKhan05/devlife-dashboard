"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const aboutParagraphs = [
  "I'm a Computer Science Engineering graduate interested in building thoughtful, user-friendly digital experiences. I enjoy working with React and Next.js to create responsive interfaces that combine functionality with clean design.",
  "My experience in customer support and logistics operations has strengthened my communication, problem-solving, and coordination skills. I bring that practical experience into my technical learning, building projects and continuously improving my development skills.",
];

const paragraphClassName =
  "text-[clamp(1.2rem,2.1vw,1.8rem)] font-semibold leading-[1.45] tracking-[-0.035em]";

export default function AboutPage() {
  const textRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 85%", "end 25%"],
  });
  const revealClip = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
  );

  return (
    <section className="min-h-[100svh] w-full bg-[#FFFAD8] text-[#191919]">
      <div className="mx-auto grid min-h-[100svh] max-w-[1600px] grid-cols-1 gap-10 px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-[minmax(0,1.75fr)_minmax(180px,0.75fr)] md:items-center md:gap-12 md:px-14 md:py-14 xl:gap-16 xl:px-24">
        <div className="flex flex-col justify-between gap-12 md:self-stretch md:py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#77745F] sm:text-sm">
              Computer Science Graduate
            </p>
            <h1 className="mt-3 text-[clamp(2.5rem,5.5vw,5rem)] font-bold leading-[1.05] tracking-[-0.06em]">
              About Me
            </h1>

            <div
              ref={textRef}
              className="relative mt-8 max-w-4xl space-y-7 sm:mt-10 sm:space-y-8"
            >
              <div className="space-y-7 sm:space-y-8">
                {aboutParagraphs.map((paragraph) => (
                  <p key={paragraph} className={paragraphClassName}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {prefersReducedMotion !== true && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 space-y-7 bg-[linear-gradient(100deg,#16834a_0%,#25a766_48%,#6bc58f_100%)] bg-clip-text text-transparent sm:space-y-8"
                  style={{ clipPath: revealClip }}
                >
                  {aboutParagraphs.map((paragraph) => (
                    <p key={paragraph} className={paragraphClassName}>
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#77745F]">
              About me
            </p>
            <p className="mt-2 font-serif text-3xl italic tracking-[-0.035em] sm:text-4xl">
              Shahbaj Khan
            </p>
          </div>
        </div>

        <div
          role="img"
          aria-label="Portrait placeholder; replace with a personal portrait"
          className="mx-auto flex aspect-[4/5] w-full max-w-[440px] items-center justify-center border border-[#E5DFAF] bg-[#F3EFCF] px-6 text-center md:mx-0 md:max-w-none"
        >
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#77745F]">
            <img
              src="/logo.jpg"
              alt="Shahbaj Khan in a professional portrait, facing forward with a calm and confident expression, wearing a dark shirt, set in a simple studio style environment."
            />

          </span>
        </div>
      </div>
    </section>
  );
}

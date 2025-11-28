"use client";

import dynamic from "next/dynamic";

const GitHubContributions = dynamic(() => import("@/components/github-contributions").then(mod => mod.GitHubContributions), { ssr: false });

const TechStack = dynamic(() => import("@/components/tech-stack").then(mod => mod.TechStack), { ssr: false });

const TimelineItem = dynamic(() => import("@/components/resume-card").then(mod => mod.TimelineItem), { ssr: false });
const ContactOrbiting = dynamic(() => import("@/components/contact-orbiting").then(mod => mod.ContactOrbiting), { ssr: false });

const WorldMap = dynamic(() => import("@/components/world-map").then(mod => mod.WorldMap), { ssr: false });
const BlurFade = dynamic(() => import("@/components/magicui/blur-fade").then(mod => mod.default), { ssr: false });
const BlurFadeText = dynamic(() => import("@/components/magicui/blur-fade-text").then(mod => mod.default), { ssr: false });
const TableOfContents = dynamic(() => import("@/components/table-of-contents").then(mod => mod.TableOfContents), { ssr: false });

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] py-section-md">
      <TableOfContents />

      <section id="hero" className="flex flex-col justify-center mb-section-lg mt-16 md:mt-32">
        <div className="w-full space-y-content-lg">
          <div className="gap-2 flex justify-between items-center">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}.`}
              />
              <BlurFadeText
                className="max-w-[600px] text-muted-foreground md:text-xl"
                delay={BLUR_FADE_DELAY * 1}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY * 1}>
              <Avatar className="w-48 h-auto rounded-none border-none">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} className="object-contain" />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="about" className="mb-section-lg">
        <div className="space-y-content-md">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">About</h2>
        </BlurFade>
          <div className="space-y-content-sm">
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert space-y-4">
            <p>
              Welcome 👋! I am Glenn Fung. I am an Empirical Research Fellow in Quantative Marketing at Northwestern University Kellogg School of Management. I am fortunate to work with Professor Artem Timoshenko.
            </p>
            <p>
              I hold an M.A. in Economics from The University of Chicago, a B.S. in Applied Mathematics from the University of Birmingham, and a B.Econ. from Jinan University, and I’ve since contributed to projects at NUS, Chicago Booth, and Northwestern Kellogg that span large-language and vision models, causal-inference frameworks, and optimization algorithms.
            </p>
            <p>
              My research blends methodological innovation—benchmarking and calibrating foundation models, designing deep structural causal networks for multi-modal experiments, and developing game-theoretic and RL approaches—with practical applications in marketing mix allocation and operational planning. I’ve worked on projects involving facial emotion analysis, person re-identification, survey-based Bayesian computations, financial econometrics, and survey statistical modeling. Building on this foundation, I plan to pursue a Ph.D. in marketing or operations where I can further advance AI-driven decision science and bridge cutting-edge machine-learning models with real-world strategy.
            </p>
            <p>
              <a href="/assets/pdf/CV.pdf" className="text-blue-600 hover:underline">My Curriculum Vitae.</a>
            </p>
            <p>
              Emails are the best way to reach me. I am also available for a chat via Zoom or in person if you are in the Greater Chicago area, <a href="https://cal.com/glenn-fung-mqul3k/default" className="text-blue-600 hover:underline">you can pick a timeslot here to chat</a>. You can find my contact information below or at the bottom of every page. Please feel free to reach out!
            </p>
            <div className="font-mono text-xs md:text-sm">
              <div>glenntfung[at]gmail[dot]com</div>
              <div>zirui.feng[at]kellogg[dot]northwestern[dot]edu</div>
            </div>
          </div>
        </BlurFade>
          </div>
        </div>
      </section>

      <section id="work" className="mb-section-lg">
        <div className="space-y-12">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Academic Experience</h2>
          </BlurFade>
          <div className="space-y-0">
          {DATA.technicalExperience.map((work, id) => (
              <BlurFade key={work.company} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
                <TimelineItem
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                badges={work.badges}
                period={work.start === (work.end ?? "Present") ? work.start : `${work.start} - ${work.end ?? "Present"}`}
                bullets={work.bullets}
                  isLast={id === DATA.technicalExperience.length - 1}
              />
            </BlurFade>
          ))}
          </div>
        </div>
      </section>

      <section id="education" className="mb-section-lg">
        <div className="space-y-12">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">Education</h2>
          </BlurFade>
          <div className="space-y-0">
          {DATA.education.map((education, id) => (
              <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 8 + id * 0.05}>
                <TimelineItem
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                subtitle={education.degree}
                href={education.href}
                period={education.start === education.end ? education.start : `${education.start} - ${education.end}`}
                  isLast={id === DATA.education.length - 1}
              />
            </BlurFade>
          ))}
        </div>
        </div>
      </section>



      <section id="tech-stack" className="mb-section-lg">
        <TechStack delay={BLUR_FADE_DELAY * 9} />
      </section>

      <section id="github" className="mb-section-lg">
        <GitHubContributions username="glenntfung" delay={BLUR_FADE_DELAY * 10} />
      </section>

      <section id="world" className="mb-section-lg">
        <div className="space-y-content-lg">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                World Map.
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Countries I&apos;ve visited.
              </p>
            </div>
          </div>
        </BlurFade>
          <WorldMap delay={BLUR_FADE_DELAY * 12} />
        </div>
      </section>

      <ContactOrbiting delay={BLUR_FADE_DELAY * 13} />
    </main>
  );
}
import Link from "next/link";
import Image from "next/image";
import { DemoGenerator } from "./components/DemoGenerator";
import PricingSection from "./components/PricingSection";
import HeroBadge from "./components/HeroBadge";
import MascotLogo from "./components/MascotLogo";

const features = [
  {
    title: "Hook Vault",
    detail: "Turn any idea into 12 scroll-stopping hooks tuned to your niche.",
  },
  {
    title: "Weekly Map",
    detail: "Auto-assembled 5-post calendar with angles and CTA-ready copy.",
  },
  {
    title: "Thread Blueprint",
    detail: "Outline a high-signal thread in 90 seconds, no blank page.",
  },
  {
    title: "Bio & CTA",
    detail: "Rewrite your bio into a conversion-focused profile and CTA.",
  },
];

const steps = [
  "Describe your niche + audience",
  "Pick a goal and tone",
  "Get hooks, threads, and a weekly calendar",
];

export default function Home() {
  return (
    <div className="bg-grid min-h-screen">
      <div className="hero-glow">
        <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div className="hidden items-center gap-3 md:flex">
            <MascotLogo size={36} />
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Creator Ops Suite
            </span>
          </div>
          <div className="flex w-full flex-col gap-4 md:hidden">
            <div className="flex w-full items-center justify-between">
              <MascotLogo size={36} />
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] pl-3 text-right">
                Creator Ops Suite
              </span>
            </div>
            <div className="flex w-full items-center justify-between">
              <Link
                href="/app"
                className="rounded-full border border-[var(--border)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:border-[var(--accent)]"
                style={{ width: "calc((100% - 12px) / 2)", textAlign: "center" }}
              >
                Open App
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-[var(--border)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white"
                style={{ width: "calc((100% - 12px) / 2)", textAlign: "center" }}
              >
                Log in
              </Link>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <Link href="/login" className="hover:text-white">
              Log in
            </Link>
            <Link
              href="/app"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:border-[var(--accent)]"
            >
              Open App
            </Link>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10">
          <section className="grid gap-12 md:grid-cols-[1.15fr_0.85fr]">
            <div className="fade-up">
              <HeroBadge />
              <h1 className="text-display mt-4 text-4xl leading-tight md:text-6xl">
                Ship scroll-stopping creator content every week, without the
                brainstorm spiral.
              </h1>
              <p className="mt-6 text-lg text-[var(--muted)]">
                HookForge is a micro-SaaS for influencers, operators, and
                creators who need high-signal hooks, thread outlines, and
                calendar-ready content in minutes.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/app"
                  className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:translate-y-[-1px] sm:w-auto"
                >
                  Generate Content
                </Link>
                <a
                  href="#pricing"
                  className="w-full rounded-full border border-[var(--border)] px-12 py-3 text-center text-sm uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white sm:flex-1"
                >
                  See Pricing
                </a>
              </div>
              <div className="relative mt-10">
                <div className="grid gap-4 text-sm text-[var(--muted)] md:grid-cols-3">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-2)] p-4">
                    {steps[0]}
                  </div>
                  {steps.slice(1).map((step) => (
                    <div
                      key={step}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--card-2)] p-4"
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <div className="mt-6 hidden justify-center md:mt-0 md:block">
                  <Image
                    src="/mascot-alt.png"
                    alt="HookForge mascot"
                    width={520}
                    height={520}
                    className="pointer-events-none w-[240px] opacity-95 md:absolute md:left-1/2 md:top-[calc(100%+6px)] md:w-[380px] md:-translate-x-1/2"
                  />
                </div>
              </div>
            </div>
            <div className="fade-in space-y-6">
              <div className="mascot-hero-frame">
                <Image
                  src="/mascot.png"
                  alt="HookForge mascot"
                  width={520}
                  height={520}
                  className="mascot-hero"
                  priority
                />
              </div>
              <div className="glass rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  Real Output
                </p>
                <div className="mt-4 space-y-4 text-sm text-white/90">
                  <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                    “I spent 6 weeks posting every day without growth. Here’s
                    the 3-signal change that flipped it.”
                  </p>
                  <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                    “Most creators write for everyone. This 1-page persona gave
                    me 28 inbound leads.”
                  </p>
                  <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                    “Stop shipping threads. Start shipping sequences: the 5-post
                    weekly map I use.”
                  </p>
                </div>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-2)] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  Built For
                </p>
                <div className="mt-4 grid gap-3 text-sm">
                  {[
                    "Influencers & personal brands",
                    "Indie hackers shipping in public",
                    "Creator-led SaaS founders",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-transparent bg-black/30 px-4 py-3"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center md:hidden">
                <Image
                  src="/mascot-alt.png"
                  alt="HookForge mascot"
                  width={320}
                  height={320}
                  className="pointer-events-none w-[240px] opacity-95"
                />
              </div>
            </div>
          </section>

          <section id="features" className="mt-20">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-display text-3xl md:text-4xl">
                Your content pipeline in one tab.
              </h2>
              <p className="max-w-md text-sm text-[var(--muted)]">
                Turn prompts into a repeatable creator system: hooks, angles,
                calendars, CTAs, and bio rewrites.
              </p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6"
                >
                  <h3 className="text-display text-2xl">{feature.title}</h3>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {feature.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <DemoGenerator />
          </section>

          <section id="pricing" className="mt-20">
            <PricingSection />
          </section>

          <section className="mt-20">
            <div className="glass flex flex-col items-center gap-6 rounded-3xl p-10 text-center">
              <h2 className="text-display text-3xl md:text-4xl">
                Ready to build an audience that converts?
              </h2>
              <p className="max-w-xl text-sm text-[var(--muted)]">
                HookForge gives you the leverage of a content strategist + copy
                lead. Start in demo mode, then upgrade in-app.
              </p>
              <Link
                href="/app"
                className="rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black"
              >
                Open HookForge
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-[var(--border)] px-8 py-3 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white"
              >
                Log in
              </Link>
            </div>
          </section>
        </main>

        <footer className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12 text-xs text-[var(--muted)]">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
            <p>© 2026 HookForge. By ISSALABS. Built for creator-led businesses.</p>
            <div className="flex items-center gap-6">
              <a href="mailto:hello@shangobashi.com" className="hover:text-white">
                Contact
              </a>
              <a href="/login" className="hover:text-white">
                Log in
              </a>
              <a href="/app" className="hover:text-white">
                App
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

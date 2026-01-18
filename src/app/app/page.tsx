import Link from "next/link";
import MascotLogo from "../components/MascotLogo";
import ContentGenerator from "./ContentGenerator";
import SignOutButton from "./SignOutButton";

export default function AppPage() {
  return (
    <div className="bg-grid min-h-screen">
      <div className="hero-glow min-h-screen">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <MascotLogo size={40} />
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Creator Workspace
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            <span>Authenticated</span>
            <a
              href="mailto:hello@shangobashi.com"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-white/80 transition hover:border-white hover:text-white"
            >
              Upgrade
            </a>
            <SignOutButton />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-6 pb-16">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Content Engine
            </p>
            <h1 className="text-display mt-3 text-4xl">
              Turn a brief into a week of creator content.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Use this dashboard to generate hooks, thread outlines, weekly
              calendars, and CTA-ready content for your brand.
            </p>
          </div>
          <ContentGenerator />
        </main>
      </div>
    </div>
  );
}

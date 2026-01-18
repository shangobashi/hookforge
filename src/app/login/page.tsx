import Link from "next/link";
import { Suspense } from "react";
import MascotLogo from "../components/MascotLogo";
import LoginForm from "./ui/LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-grid min-h-screen">
      <div className="hero-glow min-h-screen">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <MascotLogo size={40} />
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Secure Access
          </span>
        </header>
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-12">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Sign In or Create Account
            </p>
            <h1 className="text-display mt-3 text-3xl">
              Access your creator workspace.
            </h1>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Log in with email + password, or use a magic link if you prefer.
            </p>
            <div className="mt-6">
              <Suspense fallback={<div className="text-sm text-[var(--muted)]">Loading...</div>}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
          <div className="mascot-hero-frame">
            <img
              src="/mascot.png"
              alt="HookForge mascot"
              className="mascot-hero"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

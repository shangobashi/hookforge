"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MascotLogo from "../../components/MascotLogo";
import { supabaseBrowser } from "@/lib/supabase-browser";

type VerifyState = "idle" | "verifying" | "success" | "error";

export default function AuthConfirmPage() {
  const [state, setState] = useState<VerifyState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const params = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search);
  }, []);

  const tokenHash = params?.get("token_hash");
  const type = params?.get("type") ?? "magiclink";
  const redirect = params?.get("redirect") || "/app";
  const authCode = params?.get("code");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.includes("error=")) {
      const hashParams = new URLSearchParams(hash.slice(1));
      const description = hashParams.get("error_description");
      setState("error");
      setMessage(description || "This link is invalid or expired.");
    }
  }, []);

  const verify = async () => {
    if (!tokenHash) {
      setState("verifying");
      setMessage(null);
      try {
        const supabase = supabaseBrowser();
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
          window.location.href = redirect;
          return;
        }
        if (authCode) {
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(
            authCode,
          );
          if (codeError) throw codeError;
          window.location.href = redirect;
          return;
        }
        throw new Error("Missing token. Request a new link.");
      } catch (err) {
        setState("error");
        setMessage(err instanceof Error ? err.message : "Verification failed.");
        return;
      }
    }
    setState("verifying");
    setMessage(null);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as "magiclink" | "recovery" | "invite" | "email",
      });
      if (error) throw error;
      setState("success");
      window.location.href = redirect;
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Verification failed.");
    }
  };

  return (
    <div className="bg-grid min-h-screen">
      <div className="hero-glow min-h-screen">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <MascotLogo size={40} />
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Auth Confirmation
          </span>
        </header>
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-12">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Final Step
            </p>
            <h1 className="text-display mt-3 text-3xl">
              Confirm your login.
            </h1>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Click the button below to complete sign-in and enter the app.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={verify}
                disabled={state === "verifying"}
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state === "verifying" ? "Verifying..." : "Confirm & Continue"}
              </button>
              <Link
                href="/login"
                className="rounded-full border border-[var(--border)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white"
              >
                Request New Link
              </Link>
            </div>
            {state === "error" && message ? (
              <p className="mt-4 text-sm text-red-300">{message}</p>
            ) : null}
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

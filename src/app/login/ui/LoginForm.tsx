"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "sent" | "error" | "success"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  const resetStatus = () => {
    setStatus("idle");
    setMessage(null);
  };

  const signIn = async () => {
    setStatus("loading");
    setMessage(null);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setStatus("success");
      window.location.href = redirect;
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to sign in.");
    }
  };

  const signUp = async () => {
    setStatus("loading");
    setMessage(null);
    try {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?redirect=${encodeURIComponent(
            redirect,
          )}`,
        },
      });
      if (error) throw error;
      if (data.session) {
        window.location.href = redirect;
        return;
      }
      setStatus("sent");
      setMessage("Check your email to confirm your account.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to sign up.");
    }
  };

  const sendMagicLink = async () => {
    setStatus("loading");
    setMessage(null);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?redirect=${encodeURIComponent(
            redirect,
          )}`,
        },
      });
      if (error) throw error;
      setStatus("sent");
      setMessage("Check your email for the login link.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to send link.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm text-[var(--muted)]">
        Email address
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            resetStatus();
          }}
          placeholder="you@domain.com"
          className="mt-2 w-full rounded-2xl border border-transparent bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]"
        />
      </label>
      <label className="text-sm text-[var(--muted)]">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            resetStatus();
          }}
          placeholder="••••••••"
          className="mt-2 w-full rounded-2xl border border-transparent bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={signIn}
          disabled={!email || !password || status === "loading"}
          className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Working..." : "Log in"}
        </button>
        <button
          onClick={signUp}
          disabled={!email || !password || status === "loading"}
          className="rounded-full border border-[var(--border)] px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white disabled:opacity-60"
        >
          Create account
        </button>
      </div>
      <button
        onClick={sendMagicLink}
        disabled={!email || status === "loading"}
        className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] transition hover:text-white"
      >
        Send magic link instead
      </button>
      {status === "sent" || status === "success" ? (
        <p className="text-sm text-emerald-300">{message}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-300">{message}</p>
      ) : null}
    </div>
  );
}

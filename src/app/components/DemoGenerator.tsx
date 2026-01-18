"use client";

import { useState } from "react";
import type { GenerationResult } from "@/lib/types";

const defaultForm = {
  niche: "Personal brand for AI builders",
  audience: "Founders and indie hackers",
  goal: "Drive waitlist signups",
  tone: "Punchy, confident, high-signal",
  platform: "X (Twitter)",
  pillars: "Build in public, launch strategy, AI workflows",
};

export function DemoGenerator() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof typeof defaultForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const runDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          isDemo: true,
        }),
      });
      if (!res.ok) {
        throw new Error("Generation failed. Check API keys.");
      }
      const data = (await res.json()) as GenerationResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass w-full rounded-3xl p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
            Live Demo
          </p>
          <h3 className="text-display mt-2 text-2xl md:text-3xl">
            Generate a week of creator content in 20 seconds.
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              ["Niche", "niche"],
              ["Audience", "audience"],
              ["Goal", "goal"],
              ["Tone", "tone"],
              ["Platform", "platform"],
              ["Content pillars", "pillars"],
            ] as const
          ).map(([label, key]) => (
            <label key={key} className="text-sm text-[var(--muted)]">
              {label}
              <input
                value={form[key]}
                onChange={(event) => updateField(key, event.target.value)}
                className="mt-2 w-full rounded-2xl border border-transparent bg-white/5 px-4 py-3 text-sm text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]"
              />
            </label>
          ))}
        </div>
        <button
          onClick={runDemo}
          disabled={loading}
          className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:translate-y-[-1px] disabled:opacity-60"
        >
          {loading ? "Forging..." : "Forge Content"}
        </button>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {result ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-2)] p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Hooks
              </h4>
              <ul className="mt-3 space-y-3 text-sm text-slate-100">
                {result.hooks.slice(0, 4).map((hook) => (
                  <li key={hook} className="border-b border-white/10 pb-3 last:border-none">
                    {hook}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-2)] p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Weekly Map
              </h4>
              <ul className="mt-3 space-y-3 text-sm text-slate-100">
                {result.weeklyCalendar.slice(0, 4).map((item) => (
                  <li key={item.day} className="border-b border-white/10 pb-3 last:border-none">
                    <span className="text-[var(--accent-2)]">{item.day}:</span>{" "}
                    {item.post}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

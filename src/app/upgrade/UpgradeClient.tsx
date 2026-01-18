"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MascotLogo from "../components/MascotLogo";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

const planCopy = {
  creator: {
    name: "Creator",
    monthlyPrice: "$24.99",
    yearlyPrice: "$199",
    yearlyTag: "Early Creators",
    detail: "Solo creators shipping daily",
    perks: ["50 generations / month", "Hook vault + weekly map", "Export to CSV"],
  },
  studio: {
    name: "Studio",
    monthlyPrice: "$49",
    yearlyPrice: "$499",
    yearlyTag: "Early Studio",
    detail: "For agencies + creator teams",
    perks: ["200 generations / month", "Team workspace", "Priority queueing"],
  },
};

type Plan = "creator" | "studio";

type BillingCycle = "monthly" | "yearly";

type Tier = "free" | "creator" | "studio";

export default function UpgradeClient() {
  const router = useRouter();
  const params = useSearchParams();
  const selectedPlan = (params.get("plan") as Plan) || "creator";
  const initialInterval = (params.get("interval") as BillingCycle) || "monthly";
  const [billing, setBilling] = useState<BillingCycle>(initialInterval);
  const [tier, setTier] = useState<Tier>("free");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const plan = planCopy[selectedPlan] ?? planCopy.creator;

  useEffect(() => {
    let isActive = true;
    const loadTier = async () => {
      try {
        const supabase = supabaseBrowser();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          if (isActive) setAuthed(false);
          if (isActive) setTier("free");
          return;
        }
        if (isActive) setAuthed(true);
        const { data: profile, error } = (await supabase
          .from("profiles")
          .select("is_pro, tier")
          .eq("email", userData.user.email ?? "")
          .maybeSingle()) as {
          data: { is_pro?: boolean | null; tier?: string | null } | null;
          error: unknown;
        };
        if (!isActive) return;
        if (error) {
          setTier(profile?.is_pro ? "studio" : "free");
          return;
        }
        if (profile?.is_pro || profile?.tier === "studio") {
          setTier("studio");
        } else if (profile?.tier === "creator") {
          setTier("creator");
        } else if (profile) {
          setTier("creator");
        } else {
          setTier("free");
        }
      } catch {
        if (isActive) setAuthed(false);
        if (isActive) setTier("free");
      } finally {
        if (isActive) setLoading(false);
      }
    };
    loadTier();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (selectedPlan === "creator" && (tier === "creator" || tier === "studio")) {
      router.replace("/app");
    }
    if (selectedPlan === "studio" && tier === "studio") {
      router.replace("/app");
    }
  }, [loading, selectedPlan, tier, router]);

  const billingLabel = useMemo(() => (billing === "monthly" ? "/mo" : "/yr"), [billing]);

  const goCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, interval: billing }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || "Checkout failed");
      }
      window.location.href = payload.url;
    } catch (err) {
      setCheckingOut(false);
      alert(err instanceof Error ? err.message : "Checkout failed");
    }
  };

  const redirect = `/upgrade?plan=${selectedPlan}&interval=${billing}`;

  return (
    <div className="bg-grid min-h-screen">
      <div className="hero-glow min-h-screen">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <MascotLogo size={40} />
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Upgrade
          </span>
        </header>
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-16 pt-8">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  {plan.name} Plan
                </p>
                <h1 className="text-display mt-3 text-3xl">
                  Unlock full access to HookForge.
                </h1>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Choose monthly or yearly, then complete checkout to unlock the
                  full workspace.
                </p>
              </div>
              <div className="rounded-full border border-[var(--border)] bg-black/30 p-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBilling("monthly")}
                    className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                      billing === "monthly"
                        ? "bg-white text-black"
                        : "text-[var(--muted)] hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBilling("yearly")}
                    className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                      billing === "yearly"
                        ? "bg-white text-black"
                        : "text-[var(--muted)] hover:text-white"
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-2)] p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  {plan.name}
                </p>
                <h2 className="text-display mt-3 text-3xl">
                  {billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  <span className="text-base text-[var(--muted)]">
                    {billingLabel}
                  </span>
                </h2>
                {billing === "yearly" ? (
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
                    {plan.yearlyTag}
                  </p>
                ) : null}
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {plan.detail}
                </p>
                <ul className="mt-6 space-y-3 text-sm text-white/80">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    Checkout
                  </p>
                  <h3 className="text-display mt-3 text-2xl">
                    Start {plan.name} today.
                  </h3>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    Secure checkout via Stripe. Cancel anytime.
                  </p>
                </div>
                {loading ? (
                  <p className="mt-6 text-sm text-[var(--muted)]">Checking account...</p>
                ) : !authed ? (
                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href={`/login?redirect=${encodeURIComponent(redirect)}`}
                      className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:translate-y-[-1px]"
                    >
                      Log in to continue
                    </Link>
                    <p className="text-xs text-[var(--muted)]">
                      You need to be logged in to activate your subscription.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={goCheckout}
                    disabled={checkingOut}
                    className="mt-6 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:translate-y-[-1px] disabled:opacity-60"
                  >
                    {checkingOut ? "Redirecting..." : "Continue to checkout"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

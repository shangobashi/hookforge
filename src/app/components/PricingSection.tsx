"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

const plans = [
  {
    id: "creator",
    name: "Creator",
    monthlyPrice: "$24.99",
    yearlyPrice: "$199",
    yearlyTag: "Early Creators",
    detail: "Solo creators shipping daily",
    perks: ["50 generations / month", "Hook vault + weekly map", "Export to CSV"],
  },
  {
    id: "studio",
    name: "Studio",
    monthlyPrice: "$49",
    yearlyPrice: "$499",
    yearlyTag: "Early Studio",
    detail: "For agencies + creator teams",
    perks: ["200 generations / month", "Team workspace", "Priority queueing"],
  },
];

type Tier = "free" | "creator" | "studio";

type BillingCycle = "monthly" | "yearly";

export default function PricingSection() {
  const router = useRouter();
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [tier, setTier] = useState<Tier>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const loadTier = async () => {
      try {
        const supabase = supabaseBrowser();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          if (isActive) setTier("free");
          return;
        }
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

  const billingLabel = useMemo(() => (billing === "monthly" ? "/mo" : "/yr"), [billing]);

  const handleStart = (planId: "creator" | "studio") => {
    if (loading) return;
    if (planId === "creator" && (tier === "creator" || tier === "studio")) {
      router.push("/app");
      return;
    }
    if (planId === "studio" && tier === "studio") {
      router.push("/app");
      return;
    }
    router.push(`/upgrade?plan=${planId}&interval=${billing}`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-display text-3xl md:text-4xl">
            Pricing that scales with your output.
          </h2>
          <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
            Start free in demo mode. Upgrade when you want a full content engine
            and exports.
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  {plan.name}
                </p>
                <h3 className="text-display mt-2 text-3xl">
                  {billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  <span className="text-base text-[var(--muted)]">
                    {billingLabel}
                  </span>
                </h3>
                {billing === "yearly" ? (
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
                    {plan.yearlyTag}
                  </p>
                ) : null}
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {plan.detail}
                </p>
              </div>
              <div className="flex w-full items-center gap-3">
                <div className="flex flex-1 items-center rounded-full border border-[var(--border)] bg-black/30 p-1">
                  <button
                    onClick={() => setBilling("monthly")}
                    className={`flex-1 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.3em] transition ${
                      billing === "monthly"
                        ? "bg-white text-black"
                        : "text-[var(--muted)] hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBilling("yearly")}
                    className={`flex-1 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.3em] transition ${
                      billing === "yearly"
                        ? "bg-white text-black"
                        : "text-[var(--muted)] hover:text-white"
                    }`}
                  >
                    Yearly
                  </button>
                </div>
                <button
                  onClick={() => handleStart(plan.id as "creator" | "studio")}
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:translate-y-[-1px]"
                >
                  Start
                </button>
              </div>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

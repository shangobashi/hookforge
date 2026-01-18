"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage, GenerationResult } from "@/lib/types";
import { gsap } from "gsap";
import { supabaseBrowser } from "@/lib/supabase-browser";

const initial = {
  niche: "",
  audience: "",
  goal: "",
  tone: "Confident, concise, data-backed",
  platform: "X (Twitter)",
  pillars: "",
};

const limitList = [
  "New creator",
  "Rising to 1k followers",
  "Monetizing a newsletter",
  "Launching a SaaS",
];

export default function ContentGenerator() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [accountTier, setAccountTier] = useState<"PRO" | "BASIC" | "FREE">("FREE");
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const liveChatRef = useRef<HTMLDivElement | null>(null);
  const liveChatRimRef = useRef<HTMLSpanElement | null>(null);
  const liveRodsRef = useRef<HTMLSpanElement | null>(null);
  const rightColumnRef = useRef<HTMLDivElement | null>(null);
  const weeklyCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hookCardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const threadCardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const rimTween = useRef<gsap.core.Tween | null>(null);
  const prismTween = useRef<gsap.core.Animation | null>(null);
  const liveChatRimTween = useRef<gsap.core.Tween | null>(null);
  const weeklyRimTweens = useRef<gsap.core.Tween[]>([]);
  const hookRimTweens = useRef<gsap.core.Tween[]>([]);
  const threadRimTweens = useRef<gsap.core.Tween[]>([]);
  const [rightHeight, setRightHeight] = useState<number | null>(null);

  const formatAssistant = (content: string) => {
    const escaped = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const withEmphasis = escaped
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<u>$1</u>");
    return withEmphasis
      .replace(/\n\n+/g, "</p><p>")
      .replace(/\n/g, "<br />");
  };

  const canGenerate = useMemo(() => {
    return form.niche.trim() && form.audience.trim() && form.goal.trim();
  }, [form]);

  useEffect(() => {
    if (!buttonRef.current) return;

    if (loading) {
      buttonRef.current.classList.add("is-animating");
      rimTween.current = gsap.to(buttonRef.current, {
        duration: 1.4,
        repeat: -1,
        ease: "linear",
        css: {
          "--rim-angle": "360deg",
        },
      });
    } else {
      buttonRef.current.classList.remove("is-animating");
      rimTween.current?.kill();
      rimTween.current = null;
      gsap.set(buttonRef.current, { "--rim-angle": "0deg" });
    }
  }, [loading]);

  useEffect(() => {
    if (!liveChatRef.current) return;
    prismTween.current = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } })
      .to(liveChatRef.current, {
        duration: 3.4,
        css: { "--storm-rotate": "360deg", "--storm-shift": "7%" },
      })
      .to(
        liveChatRef.current,
        {
          duration: 2.8,
          css: { "--storm-rotate": "720deg", "--storm-shift": "-7%" },
        },
        0,
      )
      .to(
        liveChatRef.current,
        {
          duration: 1.4,
          css: { "--storm-glow": 0.98 },
          yoyo: true,
          repeat: 1,
        },
        0.2,
      )
      .to(
        liveChatRef.current,
        {
          duration: 0.5,
          css: { "--storm-flash": 1 },
          ease: "power2.inOut",
          yoyo: true,
          repeat: 5,
        },
        0.1,
      )
      .to(
        liveChatRef.current,
        {
          duration: 0.9,
          css: { "--storm-core": 1 },
          ease: "sine.inOut",
          yoyo: true,
          repeat: 3,
        },
        0.35,
      );
    return () => {
      prismTween.current?.kill();
      prismTween.current = null;
    };
  }, []);

  useEffect(() => {
    if (!liveChatRef.current) return;
    liveChatRimTween.current?.kill();
    liveChatRimTween.current = gsap.to(liveChatRef.current, {
      duration: 5.2,
      repeat: -1,
      ease: "linear",
      css: { "--rim-angle": "360deg" },
    });
    return () => {
      liveChatRimTween.current?.kill();
      liveChatRimTween.current = null;
    };
  }, []);

  useEffect(() => {
    if (!liveRodsRef.current) return;
    const rods = Array.from(liveRodsRef.current.querySelectorAll(".storm-rod"));
    if (!rods.length) return;
    const rodTween = gsap.timeline({ repeat: -1 });
    rods.forEach((rod, index) => {
      rodTween
        .to(
          rod,
          {
            duration: 0.12,
            opacity: 0.9,
            scaleY: 1.2,
            ease: "power2.out",
          },
          index * 0.2,
        )
        .to(
          rod,
          {
            duration: 0.18,
            opacity: 0,
            scaleY: 0.6,
            ease: "power2.in",
          },
          index * 0.2 + 0.12,
        )
        .to(
          rod,
          {
            duration: 0.01,
            x: gsap.utils.random(-18, 18),
            y: gsap.utils.random(-6, 6),
          },
          index * 0.2 + 0.22,
        );
    });
    rodTween.to({}, { duration: 0.6 });
    return () => {
      rodTween.kill();
    };
  }, []);

  useEffect(() => {
    if (!rightColumnRef.current) return;
    const updateHeight = () => {
      if (window.innerWidth < 1024) {
        setRightHeight(null);
        return;
      }
      setRightHeight(rightColumnRef.current?.offsetHeight ?? null);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(rightColumnRef.current);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const loadTier = async () => {
      try {
        const supabase = supabaseBrowser();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          if (isActive) setAccountTier("FREE");
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
          setAccountTier(profile?.is_pro ? "PRO" : "FREE");
          return;
        }
        if (profile?.is_pro || profile?.tier === "studio") {
          setAccountTier("PRO");
        } else if (profile?.tier === "creator") {
          setAccountTier("BASIC");
        } else if (profile) {
          setAccountTier("BASIC");
        } else {
          setAccountTier("FREE");
        }
      } catch {
        if (isActive) setAccountTier("FREE");
      }
    };
    loadTier();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    weeklyRimTweens.current.forEach((tween) => tween.kill());
    weeklyRimTweens.current = [];
    if (!result?.weeklyCalendar?.length) return;
    weeklyCardRefs.current.forEach((card, index) => {
      if (!card) return;
      const tween = gsap.to(card, {
        duration: 240 + index * 20,
        repeat: -1,
        ease: "linear",
        delay: index * 1.5,
        css: { "--rim-angle": "360deg" },
      });
      weeklyRimTweens.current.push(tween);
    });
    return () => {
      weeklyRimTweens.current.forEach((tween) => tween.kill());
      weeklyRimTweens.current = [];
    };
  }, [result?.weeklyCalendar]);

  useEffect(() => {
    hookRimTweens.current.forEach((tween) => tween.kill());
    hookRimTweens.current = [];
    if (!result?.hooks?.length) return;
    hookCardRefs.current.forEach((card, index) => {
      if (!card) return;
      const tween = gsap.to(card, {
        duration: 240 + index * 20,
        repeat: -1,
        ease: "linear",
        delay: index * 1.5,
        css: { "--rim-angle": "360deg" },
      });
      hookRimTweens.current.push(tween);
    });
    return () => {
      hookRimTweens.current.forEach((tween) => tween.kill());
      hookRimTweens.current = [];
    };
  }, [result?.hooks]);

  useEffect(() => {
    threadRimTweens.current.forEach((tween) => tween.kill());
    threadRimTweens.current = [];
    if (!result?.threadOutline?.length) return;
    threadCardRefs.current.forEach((card, index) => {
      if (!card) return;
      const tween = gsap.to(card, {
        duration: 240 + index * 20,
        repeat: -1,
        ease: "linear",
        delay: index * 1.5,
        css: { "--rim-angle": "360deg" },
      });
      threadRimTweens.current.push(tween);
    });
    return () => {
      threadRimTweens.current.forEach((tween) => tween.kill());
      threadRimTweens.current = [];
    };
  }, [result?.threadOutline]);

  const update = (key: keyof typeof initial, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || "Generation failed.");
      }
      const data = payload as GenerationResult;
      setResult(data);
      setHasGenerated(true);
      setChatMessages([
        {
          role: "assistant",
          content:
            "I've generated your content. Ask me to refine hooks, remix angles, or build a sharper weekly map.",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || !result) return;
    const nextMessages: ChatMessage[] = [
      ...chatMessages,
      { role: "user", content: chatInput.trim() },
    ];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context: result }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || "Chat failed.");
      }
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: payload.reply },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err instanceof Error ? err.message : "Something went wrong.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const downloadCsv = () => {
    if (!result) return;
    const rows = [
      ["Hooks", ...result.hooks],
      ["Angles", ...result.angles],
      ...result.weeklyCalendar.map((item) => [item.day, item.post]),
      ["Thread Outline", ...result.threadOutline],
      ["Bio", result.bio],
      ["CTA", result.cta],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "hookforge-content.csv");
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid items-stretch gap-8 lg:grid-cols-[0.55fr_0.45fr]">
      <section
        className={`flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 ${
          rightHeight ? "overflow-hidden" : ""
        }`}
        style={rightHeight ? { maxHeight: rightHeight } : undefined}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Creator Inputs
            </p>
            <h2 className="text-display mt-3 text-2xl">
              Feed the engine with your niche.
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Add the minimum and we'll generate hooks, a weekly map, and a thread
              outline.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-[var(--border)] bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.3em] text-[var(--accent)] lg:block">
            {accountTier}
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <label className="text-sm text-[var(--muted)]">
            Niche / Topic
            <input
              value={form.niche}
              onChange={(event) => update("niche", event.target.value)}
              placeholder="e.g. AI product design for indie SaaS"
              className="mt-2 w-full rounded-2xl border border-transparent bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]"
            />
          </label>
          <label className="text-sm text-[var(--muted)]">
            Audience
            <input
              value={form.audience}
              onChange={(event) => update("audience", event.target.value)}
              placeholder="e.g. founders building in public"
              className="mt-2 w-full rounded-2xl border border-transparent bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]"
            />
          </label>
          <label className="text-sm text-[var(--muted)]">
            Primary Goal
            <input
              value={form.goal}
              onChange={(event) => update("goal", event.target.value)}
              placeholder="e.g. drive waitlist conversions"
              className="mt-2 w-full rounded-2xl border border-transparent bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]"
            />
          </label>
          <label className="text-sm text-[var(--muted)]">
            Tone
            <input
              value={form.tone}
              onChange={(event) => update("tone", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-transparent bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]"
            />
          </label>
          <label className="text-sm text-[var(--muted)]">
            Platform
            <input
              value={form.platform}
              onChange={(event) => update("platform", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-transparent bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]"
            />
          </label>
          <label className="text-sm text-[var(--muted)]">
            Content Pillars
            <input
              value={form.pillars}
              onChange={(event) => update("pillars", event.target.value)}
              placeholder="Build in public, GTM, automations"
              className="mt-2 w-full rounded-2xl border border-transparent bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {limitList.map((item) => (
            <button
              key={item}
              onClick={() => update("goal", item)}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={submit}
            disabled={!canGenerate || loading}
            ref={buttonRef}
            className="rim-glow rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Forging..." : "Generate Content"}
          </button>
          <button
            onClick={downloadCsv}
            disabled={!result}
            className="rounded-full border border-[var(--border)] px-6 py-3 text-sm uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        {hasGenerated && result ? (
          <div className="mt-8 flex min-h-0 flex-1 flex-col border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  Creator Copilot
                </p>
                <h3 className="text-display mt-2 text-xl">
                  Ask follow-ups on hooks, maps, and threads.
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Refine angles, rewrite hooks, or turn a map into full posts.
                </p>
              </div>
              <div
                ref={liveChatRef}
                className="storm-chip px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--accent)]"
              >
                <span ref={liveChatRimRef} className="storm-rim" aria-hidden="true" />
                <span ref={liveRodsRef} className="storm-rods" aria-hidden="true">
                  <span className="storm-rod" style={{ left: "20%" }} />
                  <span className="storm-rod" style={{ left: "48%" }} />
                  <span className="storm-rod" style={{ left: "72%" }} />
                </span>
                <span>Live Chat</span>
              </div>
            </div>
            <div className="mt-6 grid min-h-0 flex-1 items-stretch gap-4 lg:grid-cols-[1fr_auto]">
              <div className="flex h-full min-h-[220px] flex-1 flex-col rounded-2xl border border-[var(--border)] bg-black/40 p-4">
                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-2 text-sm">
                  {chatMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "self-end bg-[var(--accent)] text-black"
                          : "self-start bg-[var(--card)] text-white/90"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div
                          className="leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: `<p>${formatAssistant(message.content)}</p>`,
                          }}
                        />
                      ) : (
                        message.content
                      )}
                    </div>
                  ))}
                  {chatLoading ? (
                    <p className="text-[var(--muted)]">Thinking...</p>
                  ) : null}
                </div>
              </div>
              <div className="flex h-full flex-col justify-end gap-3 self-end">
                <textarea
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendChat();
                    }
                  }}
                  placeholder="Ask for sharper hooks or a thread expansion..."
                  className="h-28 w-full rounded-2xl border border-transparent bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]"
                />
                <button
                  onClick={sendChat}
                  disabled={!chatInput.trim() || chatLoading}
                  className="rounded-full border border-[var(--border)] px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white disabled:opacity-50"
                >
                  {chatLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section ref={rightColumnRef} className="space-y-4">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-2)] p-6">
          <h3 className="text-display text-2xl">Hooks</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/90">
            {(result?.hooks ?? []).slice(0, 6).map((hook, index) => (
              <li
                key={hook}
                ref={(el) => {
                  hookCardRefs.current[index] = el;
                }}
                className="week-rim rounded-2xl border border-white/10 bg-black/30 p-3"
              >
                {hook}
              </li>
            ))}
            {!result ? (
              <li className="text-[var(--muted)]">
                Generate to see your first hook set.
              </li>
            ) : null}
          </ul>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-2)] p-6">
          <h3 className="text-display text-2xl">Weekly Map</h3>
          <div className="mt-4 space-y-3 text-sm text-white/90">
            {(result?.weeklyCalendar ?? []).map((item, index) => (
              <div
                key={item.day}
                ref={(el) => {
                  weeklyCardRefs.current[index] = el;
                }}
                className="week-rim rounded-2xl border border-white/10 bg-black/30 p-3"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--week-day)]">
                  {item.day}
                </p>
                <p className="mt-2">{item.post}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-2)] p-6">
          <h3 className="text-display text-2xl">Thread Blueprint</h3>
          <ol className="mt-4 space-y-3 text-sm text-white/90">
            {(result?.threadOutline ?? []).map((step, index) => (
              <li
                key={`${index}-${step}`}
                ref={(el) => {
                  threadCardRefs.current[index] = el;
                }}
                className="week-rim rounded-2xl border border-white/10 bg-black/30 p-3"
              >
                <span className="text-[var(--accent)]">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      
    </div>
  );
}


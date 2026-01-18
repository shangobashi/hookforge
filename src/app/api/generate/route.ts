import { NextResponse } from "next/server";
import { z } from "zod";
import Groq from "groq-sdk";
import type { GenerationResult } from "@/lib/types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const bodySchema = z.object({
  niche: z.string().min(3),
  audience: z.string().min(3),
  goal: z.string().min(3),
  tone: z.string().min(3).optional().default("Confident, concise"),
  platform: z.string().min(2).optional().default("X (Twitter)"),
  pillars: z.string().optional().default(""),
  isDemo: z.boolean().optional(),
});

const systemPrompt = `You are HookForge, a creator content strategist. Return concise, punchy outputs.
You must keep advice current and timely. Use 2026-present context and avoid outdated 2024-era references or stale data. If a claim depends on recent info, either use current-year framing (2026) or phrase it timelessly without specific dates.
Return JSON only, with keys: hooks (array of strings), angles (array of strings), weeklyCalendar (array of objects with day, post), threadOutline (array of strings), bio (string), cta (string).`;

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const payload = bodySchema.parse(json);

    if (!payload.isDemo) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !anon) {
        return NextResponse.json(
          { error: "Auth not configured" },
          { status: 401 },
        );
      }

      const cookieStore = await cookies();
      const supabase = createServerClient(url, anon, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      });

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        return NextResponse.json(
          { error: "Unauthorized. Please log in again." },
          { status: 401 },
        );
      }
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 400 },
      );
    }

    const groq = new Groq({ apiKey });
    const modelList = (process.env.GROQ_MODEL || "llama-3.3-70b-versatile,llama-3.1-8b-instant")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const userPrompt = `
Niche: ${payload.niche}
Audience: ${payload.audience}
Goal: ${payload.goal}
Tone: ${payload.tone}
Platform: ${payload.platform}
Content pillars: ${payload.pillars || "Not specified"}

Rules:
- Hooks: 10 items, max 140 chars each.
- Angles: 6 items.
- WeeklyCalendar: 5 items (Mon-Fri) with short post concept and suggested CTA.
- ThreadOutline: 6 items, clear progression.
- Bio: 1 line, under 160 chars.
- CTA: 1 line, under 100 chars.
`;

    let completion;
    let lastError: unknown;
    for (const model of modelList) {
      try {
        completion = await groq.chat.completions.create({
          model,
          temperature: 0.7,
          max_tokens: payload.isDemo ? 700 : 1100,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        });
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!completion) {
      throw lastError || new Error("No available Groq models.");
    }

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(content) as GenerationResult;
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

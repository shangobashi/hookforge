import { NextResponse } from "next/server";
import { z } from "zod";
import Groq from "groq-sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { GenerationResult } from "@/lib/types";

const bodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1),
    }),
  ),
  context: z.object({
    hooks: z.array(z.string()).default([]),
    angles: z.array(z.string()).default([]),
    weeklyCalendar: z.array(
      z.object({
        day: z.string(),
        post: z.string(),
      }),
    ),
    threadOutline: z.array(z.string()).default([]),
    bio: z.string().default(""),
    cta: z.string().default(""),
  }),
});

const systemPrompt = `You are HookForge, a creator content strategist and editor.
Use 2026-present context and avoid outdated 2024-era references or stale data.
Answer succinctly and actionable. Provide rewrites, expansions, or clarifications based on the provided content context.
Do not return JSON; reply with plain text.`;

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const payload = bodySchema.parse(json);

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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 400 },
      );
    }

    const groq = new Groq({ apiKey });
    const modelList = (
      process.env.GROQ_MODEL ||
      "moonshotai/kimi-k2-instruct-0905,qwen/qwen3-32b,openai/gpt-oss-120b"
    )
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const context = payload.context as GenerationResult;
    const contextBlock = `
Hooks: ${context.hooks.slice(0, 10).join(" | ")}
Angles: ${context.angles.slice(0, 8).join(" | ")}
Weekly Calendar: ${context.weeklyCalendar
      .slice(0, 5)
      .map((item) => `${item.day}: ${item.post}`)
      .join(" | ")}
Thread Outline: ${context.threadOutline.slice(0, 8).join(" | ")}
Bio: ${context.bio}
CTA: ${context.cta}
`;

    let completion;
    let lastError: unknown;
    for (const model of modelList) {
      try {
        completion = await groq.chat.completions.create({
          model,
          temperature: 0.6,
          max_tokens: 600,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Context:\n${contextBlock}\n\nConversation:\n${payload.messages
                .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                .join("\n")}\n\nRespond to the user's latest request.`,
            },
          ],
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
        { error: "No response generated" },
        { status: 500 },
      );
    }

    return NextResponse.json({ reply: content.trim() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

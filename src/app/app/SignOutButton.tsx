"use client";

import { DEMO_ACCESS_COOKIE } from "@/lib/demo-access";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SignOutButton() {
  const signOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    document.cookie = `${DEMO_ACCESS_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
    window.location.href = "/login";
  };

  return (
    <button
      onClick={signOut}
      className="rounded-full border border-[var(--border)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white hover:text-white"
    >
      Sign Out
    </button>
  );
}

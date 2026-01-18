"use client";

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MascotLogo({ size = 44 }: { size?: number }) {
  const pillRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!pillRef.current) return;
    const update = () => {
      const width = pillRef.current?.getBoundingClientRect().width;
      if (width) {
        document.documentElement.style.setProperty(
          "--logo-pill-width",
          `${Math.round(width)}px`,
        );
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(pillRef.current);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <Image
        src="/mascot.png"
        alt="HookForge mascot"
        width={size}
        height={size}
        className="mascot-logo"
        priority
      />
      <span
        ref={pillRef}
        className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-black"
      >
        HookForge
      </span>
    </Link>
  );
}

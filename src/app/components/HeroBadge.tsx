"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroBadge() {
  const badgeRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!badgeRef.current) return;
    const tween = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
    tween
      .to(badgeRef.current, {
        duration: 3.2,
        css: { "--glow-x": "80%", "--glow-alpha": 0.9 },
      })
      .to(
        badgeRef.current,
        {
          duration: 3.6,
          css: { "--glow-x": "0%", "--glow-alpha": 0.6 },
        },
        0,
      )
      .to(
        badgeRef.current,
        {
          duration: 1.6,
          css: { "--glow-alpha": 1 },
          yoyo: true,
          repeat: 1,
        },
        0.4,
      );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <p
      ref={badgeRef}
      className="hero-badge text-xs uppercase tracking-[0.4em] text-[var(--accent-2)]"
    >
      Viral Content Engine
    </p>
  );
}

import { Suspense } from "react";
import UpgradeClient from "./UpgradeClient";

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="text-sm text-[var(--muted)]">Loading...</div>}>
      <UpgradeClient />
    </Suspense>
  );
}

"use client";

import { ReactNode, useSyncExternalStore } from "react";

// The Great Rift launches November 3, 2026 (midnight Eastern, EST by then).
// Copy switches itself on the visitor's clock; the server snapshot is always
// the pre-launch copy so hydration stays consistent.
const GREAT_RIFT_LAUNCH_AT = Date.parse("2026-11-03T00:00:00-05:00");

const subscribe = () => () => {};

export function useGreatRiftLaunched() {
  return useSyncExternalStore(
    subscribe,
    () => Date.now() >= GREAT_RIFT_LAUNCH_AT,
    () => false,
  );
}

export function Launch({ before, after }: { before: ReactNode; after: ReactNode }) {
  return <>{useGreatRiftLaunched() ? after : before}</>;
}

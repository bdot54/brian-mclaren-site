"use client";

import { ReactNode, useSyncExternalStore } from "react";

// Brian's public 15% code (BM27Fall) is good through midnight Friday,
// November 13, 2026 (Eastern, EST by then). The page shows the "before" copy
// until then and switches itself on the visitor's clock. The server snapshot
// is always "before" so hydration stays consistent.
const CODE_DEADLINE_AT = Date.parse("2026-11-14T00:00:00-05:00");

const subscribe = () => () => {};

export function CodeDeadline({
  before,
  after,
}: {
  before: ReactNode;
  after: ReactNode;
}) {
  const stillOpen = useSyncExternalStore(
    subscribe,
    () => Date.now() < CODE_DEADLINE_AT,
    () => true,
  );
  return <>{stillOpen ? before : after}</>;
}

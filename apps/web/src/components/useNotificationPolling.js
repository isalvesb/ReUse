"use client";
import { useEffect, useState } from "react";
import { startVisiblePolling, pollingSnapshotValue } from "@/lib/visible-polling.mjs";

export default function useNotificationPolling({ userId, initial, read, enabled = true }) {
  const [snapshot, setSnapshot] = useState(null);
  useEffect(() => {
    if (!enabled || !userId) return;
    return startVisiblePolling({
      read,
      publish: (value) => setSnapshot({ userId, initial, value }),
      document,
      window,
    });
  }, [enabled, userId, initial, read]);
  // A changed account or new server snapshot cannot reuse an older poll result.
  return pollingSnapshotValue(snapshot, userId, initial);
}

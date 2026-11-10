// One in-flight read per mounted consumer; hidden pages and disposed consumers
// neither publish stale responses nor start additional reads.
export function startVisiblePolling({ read, publish, document, window }) {
  let stopped = false;
  let pending = false;
  const refresh = async () => {
    if (stopped || pending || document.hidden) return;
    pending = true;
    try {
      const value = await read();
      if (!stopped) publish(value);
    } catch { /* Keep the last snapshot; the next interval/focus retries. */ }
    finally { pending = false; }
  };
  const timer = window.setInterval(refresh, 10000);
  window.addEventListener("focus", refresh);
  document.addEventListener("visibilitychange", refresh);
  return () => {
    stopped = true;
    window.clearInterval(timer);
    window.removeEventListener("focus", refresh);
    document.removeEventListener("visibilitychange", refresh);
  };
}
export function pollingSnapshotValue(snapshot, userId, initial) {
  return snapshot && snapshot.userId === userId && snapshot.initial === initial ? snapshot.value : initial;
}


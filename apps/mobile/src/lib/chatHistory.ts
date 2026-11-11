import type { ChatMessage } from "./chatApi";
// A full newer window without overlap means the app missed a long interval.
// Restart pagination there rather than joining two blocks with an invisible gap.
export function mergeMessageWindow(
  previous: ChatMessage[],
  incoming: ChatMessage[],
  live = false,
) {
  const reset = Boolean(
    live &&
      previous.length &&
      incoming.length >= 30 &&
      !incoming.some((m) => previous.some((old) => old.id === m.id)),
  );
  const items = [
    ...new Map(
      [...(reset ? [] : previous), ...incoming].map((m) => [m.id, m]),
    ).values(),
  ].sort(
    (a, b) =>
      a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
  );
  return { items, reset };
}

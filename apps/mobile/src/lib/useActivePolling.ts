import { useCallback, useRef } from "react";
import { AppState } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
// Recursive timer avoids overlapping polls. AppState and focus suspend background work.
export function useActivePolling(
  callback: () => Promise<unknown>,
  interval = 5000,
) {
  const latest = useRef(callback);
  latest.current = callback;
  useFocusEffect(
    useCallback(() => {
      let alive = true,
        busy = false,
        timer: ReturnType<typeof setTimeout> | undefined;
      const run = async () => {
        if (!alive || busy || AppState.currentState !== "active") return;
        busy = true;
        try {
          await latest.current();
        } catch {
          /* screen owns the visible error */
        } finally {
          busy = false;
          if (alive && AppState.currentState === "active")
            timer = setTimeout(run, interval);
        }
      };
      const change = AppState.addEventListener("change", (state) => {
        clearTimeout(timer);
        if (state === "active") void run();
      });
      void run();
      return () => {
        alive = false;
        clearTimeout(timer);
        change.remove();
      };
    }, [interval]),
  );
}

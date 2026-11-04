"use client";
import { useEffect, useState } from "react";
import { unreadNotifications } from "@/app/notificacoes/actions";
export default function UnreadCount({ initial = 0, menu = false }) {
  const [count, setCount] = useState(null);
  const value = count ?? initial;
  useEffect(() => {
    let alive = true;
    const refresh = () => {
      if (!document.hidden)
        unreadNotifications()
          .then((n) => {
            if (alive) setCount(n);
          })
          .catch(() => {});
    };
    const timer = setInterval(refresh, 10000);
    window.addEventListener("focus", refresh);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return value > 0 ? (
    <span
      className={
        menu
          ? "ml-auto rounded-full bg-reuse-pink px-2 py-0.5 text-[10px] font-bold text-reuse-brown"
          : "absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-reuse-pink text-[9px] font-bold text-reuse-brown"
      }
    >
      {value > 9 ? "9+" : value}
    </span>
  ) : null;
}

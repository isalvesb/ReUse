"use client";
export default function UnreadCount({ initial = 0, menu = false }) {
  const value = initial;
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

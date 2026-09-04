import Link from "next/link";
import { Bell } from "lucide-react";

function formatRelativeDate(date) {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMinutes = Math.round(diffMs / 60000);

    if (diffMinutes < 1) return "agora mesmo";
    if (diffMinutes < 60) return `há ${diffMinutes} min`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `há ${diffHours} h`;

    const diffDays = Math.round(diffHours / 24);
    return `há ${diffDays} d`;
}

export default function NotificationCard({ message, read, createdAt, itemId }) {
    const content = (
        <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition ${read
                ? "border-transparent bg-reuse-white"
                : "border-reuse-pink bg-reuse-pink/20"
                }`}
        >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-reuse-pink/40">
                <Bell size={16} className="text-reuse-brown" />
            </div>

            <div className="flex-1">
                <p className="text-sm text-reuse-brown">
                    {message}
                </p>

                <p className="mt-1 text-xs text-reuse-brown-light">
                    {formatRelativeDate(createdAt)}
                </p>
            </div>

            {!read && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-reuse-pink" />
            )}
        </div>
    );

    if (itemId) {
        return (
            <Link href={`/produto/${itemId}`} className="block">
                {content}
            </Link>
        );
    }

    return content;
}

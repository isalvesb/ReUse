"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const CURRENT_PATH_KEY = "reuse.currentPath";
const PREVIOUS_PATH_KEY = "reuse.previousPath";

export default function InternalNavigationTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialized = useRef(false);

    useEffect(() => {
        const query = searchParams.toString();
        const nextPath = query ? `${pathname}?${query}` : pathname;
        const currentPath = sessionStorage.getItem(CURRENT_PATH_KEY);

        if (!initialized.current) {
            initialized.current = true;

            let internalReferrer = false;

            try {
                internalReferrer = Boolean(document.referrer)
                    && new URL(document.referrer).origin === window.location.origin;
            } catch {
                internalReferrer = false;
            }

            if (!internalReferrer) {
                sessionStorage.removeItem(PREVIOUS_PATH_KEY);
                sessionStorage.setItem(CURRENT_PATH_KEY, nextPath);
                return;
            }
        }

        if (currentPath && currentPath !== nextPath) {
            sessionStorage.setItem(PREVIOUS_PATH_KEY, currentPath);
        }

        sessionStorage.setItem(CURRENT_PATH_KEY, nextPath);
    }, [pathname, searchParams]);

    return null;
}

export const navigationStorageKeys = {
    current: CURRENT_PATH_KEY,
    previous: PREVIOUS_PATH_KEY,
};

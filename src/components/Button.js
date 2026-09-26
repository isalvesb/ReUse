import Link from "next/link";

export default function Button({
    children,
    variant = "primary",
    href,
    type = "button",
    onClick,
    disabled = false,
    className = "",
}) {
    const variants = {
        primary:
            "bg-reuse-pink text-reuse-brown hover:bg-[#DDA6DD]",

        secondary:
            "bg-reuse-brown text-white hover:bg-[#4A3A3A]",

        outline:
            "border border-reuse-brown bg-transparent text-reuse-brown hover:bg-reuse-brown hover:text-white",

        danger:
            "bg-red-500 text-white hover:bg-red-600",
    };

    const baseClasses =
        "inline-flex items-center justify-center rounded-3xl px-5 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100";

    const classes = `${baseClasses} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            {children}
        </button>
    );
}

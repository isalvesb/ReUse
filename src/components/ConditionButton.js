export default function ConditionButton({
    label,
    selected,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex min-h-[74px] items-center justify-center rounded-[10px] border px-3 text-center text-1rem font-medium leading-6 transition ${selected
                ? 'border-reuse-brown bg-reuse-pink'
                : "border-[#D1D5DC] bg-reuse-white"
                }`}
        >
            {label}
        </button>
    );
}
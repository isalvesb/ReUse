export default function FieldLabel({ label, required, htmlFor }) {
    const Element = htmlFor ? "label" : "span";

    return (
        <Element htmlFor={htmlFor} className="mt-5 block text-sm font-medium leading-5 text-[#364153]">
            {label}

            {required && (
                <span className="text-[#FB2C36]">
                    {""}*
                </span>
            )}
        </Element>
    );
}

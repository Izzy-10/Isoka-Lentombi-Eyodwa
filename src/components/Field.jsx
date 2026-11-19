import { useId } from "react";

export default function Field({ label, hint, as = "input", children, ...props }) {
  const id = useId();
  const Tag = as;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-cream">{label}</label>
      <Tag
        id={id}
        className="w-full rounded-xl border border-line bg-panel px-4 py-3 text-cream placeholder:text-muted focus:border-gold"
        {...props}
      >
        {children}
      </Tag>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

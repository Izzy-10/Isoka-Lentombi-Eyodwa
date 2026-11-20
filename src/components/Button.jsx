const styles = {
  primary: "btn-primary text-ink disabled:opacity-40",
  ghost: "border border-line bg-panel/50 text-cream hover:border-gold disabled:opacity-40",
  link: "text-gold underline underline-offset-4 hover:text-gold-soft",
};

export default function Button({ variant = "primary", className = "", ...props }) {
  const base = variant === "link" ? "" : "w-full rounded-xl px-5 py-3.5 font-bold transition-colors";
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

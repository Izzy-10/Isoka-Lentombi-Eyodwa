const styles = {
  primary: "bg-gold text-ink hover:bg-gold-soft disabled:opacity-40",
  ghost: "border border-line text-cream hover:border-gold disabled:opacity-40",
  link: "text-gold underline underline-offset-4 hover:text-gold-soft",
};

export default function Button({ variant = "primary", className = "", ...props }) {
  const base = variant === "link" ? "" : "w-full rounded-xl px-5 py-3.5 font-bold transition-colors";
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

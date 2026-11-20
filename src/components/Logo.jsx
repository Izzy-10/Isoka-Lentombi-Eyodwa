export default function Logo({ size = 40, glow = false, className = "" }) {
  return (
    <img
      src="/logo.webp" alt="Isoka Lentombi Eyodwa" width={size} height={size} decoding="async"
      className={`shrink-0 rounded-full ${glow ? "glow-strong" : ""} ${className}`}
    />
  );
}

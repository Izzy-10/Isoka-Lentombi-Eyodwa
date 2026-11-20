import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Crown from "../components/Crown.jsx";
import Logo from "../components/Logo.jsx";
import ThemeButton from "../components/ThemeButton.jsx";

export default function Welcome() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-between px-6 py-8">
      <div className="flex justify-end"><ThemeButton /></div>

      <section className="hero-rise text-center">
        <Logo size={208} glow className="mx-auto" />
        <p className="mt-6 flex items-center justify-center gap-3 font-brand text-sm font-bold uppercase tracking-[0.3em] text-gold-soft">
          <Crown /> Single and mingle <Crown />
        </p>
        <h1 className="gold-text mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight">
          Isoka lakho
          <br />
          likulindele.
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-muted">
          Meet real people across South Africa. Swipe, match and chat.
        </p>
      </section>

      <section className="grid gap-3">
        <Link to="/login?mode=signup"><Button>Create account</Button></Link>
        <Link to="/login"><Button variant="ghost">I already have an account</Button></Link>
        <p className="pt-2 text-center text-xs text-muted">
          You must be 18 or older to join. Read our{" "}
          <Link to="/terms" className="underline underline-offset-4">Terms</Link> and{" "}
          <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>.
        </p>
      </section>
    </main>
  );
}

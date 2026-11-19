import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function Welcome() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-between px-6 py-10">
      <p className="font-display text-lg font-bold text-gold">Isoka Lentombi Eyodwa</p>

      <section className="hero-rise">
        <h1 className="font-display text-6xl font-extrabold leading-[0.95] tracking-tight">
          Isoka lakho
          <br />
          likulindele.
        </h1>
        <p className="mt-6 max-w-xs text-lg text-muted">
          Meet people across South Africa through short video profiles and live dates.
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

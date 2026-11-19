import { Link, useNavigate } from "react-router-dom";
import { hasPlaceholders, privacy, terms } from "../content/legal.js";

const DOCS = { privacy, terms };

export default function Legal({ doc: key }) {
  const navigate = useNavigate();
  const doc = DOCS[key];
  const draft = hasPlaceholders(doc);

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-gold underline underline-offset-4">Back</button>
      <h1 className="mt-4 font-display text-4xl font-extrabold">{doc.title}</h1>
      <p className="mt-1 text-sm text-muted">Last updated: {doc.updated}</p>

      {draft && (
        <p role="note" className="mt-4 rounded-xl border border-danger/50 p-3 text-sm text-danger">
          Draft: this has not been finalised. Fill in every [BRACKETED] item and have a lawyer review it before launch.
        </p>
      )}

      <p className="mt-6 text-cream">{doc.intro}</p>
      {doc.sections.map((s) => (
        <section key={s.h} className="mt-8">
          <h2 className="font-display text-xl font-bold text-gold">{s.h}</h2>
          <div className="mt-2 grid gap-2 text-cream">
            {s.p.map((line, i) => <p key={i} className={line.startsWith("•") ? "pl-3" : ""}>{line}</p>)}
          </div>
        </section>
      ))}
      <p className="mt-10 text-sm text-muted">
        <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
        {" · "}
        <Link to="/terms" className="underline underline-offset-4">Terms of Service</Link>
      </p>
    </main>
  );
}

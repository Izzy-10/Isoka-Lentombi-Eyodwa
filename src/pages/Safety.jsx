import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";

const TIPS = [
  ["Meet in public first", "Choose a busy place like a mall or restaurant for your first few meetings. Don't share your home address early."],
  ["Tell someone", "Tell a friend or family member who you're meeting, where, and when. Share your live location with them."],
  ["Never send money, airtime or data", "If a match asks for money, airtime, data or gift cards, even for an emergency, it's almost certainly a scam. Report them."],
  ["Video call before you meet", "A quick video call helps confirm they're the person in their photos."],
  ["Keep personal details private", "Don't share your ID number, banking details, OTP codes or passwords with anyone, ever."],
  ["Trust your gut", "If something feels wrong, leave. You don't owe anyone an explanation."],
  ["Report and block", "Use Report or block inside any chat. Reports about people who seem under 18 are taken seriously."],
];

export default function Safety() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-6">
      <Link to="/settings" className="text-sm text-gold underline underline-offset-4">Back to Settings</Link>
      <h1 className="mt-4 font-display text-4xl font-extrabold gold-text">Stay safe</h1>
      <ul className="mt-6 grid gap-4">
        {TIPS.map(([title, body]) => (
          <li key={title} className="rounded-2xl border border-line bg-panel p-5">
            <h2 className="font-bold text-gold">{title}</h2>
            <p className="mt-1 text-cream">{body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        In an emergency in South Africa, call the SAPS Flying Squad on 10111, or 112 from a cellphone.
      </p>
      <BottomNav />
    </main>
  );
}

// Writes the lawyer's copy: npm run export-legal
import { writeFileSync } from "node:fs";
import { privacy, terms } from "../src/content/legal.js";

const render = (doc) =>
  [
    `# ${doc.title}`,
    `Last updated: ${doc.updated}`,
    "",
    doc.intro,
    "",
    ...doc.sections.flatMap((s) => [`## ${s.h}`, "", ...s.p.map((line) => (line.startsWith("•") ? `- ${line.slice(1).trim()}` : line)), ""]),
    "---",
    "",
    `## Notes for the lawyer (${doc.title})`,
    "",
    ...doc.lawyerNotes.map((n) => `- ${n}`),
    "",
  ].join("\n");

const out = [
  "# Isoka Lentombi Eyodwa: Privacy Policy and Terms (DRAFTS)",
  "",
  "These are plain-language drafts based on what the app actually does today. They are NOT legal advice and have not been reviewed by a lawyer.",
  "Everything in [SQUARE BRACKETS] must be filled in or written by your lawyer. The app shows a DRAFT banner until no brackets are left.",
  "",
  "---",
  "",
  render(privacy),
  "",
  "---",
  "",
  render(terms),
].join("\n");

writeFileSync(new URL("../LEGAL_DRAFTS_FOR_LAWYER.md", import.meta.url), out);
console.log("Wrote LEGAL_DRAFTS_FOR_LAWYER.md");

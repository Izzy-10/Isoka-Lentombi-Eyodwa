// Single source for the Privacy Policy and Terms. The app pages and the lawyer's copy
// (npm run export-legal) are both generated from this file, so they can't drift apart.
// Anything in [SQUARE BRACKETS] must be filled in. The app shows a DRAFT banner until none are left.

const CO = "[COMPANY NAME]";
const EMAIL = "[CONTACT EMAIL]";

export const privacy = {
  title: "Privacy Policy",
  updated: "[DATE]",
  intro: `This policy explains what personal information ${CO} ("we", "us") collects through Isoka Lentombi Eyodwa ("Isoka"), why we collect it, who sees it, and what rights you have under South Africa's Protection of Personal Information Act 4 of 2013 (POPIA).`,
  sections: [
    {
      h: "1. Who is responsible for your information",
      p: [
        `${CO}, registration number [REGISTRATION NUMBER], of [PHYSICAL ADDRESS], is the responsible party under POPIA.`,
        `Our Information Officer is [INFORMATION OFFICER NAME]. You can reach them at ${EMAIL}.`,
      ],
    },
    {
      h: "2. What we collect",
      p: [
        "Information you give us:",
        "• Your cellphone number or email address, used to log in.",
        "• Your display name, date of birth, gender, what you are looking for, bio and interests.",
        "• A TikTok username or profile link, if you choose to add one.",
        "• Your photos.",
        "• A verification selfie, only if you choose to get verified. We ask for your agreement first.",
        "• Your province and city, and (only if you choose to share it) your device location, which we use to work out distances.",
        "• Your messages to other users.",
        "• Your swipes, matches, blocks and any reports you make.",
        "• Your plan and payment details: which plan you bought, the amount, the date and the payment reference. We never see or store your card number. Paystack handles it.",
        "Information collected automatically:",
        "• When you were last active.",
        "• Technical data such as your IP address, which our hosting providers may log for security and reliability.",
        "Some of what you choose to put on a dating profile, such as who you are looking for, can reveal sensitive information about your private life. You decide what to share. We only use it to run Isoka as described below.",
      ],
    },
    {
      h: "3. Why we use it",
      p: [
        "• To create your account and keep it secure.",
        "• To show your profile to other users and suggest people to you.",
        "• To let matched users chat.",
        "• To keep Isoka safe: handling reports and blocks, preventing fake profiles, scams and abuse, and removing people who break our Terms.",
        "• To process payments for Premium and VIP.",
        "• To meet our legal obligations.",
        "We use your information because you agreed to it, because we need it to provide the service you signed up for, to keep our users safe, or because the law requires it.",
        "We do not sell your information and we do not use it for advertising.",
      ],
    },
    {
      h: "4. Who can see your information",
      p: [
        "Other users can see: whether you are verified, your display name, age (not your date of birth), city and province, bio, interests, photos, any TikTok profile link you choose to add, and the messages you send them. They never see your phone number, email address, date of birth or device location. No other user ever sees your verification selfie. Only our review team does, to compare it with your photos.",
        "If you open a TikTok link, TikTok may collect information about your visit under its own privacy policy.",
        "Our service providers process information for us:",
        "• Google Firebase: login and photo storage.",
        "• Railway: our servers and database.",
        "• Vercel: the website.",
        "• Paystack: payments.",
        "We may also share information if the law requires it, or to protect someone's safety.",
      ],
    },
    {
      h: "5. Where your information is kept",
      p: [
        "Our providers may store and process information outside South Africa, including in [HOSTING REGION]. Where that happens we take reasonable steps to make sure your information is protected to a similar standard, as POPIA requires.",
      ],
    },
    {
      h: "6. How long we keep it",
      p: [
        "Verification selfies are deleted as soon as our team has reviewed them, and in any case within 30 days.",
        "We keep your information while your account is open. When you delete your account in Settings, we delete your profile, photos, matches, messages and login. Copies in our backups are removed within [BACKUP DAYS] days.",
      ],
    },
    {
      h: "7. How we protect it",
      p: [
        "Connections to Isoka are encrypted. Logins are handled by Google Firebase. Only our team can access the database, and only where needed. No system is perfectly secure, so if we learn that your information has been accessed without permission, we will tell you and the Information Regulator as the law requires.",
      ],
    },
    {
      h: "8. Your rights",
      p: [
        "Under POPIA you can:",
        "• Ask what information we hold about you and get a copy. Use Settings → Download my data.",
        `• Correct information that is wrong. Use Settings → Edit profile. Your date of birth is locked, so email ${EMAIL} if it is wrong.`,
        "• Ask us to delete your information. Use Settings → Delete my account.",
        "• Object to how we use your information, or withdraw your consent. Withdrawing consent means we can no longer provide Isoka to you.",
        "If you think we have handled your information unlawfully, you can complain to the Information Regulator (South Africa): inforegulator.org.za, POPIAComplaints@inforegulator.org.za, 010 023 5200.",
      ],
    },
    {
      h: "9. Age limit",
      p: [
        "Isoka is only for people who are 18 or older. If we learn that someone under 18 has an account, we will delete it. If you think someone on Isoka is under 18, please report them in the app.",
      ],
    },
    {
      h: "10. Changes to this policy",
      p: [
        "If we change this policy in a way that matters, we will tell you in the app before it takes effect. The date at the top shows when it was last updated.",
      ],
    },
    {
      h: "11. Contact us",
      p: [`Questions or requests: ${EMAIL}.`],
    },
  ],
  lawyerNotes: [
    "Confirm whether we must register an Information Officer with the Information Regulator, and fill in section 1.",
    "Confirm the lawful grounds in section 3 and whether profile data such as gender and 'looking for' counts as special personal information (sex life) needing explicit consent. The app currently records one consent tick at signup, with a timestamp and version.",
    "Section 5 (cross-border transfers, POPIA section 72): confirm what we must do for Google, Railway, Vercel and Paystack, and fill in the real hosting regions.",
    "Section 6: the code currently deletes EVERYTHING on account deletion, including payment records and reports about that user. Decide what we must or may keep (tax records, safety records about banned users), then we will change the code and this text to match.",
    "Section 8: users can edit their profile in the app. Date of birth is locked (it is the age check), so corrections to it go through email. Confirm that is acceptable under the right to correction.",
    "Verification selfies are biometric-type information, likely special personal information. The app asks for explicit consent before the selfie (time stored), keeps it private, shows it only to staff in the admin, and deletes it after the decision (or after 30 days, or on account deletion). Confirm this meets POPIA, who on the team may access it, and whether we need a written access policy.",
    "Check Information Regulator contact details are still current before publishing.",
    "Do we need a PAIA manual? Do we need a breach response plan and operator agreements with each provider?",
  ],
};

export const terms = {
  title: "Terms of Service",
  updated: "[DATE]",
  intro: `These terms are the agreement between you and ${CO} for using Isoka Lentombi Eyodwa ("Isoka"). By creating an account you agree to them.`,
  sections: [
    {
      h: "1. Who we are",
      p: [
        `${CO}, registration number [REGISTRATION NUMBER], of [PHYSICAL ADDRESS]. VAT: [VAT STATUS]. Contact: ${EMAIL}.`,
      ],
    },
    {
      h: "2. Who can use Isoka",
      p: [
        "• You must be 18 or older.",
        "• You may have one account, and the information on it must be true. Your photos must show you.",
        "• You must not have been removed from Isoka before.",
      ],
    },
    {
      h: "3. Your account",
      p: [
        "You are responsible for what happens on your account. Do not share your login codes. Tell us straight away if someone else gets into your account.",
      ],
    },
    {
      h: "4. How to behave",
      p: [
        "You must not:",
        "• Harass, threaten, abuse or discriminate against anyone.",
        "• Pretend to be someone else, or use fake photos or details.",
        "• Ask anyone for money, airtime, data or gift cards, or run any scam.",
        "• Post nudity, sexual content, violence, or anything illegal.",
        "• Use Isoka to sell things, advertise, or recruit.",
        "• Collect other users' information, or use bots or scripts.",
        "• Try to break or get around the security of Isoka.",
        "• Use Isoka if you are under 18.",
      ],
    },
    {
      h: "5. Your content",
      p: [
        "You keep ownership of your photos and words. You give us permission to store them and show them to other users so that Isoka can work. That permission ends when you delete your account or the content.",
        "You promise you have the right to post what you post.",
      ],
    },
    {
      h: "6. Meeting people safely",
      p: [
        "We do not run background checks. Some users choose to verify their photos with a selfie that our team compares with their profile photos. The gold badge only means that happened at that time. It does not prove who someone is or that they are safe, so take care when you talk to or meet people. Read our safety tips in the app. You are responsible for your own decisions and for what you do.",
      ],
    },
    {
      h: "7. Reports, blocking and removal",
      p: [
        "You can report or block anyone inside the app. We may review reports and chats that are reported. We may remove content, suspend or delete accounts that break these terms or put people at risk, with or without warning where safety requires it.",
      ],
    },
    {
      h: "8. Premium and VIP",
      p: [
        "Premium and VIP are paid access passes. The price in rand is shown before you pay. Each payment gives you 30 days. It does not renew automatically, so you will not be charged again unless you choose to buy again.",
        "Buying the same plan again adds 30 days to the time you have left. Upgrading to VIP starts a new 30 days. We do not refund unused time on a lower plan unless the law requires it.",
        "Payments are processed by Paystack. We do not store your card details.",
        "The features of each plan are those listed on the plans page when you buy. [REFUND POLICY]",
      ],
    },
    {
      h: "9. Our rights in Isoka",
      p: [
        "The Isoka app, name, design and software belong to us. You may use them only to use Isoka as intended.",
      ],
    },
    {
      h: "10. Availability and changes",
      p: [
        "We work to keep Isoka running but cannot promise it will always be available or error free. We may change or stop features. If we change these terms in a way that matters, we will tell you in the app first. If you keep using Isoka after the change takes effect, you accept the new terms.",
      ],
    },
    {
      h: "11. Our responsibility",
      p: [
        "[LIMITATION OF LIABILITY: to be written by your lawyer in line with the Consumer Protection Act.]",
      ],
    },
    {
      h: "12. Ending your account",
      p: [
        "You can delete your account any time in Settings. We may end your account as described in section 7.",
      ],
    },
    {
      h: "13. Law and disputes",
      p: [
        "These terms are governed by the laws of South Africa. [DISPUTE RESOLUTION AND JURISDICTION]",
      ],
    },
    {
      h: "14. Contact",
      p: [`Questions: ${EMAIL}.`],
    },
  ],
  lawyerNotes: [
    "Electronic Communications and Transactions Act: confirm the supplier information in section 1 is complete, and whether the 7-day cooling-off right applies to Premium and VIP passes. Write the refund policy in section 8.",
    "Consumer Protection Act: review sections 8, 10 and 11 (limitation of liability, unilateral changes, plain language).",
    "Section 4 bans nudity and sexual content: confirm this is the position you want and how we enforce it. Photos are not moderated yet.",
    "Terms section 6: verification is optional and manual. Confirm the wording about what the badge means protects us.",
    "Add dispute resolution and jurisdiction in section 13.",
    "Confirm the minimum age and consider what happens when we find an under-18 account.",
    "Decide how users are told about changes and how acceptance of new versions is recorded. The backend stores acceptance time and a TERMS_VERSION string.",
  ],
};

export const hasPlaceholders = (doc) => /\[[A-Z][A-Z0-9 \/:.,\-a-z]*\]/.test(JSON.stringify(doc.sections) + doc.updated);

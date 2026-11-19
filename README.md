# Isoka Lentombi Eyodwa: Frontend (Weeks 1 to 4 + legal)

Auth (phone OTP, Google, email) and 4-step onboarding. Built by Sizwe Sicelimilo Sibiya.

## Run it
```bash
npm install
cp .env.example .env     # then fill in your Firebase keys
npm run dev
```

## Firebase setup (5 minutes)
1. console.firebase.google.com -> Add project -> add a **Web app** and copy the config into `.env`.
2. Build -> Authentication -> Sign-in method: enable **Phone**, **Google**, **Email/Password**.
3. Authentication -> Settings -> Authorized domains: add `localhost` and your Vercel domain.
4. Authentication -> Phone -> **Phone numbers for testing**: add `+27 71 234 5678` with code `123456` (free, no SMS cost while building).
5. Build -> Storage -> Get started. Rules for now:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile photos: any logged-in user can view, only the owner can upload images under 8 MB
    match /users/{uid}/photos/{file} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid
                   && request.resource.size < 8 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    // Verification selfies: the owner can upload, NOBODY can read. Only the backend (admin SDK) can.
    match /users/{uid}/verification/{file} {
      allow read: if false;
      allow write: if request.auth != null && request.auth.uid == uid
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Flow
`/` -> `/login` -> `/onboarding/profile -> photos -> interests -> location` -> `/discover`

## Notes
- Profile saves to `PUT /api/profiles/me` once Django is running (Week 3). Until then it falls back to localStorage so you can test the full flow.
- Photos upload to Firebase Storage under `users/{uid}/photos/`.
- 18+ is enforced by date of birth in step 1. Re-check it on the backend too.

## Week 2: swipe feed
- `/discover`: swipe a card left (pass) or right (like), or use the buttons. Tap the left or right of a photo to browse photos.
- Match popup when both people like each other. `/matches` lists matches and lets you unmatch.
- Needs the Django backend running and `VITE_API_URL` set (for example `http://localhost:8000`).
- Free users get 10 swipes a day. Super likes return a "Premium" message until payments are added.

## Week 3: chat, safety, alerts
- `/chat/:matchId`: live chat over WebSocket with read receipts, history paging and auto-reconnect. The Firebase token is sent as the first socket message, never in the URL.
- Report or block from inside any chat. Blocking ends the match for both people and hides them from Discover.
- `/notifications`: matches and new messages, with an unread badge on the Alerts tab (checked every 30 seconds).
- Set `VITE_WS_URL` (for example `ws://localhost:8000`, or `wss://your-backend` in production).

## Week 4: Premium and VIP payments
- `/premium`: plans and prices come from the backend, so you change prices in one place. Checkout opens on Paystack.
- `/payment/callback`: Paystack sends people back here. The page confirms the payment with the backend and keeps checking for up to 20 seconds in case the webhook is slow.
- The Discover header shows "Go Premium" for free users, and the daily-limit screen links to the plans.

## Legal pages
- `/privacy` and `/terms` are public. Text lives in `src/content/legal.js` (one source for the app and the lawyer's copy).
- Fill in every `[BRACKETED]` item. The pages show a red DRAFT banner until none are left.
- `npm run export-legal` writes `LEGAL_DRAFTS_FOR_LAWYER.md` with notes for your lawyer.
- Step 1 of onboarding requires ticking the consent box. The backend records when, and which version (`TERMS_VERSION` in the backend settings). Bump it whenever you publish new text.

## Photo verification
- `/verify`: the person agrees, gets a random pose, takes a selfie (shrunk in the browser, GPS data removed) and sends it. A reviewer approves or rejects it in the backend admin.
- A gold badge shows on swipe cards, the matches list and chat headers.
- **Update your Firebase Storage rules** to the ones above. The old single rule let any logged-in user read selfies.

## Edit profile
- `/profile/edit` (Settings → Edit profile): name, gender, what you're looking for, bio, interests, location and photos (add, remove, make main).
- Date of birth is locked, because it is the 18+ check.
- Adding a new photo removes the gold badge until the person verifies again. Removing or reordering photos keeps it.
- Every uploaded photo is shrunk to a JPEG in the browser, which also strips hidden GPS data. Removed photos are deleted from Storage.

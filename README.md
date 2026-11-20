# Agoza (አጎዛ)

Ethiopia's verified peer-to-peer marketplace — buy, sell and swap phones, vehicles,
electronics, fashion, property and more, with safe in-person exchange hubs.

Built with React 19, Vite, Tailwind CSS 4 and (optionally) Firebase.

## Run locally

Prerequisites: Node.js 20+

```bash
npm install
cp .env.example .env.local   # then fill in the values you have
npm run dev                  # http://localhost:3000
```

Firebase is optional. Without `VITE_FIREBASE_*` values the app runs in **offline demo
mode**: browsing, filters, offers and chat work against local data, and sign-in shows a
friendly "accounts unavailable" message.

## Scripts

| Command           | What it does                    |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start the dev server            |
| `npm run build`   | Production build into `dist/`   |
| `npm run preview` | Serve the production build      |
| `npm run lint`    | Type-check with `tsc --noEmit`  |

## Languages

UI strings live in `src/i18n/` and cover English, Amharic (አማርኛ), Tigrinya (ትግርኛ),
Afaan Oromoo and Somali. English is the source of truth; any key missing in another
language falls back to English automatically. Non-English strings should be reviewed by
native speakers before launch.

## Security notes

- Deploy `firestore.rules` with the app. Admin rights come from `isAdmin: true` on
  `users/{uid}`, which only the Firebase console / Admin SDK can set.
- `VITE_GEMINI_API_KEY` is bundled into client JavaScript and is visible to anyone.
  For production, move Gemini calls behind a server/Cloud Function and restrict the key.

## License

MIT

# Buddy Card Generator

Internal workshop tool for the **Manager Makes Movers** program. Participants
enter their company domain, build a Buddy Card (photo, interests, rituals,
what they can offer / need), download it, then match with two buddies to
generate a combined Buddy Team card.

Not a SaaS product, not a production system — a lightweight static site
(GitHub Pages) backed by a Google Sheet through Google Apps Script.

## Stack

React + Vite · Tailwind CSS · React Hook Form · html2canvas · Google Apps
Script · Google Sheets · localStorage (draft persistence only)

## 1. One file to customize: `src/config.js`

Everything editable — the Apps Script URL, export sizes, theme colors,
template image paths, required ritual count, emoji list — lives in
`src/config.js`. You should not need to touch any other file to re-skin the
app or point it at a new workshop's Sheet.

## 2. Set up the Google Sheet

Create a Google Sheet with a tab named `Sheet1` (or update `SHEET_NAME` in
`Code.gs`) with these exact column headers in row 1:

| Domain | Name | Avatar URL | Interests | Rituals | Contribute | Need |
|---|---|---|---|---|---|---|

Pre-fill **Domain** and **Name** for every participant before the workshop.
Leave the other columns empty — the app fills them in.

## 3. Deploy the Google Apps Script backend

1. Open your Sheet → **Extensions → Apps Script**.
2. Delete the boilerplate and paste the contents of
   `google-apps-script/Code.gs`.
3. Click **Deploy → New deployment**.
4. Type: **Web app**.
5. Execute as: **Me**.
6. Who has access: **Anyone** (required for the static site to reach it
   without a login flow).
7. Click **Deploy**, authorize the requested permissions, and copy the
   **Web app URL** — it looks like
   `https://script.google.com/macros/s/AKfycb.../exec`.
8. Paste that URL into `GOOGLE_SCRIPT_URL` in `src/config.js`.

> Redeploy (**Deploy → Manage deployments → Edit → New version**) any time
> you change `Code.gs` — editing the script alone doesn't update a live
> deployment.

## 4. Local development

```bash
npm install
npm run dev
```

Open the printed local URL. The app will call your Apps Script URL directly
from `localhost`, which works since Apps Script Web Apps don't enforce CORS
origin checks for simple GET/text-plain POST requests.

## 5. Replace the template assets (optional but recommended)

Swap these files in `public/assets/` with your real designs — same
filenames, no code changes needed:

- `personal-card-template.png` — Step 1 & 2 card background
- `buddy-team-template.png` — Step 3 combined card background
- `logo.png` — shown in the header and on both cards
- `default-avatar.png` — placeholder before someone uploads a photo

## 6. Deploy to GitHub Pages

1. In `vite.config.js`, set `base` to `/<your-repo-name>/` (or `/` if this
   is a user/org page or custom domain).
2. Push this project to a GitHub repository.
3. Run:

   ```bash
   npm install
   npm run deploy
   ```

   This builds the app and pushes `dist/` to a `gh-pages` branch using the
   `gh-pages` package already included in `package.json`.
4. In the repo's **Settings → Pages**, set the source to the `gh-pages`
   branch (root).

Alternatively, use a GitHub Actions workflow if you prefer CI-based
deploys — any standard "Vite → GitHub Pages" action works unchanged since
this is a plain static build.

## Project structure

```
src/
  components/     Reusable UI: AvatarUploader, InterestTags, RitualEditor,
                   CardPreview, BuddyPreview, Layout, StepHeader, Button
  pages/           Login, Step1, Step2, Step3 — one per flow step
  services/        googleApi.js (all Sheet I/O), renderService.js (PNG export)
  hooks/           useUserData (global state + localStorage), useDebouncedValue
  utils/           imageUtils.js (avatar crop/resize/compress), validators.js
  config.js        Every editable setting — see section 1 above
google-apps-script/
  Code.gs          Backend REST API (paste into Apps Script editor)
```

## Notes on design decisions

- **No backend server, no auth.** The Google Apps Script Web App *is* the
  backend. Anyone with the link can use the tool, matching the "internal
  event tool" scope.
- **Avatars are stored as compressed base64 JPEGs directly in the Sheet
  cell** (not uploaded to Drive), since that keeps the whole system to a
  single Sheet with no additional service to configure. Photos are
  auto-cropped square, resized, and compressed client-side to stay well
  under Google Sheets' ~50,000-character cell limit.
- **Drafts persist to localStorage** so a browser refresh mid-workshop
  doesn't lose someone's in-progress card. The Sheet itself is only updated
  when the user clicks Save or Download.
- **The Card is a live React component, not a flattened image** — every
  field renders from real data, and the exact same component is used for
  on-screen preview and for the html2canvas PNG export.

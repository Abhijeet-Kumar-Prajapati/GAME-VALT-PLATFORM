# GameVault — Mobile Gaming Platform

A **mobile gaming platform** built for the Indian mobile gaming community.
Discover games, join tournaments with real prize money, climb the leaderboard
and connect with players.

Built by **Abhijeet** — no build step, no framework, no dependencies.

---

## 🚀 Quick start

```bash
node server.js
```

Open **http://localhost:8080**

> Plain HTML + CSS + JavaScript. No `npm install` needed.
> You can also just double-click `index.html`.

---

## 📄 Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page — hero, trending games, live tournaments, payment, community buzz |
| `games.html` | Game library — search, genre filters, sorting, favourites, detail modal |
| `tournaments.html` | Tournament hub — filters, squad registration, **UPI payment**, fair-play policy |
| `leaderboard.html` | All-time + monthly leaderboards, podium, rank system |
| `community.html` | Social feed — post, like, comment, filter, search |
| `news.html` | Gaming news feed |
| `profile.html` | Player profile — rank, squads, library, posts |

---

## 📁 Structure

```
mobile-gaming-platform/
├── index.html
├── games.html
├── tournaments.html
├── leaderboard.html
├── community.html
├── news.html
├── profile.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js      ← ⚙️ YOUR DETAILS LIVE HERE
│   ├── data.js        games, tournaments, leaderboard, seed data
│   ├── app.js         auth, payment, nav, modals, teams, community
│   └── pages.js       page renderers
├── server.js          dev static server
├── README.md
└── LICENSES.md
```

---

## ⚙️ Configuration — change your details in ONE place

Everything personal lives in **`js/config.js`**:

```js
const SITE = {
    ownerName: 'Abhijeet',
    ownerFullName: 'Abhijeet',

    phone: '<your-number>',
    phoneIntl: '<your-phone>',
    phoneDisplay: '<your-phone>',
    whatsapp: '<your-number>',

    email: '<your-email>',

    upiId: '<your-upi-id>',
    upiName: 'Abhijeet',

    supportHours: '10 AM – 10 PM IST'
};
```

Change it once and it updates across **every page** — footers, contact
sections, payment panels and the owner account.

---

## 💳 Payment system (UPI)

Built around your mobile number. **No gateway, no backend, no monthly fee.**

| | |
|---|---|
| UPI ID | `<your-upi-id>` |
| Payee name | Abhijeet |
| Phone / WhatsApp | <your-phone> |
| Email | <your-email> |

**How it works:**
1. Player registers a squad and picks a tournament
2. The registration modal shows a **"Pay with UPI App"** button
3. Tapping the button opens Google Pay / PhonePe / Paytm / any bank app with the **amount already filled in**
4. Player sends the payment screenshot on WhatsApp
5. You verify and confirm the slot

**Also included:**
- One-tap copy of the UPI ID
- One-tap copy of the full payment link
- One-tap payment that opens the UPI app directly (no third-party QR library)
- Automatic amount detection from the tournament entry fee

> Most Indian banks let you use `UPI ID = 10-digit mobile number + @bankhandle`.
> If your UPI ID is different, just change `SITE.upiId` in `js/config.js`.
>
> ⚠️ Always test with a small amount first to confirm your UPI ID resolves correctly.

---

## 🎮 Features

**Game library — 10 titles**
Free Fire MAX, BGMI, COD Mobile, MLBB, Valorant Mobile, PUBG Mobile,
Clash Royale, Minecraft, Clash of Clans, Genshin Impact.
Search, genre filter, sort by trending/rating/downloads/name, favourites
library, and a full detail modal with modes and stats.

**Tournaments**
6 seeded events (live / open / filling / ended) with live slot tracking,
prize pool, entry fee, schedule and rules.
Squad registration auto-generates the correct number of player slots based on
the tournament mode (solo 1v1 → team 5v5), and validates member count,
duplicate squad names and tournament capacity.

**Leaderboards**
All-time and monthly boards with a 3-place podium, win-rate bars, and the
full rank tier system from Bronze up to Ace Dominator.

**Community**
Social feed with categories (Highlight / Clutch / Guide / Question /
Announcement / Rant), posting, likes, threaded comments, search and filter,
plus a squad-finder sidebar.

**Accounts**
Register / sign in with validation, persistent sessions, editable profile
(username, email, main game, rank), and a dashboard showing wins, squads,
library and posts.

**Design**
Dark neon gaming aesthetic — deep-space background with radial glows and a
subtle grid, Orbitron/Rajdhani/Inter typography, glassmorphism surfaces and
gradient accents. Fully responsive down to 360px with a mobile drawer nav.

All game artwork and avatars are **generated as inline SVG** — no external
image files, nothing to break.

---

## 🔑 Owner account

```
Email:    <your-email>
Password: abhijeet943935
```

Other sample players use `demo1234`.

> ⚠️ This password is in `js/data.js` as seed data. **Change it before
> publishing** if you don't want it publicly known.

---

## 💾 Data storage

Everything persists in `localStorage` under the `gv_` prefix:

| Key | Holds |
|---|---|
| `gv_users` | Accounts |
| `gv_session` | Current logged-in user |
| `gv_teams` | Squad registrations |
| `gv_posts` | Community posts + comments |
| `gv_favorites` | Games in the user's library |
| `gv_news` | News articles |
| `gv_liked_posts` | Which posts the user liked |

To reset everything, run `localStorage.clear()` in the browser console.

> **Note:** this is a front-end-only site, so data is per-browser. For real
> multi-user tournaments with a shared admin view, you'd add a backend. The
> `Store`, `Auth` and `Teams` objects in `js/app.js` are the single place to
> swap `localStorage` for API calls.

---

## 🌐 Deploying

Pure static files — no build required. Drop the folder on any host:

- **Netlify Drop** — https://app.netlify.com/drop *(fastest)*
- **Netlify** — drag the folder into the dashboard
- **Vercel** — `npx vercel --prod`
- **GitHub Pages** — push to a repo, then Settings → Pages → deploy from branch
- **Cloudflare Pages** — connect the repo, no build command needed

Remember to update `SITE` in `js/config.js` before going live.

# Amit Automation Suite — website

Static marketing and legal site for **Amit Automation Suite (AAS)**, the Windows
desktop tender-management application.

**Live at <https://amitsuite.github.io/>**

Plain HTML, CSS and one small JavaScript file. No build step, no framework, no
package manager, no backend. The pages load only their own CSS, JS and images —
nothing third-party loads unless a visitor explicitly asks for the map.

---

## Pages

| File | URL | Purpose |
|---|---|---|
| `index.html` | `/` | Home — hero, six product areas, workflow, security panel |
| `features.html` | `/features.html` | Module-by-module feature breakdown |
| `how-it-works.html` | `/how-it-works.html` | One tender followed end to end |
| `about.html` | `/about.html` | Product background, principles, technology, requirements |
| `contact.html` | `/contact.html` | Contact cards, message form, map, **comments** |
| `privacy.html` | `/privacy.html` | Privacy Policy (Google OAuth / Calendar disclosure) |
| `terms.html` | `/terms.html` | Terms of Service |
| `404.html` | any missing URL | Not-found page, served automatically by GitHub Pages |

## Folder structure

```
aas-website/
├── index.html · features.html · how-it-works.html · about.html
├── contact.html · privacy.html · terms.html · 404.html
├── assets/
│   ├── css/styles.css          single stylesheet, design tokens at the top
│   ├── js/main.js              CONFIG block at the top — edit that, not the rest
│   ├── data/comments.json      APPROVED comments only (see below)
│   └── img/                    favicons, app icon, product logo, OG card
├── favicon.ico · site.webmanifest · robots.txt · sitemap.xml
├── .nojekyll                   tells GitHub Pages to skip Jekyll
└── README.md
```

---

## ⚠️ One thing still to do: the WhatsApp link

Open `assets/js/main.js`. The very first setting is:

```js
whatsappLink: '',
```

Paste your **WhatsApp Business short link** between the quotes, e.g.

```js
whatsappLink: 'https://wa.me/message/ABCD1234EFGH1',
```

Get it in **WhatsApp Business → Settings → Business tools → Short link**.
A short link keeps your phone number completely hidden — it never appears on
the page, and it is not in the page source either.

**While this is empty, every WhatsApp button on the site stays hidden.** That is
deliberate: a dead link is never shown to a visitor. Once you paste the link, all
of these appear at once, with no other edits:

- the floating green button, bottom-right of every page
- the WhatsApp card on the Contact page
- the WhatsApp entry in every footer
- the WhatsApp line in the Privacy and Terms contact sections

**One limitation, so it is not a surprise:** WhatsApp short links cannot carry a
pre-filled message — that is WhatsApp's restriction, not this site's. So the
contact form's "Send on WhatsApp" button stays hidden with a short link, and the
form uses email instead. If you ever paste a plain number link
(`https://wa.me/91XXXXXXXXXX`) the WhatsApp send button appears automatically —
but then the number *is* visible in the page source.

---

## How the message form works

There is no server, so nothing is submitted anywhere. Pressing **Send message**
validates the fields, assembles the text, and opens the visitor's **own email
app** with everything filled in. They press send, so it arrives from their real
address and they keep a copy.

This is why the Privacy Policy can honestly say the site stores nothing.

To switch to real background submission later you would add a service such as
Web3Forms or Formspree — that is a third-party dependency and
[section 10.1 of the Privacy Policy](privacy.html) would need updating to match.

---

## Comments: nothing is published without your approval

The flow is deliberately manual, because that is what "approve first" means with
no backend:

1. A visitor fills the comment form on `contact.html`.
2. Their email app opens with the comment addressed to you. They send it.
3. **It does not appear on the site.** Nothing was written anywhere.
4. If you want it public, add it to `assets/data/comments.json` and push.

To publish a comment, add an object to the `comments` array:

```json
{
  "comments": [
    {
      "name": "R. Sharma",
      "company": "Sharma Constructions",
      "date": "2026-08-30",
      "message": "First paragraph.\n\nSecond paragraph.",
      "reply": "Thanks — the EMD screen is on the list.",
      "replyDate": "2026-08-31"
    }
  ]
}
```

- `name`, `date` and `message` are required; everything else is optional.
- `reply` / `replyBy` / `replyDate` render your answer indented beneath it.
- `"approved": false` hides an entry without deleting it.
- Comments sort newest-first automatically, so order in the file does not matter.
- **Everything in this file is public** the moment it is pushed. Never paste a
  commenter's email address or phone number into it.

The page renders comments with `textContent`, never `innerHTML`, so a comment
cannot inject markup or script even if one slipped through.

Comments are fetched over HTTP, so opening `contact.html` directly from disk
(`file://`) shows "no comments yet" — that is the browser blocking a local
fetch, not a bug. Use the local server below.

---

## Local preview

```bash
python -m http.server 8080
```

Then open <http://localhost:8080/>.

---

## The map

The Contact page shows Google Maps **only after the visitor presses "Show the
map"**. Until then nothing is requested from Google, which is what keeps the
"no third-party content" claim in the Privacy Policy true.

The location is set by `mapEmbed` in the `CONFIG` block of `assets/js/main.js`.

**The written address on the site is deliberately only "Delhi, India"** — the
street address is not published anywhere, including in the page's structured
data. Be aware of the one gap that leaves: the map pin is on the exact building,
and Google displays the full street address inside the embed once a visitor
loads it. The "Open in Google Maps" link on `contact.html` does the same.

If you want nothing to pinpoint the office, `main.js` has a ready-to-paste
city-level `mapEmbed` in the comment right above the current one — swap it in and
delete the "Open in Google Maps" link.

---

## Google OAuth verification

`privacy.html` supports Google's OAuth verification for the Calendar Sync
feature. Two things Google checks:

- The **privacy policy URL must be on the same domain as the app's homepage** —
  both are on `amitsuite.github.io`, so keep them together.
- The policy must **name the scope and justify it**. It does:
  `https://www.googleapis.com/auth/calendar`, justified by the fact that the
  feature creates and deletes events, which a read-only scope cannot do.

The Limited Use disclosure is section 6 of the policy.

---

## Content rules used here

Everything factual comes from the AAS repository — `CLAUDE.md`, the `Services/`
layer, `AboutWindow.xaml`, `AmitAutomationSuite.csproj` and the SRS. No
certification, customer, revenue, accreditation or capability is claimed that
does not exist.

- Modules **designed but not built** (Tender Submission Helper) are labelled
  *In development* wherever they appear.
- Screens that are **placeholders in the shipped app** (EMD Management, EMD
  Refund, Reports) are not presented as delivered features.
- Figures in the hero illustration are **examples**, and are captioned as such.

If a module ships, update `features.html` (status tag) and `index.html` (card)
together so the two pages cannot disagree.

---

## Design

Colours come from the application's own `Themes/LightTheme.xaml` — navy
`#1F4E79`, blue `#2E75B6`, gold `#D4A843` — so site and product match. All tokens
sit in the `:root` block at the top of `assets/css/styles.css`, with a dark-mode
override that follows the visitor's system setting.

Three tokens are deliberately **darker than the app's** values, and the hero
gradient's light end is capped at `#1C4666`: the app's brighter tones cannot
carry their own text at WCAG AA on a web page. Every text/background pair on the
site clears 4.5:1.

Type is a system font stack — no webfont request, and Segoe UI on Windows matches
the desktop application.

### Motion

Everything below is switched off automatically for visitors who have "reduce
motion" enabled in their operating system:

| | |
|---|---|
| Hero | staggered entrance on load, one slow sheen across the panel |
| Dashboard illustration | gentle float; the figures count up when first scrolled into view |
| Sections | fade-and-rise on scroll, with cards in a grid staggered 70 ms apart |
| How It Works | the vertical rule between steps draws itself downward |
| Cards | lift, gold hairline along the top, icon tilts and scales |
| Navigation | underline grows from the left; mobile menu drops in |
| Buttons | arrow nudges forward |
| Chrome | gold scroll-progress bar, back-to-top button, WhatsApp pulse (twice, then it stops), map pin bounce |

The counters read their target from the markup and the final value is also the
value written in the HTML, so if JavaScript never runs the figures are still
correct — and a `setTimeout` guarantees the real number lands even if the
animation is interrupted by the tab going to the background.

---

© 2026 Amit Jain. All rights reserved.

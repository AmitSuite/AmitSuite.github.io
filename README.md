# Amit Automation Suite — website

Static marketing and legal site for **Amit Automation Suite (AAS)**, the Windows
desktop tender-management application.

Plain HTML, CSS and a single small JavaScript file. No build step, no framework,
no package manager, no third-party requests at run time — the pages load only
their own CSS, JS and images.

---

## Pages

| File | URL | Purpose |
|---|---|---|
| `index.html` | `/` | Home — hero, six product areas, workflow, security panel |
| `features.html` | `/features.html` | Module-by-module feature breakdown |
| `how-it-works.html` | `/how-it-works.html` | One tender followed end to end |
| `about.html` | `/about.html` | Product background, principles, technology, requirements |
| `privacy.html` | `/privacy.html` | Privacy Policy (includes the Google OAuth / Calendar disclosure) |
| `terms.html` | `/terms.html` | Terms of Service |
| `contact.html` | `/contact.html` | Contact details (no form — the site has no backend) |
| `404.html` | any missing URL | Not-found page, served automatically by GitHub Pages |

## Folder structure

```
aas-website/
├── index.html · features.html · how-it-works.html · about.html
├── privacy.html · terms.html · contact.html · 404.html
├── assets/
│   ├── css/styles.css        single stylesheet, design tokens at the top
│   ├── js/main.js            nav, scroll reveal, footer year — no dependencies
│   └── img/                  favicons, app icon, product logo, OG card
├── favicon.ico               root favicon (browsers request this by default)
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── .nojekyll                 tells GitHub Pages to skip Jekyll
└── README.md
```

## Local preview

From this folder:

```bash
python -m http.server 8080
```

Then open <http://localhost:8080/>. Opening the `.html` files directly with
`file://` also works, because every link and asset path is relative.

---

## ⚠️ Before publishing: set the real site URL

Absolute URLs are needed for `rel="canonical"`, Open Graph tags, `sitemap.xml`
and `robots.txt`. They currently use the placeholder:

```
https://amitautomationsuite.github.io
```

**Replace that with the real address** everywhere before going live. From this
folder in PowerShell:

```powershell
$old = 'https://amitautomationsuite.github.io'
$new = 'https://YOUR-REAL-DOMAIN'          # no trailing slash
Get-ChildItem -Recurse -Include *.html,*.xml,*.txt | ForEach-Object {
    $t = [IO.File]::ReadAllText($_.FullName)
    if ($t.Contains($old)) {
        [IO.File]::WriteAllText($_.FullName, $t.Replace($old, $new), (New-Object Text.UTF8Encoding $false))
        "updated $($_.Name)"
    }
}
```

If the site is published as a **project site** (`https://user.github.io/repo/`)
rather than a user site, the base URL must include the repository path — for
example `https://user.github.io/aas-website`. Relative paths inside the pages
handle the subfolder correctly on their own; only these absolute URLs need
changing.

## Publishing to GitHub Pages

1. Create a repository and push the contents of this folder to its default branch.
2. Repository **Settings → Pages → Build and deployment**: source *Deploy from a
   branch*, branch `main`, folder `/ (root)`.
3. Wait for the first deploy, then set the real URL as described above and push
   again.
4. For a custom domain, add a `CNAME` file containing the bare domain and
   configure DNS. (No `CNAME` file is included — none is needed until a domain
   exists.)

## Google OAuth verification

`privacy.html` is written to support Google's OAuth verification for the
Calendar Sync feature. Two things Google checks:

- The **privacy policy URL must be on the same domain as the app's homepage**.
  Both are on this site, so keep them on one domain.
- The policy must **name the scope requested and justify it**. It does:
  `https://www.googleapis.com/auth/calendar`, justified by the fact that the
  feature creates and deletes events, which a read-only scope cannot do.

The Limited Use disclosure required by the Google API Services User Data Policy
is section 6 of the policy.

## Content rules used here

Everything on the site is taken from the AAS repository — `CLAUDE.md`, the
`Services/` layer, `AboutWindow.xaml`, `AmitAutomationSuite.csproj` and the SRS.
No certification, customer, revenue, security accreditation, integration or
capability is claimed that does not exist.

- Modules that are **designed but not built** (Tender Submission Helper) are
  labelled *In development* wherever they appear.
- Screens that are **placeholders in the shipped app** (EMD Management, EMD
  Refund, Reports) are not presented as delivered features.
- Figures in the hero illustration are **examples**, and are captioned as such.

If a module ships, update `features.html` (status tag) and `index.html` (card)
together so the two pages cannot disagree.

## Design

Colours come from the application's own WPF theme
(`src/AmitAutomationSuite/Themes/LightTheme.xaml`) so the site and the product
match: navy `#1F4E79`, blue `#2E75B6`, gold `#D4A843`. All tokens live in the
`:root` block at the top of `assets/css/styles.css`, with a dark-mode override
that follows the visitor's system setting.

Type is a system font stack — no webfont request, and Segoe UI on Windows
matches the desktop application.

---

© 2026 Amit Jain. All rights reserved.

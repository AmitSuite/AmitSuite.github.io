# Website refresh — bring amitsuite.github.io up to AAS as of 22-10-2026

**Objective** — the public site still describes AAS as it was on 31-08-2026
(14 sidebar modules, Submission Helper "In development", EMD Management /
EMD Refund / Reports called placeholders). AAS now ships **27 modules**. Bring
every page to the current product, without claiming anything that is not built.

**Why** — the site is the product's public face and the Google OAuth
verification target. Stale capability claims and a now-false "never handles a
digital signature" line in the Terms are the two real problems.

**Source of truth** — `C:\Users\Aanya\Projects\AmitAutomationSuite`:
`MainWindow.xaml.cs` (`_viewFactory` / `_titles` / `DefaultNav`) for the module
list, `AAS_STATUS_SNAPSHOT.md` §3 for per-feature status and §3.15 / §12 for
what is **not** built. Where the snapshot contradicts itself, the newer dated
row and `MainWindow` win (§12 A.0 warns several §12 rows went stale).

## Scope

- `index.html` — product-area cards, security panel
- `features.html` — full module breakdown, status tags
- `how-it-works.html` — the workflow now runs through more screens
- `about.html` — module count / scope sentence
- `terms.html` §5 — the automation-limits list (now partly false)
- `privacy.html` — only if a claim there is contradicted
- `sitemap.xml` lastmod

Out of scope: design, layout, colours, WhatsApp/map/comments/form, the
Drive Backup tool (a repo tool, not a user-facing AAS module).

## Authorized scope and constraints

- Content edits only. No CSS/JS changes, no new pages, no layout rework.
- Every claim must trace to `MainWindow` nav or a snapshot §3 row.
- Keep existing tone, heading structure, component classes and the factual
  discipline already on the site (no invented customers, certifications,
  integrations or metrics).
- Keep the hero illustration's figures as examples with their caption.

## Checks

- `python -m http.server` + the audit script: links, anchors, assets, a11y, SEO
- 320 / 768 / 1440 px, light + dark — no horizontal overflow
- grep the site for every removed claim ("In development", "placeholder",
  "digital signature", module names) and confirm nothing stale survives

## Tasks

- [ ] T1 — `features.html`: replace the six-area breakdown with the current
      module set; correct every status tag. Route: delegated.
- [ ] T2 — `index.html`: product-area cards + security panel. Route: delegated.
- [ ] T3 — `how-it-works.html`: workflow through the current screens.
      Route: delegated.
- [ ] T4 — `about.html` scope sentence + `terms.html` §5 automation limits.
      Route: delegated.
- [ ] T5 — verify: audit, responsive, stale-claim grep. Route: inline (parent).

## The 27 modules, as `MainWindow` lists them

DATA — Dashboard · Workspace · Tender Calendar · Google Calendar · Search ·
Tender Analysis · Master Data · Import Data · Archived Tenders ·
Salary Register · Stamp Paper Register

AUTOMATION — Process EMD · EMD Management · EMD Refund ·
Bank Statement Analyser · Generate Documents · Document Parser · CPPP Scraper ·
Document Downloader · Reader · Submission Helper · Tender Status ·
Bid History Sync · After award · GST Invoices

REPORTS — Tender Reports   SETTINGS — Configuration

## Corrections that must land

1. **Submission Helper is built** — 8-tab workspace, 17-step portal plan,
   cover/slot planning, Java utility fill, bid acknowledgement capture and
   write-back. Remove every "In development" tag and the design-only wording.
2. **EMD Management, EMD Refund and Reports are real screens**, not
   `PlaceholderView`. Remove the callout in `features.html` that says so.
3. **Automation limits changed.** Still true: CAPTCHA is never filled or
   bypassed; Freeze and the final bid submission are operator-only. **No longer
   true:** "never applies a digital signature". AAS can type the DSC PIN when
   the operator switches that on and has saved the PIN, and it can press
   Sign & Upload inside the portal's Java utility (a fill-only button exists
   that stops before it). `terms.html` §5 and the home security panel must say
   this accurately.

## Still not built — never claim these

EMD refund *analytics* beyond what the screen does · plugin loader ·
AI API providers (Gemini/OpenAI/Claude keys — the AI path is a browser handoff,
not an API) · Windows toast / tray / email notifications · Workspace auto-add.

Several modules are implementation-complete but **not yet verified against the
live portal**. Do not claim live-proven reliability; describe what the software
does, not how well it has been field-tested.

## Progress

- Parent read the snapshot and nav 22-10-2026; facts above are verbatim from
  those sources.
- Next: T1–T4 to one writer, then T5 here.

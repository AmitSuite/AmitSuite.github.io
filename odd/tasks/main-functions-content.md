# Pass 2 — main functions per screen (verified content for the writer)

Source: `AAS_STATUS_SNAPSHOT.md` §4 (UI / navigation map) and §3 (feature
matrix), plus `MainWindow.xaml.cs`. Every line below is taken from those; the
writer must not add actions that are not here.

**Where this goes**: into the existing per-module cards in `features.html`, as
`.card__list` items. No new page, no nav change. Keep each list to the actions
below — these are the ones an operator uses, not every button (the application
has 824 button elements; this is deliberately the main set).

**Wording rule**: describe the action, not the widget. "Download tender
documents into the tender's folder", not "press the Download button".

---

## Data

**Dashboard** — tender counts (total, today, upcoming, overdue); EMD committed,
refund pending, refunded and held; zone-wise and division-wise EMD summaries;
stage-wise summary; recent tenders; click any figure to drill into that list;
Customize chooses which widgets and columns show.

**Workspace** — a queue of tenders you are working on; for the selected tender,
six step cards (documents downloaded, NIT analysed, documents generated, EMD
paid, submitted, result), each opening the screen that does that step; read the
NIT with AI; open the portal packet; mark submitted; save the result.

**Tender Calendar** — Month, Week, Day and Agenda views over stored tender
dates; filters; "Show on cards" chooses which tender fields appear on a card;
open a card in place; expand to full screen; Go to Tender; reminders and
upcoming deadlines beside the calendar.

**Google Calendar** — connection health and "will Google notify you?"; next
seven days; folds for all events, event rules, which tenders are sending,
sync history and check-against-Google; Sync Now; send a test notification;
choose how Google notifies you; Reconfigure reopens the setup wizard.

**Search** — one box (Ctrl+K); Quick status filters (twelve, including draw
done or upcoming, EMD made or not made, refund pending or received, submitted,
result awaited, won, cancelled or retender, in Workspace); More filters for
result, submission, EMD, draw, portal status, analysis and location; Include
archived; Clear; Show results opens them in their own window; saved search
cards; right-click Go to Tender.

**Tender Analysis** — the imported tender list; show, hide, reorder, resize and
freeze columns with the layout remembered; per-column filters and click-sort;
row highlighting by your own rules; full-screen grid.

**Master Data** — promoted tenders in two tabs, Master Data and Submitted, each
with its own counts.

**Import Data** — six steps: File & Worksheet, Select Columns, Map, Preview,
Summary, Results; import presets; download a blank template with an AI prompt
for converting an old register; update AAS from a filled template with a
per-row preview, conflict handling and AAS's own recommendation per field.

**Archived Tenders** — the archived list with Restore, open detail and delete;
archiving happens automatically by your rule or by hand, with a note.

**Salary Register** — employee salary records, with settings for how they are
calculated.

**Stamp Paper Register** — stamp paper stock and what each sheet was used for.

## Automation

**Process EMD** — status chips and the EMD grid; Unmatched reads inbox; opens
the EMD Execution window, which signs in to IFMIS, fills the EMD form, assists
through the payment gateway and net banking, captures the receipt PDF and
writes the result back to the tender.

**EMD Management** — every EMD record with a summary line.

**EMD Refund** — refund records and which refunds are still pending.

**Bank Statement Analyser** — import statements for several banks and accounts;
All / EMDs / Others views; duplicate transactions removed per transaction, not
per file; for a flagged row, why it was flagged and ranked tender suggestions;
Confirm, Choose tender, Find tender, Not an EMD payment, or keep it.

**Generate Documents** — Select Tenders, then Review & Generate; one Word file
per batch, off-thread, with Stop; pre-flight marks every placeholder Resolved,
Missing or Not In Registry; affidavits and undertakings built from the NIT's own
wording; Template Builder edits templates.

**Document Parser** — four tabs: EMD Receipts (extracted values, suggested
tenders, Apply to Tender field by field), Bank Statements, Review Queue and
Parse History; reads text-layer PDFs, rasterises and OCRs the rest, cross-checks
two OCR engines, handles English and Hindi, and opens password-protected
statements.

**CPPP Scraper** — Stage 0 check-in and run history, Stage 1 search criteria
from a saved profile, Stage 2 the live run; you solve the CAPTCHA and press
Search; results are read page by page, details extracted, then every row marked
New, Duplicate or Changed before you choose what to import.

**Document Downloader** — Select, Queue & Download, Done; downloads the tender
ZIP and PDFs, unzips them and files them in the tender's folder; asks once if a
tender's documents are already downloaded; pauses for the CAPTCHA and resumes.

**Reader** — Select tenders, then Queue & read; the packet in tabs (Bid packet
technical and financial, Rates, Other documents); a status per document; change
which file a document uses; update packet data from the portal.

**Submission Helper** — a tender list, then eight tabs: Overview, Requirements,
Affidavits, Documents, EMD, Rates, Portal and Final check; a seventeen-step
portal plan you can switch step by step; cover and slot planning; fills the
portal's Java upload utility (with a fill-only option that stops before Sign &
Upload); captures the bid acknowledgement and writes it back.

**Tender Status** — Select (Our bids / Not bid), Queue & Check, Done; three
methods — signed in, public, or division-wise where one CAPTCHA covers a whole
division; reads the BOQ comparative chart for L1 and the bidder list; saves the
chart and PDF notices into the tender's folder; interprets the result without
ever silently overwriting a final one.

**Bid History Sync** — reads the portal's own bid list and tender-status list;
options for creating missing tenders and how much detail to read; a preview-only
run; Start, Stop after the current row, Finish; a summary card and a results
grid; fills empty fields only and never touches what you edited by hand.

**After award** — performance and advance guarantee (FDR) amounts per tender;
read the after-award terms from the NIT with AI; read the bank's FDR advice from
its PDF; generate the guarantee letter.

**GST Invoices** — the invoice register and a new invoice, numbered in sequence
and editable without losing its number.

## Reports

**Tender Reports** — filters by period, date basis, division, category, result
stage and value; eight summary cards; five tabs (overview charts, division and
category, bid comparison, tie tenders, data quality); a shared tender grid with
a detail panel; open the BOQ chart, the technical summary or the tender folder;
Excel export; print or save as PDF; re-read result files.

## Settings

**Configuration** — General settings (company, theme, folders, document
generation, templates, placeholders, document names); Admin settings behind a
password (company and bank accounts, portal and token sign-ins, import, column
defaults, business rules, master lists, automation engines, search, reminders);
highlighting rules for rows and fields; footer Back, Lock Admin and Save.

## Everywhere

Worth one short card of its own: right-click any tender grid for open detail,
portal link, folder, copy ID, add to download queue, read in Reader, check
tender status, generate documents, generate EMD, move to Master, add to or
remove from Workspace, archive and delete. Plus Back and Forward in the header,
Ctrl+K search, F1 for the shortcut list, full-screen grids, and a Live Progress
window that pops out of any long-running screen.

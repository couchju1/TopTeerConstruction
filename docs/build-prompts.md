# Top Teer Construction: Build Prompts

Run these in order. One prompt per Claude Code session (or Antigravity where labeled). Read the diff, run the checks, commit, then move to the next one.

## Brand colors (from Chad's logo)

The palette follows the logo: black, red, grey, white. Token names in
`src/styles/tokens.css` changed with it. When a prompt below says:

| Prompt says | Use token | Value |
|---|---|---|
| limestone (page background) | `--color-paper` | #F6F6F4 |
| spruce (dark band) | `--color-band` | #141414 |
| spruce-deep | `--color-band-deep` | #0A0A0A |
| limestone text on spruce | `--color-on-band` | #EDEDEA |
| brass (buttons, plumb line, accents) | `--color-accent` | #D0111F |
| brass-dark (small labels on light) | `--color-accent-dark` | #A30D18 |
| brass text on a dark band | `--color-accent-on-band` | #FF5A63 |

Primary buttons are red with **white** text (`--color-on-accent`), not ink: ink on red fails contrast.

## Before prompt 1

1. Make a new folder `topteer-site`, run `git init`.
2. Put these files in it:
   - `site.config.json` (repo root)
   - `tokens.css` -> `src/styles/tokens.css`
   - The plan doc exported as Markdown -> `docs/plan.md` (Phase 3 sitemap, Phase 4 design, Phase 5 copy deck live there)
3. Add `.gitignore` with `node_modules`, `dist`, `.env`, `.DS_Store`.
4. Photos Chad sends go in `src/assets/photos/raw/`. Never commit originals with GPS data. Prompt 4 strips it.

---

## Prompt 1: Scaffold, layout, header, footer

```text
[CLAUDE CODE] repo: topteer-site

GOAL
Scaffold an Astro static site for Top Teer Construction, a remodeling contractor in Tea, SD.
Every business fact (name, phone, towns, services, credentials) must come from
site.config.json. No hardcoded business data in components.

FILES
- astro.config.mjs (output: 'static', site: config.site.url, trailingSlash: 'always',
  build.format: 'directory')
- src/lib/config.ts: imports site.config.json, exports typed helpers. Add assertLaunchReady()
  that throws during `astro build` when NODE_ENV=production and any rendered value contains
  "[CONFIRM" or "[NEEDS CLIENT PROOF". In dev, render those values with a visible yellow
  outline so they're easy to spot.
- src/styles/tokens.css (already present, don't change values)
- src/styles/base.css: modern reset, body uses --font-body / --step-0 / --leading-body,
  headings use --font-display weight 600, left-aligned, ink on limestone background.
- Self-host Zilla Slab (500, 600) and Public Sans (400, 600) as woff2 in public/fonts/ with
  font-display: swap. Preload only Zilla Slab 600 and Public Sans 400.
- src/layouts/Base.astro: <html lang="en">, skip link "Skip to main content", <header>,
  <main id="main">, <footer>, slot for head meta.
- src/components/Header.astro: wordmark (text "Top Teer" in Zilla Slab 600 with
  "Construction" small caps below, as live text, not an image), nav (Remodeling, Additions,
  Decks, Siding & Trim, New Construction, Our Work, About), phone link (tel: E.164), brass
  "Free estimate" button. Shrinks with shadow-sm after 40px scroll. Mobile menu is a
  <button aria-expanded aria-controls> with a full-height panel, focus trapped while open,
  Esc closes and returns focus to the button.
- Current page in the nav gets aria-current="page" and the plumb-line marker: a 2px brass
  vertical rule to the left of the link with a small brass bob (CSS only).
- src/components/MobileBar.astro: fixed bottom bar under 48rem with two halves,
  "Call Chad" (tel:) and "Free estimate" (/free-estimate/). 56px tall. Hide it while the
  estimate form is in the viewport (IntersectionObserver). Add bottom padding to <body> so
  it never covers content.
- src/components/Footer.astro: CTA band (spruce background, limestone text, centered is
  allowed here only), then NAP, hours, service towns, Facebook link, privacy link,
  "(c) 2026 Top Teer Construction".

COPY
Global section of docs/plan.md, Phase 5.

ACCEPTANCE
- `npm run build` passes in dev mode. Production build fails while any [CONFIRM] value is
  rendered, and the error names the field.
- Keyboard: Tab order is skip link, wordmark, nav, phone, CTA. Mobile menu traps focus, Esc
  closes it.
- Lighthouse accessibility 100 on an empty page using the layout.
- No layout shift from fonts (size-adjust fallbacks for Georgia and system-ui).

DON'T
- No Tailwind, no UI kits, no icon fonts. Inline SVG for the few icons (phone, menu, close).
- No comments that explain what the code does. No console.log. No href="#".
- Don't center headings or hero text.

Commit: "Scaffold site layout, header, footer and mobile call bar"
```

---

## Prompt 2: Shared components

```text
[CLAUDE CODE] repo: topteer-site

GOAL
Build the shared components every page uses, with all states from docs/plan.md Phase 4
"Components and states".

FILES (src/components/)
- Button.astro: variants primary (brass bg, ink text, on spruce or limestone), secondary
  (1px ink outline). Renders <a> when href is given, <button type="button"> otherwise.
  States: hover, focus-visible (box-shadow var(--shadow-focus)), active (translateY 1px),
  disabled (aria-disabled, not clickable).
- Section.astro: props tone ("limestone" | "white" | "spruce"), width ("full" | "contained"),
  and an optional asymmetric grid preset ("7-5", "5-7", "8-4").
- ProofStrip.astro: three short facts in a row, wraps to one column under 36rem.
- ServiceList.astro: a ruled list (not cards). Each row: service name in Zilla Slab, one line
  description, arrow, link to the page. On hover/focus a 1:1 thumbnail slides in on the right
  (desktop only, opacity + transform, respects reduced motion).
- BeforeAfter.astro: two images stacked, a range input (0-100, step 5, aria-label "Before and
  after slider") controls a clip-path. Works with mouse, touch and arrow keys. With JS off,
  show both images one above the other with "Before" and "After" labels.
- ProcessSteps.astro: numbered <ol>. Desktop: horizontal track with the brass plumb line
  moving to the step nearest the viewport center (IntersectionObserver). Mobile: vertical
  list with the plumb line on the left. States: upcoming, active, done.
- Accordion.astro: native <details>/<summary> FAQ. Custom marker, focus-visible ring.
  Emits FAQ items to a slot so pages can build FAQPage JSON-LD from the same data.
- Reviews.astro: renders nothing unless config.reviews.items.length >= minimumToShow.
- CtaBand.astro: used before the footer on every page.
- Picture.astro: wraps astro:assets <Picture> with formats ['avif','webp'], widths
  [480,800,1200,1800], required alt prop (empty string allowed only with decorative={true}),
  and a priority prop that sets loading="eager" fetchpriority="high".

ACCEPTANCE
- A /dev/components/ page (excluded from build output and sitemap) shows every component in
  every state.
- axe DevTools: 0 violations on that page.
- BeforeAfter works with keyboard only and with JS disabled.
- prefers-reduced-motion: no transitions anywhere.

DON'T
- No carousels or auto-advancing sliders.
- No three-equal-card grids.
- No AI-style comments, no unused props.

Commit: "Shared components with all states"
```

---

## Prompt 3: Home page

```text
[CLAUDE CODE] repo: topteer-site

GOAL
Build src/pages/index.astro from docs/plan.md: Phase 3 Home section plan, Phase 5 Home copy.

LAYOUT
1. Hero: split 7/5 on desktop. Left: small "Based in Tea, SD" stamp (brass dark, uppercase,
   letter-spaced), H1, sub, primary "Get a free estimate" + secondary phone button. Right:
   hero photo, 4:5 crop on mobile shown ABOVE the text, 5:4 on desktop. Hero image is
   priority. Use src/assets/photos/placeholder-hero.jpg (flat limestone with the text
   "NEEDS REAL PHOTO") until Chad's photo lands.
2. ProofStrip directly under the hero, on white.
3. ServiceList with heading "What I build".
4. BeforeAfter with heading "One job, start to finish" and the caption below. Hide the whole
   section if no before/after pair exists in src/content/projects.
5. ProcessSteps "How a job goes" on spruce background, limestone text.
6. Chad intro: 5/7 split, photo left, first-person note right, link "More about me".
7. Reviews (renders nothing for now).
8. Service area: a simple inline SVG map of the towns as labeled dots around Sioux Falls
   (relative positions, not a map tile service), plus the paragraph.
9. CtaBand.

ACCEPTANCE
- Exactly one <h1>.
- At 375px: H1 and both CTAs visible without scrolling below the photo within one swipe,
  no horizontal scroll, all tap targets >= 44px.
- LCP element is the hero image. Lighthouse mobile performance >= 90 on `npm run preview`.
- Copy matches the plan word for word, including [CONFIRM] markers in dev.

DON'T
- Don't invent proof, numbers or reviews.
- No stock photos.

Commit: "Home page"
```

---

## Prompt 4: Photos pipeline and Our Work

```text
[CLAUDE CODE] repo: topteer-site

GOAL
Turn Chad's raw photos into a project gallery with real captions.

DO
1. scripts/prep-photos.mjs (run manually, not at build): reads src/assets/photos/raw/,
   strips all EXIF (especially GPS) with sharp, auto-orients, writes to
   src/assets/photos/projects/. Prints a list of files that are under 1600px wide so I know
   which ones can't be a hero.
2. Content collection src/content/projects/*.md with schema:
   title, town (enum of config.location.serviceTowns), service (enum of service slugs),
   date, cover, photos[] {src, alt, kind: "before" | "after" | "detail" | "wide"},
   caption (one plain sentence), featured (bool).
   Build fails if alt or caption is empty.
3. src/pages/our-work/index.astro: intro, filter chips (buttons with aria-pressed, filter in
   JS, all photos visible with JS off), masonry-style grid with mixed ratios using CSS
   columns, captions "[Town]. [caption]". Lightbox: <dialog>, arrow keys, Esc, focus returns
   to the thumbnail. Empty filter state copy from the plan.
4. Each service page gets a gallery of projects with that service (used in prompt 5).

ACCEPTANCE
- No photo in dist/ contains EXIF GPS data (check with exiftool in a test script).
- Gallery works fully with keyboard and with JS off.
- CLS < 0.1 on /our-work/ (all images have width/height).

Commit: "Photo pipeline and Our Work gallery"
```

---

## Prompt 5: Service pages

```text
[CLAUDE CODE] repo: topteer-site

GOAL
Build /remodeling/, /additions/, /decks/, /siding/, /new-construction/ from docs/plan.md
Phase 3 section plans and Phase 5 copy.

DO
- One template src/layouts/Service.astro, but each page must have one layout choice the
  others don't:
  - Remodeling: four sub-sections alternating 7/5 and 5/7, each with its timeline in a small
    brass-dark label. "Behind the wall" as a full-width spruce band.
  - Additions: "From sketch to keys" uses ProcessSteps vertically with a large step number.
  - Decks: the wood vs composite table as a real <table> with <caption>, scrollable on
    mobile inside a focusable region with aria-label.
  - Siding: straight-on hero photo, then a detail strip of three corner/trim close-ups.
  - New construction: shorter page, big photo, "How I work with you", CTA.
- FAQ via Accordion, and each page outputs FAQPage JSON-LD from the same items.
- Each page's CTA label comes from the plan (e.g. "Get a free deck estimate").
- Galleries from the projects collection filtered by service. Hide when empty.

ACCEPTANCE
- One H1 per page, title and meta exactly as the plan.
- No two service pages share the same section order.
- Rich Results Test sees FAQPage on each page with FAQs.

Commit: "Service pages"
```

---

## Prompt 6: About, Service Area, Free Estimate, form handler, utility pages

```text
[CLAUDE CODE] repo: topteer-site

GOAL
Build /about/, /service-area/, /free-estimate/, /thanks/, /privacy/, 404, and the PHP form
handler for Hostinger.

FREE ESTIMATE
- Two columns on desktop (form 7, side 5), stacked on mobile with the form first.
- Fields exactly as the plan's table. <label for> on every field, autocomplete attributes
  (name, tel, email, address-level2 for town), inputmode="tel" on phone.
- Client validation on blur and submit, messages in an aria-live="polite" region under each
  field, aria-invalid on errors, focus moves to the first invalid field on submit.
- Honeypot input name="company", visually hidden (not display:none), tabindex="-1",
  autocomplete="off", aria-hidden="true".
- Also reject submits faster than 3 seconds after page load (hidden timestamp field).
- Submit shows "Sending...", disables the button, posts multipart to /contact.php, then
  redirects to /thanks/. On error, show the plan's server error copy with the phone link.
- Works with JS off (normal POST, PHP redirects).

public/contact.php
- POST only. If honeypot filled or too fast: redirect to /thanks/ silently.
- Validate and trim every field server-side, same rules as the client.
- Files: max 3, max 10 MB each, check real MIME with finfo (image/jpeg, image/png,
  image/heic, image/webp), never trust the extension. Attach to the email, never save to the
  web root.
- Send with PHPMailer over SMTP using credentials from a .env file outside public_html.
  Reply-To set to the customer's email if given. Subject:
  "Estimate request: [project type], [town]".
- Plain text body, no HTML from user input. Log failures to a file outside public_html.
- Rate limit: 5 submits per IP per hour (file-based).

ABOUT
- Big 3:2 photo, first-person story, "How I run a job" list, "The paperwork" list. Each
  credential line hides itself if its config value is still a placeholder in production.

SERVICE AREA
- Same SVG map as home, larger. One paragraph per town from the plan. Town paragraphs that
  are still [CONFIRM] are omitted in production, not shown empty.

THANKS: noindex. 404: noindex, branded, Call + Home buttons, add "ErrorDocument 404 /404.html"
to public/.htaccess. PRIVACY: from the plan, marked [CLIENT TO VERIFY] in dev.

ACCEPTANCE
- Submit with each field invalid and see the right message, focus and aria-invalid.
- Honeypot and timing traps send nothing. A real submit arrives at the formRecipient with
  photos attached.
- A .php or .svg renamed to .jpg is rejected.
- Form fully usable with keyboard and screen reader (VoiceOver quick check).

DON'T
- No reCAPTCHA. No third-party form services. No storing submissions in the web root.

Commit: "About, service area, estimate form and handler, utility pages"
```

---

## Prompt 7: SEO, schema, headers

```text
[CLAUDE CODE] repo: topteer-site

GOAL
Finish technical SEO.

DO
1. src/components/Seo.astro: title, meta description, canonical (absolute, trailing
   slash, www), og:title/description/url/image (1200x630)/site_name "Top Teer Construction",
   og:type "website", twitter:card summary_large_image. Every page passes its own title and
   meta from the plan. Build fails on duplicate titles or descriptions.
2. JSON-LD in Base layout:
   - GeneralContractor with name, url, telephone (E.164), email, image, logo, priceRange
     omitted, address with addressLocality Tea, addressRegion SD, postalCode 57064 and no
     street (service-area business), areaServed as City objects for every service town,
     foundingDate 2026, founder Person "Chad [last name]", sameAs [Facebook, GBP when it
     exists], openingHoursSpecification when hours are confirmed.
   - Service on each service page (serviceType, provider @id of the business, areaServed).
   - BreadcrumbList on every page but home.
   - FAQPage where FAQs exist.
   Use a stable @id ("https://www.topteerconstruction.com/#business").
3. @astrojs/sitemap excluding /thanks/ and /dev/. public/robots.txt with the sitemap URL.
4. public/.htaccess: force HTTPS and www with one 301, headers
   Strict-Transport-Security "max-age=31536000", X-Content-Type-Options "nosniff",
   Referrer-Policy "strict-origin-when-cross-origin",
   Permissions-Policy "camera=(), microphone=(), geolocation=()",
   long cache for /_astro/ and /fonts/, short cache for HTML. Block access to .env, .git, logs.
5. Favicon set from the wordmark's "T": favicon.svg, favicon.ico, apple-touch-icon.png,
   no default Astro favicon anywhere.
6. Remove the generator meta Astro adds.

ACCEPTANCE
- Rich Results Test: valid LocalBusiness (GeneralContractor), BreadcrumbList, FAQPage.
- View source: one canonical per page, no generator tag, no comments.
- securityheaders.com grade A on the deployed site.

Commit: "SEO, schema, sitemap and server headers"
```

---

## Prompt 8: Conversion tracking

```text
[CLAUDE CODE] repo: topteer-site

GOAL
Track the three things that matter: phone taps, estimate CTA clicks, and form submits.

DO
- If config.analytics.provider is "plausible": load the script deferred, send custom events
  "Call Click" (with prop location: header | mobile-bar | hero | footer | page),
  "Estimate CTA Click" (same location prop), "Form Submit" (props: town, project type).
- If "ga4": same events as call_click, estimate_cta_click, generate_lead, with the same
  params, loaded after a consent banner only if required. [CONFIRM provider]
- One small src/lib/track.ts used by every CTA via data-track attributes. No inline onclick.
- Fire Form Submit only on the /thanks/ page after a real submit (query flag set by PHP
  redirect), not on button click.

ACCEPTANCE
- Events show in the provider's realtime view for each location.
- Lighthouse performance unchanged within 2 points.

Commit: "Conversion tracking for calls, estimate clicks and leads"
```

---

## Prompt 9: Browser QA

```text
[ANTIGRAVITY] site: npm run preview (local), then the staging URL

GOAL
Test every page in a real browser and report problems. Don't fix, report.

TEST
- Widths 360, 390, 768, 1024, 1280, 1536. Chrome, Safari (WebKit), Firefox.
- Every link (no 404s, no links to redirects). Every tel: link has +16052902881.
- Keyboard only: full tab through Home, a service page, Free Estimate. Focus always visible.
- Mobile menu, BeforeAfter slider, gallery filter and lightbox, FAQ accordions.
- Form: each validation error, honeypot, a real submit with 3 photos, a 12 MB photo.
- Run axe on every page. Run Lighthouse mobile on Home, Remodeling, Our Work, Free Estimate.
- Check for horizontal scroll at each width.

REPORT
A table: page, width/browser, issue, screenshot, severity (blocker / should fix / nit).

Commit: none (report only)
```

---

## Prompt 10: Final cleanup pass

```text
[CLAUDE CODE] repo: topteer-site

GOAL
Fix everything from the QA report, then strip anything that looks generated.

DO
1. Fix all blocker and should-fix items from the QA report (paste it below).
2. Remove: every code comment that explains what code does, console.* calls, unused
   components, props, CSS rules and fonts, the /dev/ page, any lorem ipsum, any href="#".
3. grep the built HTML in dist/ for: em dash, en dash, semicolons in visible text, and the
   banned list (delve, elevate, empower, seamless, unlock, robust, leverage, streamline,
   comprehensive, cutting-edge, top-notch, one-stop, tailored, passionate, trusted partner,
   pride ourselves, journey, "Whether you're", "Look no further"). Report every hit with
   file and line. Don't rewrite copy yourself, list it for me.
4. Confirm class naming is consistent (kebab-case, component-prefixed).

ACCEPTANCE
- The grep report is empty or every hit is approved by me.
- npm run build passes in production mode (no [CONFIRM] left).
- Lighthouse mobile: 90+ performance, 100 accessibility, 100 best practices, 100 SEO on the
  four test pages.

Commit: "QA fixes and final cleanup"
```

---

## Deploy (Hostinger, same as Nate Hall)

1. `npm run build`. Upload the contents of `dist/` to `public_html/` (never upload `.git`,
   `src/`, `node_modules/` or `.env`).
2. Put `.env` with SMTP credentials one level above `public_html/`.
3. Run `composer require phpmailer/phpmailer` in a folder outside `public_html` and point
   contact.php at its autoloader, or upload the vendor folder outside the web root.
4. Purge the Hostinger cache after every deploy.

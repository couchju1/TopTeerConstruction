# Top Teer Construction website

Marketing site for Top Teer Construction, a remodeling contractor based in Tea, SD, serving the Sioux Falls area (towns are in `location.serviceTowns`). The owner is Chad. Services: remodeling (primary), additions, decks, siding and trim, new construction. Domain: topteerconstruction.com, with `www` as primary.

The site's main job is to get estimate requests: every page pushes to `/free-estimate/`, and the form there emails Chad with up to 3 photos.

## Stack
- Astro 7, static output, `trailingSlash: 'always'`, directory format. Sitemap from `@astrojs/sitemap`. Node 22.
- Business facts live in `site.config.json`. Pages read it through `src/lib/config.ts`. Change facts there, not in page files.
- Page copy lives in `src/lib/*-copy.ts` and `src/lib/copy.ts`, not in the `.astro` files.
- Design tokens are in `src/styles/tokens.css`. Use them, not raw colors or sizes. Palette follows Chad's logo: black, red, grey, white. `docs/build-prompts.md` maps the old token names (limestone, spruce, brass) to the current ones.
- Fonts are self-hosted in `public/fonts/` (Zilla Slab, Public Sans).
- Projects are Markdown files in `src/content/projects/`, schema in `src/content.config.ts`. Follow `docs/adding-projects.md`.
- The estimate form posts to `/api/estimate`, a Netlify function in `netlify/functions/estimate.mts`. It emails Chad over SMTP with nodemailer. Settings are environment variables, listed in `.env.example`.
- `src/lib/site-files.mjs` writes `_headers` (CSP, security headers, caching) and `_redirects` (bare domain to www) into `dist` at build time.
- Analytics: Plausible or GA4 via `analytics` in `site.config.json`. Off while `analytics.id` is empty.

## Rules
- Never invent a fact about the business. Unverified values are marked `[CONFIRM]` or `[NEEDS CLIENT PROOF]`. Leave the marker and ask me. Don't replace it with a guess.
- The production build fails while any of those markers is rendered on a page. That is on purpose. Don't work around it.
- Site copy must pass `npm run check:copy`: no em or en dashes, no semicolons, none of the banned marketing words listed in `scripts/copy-check.mjs`.
- Photos: raw files go in `src/assets/photos/raw/` (never committed). Run `npm run photos`, then `npm run test:exif`. No photo with GPS data goes in the site.
- Project entries need real alt text and a one-sentence caption. The town must be one of `location.serviceTowns`.
- The repo is public on GitHub. Don't commit anything private.
- Load the `ui-ux-pro-max` skill before any work that changes how the site looks or behaves: pages, components, layout, color, type, forms, navigation, animation, accessibility. Use it for targeted searches (`--stack astro`, `--domain ux`) and its checklists. The site already has a design system (`tokens.css`, the logo palette, Zilla Slab and Public Sans, the copy rules), so don't run `--design-system --persist` or change palette or fonts based on its output without asking me. Where it disagrees with this file, this file wins. Skip it for work that doesn't touch the design (form handler, deploy, scripts).

## Commands
- `npm install`, then `npm run dev` for the local preview (draft mode, markers shown with a yellow outline).
- `npm run build` is a draft build. `npm run build:prod` is the launch build and runs the marker scan.
- `npm run check` (Astro type check), `npm run check:copy` (scans `dist`, so build first), `npm run test:exif`.
- On Windows, `dev`, `build` and `build:prod` fail in PowerShell or cmd with "'SITE_ENV' is not recognized", because the scripts use `SITE_ENV=... astro ...`. Run them from Git Bash instead, for example `SITE_ENV=draft npx astro build`. Netlify builds on Linux, so it is not affected. A proper fix (`cross-env`, or a Node wrapper) is a dependency or script change: ask first.

## Branches and deploy
- `main` was created on 20 Nov 2026 from `claude/new-session-d62jom`. GitHub's default branch is still `claude/new-session-d62jom`. Both branches hold the same site code. Ask me before changing the default branch or the branch Netlify publishes from.
- Netlify is the chosen host (confirmed 20 Nov 2026). `netlify.toml` sets the build (`npm run build:prod`, publish `dist`, functions folder). `docs/deploy-netlify.md` has the one-time setup: connect the repo, set the SMTP variables, add the domain.
- My other sites are on Hostinger. This one can't move there as it is, because the estimate form is a Netlify function. Moving needs a new form handler first (a PHP script, for example). Don't start that without asking.
- Don't push to the live branch until I say so.

## Key decisions and why
- **Static Astro, facts in one JSON file.** Chad's details are still being confirmed, so every fact sits in one place and can be changed without touching pages.
- **Marker system instead of guesses.** Unknown facts carry `[CONFIRM]` or `[NEEDS CLIENT PROOF]`. In production, fields that are still markers are left off the page (`shownInBuild` in `src/lib/config.ts`), and the launch scan (`src/lib/launch-scan.mjs`) fails the build if a marker reaches the HTML anyway. A few fields (GA4 ID when GA4 is selected) throw outright.
- **Netlify, not Hostinger.** The form needs server code to send email with photos. A Netlify function does that without a server to look after. It replaced an earlier PHP handler, so there's no per-IP rate limit now, only the honeypot and a 3-second timer.
- **Photos shrink in the browser.** Netlify caps a request at 6 MB, so the form resizes each photo to about 2000 px and 1 MB before sending.
- **Strict copy rules.** Plain voice, written as Chad ("built by the guy who bid it"). The copy check enforces it.
- **Reviews and projects stay hidden until real.** Reviews show once there are at least `reviews.minimumToShow` (3). Project sections need real project files.
- The build was done in 10 prompts, listed in `docs/build-prompts.md`, with the plan's sitemap, design and copy decisions behind them.

## Status (20 Nov 2026)

### Done
- All pages built: home, five service pages, Our Work, About, Service Area, Free Estimate, Thanks, Privacy, 404. Sitemap and `robots.txt` generate.
- Last feature work (10 Oct 2026): full-width photo hero and "Our services" cards on the home page.
- Checked on 20 Nov 2026: draft build and launch build both complete (13 pages), `astro check` has 0 errors, copy check has no hits, EXIF check is clean (no project photos yet).

### Not live yet
- topteerconstruction.com still serves a Squarespace site (checked 20 Nov 2026). DNS has not moved to Netlify.
- No Netlify deploy statuses show on either branch on GitHub, so I can't tell whether the Netlify site is connected or which branch it would publish from. Check the Netlify dashboard before the first deploy.
- SMTP variables on Netlify are unconfirmed, and the form has never been tested end to end.

### Waiting on Chad
- Proof of insurance, insurance carrier, Sioux Falls contractor license, warranty terms (`credentials.*`). Hidden from the About page until filled in.
- What "New construction" includes (`services[4].includes`).
- A Google Business Profile, then its URL (`social.googleBusinessProfile`).
- Project photos (none yet, so Our Work, galleries and the before/after slider are empty, and the build warns that the `projects` collection is empty).
- At least 3 real reviews.
- Which mailbox the site sends from, and its SMTP details.

### Waiting on me (Justin)
- Confirm `location.geo` (lat/lng for schema) or leave it out.
- Pick analytics: Plausible or GA4, and set `analytics.id`.
- Netlify setup and the domain move, per `docs/deploy-netlify.md`. Decide which branch is production.

### Next steps
1. Connect Netlify, set SMTP variables, deploy to the Netlify subdomain and send a test estimate with photos.
2. Add the first projects once Chad sends photos.
3. Browser QA (prompt 9 in `docs/build-prompts.md`). There's no record in git that prompts 9 and 10 were run.
4. Move DNS from Squarespace to Netlify only when I say so.

### Known issues
- npm scripts don't run in PowerShell or cmd on Windows (see Commands).
- The form has no rate limiting beyond the honeypot and timer.
- Without JavaScript, photos upload full size and can hit Netlify's 6 MB limit.
- The repo is public. Keep `.env` and any client documents out of it.

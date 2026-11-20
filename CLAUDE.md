# Top Teer Construction website

Site for Top Teer Construction, a remodeling contractor based in Tea, SD, serving the Sioux Falls area. The owner is Chad. Live domain: topteerconstruction.com (`www` is primary).

## Stack
- Astro, static output, trailing slashes on every URL.
- Business facts live in `site.config.json`. Pages read from it. Change facts there, not in page files.
- Design tokens are in `src/styles/tokens.css`. Use them, not raw colors or sizes.
- Projects are Markdown files in `src/content/projects/`. Follow `docs/adding-projects.md`.
- The estimate form posts to `/api/estimate`, a Netlify function in `netlify/functions/estimate.mts`. It emails Chad over SMTP. Settings are environment variables, listed in `.env.example`.

## Rules
- Never invent a fact about the business. Unverified values are marked `[CONFIRM]` or `[NEEDS CLIENT PROOF]`. Leave the marker and ask me. Don't replace it with a guess.
- The production build fails while any of those markers is rendered on a page. That is on purpose. Don't work around it.
- Site copy must pass `npm run check:copy`: no em or en dashes, no semicolons, none of the banned marketing words listed in `scripts/copy-check.mjs`.
- Photos: raw files go in `src/assets/photos/raw/` (never committed). Run `npm run photos`, then `npm run test:exif`. No photo with GPS data goes in the site.
- Project entries need real alt text and a one-sentence caption. The town must be one of `location.serviceTowns`.
- The repo is public on GitHub. Don't commit anything private.

## Commands
- `npm install`, then `npm run dev` for the local preview (draft mode, markers allowed).
- `npm run build` is a draft build. `npm run build:prod` is the launch build and runs the marker scan.
- `npm run check` (Astro type check), `npm run check:copy`, `npm run test:exif`.

## Branches and deploy
- The repo has no `main` branch yet. All work is on `claude/new-session-d62jom`. Ask me before creating `main` or changing the default branch.
- The site is hosted on Netlify (confirmed 20 Nov 2026). `netlify.toml` and `docs/deploy-netlify.md` describe the setup.
- My other sites are on Hostinger. This one can't move there as it is, because the estimate form is a Netlify function. Moving needs a new form handler first (a PHP script, for example). Don't start that without asking.
- Don't push to the live branch until I say so.

## Status
(Update at the end of each session: what's done, what's next, anything waiting on Chad.)

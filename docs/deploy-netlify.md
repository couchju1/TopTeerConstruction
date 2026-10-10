# Deploying to Netlify

`netlify.toml` already sets the build command (`npm run build:prod`), the publish folder (`dist`),
Node 22 and the functions folder. The build writes `_headers` (security headers, CSP, caching) and
`_redirects` (bare domain to www) into `dist`.

## One-time setup

1. **Add the site:** Netlify → Add new site → Import an existing project → pick this repo. Choose
   the branch with this work as the production branch, or merge it into `main` first.
2. **Environment variables** (Site configuration → Environment variables). The estimate form emails
   Chad through these:

   | Key | Example | Notes |
   |---|---|---|
   | `SMTP_HOST` | `smtp.hostinger.com` | Your email provider's SMTP server |
   | `SMTP_PORT` | `465` | 465 for SSL, 587 for STARTTLS |
   | `SMTP_SECURE` | `ssl` | `ssl` for port 465, `tls` for 587 |
   | `SMTP_USER` | `website@topteerconstruction.com` | Mailbox the site sends from |
   | `SMTP_PASS` | | That mailbox's password. Mark it as a secret |
   | `MAIL_FROM` | `website@topteerconstruction.com` | Usually the same as `SMTP_USER` |

   Requests go to `contact.formRecipient` in `site.config.json`.
3. **Domain:** Domain management → add `topteerconstruction.com`, set
   `www.topteerconstruction.com` as the primary domain, and follow Netlify's DNS steps. HTTPS is
   issued automatically.
4. **Test the form** after the first deploy: send a request with a couple of phone photos and confirm
   the email arrives. Function logs are under Logs → Functions → `estimate`.

## How the form works on Netlify

- `netlify/functions/estimate.mts` answers `POST /api/estimate`. It runs the same checks as the
  page: required fields, honeypot, the 3-second timer, 3 photos max, and real file-type checks
  (JPEG, PNG, HEIC, WebP by their first bytes, not the file name).
- Netlify caps a request at 6 MB, so the browser shrinks each photo to 2000 px and about 1 MB before
  sending. If a photo can't be shrunk in that browser (HEIC in Chrome, for example) and the total is
  still too big, the form asks for fewer photos instead of failing.
- Without JavaScript the form still posts, but photos are sent full size, so large photos can hit
  the 6 MB cap.
- There is no per-IP rate limit like the old PHP handler had. The honeypot and timer stop most bots.

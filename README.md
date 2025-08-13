# Personal Portfolio Website

This project is a personal website built with Next.js, React, TypeScript, and Tailwind CSS. It includes sections for a curriculum vitae, project showcase, photography gallery, and a contact form.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### GitHub pinned projects (optional)

The Projects page can show your pinned GitHub repositories. Configure these environment variables in a `.env.local` file:

```
GITHUB_USERNAME=NikolasNeofytou
# Optional: increases data quality (stars, topics, language) and reliability
GITHUB_TOKEN=ghp_xxx
```

Notes:
- Without `GITHUB_TOKEN`, the site falls back to a lightweight public scrape of your profile and shows basic info only.
- With `GITHUB_TOKEN` (scopes: public data is enough), the site uses GitHub’s GraphQL API for richer data.

### Contact configuration (optional)

Set these in `.env.local` to enable quick contact and social links:

```
# Public (safe to expose in the client)
NEXT_PUBLIC_CONTACT_EMAIL=you@example.com
NEXT_PUBLIC_WHATSAPP_NUMBER=35799123456  # international format, digits only
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hi Nikolas, I saw your portfolio and would like to connect.
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/your-handle/
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/your-handle
# Optional: Calendly or any booking URL
NEXT_PUBLIC_CALENDAR_URL=https://calendly.com/your-handle/intro-call
```

To enable the contact form to send emails via Resend, also set:

```
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
CONTACT_TO_EMAIL=you@example.com
CONTACT_TO_NAME=Your Name
```

To add spam protection with reCAPTCHA v3 and simple rate limiting:

```
# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
RECAPTCHA_MIN_SCORE=0.5  # optional, default 0.5

# Basic IP rate limiting (per minute)
RATE_LIMIT_WINDOW_MS=60000  # optional, default 60000
RATE_LIMIT_MAX=5            # optional, default 5
```

## Project Structure

- `src/app` – application routes and pages
- `src/components` – reusable React components
- `src/app/api/pinned/route.ts` – API route returning pinned repos
- `src/components/PinnedProjects.tsx` – client component rendering pinned repos
 - `src/app/blog/page.tsx` – Blog page linking to your Substack
- static assets can be added via a `public/` directory as needed, but this repository avoids committed binaries

## Testing

Run the test suite:

```bash
npm test
```

Feel free to replace the placeholder content with your own CV, projects, and photographs.

### Blog configuration (optional)

Set your Substack URL in `.env.local` (defaults to your handle if omitted):

```
NEXT_PUBLIC_SUBSTACK_URL=https://substack.com/@nikolasneofytou
```

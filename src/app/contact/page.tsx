import ContactForm from "@/components/ContactForm";
import CopyButton from "@/components/CopyButton";

export default function Contact() {
  const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.CONTACT_EMAIL || "";
  const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || ""; // E.g., 35799123456
  const WHATSAPP_MESSAGE =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || process.env.WHATSAPP_MESSAGE ||
    "Hi Nikolas, I saw your portfolio and would like to connect.";
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "NikolasNeofytou";
  const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || process.env.LINKEDIN_URL || "";
  const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL || process.env.TWITTER_URL || "";
  const CALENDAR_URL = process.env.NEXT_PUBLIC_CALENDAR_URL || process.env.CALENDAR_URL || "";

  const waPhone = WHATSAPP.replace(/[^\d]/g, "");
  const waHref = waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}` : "";
  const emailHref = EMAIL ? `mailto:${EMAIL}` : "";
  const githubHref = `https://github.com/${GITHUB_USERNAME}`;

  return (
    <main className="container py-12">
      <h1 className="text-3xl font-bold mb-6" style={{fontFamily: 'var(--font-serif)'}}>Contact</h1>

      {/* Quick contact actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Email Card */}
  <a
          href={emailHref || undefined}
          className="surface rounded-2xl p-5 flex items-start gap-4"
          aria-disabled={!EMAIL}
        >
          <span aria-hidden className="inline-flex h-10 w-10 items-center justify-center rounded-xl border" style={{borderColor: 'var(--border)'}}>
            {/* Envelope icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16v12H4z"/><path d="m22 6-10 7L2 6"/></svg>
          </span>
          <div className="flex-1">
            <h3 className="font-semibold" style={{fontFamily: 'var(--font-serif)'}}>Email</h3>
            <p className="text-sm text-[color:var(--muted)]">{EMAIL || 'Set NEXT_PUBLIC_CONTACT_EMAIL'}</p>
          </div>
          {EMAIL && <CopyButton value={EMAIL} label="Copy" />}
        </a>

        {/* WhatsApp Card */}
        <a
          href={waHref || undefined}
          target={waHref ? "_blank" : undefined}
          rel={waHref ? "noreferrer" : undefined}
          className="surface rounded-2xl p-5 flex items-start gap-4"
          aria-disabled={!waHref}
        >
          <span aria-hidden className="inline-flex h-10 w-10 items-center justify-center rounded-xl border" style={{borderColor: 'var(--border)'}}>
            {/* WhatsApp icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12.04c0 4.42-3.58 8-8 8-1.41 0-2.73-.36-3.88-.99L4 20l.99-4.09A7.95 7.95 0 0 1 4 12.04c0-4.42 3.58-8 8-8s8 3.58 8 8Zm-4.2 1.55c.08.05.13.12.16.22.07.2.07.4-.01.6-.2.5-.71 1.11-1.4 1.27-.37.08-.85.14-2.83-.92-2.38-1.22-3.9-3.44-4.01-3.61-.1-.16-.95-1.26-.95-2.41 0-1.15.6-1.7.82-1.93.09-.1.23-.15.37-.14.09 0 .17.02.24.05.08.03.15.06.22.1.07.04.16.09.24.15.07.05.12.08.16.14.07.1.12.2.15.31.06.2.13.49.16.6.05.17.01.33-.09.47-.06.09-.13.17-.2.25-.06.07-.11.12-.17.18-.05.05-.1.1-.06.19.04.09.26.64.63 1.1.43.54.97 1.17 1.68 1.63.82.54 1.47.71 1.56.74.09.03.15.02.21-.04.06-.05.46-.54.58-.73.13-.19.25-.16.41-.1.16.06 1.05.5 1.23.59Z"/></svg>
          </span>
          <div>
            <h3 className="font-semibold" style={{fontFamily: 'var(--font-serif)'}}>WhatsApp Business</h3>
            <p className="text-sm text-[color:var(--muted)]">{waPhone ? `+${waPhone}` : 'Set NEXT_PUBLIC_WHATSAPP_NUMBER'}</p>
          </div>
        </a>

        {/* GitHub Card */}
        <a href={githubHref} target="_blank" rel="noreferrer" className="surface rounded-2xl p-5 flex items-start gap-4">
          <span aria-hidden className="inline-flex h-10 w-10 items-center justify-center rounded-xl border" style={{borderColor: 'var(--border)'}}>
            {/* GitHub icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.7 2 12.4c0 4.57 2.87 8.44 6.85 9.81.5.1.68-.23.68-.5 0-.25-.01-1.08-.02-1.96-2.78.63-3.37-1.24-3.37-1.24-.45-1.19-1.1-1.5-1.1-1.5-.9-.64.07-.62.07-.62 1 .07 1.52 1.07 1.52 1.07.9 1.61 2.36 1.15 2.94.88.09-.67.35-1.14.63-1.4-2.22-.26-4.56-1.16-4.56-5.16 0-1.14.39-2.06 1.03-2.78-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.06A9.3 9.3 0 0 1 12 7.7c.85 0 1.7.12 2.5.35 1.9-1.34 2.75-1.06 2.75-1.06.56 1.4.21 2.44.1 2.7.65.72 1.03 1.64 1.03 2.78 0 4.01-2.35 4.89-4.58 5.15.36.33.68.97.68 1.96 0 1.41-.01 2.55-.01 2.89 0 .27.18.6.69.49A10.4 10.4 0 0 0 22 12.4C22 6.7 17.52 2 12 2Z"/></svg>
          </span>
          <div>
            <h3 className="font-semibold" style={{fontFamily: 'var(--font-serif)'}}>GitHub</h3>
            <p className="text-sm text-[color:var(--muted)]">@{GITHUB_USERNAME}</p>
          </div>
        </a>
      </section>

      {/* Social links row (optional) */}
      {(LINKEDIN_URL || TWITTER_URL) && (
        <div className="mb-10 flex flex-wrap gap-3">
          {LINKEDIN_URL && (
            <a href={LINKEDIN_URL} className="btn btn-outline" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              {/* LinkedIn icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8.5h4V23h-4V8.5ZM8.5 8.5h3.8v2h.06c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.06V23h-4v-6.5c0-1.55-.03-3.54-2.16-3.54-2.16 0-2.49 1.68-2.49 3.42V23h-4V8.5Z"/></svg>
              <span>LinkedIn</span>
            </a>
          )}
          {TWITTER_URL && (
            <a href={TWITTER_URL} className="btn btn-outline" target="_blank" rel="noreferrer" aria-label="Twitter/X">
              {/* X icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21L13.68 10.33 22 22h-6.2l-4.84-6.41L5.4 22H2.64l7.82-8.88L2 2h6.32l4.36 5.86L18.244 2Zm-2.18 18h1.76L8.02 4H6.18l9.886 16Z"/></svg>
              <span>Twitter</span>
            </a>
          )}
          {CALENDAR_URL && (
            <a href={CALENDAR_URL} className="btn btn-primary" target="_blank" rel="noreferrer" aria-label="Schedule a call">
              Schedule a call
            </a>
          )}
        </div>
      )}

  {/* Contact form */}
  <ContactForm />
    </main>
  );
}

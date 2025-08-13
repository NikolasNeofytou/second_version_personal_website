import { NextRequest } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  message?: string;
  company?: string; // honeypot
  recaptchaToken?: string;
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const CONTACT_TO_NAME = process.env.CONTACT_TO_NAME || "Portfolio";
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 5);

// Simple in-memory rate limit (per-IP). Suitable for small deployments/dev.
// For production at scale, use a shared store (Upstash, Redis, etc.).
const memoryStore = new Map<string, { count: number; ts: number }>();

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(req) || "unknown";
    const now = Date.now();
    const rec = memoryStore.get(ip);
    if (!rec || now - rec.ts > RATE_LIMIT_WINDOW_MS) {
      memoryStore.set(ip, { count: 1, ts: now });
    } else {
      if (rec.count >= RATE_LIMIT_MAX) return json({ error: "Too many requests, please try again later." }, 429);
      rec.count += 1;
    }

    const body = (await req.json()) as Payload;

    // Honeypot: reject if filled
    if (body.company && body.company.trim().length > 0) {
      return json({ ok: true }, 200);
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();

    // reCAPTCHA v3 verification (if configured)
  const recaptchaToken = body.recaptchaToken;
    if (RECAPTCHA_SECRET_KEY) {
      if (!recaptchaToken) return json({ error: "reCAPTCHA token missing" }, 400);
      const verify = await verifyRecaptcha({ token: recaptchaToken, secret: RECAPTCHA_SECRET_KEY, remoteip: ip });
      if (!verify.success || (typeof verify.score === 'number' && verify.score < RECAPTCHA_MIN_SCORE)) {
        return json({ error: "reCAPTCHA verification failed" }, 400);
      }
      if (verify.action && verify.action !== 'contact') {
        return json({ error: "Invalid reCAPTCHA action" }, 400);
      }
    }

    // Basic validation
    if (!name || name.length < 2 || name.length > 100) return json({ error: "Invalid name" }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Invalid email" }, 400);
    if (!message || message.length < 5 || message.length > 5000) return json({ error: "Invalid message" }, 400);

    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
      return json({ error: "Email not configured. Set RESEND_API_KEY and CONTACT_TO_EMAIL in .env.local" }, 501);
    }

    const subject = `Portfolio contact from ${name}`;
    const text = `From: ${name} <${email}>\n\n${message}`;
    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;line-height:1.6">
        <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${CONTACT_TO_NAME} <onboarding@resend.dev>`,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return json({ error: `Resend error: ${res.status} ${errText}` }, 502);
    }

    return json({ ok: true }, 200);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
}

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getClientIp(req: NextRequest): string | undefined {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim();
  const xr = req.headers.get("x-real-ip");
  if (xr) return xr.trim();
  // NextRequest ip is experimental; fallback undefined
  const ip = (req as unknown as { ip?: string }).ip;
  return ip || undefined;
}

async function verifyRecaptcha({ token, secret, remoteip }: { token: string; secret: string; remoteip?: string }) {
  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("response", token);
  if (remoteip) params.set("remoteip", remoteip);
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) return { success: false };
  return (await res.json()) as { success: boolean; score?: number; action?: string };
}

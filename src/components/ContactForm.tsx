"use client";

import { useCallback, useMemo, useState } from "react";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  // helpers
  const emailRe = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  type FormShape = { name?: string; email?: string; message?: string; company?: string; recaptchaToken?: string };
  const validate = useCallback((data: FormShape) => {
    const next: { name?: string; email?: string; message?: string } = {};
    const name = (data.name as string)?.trim() || "";
    const email = (data.email as string)?.trim() || "";
    const message = (data.message as string)?.trim() || "";
    if (name.length < 2) next.name = "Please enter at least 2 characters.";
    if (!emailRe.test(email)) next.email = "Please enter a valid email.";
    if (message.length < 5) next.message = "Please write a bit more (min 5 characters).";
    return next;
  }, [emailRe]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries()) as FormShape;

    // client-side validation
    const v = validate(data);
    setErrors(v);
    if (Object.keys(v).length) {
      setToast({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }
    setState("loading");
    setError(null);
    try {
      // reCAPTCHA v3
      if (siteKey && typeof window !== 'undefined') {
        const token = await getRecaptchaToken(siteKey, 'contact');
        data.recaptchaToken = token;
      }
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      setState("success");
      form.reset();
      setErrors({});
      setToast({ type: "success", message: "Message sent. I’ll get back to you soon." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setState("error");
      setToast({ type: "error", message: msg });
    }
  }

  return (
    <form onSubmit={onSubmit} className="surface rounded-2xl p-6 max-w-lg space-y-4">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          minLength={2}
          maxLength={100}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'err-name' : undefined}
          className={`w-full rounded-lg border bg-transparent p-3 ${errors.name ? 'border-red-500' : 'border-[color:var(--border)]'}`}
          onBlur={(e) => setErrors((prev) => ({ ...prev, ...validate({ ...prev, name: e.currentTarget.value }) }))}
        />
        {errors.name && <p id="err-name" className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'err-email' : undefined}
          className={`w-full rounded-lg border bg-transparent p-3 ${errors.email ? 'border-red-500' : 'border-[color:var(--border)]'}`}
          onBlur={(e) => setErrors((prev) => ({ ...prev, ...validate({ ...prev, email: e.currentTarget.value }) }))}
        />
        {errors.email && <p id="err-email" className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Message"
          required
          minLength={5}
          maxLength={5000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'err-message' : undefined}
          className={`w-full rounded-lg border bg-transparent p-3 ${errors.message ? 'border-red-500' : 'border-[color:var(--border)]'}`}
          rows={4}
          onBlur={(e) => setErrors((prev) => ({ ...prev, ...validate({ ...prev, message: e.currentTarget.value }) }))}
        />
        {errors.message && <p id="err-message" className="mt-1 text-sm text-red-500">{errors.message}</p>}
      </div>
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={state === "loading"} className="btn btn-primary">
          {state === "loading" ? "Sending…" : "Send"}
        </button>
        {state === "success" && <span className="text-green-600">Sent!</span>}
        {state === "error" && <span className="text-red-500">{error}</span>}
      </div>

      {/* Toast */}
      {toast && (
        <div
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
          className="fixed bottom-6 right-6 z-50 surface rounded-xl px-4 py-3 shadow-lg"
        >
          <div className={`text-sm ${toast.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>{toast.message}</div>
        </div>
      )}
    </form>
  );
}

async function getRecaptchaToken(siteKey: string, action: string) {
  // load script once
  const src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
  if (!document.querySelector(`script[src="${src}"]`)) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
      document.head.appendChild(s);
    });
  }
  // @ts-expect-error grecaptcha is injected by the reCAPTCHA script
  if (typeof grecaptcha === 'undefined') throw new Error('reCAPTCHA not available');
  // @ts-expect-error grecaptcha is injected by the reCAPTCHA script
  return await grecaptcha.execute(siteKey, { action });
}

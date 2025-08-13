export const dynamic = "force-static";

import RecentSubstackPosts from "@/components/RecentSubstackPosts";

export default function Blog() {
  const SUBSTACK_URL = process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://substack.com/@nikolasneofytou";
  const { embedSrc, subscribeUrl, readUrl } = computeSubstackUrls(SUBSTACK_URL);

  return (
    <main className="container py-12">
      <h1 className="text-3xl font-bold mb-4" style={{fontFamily: 'var(--font-serif)'}}>Blog</h1>
      <p className="text-[color:var(--muted)] mb-6 max-w-prose">
        I write about engineering, systems, and timeless ideas. My blog lives on Substack.
      </p>

      {/* Subscribe widget */}
      <section className="surface rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3" style={{fontFamily: 'var(--font-serif)'}}>Subscribe</h2>
        <div className="rounded-xl overflow-hidden border" style={{borderColor: 'var(--border)'}}>
          <iframe
            src={embedSrc}
            style={{ width: '100%', background: 'transparent' }}
            height={320}
            frameBorder={0}
            scrolling="no"
          />
        </div>
      </section>

      {/* Fallback CTAs */}
      <div className="surface rounded-2xl p-6 flex flex-wrap items-center gap-3">
        <a href={readUrl} target="_blank" rel="noreferrer" className="btn btn-outline">Read on Substack</a>
        <a href={subscribeUrl} target="_blank" rel="noreferrer" className="btn btn-primary">Subscribe</a>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3" style={{fontFamily: 'var(--font-serif)'}}>Recent posts</h2>
        <RecentSubstackPosts />
      </section>
    </main>
  );
}

function computeSubstackUrls(input: string) {
  try {
    const u = new URL(input);
    const isSubstack = u.hostname.endsWith("substack.com");
    const hasSubdomain = isSubstack && u.hostname.split(".").length > 2; // e.g., name.substack.com
    const path = u.pathname.replace(/\/$/, "");
  let embedSrc = "";
  let subscribeUrl = "";
  const readUrl = u.toString();

    if (hasSubdomain) {
      // https://name.substack.com/embed and /subscribe
      embedSrc = `${u.origin}/embed`;
      subscribeUrl = `${u.origin}/subscribe`;
    } else if (isSubstack && path.startsWith("/@")) {
      // https://substack.com/embed/@handle and /@handle/subscribe
      embedSrc = `${u.origin}/embed${path}`;
      subscribeUrl = `${u.origin}${path}/subscribe`;
    } else {
      // Fallback: try /embed and /subscribe on origin
      embedSrc = `${u.origin}/embed`;
      subscribeUrl = `${u.origin}/subscribe`;
    }

    return { embedSrc, subscribeUrl, readUrl };
  } catch {
    const clean = input.replace(/\/$/, "");
    return {
      embedSrc: `${clean}/embed`,
      subscribeUrl: `${clean}/subscribe`,
      readUrl: clean,
    };
  }
}

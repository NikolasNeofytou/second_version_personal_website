export const runtime = "edge";

type Post = {
  title: string;
  url: string;
  date?: string;
  image?: string | null;
};

const DEFAULT_URL = "https://substack.com/@nikolasneofytou";

export async function GET() {
  try {
    const source = process.env.NEXT_PUBLIC_SUBSTACK_URL || DEFAULT_URL;
    const feedUrls = buildFeedCandidates(source);

    let xml: string | null = null;
    for (const url of feedUrls) {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (res.ok) {
        xml = await res.text();
        break;
      }
    }
    if (!xml) return json({ posts: [] }, 200, 300);

    const posts = parseRss(xml).slice(0, 6);
    return json({ posts }, 200, 3600);
  } catch (e) {
    return json({ posts: [], error: (e as Error).message }, 500, 60);
  }
}

function buildFeedCandidates(input: string): string[] {
  try {
    const u = new URL(input);
    const isSubstack = u.hostname.endsWith("substack.com");
    const hasSubdomain = isSubstack && u.hostname.split(".").length > 2; // name.substack.com
    const path = u.pathname.replace(/\/$/, "");
    if (hasSubdomain) {
      return [
        `${u.origin}/feed`,
        `${u.origin}/rss`,
      ];
    } else if (isSubstack && path.startsWith("/@")) {
      return [
        `${u.origin}/feed${path}`,
        `${u.origin}/rss${path}`,
      ];
    }
  } catch {
    // ignore
  }
  const clean = input.replace(/\/$/, "");
  return [
    `${clean}/feed`,
    `${clean}/rss`,
  ];
}

function parseRss(xml: string): Post[] {
  const items = Array.from(xml.matchAll(/<item[\s\S]*?<\/item>/g)).map(m => m[0]);
  return items.map(chunk => {
    const title = decode(captureTag(chunk, 'title')) || 'Untitled';
    const url = unescapeHtml(captureTag(chunk, 'link')) || '#';
    const date = captureTag(chunk, 'pubDate') || undefined;
    const content = captureCdata(chunk, 'content:encoded') || captureTag(chunk, 'description') || '';
    const image = extractFirstImage(content);
    return { title, url, date, image };
  });
}

function captureTag(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}>([\n\r\t\s\S]*?)<\/${tag}>`, 'i');
  const m = xml.match(re);
  return m ? m[1].trim() : null;
}

function captureCdata(xml: string, tag: string): string | null {
  const re = new RegExp(`<${escapeReg(tag)}>[\n\r\t\s]*<!\[CDATA\[([\s\S]*?)\]\]>[\n\r\t\s]*<\/${escapeReg(tag)}>`, 'i');
  const m = xml.match(re);
  return m ? m[1] : null;
}

function extractFirstImage(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return m ? m[1] : null;
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, r => `\\${r}`);
}

function unescapeHtml(s: string | null): string | null {
  if (!s) return s;
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
}

function decode(s: string | null): string | null {
  if (!s) return s;
  // strip CDATA if present
  const c = s.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
  return unescapeHtml(c);
}

function json(data: Record<string, unknown>, status = 200, sMaxAge = 3600) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': `public, s-maxage=${sMaxAge}, stale-while-revalidate=86400`,
    },
  });
}

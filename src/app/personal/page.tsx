export const dynamic = "force-static";
import Image from "next/image";

type Hero = { name: string; role?: string; note?: string; quote?: string; imageUrl?: string };
type Interest = { label: string; note?: string; url?: string };
type Movie = { title: string; year?: number; note?: string; url?: string; posterUrl?: string };

const heroes: Hero[] = [
  { name: "Augustus", note: "Architect of the Principate—stability through structure and long-term vision.", quote: "Festina lente." },
  { name: "Julius Caesar", note: "Strategist and statesman—decisive action and institutional reform.", quote: "Veni, vidi, vici." },
  { name: "Friedrich Nietzsche", note: "Provocative thinker—values, will, creativity, and modernity.", quote: "Become who you are." },
];

const interests: Interest[] = [
  { label: "Football", note: "Playing and watching; tactics, flow, and team dynamics.", url: "https://en.wikipedia.org/wiki/Association_football" },
  { label: "Philosophy", note: "Stoicism and Continental thought; first principles and clarity of mind.", url: "https://en.wikipedia.org/wiki/Philosophy" },
  { label: "Padel", note: "Fast rallies and court craft; weekly sessions.", url: "https://en.wikipedia.org/wiki/Padel_(sport)" },
];

const movies: Movie[] = [
  { title: "12 Angry Men", note: "Reason, persuasion, and integrity.", url: "https://www.youtube.com/results?search_query=12+angry+men+trailer" },
  { title: "For a Few Dollars More", note: "Tension, style, and myth-making.", url: "https://www.youtube.com/results?search_query=for+a+few+dollars+more+trailer" },
  { title: "Cars", note: "Speed, mentorship, and finding purpose.", url: "https://www.youtube.com/results?search_query=cars+2006+trailer" },
];

export default function Personal() {
  return (
    <main className="container py-12 space-y-10">
      <header>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>Personal</h1>
        <p className="mt-2 text-[color:var(--muted)] max-w-prose">
          A small corner of the site to share a few heroes, interests, and films that shaped my thinking.
        </p>
      </header>

      {/* Heroes */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border" style={{borderColor:'var(--border)'}}>
            <IconShield />
          </span>
          Heroes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heroes.map((h) => (
            <div key={h.name} className="surface rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" aria-hidden>
                  <Image
                    src={h.imageUrl || monogramDataURL(h.name, 128, 128)}
                    alt=""
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={shimmerDataURL(128, 128)}
                    unoptimized={Boolean(!h.imageUrl)}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-medium truncate">{h.name}</div>
                  {h.role && <div className="text-sm text-[color:var(--muted)]">{h.role}</div>}
                  {h.quote && <blockquote className="mt-2 text-sm italic text-[color:var(--muted)]">“{h.quote}”</blockquote>}
                </div>
              </div>
              {h.note && <p className="mt-3 text-sm text-[color:var(--muted)]">{h.note}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Interests */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border" style={{borderColor:'var(--border)'}}>
            <IconSpark />
          </span>
          Interests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interests.map((i) => (
            <div key={i.label} className="surface rounded-xl p-5">
              <div className="text-base font-medium">
                {i.url ? (
                  <a href={i.url} target="_blank" rel="noreferrer" className="link-underline">{i.label}</a>
                ) : (
                  i.label
                )}
              </div>
              {i.note && <p className="mt-2 text-sm text-[color:var(--muted)]">{i.note}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Movies */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border" style={{borderColor:'var(--border)'}}>
            <IconClapper />
          </span>
          Movies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {movies.map((m) => (
            <div key={m.title} className="surface rounded-xl overflow-hidden">
              <div className="relative w-full h-40">
                <Image
                  src={m.posterUrl || monogramDataURL(m.title, 640, 256)}
                  alt=""
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={shimmerDataURL(640, 256)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={Boolean(!m.posterUrl)}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-base font-medium">
                    {m.url ? (
                      <a href={m.url} target="_blank" rel="noreferrer" className="link-underline">{m.title}</a>
                    ) : (
                      m.title
                    )}
                  </div>
                  {m.year && <span className="text-xs text-[color:var(--muted)]">{m.year}</span>}
                </div>
                {m.note && <p className="mt-2 text-sm text-[color:var(--muted)]">{m.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function shimmer(width: number, height: number) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#e6e6e6" offset="20%" />
          <stop stop-color="#f5f5f5" offset="50%" />
          <stop stop-color="#e6e6e6" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#eee" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
    </svg>`;
}

function toBase64(str: string) {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return window.btoa(str);
}

function shimmerDataURL(w: number, h: number) {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
}

function initials(text: string) {
  const parts = text.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + last).toUpperCase();
}

function monogramDataURL(text: string, w: number, h: number) {
  const inits = initials(text);
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="hsl(210 30% 90%)" />
        <stop offset="100%" stop-color="hsl(210 20% 80%)" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" font-size="${Math.floor(Math.min(w,h)/3)}" fill="hsl(210 20% 30%)">${inits}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}

function IconShield() {
  // Laurel wreath
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4 C 9 5.5, 7 8, 7 11 C 7 14, 9 16.5, 12 18" />
      <path d="M12 4 C 15 5.5, 17 8, 17 11 C 17 14, 15 16.5, 12 18" />
      <path d="M9.5 7.5 L8 6.5" />
      <path d="M8.5 9.5 L7 8.7" />
      <path d="M8 12 L6.7 11.5" />
      <path d="M14.5 7.5 L16 6.5" />
      <path d="M15.5 9.5 L17 8.7" />
      <path d="M16 12 L17.3 11.5" />
    </svg>
  );
}

function IconSpark() {
  // Book
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6v12" />
      <path d="M5 6h7v12H7a3 3 0 0 1-3-3V8a2 2 0 0 1 2-2z" />
      <path d="M12 6h7v12h-5a3 3 0 0 1-3-3V6z" />
    </svg>
  );
}

function IconClapper() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
      <path d="M3 9l4-4h5l-4 4h5l4-4h4v4H3z" />
    </svg>
  );
}

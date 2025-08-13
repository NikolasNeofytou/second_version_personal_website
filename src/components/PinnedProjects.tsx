"use client";

import { useEffect, useState } from "react";

type Repo = {
  name: string;
  description?: string | null;
  stars?: number;
  forks?: number;
  language?: { name: string; color?: string | null } | null;
  topics?: string[];
  url: string;
};

export default function PinnedProjects() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Repo[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/pinned", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        setProjects(data.projects || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="text-[color:var(--muted)]">Loading pinned projects…</div>;
  if (error) return <div className="text-red-500">Failed to load: {error}</div>;
  if (!projects.length) return <div className="text-[color:var(--muted)]">No pinned projects found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((p) => (
        <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="surface rounded-xl p-5 block hover:translate-y-[-2px] transition-transform">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold" style={{fontFamily: 'var(--font-serif)'}}>{p.name}</h3>
            {p.language?.name && (
              <span className="text-xs px-2 py-1 rounded-full border" style={{borderColor: 'var(--border)'}}>
                {p.language.name}
              </span>
            )}
          </div>
          {p.description && <p className="mt-2 text-sm text-[color:var(--muted)]">{p.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[color:var(--muted)]">
            {typeof p.stars === 'number' && <span>⭐ {p.stars}</span>}
            {typeof p.forks === 'number' && <span>🍴 {p.forks}</span>}
            {p.topics?.slice(0, 4).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full border" style={{borderColor: 'var(--border)'}}>{t}</span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}

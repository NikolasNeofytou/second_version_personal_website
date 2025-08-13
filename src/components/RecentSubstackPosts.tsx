"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Post = { title: string; url: string; date?: string; image?: string | null };

export default function RecentSubstackPosts() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const SUBSTACK_URL = process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://substack.com/@nikolasneofytou";

  useEffect(() => {
    let mounted = true;
    fetch("/api/substack/recent", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => { if (mounted) setPosts(data.posts || []); })
      .catch((e) => setError(e.message));
    return () => { mounted = false; };
  }, []);

  if (error) return <div className="text-red-500">Failed to load posts: {error}</div>;
  if (!posts) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[0,1,2].map((i) => (
        <div key={i} className="surface rounded-xl overflow-hidden">
          <div className="skeleton w-full h-40" />
          <div className="p-4">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="mt-2 skeleton h-3 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
  if (!posts.length) return <div className="text-[color:var(--muted)]">No recent posts found.</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((p) => (
          <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="surface rounded-xl overflow-hidden block">
            {p.image && (
              <div className="relative w-full h-40">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={shimmerDataURL(700, 160)}
                  unoptimized={!isOptimizable(p.image)}
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold" style={{fontFamily: 'var(--font-serif)'}}>{p.title}</h3>
              {p.date && <p className="text-xs text-[color:var(--muted)] mt-1">{new Date(p.date).toLocaleDateString()}</p>}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4">
        <a href={SUBSTACK_URL} target="_blank" rel="noreferrer" className="btn btn-outline">View all posts</a>
      </div>
    </>
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

function isOptimizable(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    if (hostname === 'substackcdn.com') return true;
    if (hostname.endsWith('.substack.com')) return true;
    if (hostname === 'substack-post-media.s3.amazonaws.com') return true;
    if (hostname === 'substack-post-media.s3.us-west-2.amazonaws.com') return true;
    return false;
  } catch {
    return false;
  }
}

"use client";

import { useRef, useState } from "react";

type Props = {
  value: string;
  label?: string;
  className?: string;
};

export default function CopyButton({ value, label = "Copy", className = "btn btn-outline" }: Props) {
  const [copied, setCopied] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setShowTip(true);
      spawnConfetti(ref.current);
      setTimeout(() => setCopied(false), 1500);
      setTimeout(() => setShowTip(false), 1200);
    } catch {
      // noop
    }
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button type="button" onClick={onCopy} className={className} aria-live="polite">
        {copied ? "Copied" : label}
      </button>
      {showTip && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 surface px-2 py-1 rounded-md text-xs">
          Copied!
          <div className="absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 rotate-45 border-b border-r" style={{background: 'var(--surface)', borderColor: 'var(--border)'}} />
        </div>
      )}
      <div className="confetti" aria-hidden />
    </div>
  );
}

function spawnConfetti(root: HTMLDivElement | null) {
  if (!root) return;
  const host = root.querySelector('.confetti') as HTMLDivElement | null;
  if (!host) return;
  const colors = [
    'var(--accent)',
    'var(--accent-2)',
    'color-mix(in oklab, var(--foreground) 40%, transparent)'
  ];
  const N = 10;
  for (let i = 0; i < N; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.background = colors[i % colors.length] as string;
    const dx = (Math.random() * 2 - 1) * 80; // -80..80
    const dy = - (40 + Math.random() * 60); // -40..-100
    const rot = (Math.random() * 2 - 1) * 360;
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');
    el.style.setProperty('--rot', rot + 'deg');
    host.appendChild(el);
    // cleanup each piece
    setTimeout(() => el.remove(), 800);
  }
}

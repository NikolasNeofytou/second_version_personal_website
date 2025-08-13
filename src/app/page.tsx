export default function Home() {
  return (
    <main className="container py-16">
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7">
          <h1 className="text-4xl md:text-6xl leading-tight mb-4" style={{fontFamily: 'var(--font-serif)'}}>
            Welcome to my personal website
          </h1>
          <p className="text-lg text-[color:var(--muted)] max-w-prose mb-8">
            Engineering meets the classical ages. Explore my CV, projects, and photography—crafted with a modern aesthetic inspired by marble, blueprint grids, and timeless typography.
          </p>
          <div className="flex gap-3">
            <a href="/projects" className="btn btn-primary">View Projects</a>
            <a href="/cv" className="btn btn-outline">Download CV</a>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="surface rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="h-24 rounded-lg" style={{background: 'linear-gradient(135deg, var(--accent-2), transparent)', border: '1px solid var(--border)'}}></div>
              <div className="h-24 rounded-lg" style={{background: 'linear-gradient(135deg, var(--accent), transparent)', border: '1px solid var(--border)'}}></div>
              <div className="h-24 rounded-lg" style={{background: 'linear-gradient(135deg, color-mix(in oklab, var(--foreground) 12%, transparent), transparent)', border: '1px solid var(--border)'}}></div>
              <div className="col-span-3 h-28 rounded-lg" style={{background: 'linear-gradient(90deg, color-mix(in oklab, var(--accent) 25%, transparent), color-mix(in oklab, var(--accent-2) 25%, transparent))', border: '1px solid var(--border)'}}></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

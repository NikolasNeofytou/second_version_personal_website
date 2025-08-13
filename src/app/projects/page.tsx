import PinnedProjects from "@/components/PinnedProjects";
export default function Projects() {
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-bold mb-4" style={{fontFamily: 'var(--font-serif)'}}>Projects</h1>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3" style={{fontFamily: 'var(--font-serif)'}}>Pinned from GitHub</h2>
        <PinnedProjects />
      </section>
      <ul className="list-disc pl-5 space-y-2">
        <li>Project 1 - Description coming soon</li>
        <li>Project 2 - Description coming soon</li>
      </ul>
    </main>
  );
}

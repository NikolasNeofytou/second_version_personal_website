import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-transparent/60">
      <div className="container py-4">
        <div className="surface rounded-xl px-4 py-2">
          <ul className="flex flex-wrap items-center gap-6 text-sm">
            <li><Link className="link-underline" href="/">Home</Link></li>
            <li><Link className="link-underline" href="/cv">CV</Link></li>
            <li><Link className="link-underline" href="/projects">Projects</Link></li>
            <li><Link className="link-underline" href="/blog">Blog</Link></li>
            <li><Link className="link-underline" href="/personal">Personal</Link></li>
            <li><Link className="link-underline" href="/photos">Photos</Link></li>
            <li className="ml-auto"><Link className="btn btn-outline" href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="p-4 bg-gray-800 text-white">
      <ul className="flex gap-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/cv">CV</Link></li>
        <li><Link href="/projects">Projects</Link></li>
        <li><Link href="/photos">Photos</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

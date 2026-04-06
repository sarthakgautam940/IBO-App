import Link from "next/link";

const links = [
  ["Dashboard", "/dashboard"],
  ["Roadmap", "/roadmap"],
  ["Team", "/team"],
  ["Practice", "/practice"],
  ["Case Lab", "/cases"],
  ["Analytics", "/analytics"]
] as const;

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">IBO Mastery OS</p>
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          </div>
          <nav className="flex gap-4 text-sm text-slate-600">
            {links.map(([label, href]) => (
              <Link key={href} className="hover:text-slate-900" href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
